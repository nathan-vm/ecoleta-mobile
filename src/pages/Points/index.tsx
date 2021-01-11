import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet, Text, View, ScrollView, Image, Alert } from 'react-native'
import Constants from 'expo-constants'
import { Feather as Icon } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation, useRoute } from '@react-navigation/native'
import MapView, { Marker } from 'react-native-maps'
import { SvgUri } from 'react-native-svg'
import * as Location from 'expo-location'
import api from '../../services/api'

interface Item {
  id: number
  title: string
  image_url: string
}

interface Point {
  id: number
  image: string
  name: string
  city: string
  uf: string
  latitude: number
  longitude: number
}

interface Coords {
  lat: number
  lng: number
}

interface Params {
  uf: string
  city: string
}

export const Points: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const routeParams = route.params as Params

  const [items, setItems] = useState<Item[]>([])
  const [points, setPoints] = useState<Point[]>([])
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [initialCoords, setInitialCoords] = useState<Coords>({ lat: 0, lng: 0 })

  useEffect(() => {
    async function loadPosition(): Promise<void> {
      const { status } = await Location.requestPermissionsAsync()

      if (status !== 'granted') {
        Alert.alert(
          'Ooops',
          'Precisamos de sua permissão para obter a localização',
        )
        return
      }
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.LocationAccuracy.Highest,
      })

      const { latitude, longitude } = location.coords

      setInitialCoords({
        lat: latitude,
        lng: longitude,
      })
    }

    loadPosition()
  })

  useEffect(() => {
    if (routeParams.city && routeParams.uf) {
      api
        .get('points', {
          params: {
            city: routeParams.city,
            uf: routeParams.uf,
            items: selectedItems,
          },
        })
        .then(response => {
          setPoints(response.data)
        })
        .catch(e => console.log(e))
    }
  }, [routeParams, selectedItems])

  useEffect(() => {
    api
      .get('items')
      .then(response => {
        setItems(response.data)
      })
      .catch(e => console.log(e))
  }, [])

  const handleNavigateBack = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  const handleNavigateToDetail = useCallback(
    (id: number) => {
      navigation.navigate('Detail', { point_id: id })
    },
    [navigation],
  )

  const handleSelectItem = useCallback(
    (id: number) => {
      const alreadySelected = selectedItems.findIndex(item => item === id)

      if (alreadySelected >= 0) {
        const filteredItems = selectedItems.filter(item => item !== id)
        setSelectedItems(filteredItems)
      } else {
        setSelectedItems([...selectedItems, id])
      }
    },
    [selectedItems],
  )

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={20} color="#34cb79" />
        </TouchableOpacity>

        <Text style={styles.title}>Bem vindo.</Text>
        <Text style={styles.description}>
          Encontre no mapa um ponto de coleta.
        </Text>

        <View style={styles.mapContainer}>
          {initialCoords.lat !== 0 && (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: initialCoords.lat,
                longitude: initialCoords.lng,
                latitudeDelta: 0.014,
                longitudeDelta: 0.014,
              }}
            >
              {points &&
                points.map(point => (
                  <Marker
                    key={String(point.id)}
                    style={styles.mapMarker}
                    onPress={() => handleNavigateToDetail(point.id)}
                    coordinate={{
                      latitude: Number(point.latitude),
                      longitude: Number(point.longitude),
                    }}
                  >
                    <View style={styles.mapMarkerContainer}>
                      <Image
                        style={styles.mapMarkerImage}
                        source={{
                          uri: point.image,
                        }}
                      />
                      <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                    </View>
                  </Marker>
                ))}
            </MapView>
          )}
        </View>
      </View>
      <View style={styles.itemsContainer}>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20 }}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {items &&
            items.map(item => (
              <TouchableOpacity
                activeOpacity={0.6}
                key={String(item.id)}
                style={[
                  styles.item,
                  selectedItems.includes(item.id) ? styles.selectedItem : {},
                ]}
                onPress={() => {
                  handleSelectItem(item.id)
                }}
              >
                <SvgUri width={42} height={42} uri={item.image_url} />
                <Text style={styles.itemTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  title: {
    fontSize: 20,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'Roboto_400Regular',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80,
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: '#34CB79',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    color: '#FFF',
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',

    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#34CB79',
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 13,
  },
})
