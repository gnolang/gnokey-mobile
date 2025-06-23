import { View, TextInput as RNTextInput, Alert as RNAlert, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { router, useFocusEffect } from 'expo-router'
import { useGnoNativeContext } from '@gnolang/gnonative'
import {
  selectMasterPassword,
  useAppDispatch,
  useAppSelector,
  VaultCreationState,
  existingAccountSelector,
  newAccountSelector,
  registerAccount,
  createKey,
  signUpStateSelector,
  selectKeyName,
  setKeyName,
  selectPhrase,
  generateNewPhrase,
  resetState,
  fetchVaults,
  checkForKeyOnChains,
  selectLastProgress,
  selectLoadingAddVault,
  clearProgress,
  selectSelectedChain
} from '@/redux'
import { TextCopy } from '@/components'
import { Feather, Octicons } from '@expo/vector-icons'
import { Button, Text, TextField, BottonPanel, Container, ButtonIcon, Spacer, SafeAreaView } from '@/modules/ui-components'
import { useTheme } from 'styled-components/native'
import { ChainSelectView } from '@/views/chains/chain-select-view'
import { LoadingModal } from '@/components/loading'

export default function Page() {
  const [error, setError] = useState<string | undefined>(undefined)
  const [editable, setEditable] = useState<boolean>(true)

  const inputRef = useRef<RNTextInput>(null)

  const { gnonative } = useGnoNativeContext()
  const progress = useAppSelector(selectLastProgress)

  const dispatch = useAppDispatch()

  const masterPassword = useAppSelector(selectMasterPassword)
  const signUpState = useAppSelector(signUpStateSelector)
  const newAccount = useAppSelector(newAccountSelector)
  const existingAccount = useAppSelector(existingAccountSelector)
  const keyName = useAppSelector(selectKeyName)
  const phrase = useAppSelector(selectPhrase)
  const loading = useAppSelector(selectLoadingAddVault)
  const selectedChain = useAppSelector(selectSelectedChain)

  useFocusEffect(
    React.useCallback(() => {
      onResetForm()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  )

  useEffect(() => {
    ;(async () => {
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
        setEditable(false)
        setError(
          'This name is already registered locally on this device but NOT on chain. If you want to register your account on the Gno Blockchain, please press Register On-Chain. Your seed phrase will remain the same.'
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
      if (signUpState === VaultCreationState.account_created) {
        if (selectedChain?.faucetPortalUrl) {
          router.push('/home/vault/new-vault/external-faucet')
          return
        }
        if (selectedChain?.faucetUrl) {
          await dispatch(registerAccount()).unwrap()
          return
        } else {
          router.replace('/home/vault/new-vault/new-vault-success')
          return
        }
      }
      if (signUpState === VaultCreationState.account_registered) {
        router.replace('/home/vault/new-vault/new-vault-success')
        return
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    try {
      await dispatch(createKey({ name: keyName, password: masterPassword, phrase })).unwrap()
      await dispatch(fetchVaults()).unwrap()
      dispatch(checkForKeyOnChains())
    } catch (error: any) {
      console.log(error)
      const msg = error['message'] || JSON.stringify(error)
      RNAlert.alert('Error', msg)
      setError(msg)
    }
  }

  // To be called when VaultCreationState.user_exists_only_on_local_storage
  const onRegisterOnChainOnly = async () => {
    if (!existingAccount || !keyName || !masterPassword) {
      console.error('Some required data is missing to register on-chain.')
      return
    }
    try {
      await gnonative.activateAccount(keyName)
      await gnonative.setPassword(masterPassword, existingAccount.address)
      if (selectedChain?.faucetPortalUrl) {
        router.push('/home/vault/new-vault/external-faucet')
        return
      }
      await dispatch(registerAccount()).unwrap()
    } catch (error: any) {
      console.log(error)
      const msg = error['message'] || JSON.stringify(error)
      RNAlert.alert('Error', msg)
      setError(msg)
    }
  }

  const onResetForm = () => {
    setEditable(true)
    dispatch(resetState())
    setError(undefined)
    dispatch(clearProgress())
    dispatch(generateNewPhrase())
    inputRef.current?.focus()
  }

  return (
    <>
      <LoadingModal visible={loading} message={progress} />
      <SafeAreaView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Container>
            <Spacer />
            <TextField
              label="Account Key Name"
              placeholder="Account Key Name"
              value={keyName}
              onChangeText={(x) => dispatch(setKeyName(x))}
              editable={editable}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="off"
              error={error}
            />
            <Spacer space={4} />
            <ChainSelectView />
          </Container>
        </TouchableWithoutFeedback>
      </SafeAreaView>

      <BottonPanel>
        <SeedPhraseBox phrase={phrase} signUpState={signUpState} />
        <Spacer />
        <View style={{ flexDirection: 'row', flex: 1, width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ width: 120 }} />
        </View>

        {signUpState === VaultCreationState.user_exists_only_on_local_storage ? (
          <>
            <Button onPress={onRegisterOnChainOnly} style={{ marginTop: 10 }}>
              Register On-Chain
            </Button>
            <Spacer />
            <Button color="secondary" onPress={onResetForm}>
              Cancel
            </Button>
          </>
        ) : (
          <Button onPress={onCreate} style={{ width: '100%' }}>
            Continue
          </Button>
        )}
      </BottonPanel>
    </>
  )
}

const SeedPhraseBox = ({ phrase, signUpState }: { phrase?: string; signUpState?: VaultCreationState }) => {
  const theme = useTheme()
  const dispatch = useAppDispatch()

  if (signUpState === VaultCreationState.user_exists_only_on_local_storage) {
    return null
  }

  return (
    <>
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
    </>
  )
}
