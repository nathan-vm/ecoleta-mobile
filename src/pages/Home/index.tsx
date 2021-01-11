import React, { useCallback, useState } from 'react'
import { Feather as Icon } from '@expo/vector-icons'
import {
  Text,
  View,
  ImageBackground,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { RectButton, TextInput } from 'react-native-gesture-handler'

import logo from '../../assets/logo.png'
import backgroundImage from '../../assets/home-background.png'
import { useNavigation } from '@react-navigation/native'

export const Home: React.FC = () => {
  const navigation = useNavigation()

  const [uf, setUf] = useState('')
  const [city, setCity] = useState('')

  const handleNavigateToPoints = useCallback(() => {
    navigation.navigate('Points', {
      uf,
      city,
    })
  }, [navigation, uf, city])

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ImageBackground
        source={backgroundImage}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={logo} />
          <View>
            <Text style={styles.title}>
              Seu marketplace de coleta de resíduos
            </Text>
            <Text style={styles.description}>
              Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <TextInput
            value={uf}
            onChangeText={setUf}
            placeholder="Digite a UF"
            maxLength={2}
            autoCapitalize="characters"
            autoCorrect={false}
            style={styles.input}
          />

          <TextInput
            value={city}
            onChangeText={setCity}
            placeholder="Digite a cidade"
            style={styles.input}
          />

          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#fff" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },
})
