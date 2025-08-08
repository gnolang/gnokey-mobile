import styled from 'styled-components/native'
import { Spacer, Text, TextField } from '../src'
import { Ruller } from '@/components'
import { useEffect, useState } from 'react'
import {
  selectChainsAvailable,
  selectDescription,
  selectKeyName,
  selectSelectedChain,
  setDescription,
  setKeyName,
  setSelectedChain,
  useAppDispatch,
  useAppSelector
} from '@/redux'
import { CheckItem } from '../molecules/CheckItem'
import { NavigationRow } from '../molecules/NavigationRow'
import { NetworkSelectionModal } from './NetworkSelectionModal'
import { useRouter } from 'expo-router'
import { Alert } from 'react-native'
import { BetaVersionMiniBanner } from '../molecules'

export interface Props {
  error?: string
}

export const NewVaultForm = ({ error }: Props) => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const keyName = useAppSelector(selectKeyName)
  const description = useAppSelector(selectDescription)
  const networks = useAppSelector(selectChainsAvailable)
  const currentNetwork = useAppSelector(selectSelectedChain)

  const [isMin6Chars, setIsMin6Chars] = useState(false)
  const [isDigitAtEnd, setIsDigitAtEnd] = useState(false)
  const [isLowercase, setIsLowercase] = useState(false)
  const [showNetworkModal, setShowNetworkModal] = useState(false)

  useEffect(() => {
    setIsMin6Chars(keyName ? keyName.length >= 6 : false)
    setIsDigitAtEnd(keyName ? /\d{3,}$/.test(keyName) : false)
    setIsLowercase(keyName ? /[a-z]/.test(keyName) : false)
  }, [keyName])

  useEffect(() => {
    if (error && error.length > 0) {
      Alert.alert('Error', error, [
        {
          text: 'OK'
        }
      ])
    }
  }, [error])

  return (
    <Container>
      <NetworkSelectionModal
        visible={showNetworkModal}
        onClose={() => setShowNetworkModal(false)}
        onNetworkSelect={async (v) => {
          setShowNetworkModal(false)
          await dispatch(setSelectedChain(v)).unwrap()
          console.log('Selected network:', v)
        }}
        onAddChain={() => {
          setShowNetworkModal(false)
          router.push({ pathname: '/home/(modal)/new-network', params: { fromScreen: 'NewVault' } })
        }}
        networks={networks}
        currentNetwork={currentNetwork}
      />
      <TextField
        label="Account name"
        description="Enter your account name, something meaningful"
        placeholder="Enter vault name"
        value={keyName}
        onChangeText={(x) => dispatch(setKeyName(x))}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="off"
        hideError
      />
      <LeftItems>
        <CheckItem isValid={isMin6Chars}>Minimum 6 characters</CheckItem>
        <CheckItem isValid={isDigitAtEnd}>Minimum 3 digits at the end</CheckItem>
        <CheckItem isValid={isLowercase}>Lowercase letters only</CheckItem>
      </LeftItems>

      <Spacer space={16} />
      <Ruller />
      <Spacer space={16} />
      <TextField
        label="Account description"
        description="Describe your account, this will help you remember what it is for"
        placeholder="Enter vault description"
        value={description}
        onChangeText={(x) => dispatch(setDescription(x))}
      />
      <Spacer space={16} />
      <Ruller />
      <Spacer space={16} />
      <NavigationRow
        title="Select Chain to Register username"
        description="Register username will allow you to use your account on the Gno blockchain"
        onPress={() => setShowNetworkModal(true)}
        footer={currentNetwork ? <Text.Link>{currentNetwork.chainName}</Text.Link> : <Text.Link>No Registration</Text.Link>}
      />
      <Spacer space={16} />
      <Ruller />
      <Spacer space={16} />
      <BetaVersionMiniBanner />
    </Container>
  )
}

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: flex-start;
`

const LeftItems = styled.View`
  padding-top: 8px;
  align-self: flex-start;
`
