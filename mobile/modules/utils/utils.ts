import { Linking } from 'react-native'

export const openFaucet = () => {
  Linking.openURL('https://faucet.gno.land/')
}
