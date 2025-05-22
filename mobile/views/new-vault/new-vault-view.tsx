import { ChainSelectView } from '@/views'
import { View, Alert as RNAlert } from 'react-native'
import React, { useEffect, useState } from 'react'
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
  selectPhrase,
  resetState,
  fetchVaults,
  checkForKeyOnChains,
  setKeyName
} from '@/redux'
import { Button, TextField, Spacer } from '@/modules/ui-components'
import { Text } from '@/components'

interface Props {
  onSucess: () => void
}

export const NewVaultView = (props: Props) => {
  const { onSucess } = props

  const [error, setError] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(false)

  const { gnonative } = useGnoNativeContext()

  const dispatch = useAppDispatch()
  const masterPassword = useAppSelector(selectMasterPassword)
  const signUpState = useAppSelector(signUpStateSelector)
  const newAccount = useAppSelector(newAccountSelector)
  const existingAccount = useAppSelector(existingAccountSelector)
  const keyName = useAppSelector(selectKeyName)
  const phrase = useAppSelector(selectPhrase)

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
        onSucess()
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signUpState, newAccount])

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
      setError('Invalid vault name.')
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
    <View>
      <View style={{ paddingVertical: 16, paddingBottom: 40 }}>
        <Spacer space={16} />
        <Text.Caption1>
          Vault name must be 6-20 characters, start with 3 lowercase letters, can include lowercase letters, numbers, underscores,
          and must end with 3 digits.
        </Text.Caption1>
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
        <Spacer space={16} />
        <ChainSelectView />
      </View>
      <Button onPress={onCreate} loading={loading}>
        Continue
      </Button>
    </View>
  )
}
