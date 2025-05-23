import { View, TextInput as RNTextInput, Alert as RNAlert, Modal, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { router, useNavigation } from 'expo-router'
import { useGnoNativeContext } from '@gnolang/gnonative'
import {
  selectMasterPassword,
  useAppDispatch,
  useAppSelector,
  VaultCreationState,
  existingAccountSelector,
  newAccountSelector,
  onboarding,
  addVault,
  signUpStateSelector,
  selectKeyName,
  setKeyName,
  selectPhrase,
  generateNewPhrase,
  resetState,
  fetchVaults,
  checkForKeyOnChains
} from '@/redux'
import { TextCopy } from '@/components'
import { Feather, Octicons } from '@expo/vector-icons'
import { Button, Text, TextField, BottonPanel, Container, ButtonIcon, Spacer, SafeAreaView } from '@/modules/ui-components'
import { useTheme } from 'styled-components/native'
import { ChainSelectView } from '@/views/chains/chain-select-view'

export default function Page() {
  const [error, setError] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(false)

  const inputRef = useRef<RNTextInput>(null)

  const navigation = useNavigation()
  const { gnonative } = useGnoNativeContext()

  const dispatch = useAppDispatch()

  const masterPassword = useAppSelector(selectMasterPassword)
  const signUpState = useAppSelector(signUpStateSelector)
  const newAccount = useAppSelector(newAccountSelector)
  const existingAccount = useAppSelector(existingAccountSelector)
  const keyName = useAppSelector(selectKeyName)
  const phrase = useAppSelector(selectPhrase)

  const theme = useTheme()

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      dispatch(resetState())
      dispatch(generateNewPhrase())
      setError(undefined)
      inputRef.current?.focus()
    })
    return unsubscribe
  }, [navigation, dispatch])

  useEffect(() => {
    ;(async () => {
      // console.log("signUpState ->", signUpState);

      if (signUpState === VaultCreationState.user_exists_on_blockchain_and_local_storage) {
        setError('This name is already registered on the blockchain and on this device. Please choose another name.')
        return
      }
      if (signUpState === VaultCreationState.user_already_exists_on_blockchain) {
        setError('This name is already registered on the blockchain. Please, choose another name.')
        return
      }
      if (signUpState === VaultCreationState.user_already_exists_on_blockchain_under_different_name) {
        setError(
          'This account is already registered on the blockchain under a different name. Please press Back and sign up again with another Seed Phrase, or for a normal sign in with a different account if available.'
        )
        return
      }
      if (signUpState === VaultCreationState.user_exists_only_on_local_storage) {
        setError(
          'This name is already registered locally on this device but NOT on chain. If you want to register your account on the Gno Blockchain, please press Create again. Your seed phrase will be the same.'
        )
        return
      }
      if (signUpState === VaultCreationState.user_exists_under_differente_key) {
        setError(
          'This name is already registered locally and on the blockchain under a different key. Please choose another name.'
        )
        return
      }
      if (signUpState === VaultCreationState.user_exists_under_differente_key_local) {
        setError('This name is already registered locally under a different key. Please choose another name.')
        return
      }
      if (signUpState === VaultCreationState.account_created && newAccount) {
        dispatch(resetState())
        router.replace({ pathname: 'vault/new-vault/new-vault-sucess' })
      }
    })()
  }, [signUpState, newAccount, dispatch])

  const onCreate = async () => {
    setError(undefined)

    if (!keyName) {
      setError('Please fill out all fields')
      return
    }

    if (!phrase) {
      setError('Phrase not found.')
      return
    }

    // Use the same regex and error message as r/gnoland/users/v1
    if (!keyName.match('^[a-z]{3}[_a-z0-9]{0,14}[0-9]{3}$')) {
      setError('Account name must be at least 6 characters, lowercase alphanumeric with underscore')
      return
    }

    if (!masterPassword) {
      setError('Master password not found.')
      return
    }

    setLoading(true)

    if (signUpState === VaultCreationState.user_exists_only_on_local_storage && existingAccount) {
      await gnonative.activateAccount(keyName)
      await gnonative.setPassword(masterPassword, existingAccount.address)
      await dispatch(onboarding({ account: existingAccount })).unwrap()
      return
    }

    try {
      await dispatch(addVault({ name: keyName, password: masterPassword, phrase })).unwrap()
      await dispatch(fetchVaults()).unwrap()

      dispatch(checkForKeyOnChains())
    } catch (error) {
      RNAlert.alert('Error', '' + error)
      setError('' + error)
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Modal visible={loading} transparent>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </Modal>
      <SafeAreaView>
        <Container>
          <View>
            <Text.H1>My New</Text.H1>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text.H1>Vault&nbsp;</Text.H1>
              <Text.H1 style={{ color: '#E5E5E5' }}>Info</Text.H1>
            </View>
          </View>

          <Spacer />
          <TextField
            label="Vault name"
            placeholder="Vault name"
            value={keyName}
            onChangeText={(x) => dispatch(setKeyName(x))}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="off"
            error={error}
          />
          <Spacer space={4} />
          <ChainSelectView />
        </Container>
      </SafeAreaView>

      <BottonPanel>
        <Text.H3 style={{ color: theme.colors.primary }}>Seed Phrase</Text.H3>
        <Spacer />
        <TextCopy text={phrase}>
          <Text.Body style={{ textAlign: 'center' }}>
            {phrase} &nbsp;
            <Octicons name="copy" size={12} color={theme.colors.primary} />
          </Text.Body>
        </TextCopy>
        <Spacer />
        <ButtonIcon size={30} color="primary" onPress={() => dispatch(generateNewPhrase())}>
          <Feather name="refresh-cw" size={15} color="white" />
        </ButtonIcon>
        <Spacer />
        <View style={{ flexDirection: 'row', flex: 1, width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ width: 120 }} />
        </View>
        <Spacer />
        <Button onPress={onCreate} style={{ width: '100%' }}>
          Continue
        </Button>
      </BottonPanel>
    </>
  )
}
