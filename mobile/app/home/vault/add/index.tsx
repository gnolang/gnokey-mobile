import { Alert as RNAlert } from 'react-native'
import React, { useState } from 'react'
import { router, useFocusEffect } from 'expo-router'
import {
  selectMasterPassword,
  useAppDispatch,
  useAppSelector,
  createKey,
  selectKeyName,
  selectPhrase,
  generateNewPhrase,
  resetState
} from '@/redux'
import { Button, Form, HomeLayout, ScreenHeader, Spacer } from '@/modules/ui-components'
import { NewVaultForm } from '@/modules/ui-components/organisms/NewVaultForm'

export default function Page() {
  const [error, setError] = useState<string | undefined>(undefined)
  const dispatch = useAppDispatch()

  const masterPassword = useAppSelector(selectMasterPassword)
  const keyName = useAppSelector(selectKeyName)
  const phrase = useAppSelector(selectPhrase)

  useFocusEffect(
    React.useCallback(() => {
      dispatch(generateNewPhrase())
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  )

  const onCreate = async () => {
    setError(undefined)

    if (!keyName) {
      console.error('Key name is required')
      setError('Please fill out all fields')
      return
    }

    if (!phrase) {
      console.error('Seed phrase is required')
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
      dispatch(createKey({ name: keyName, password: masterPassword, phrase }))
      router.navigate('/home/vault/add/new-vault-loading')
      // await dispatch(fetchVaults()).unwrap()
      // dispatch(checkForKeyOnChains())
    } catch (error: any) {
      console.log(error)
      const msg = error['message'] || JSON.stringify(error)
      RNAlert.alert('Error', msg)
      setError(msg)
    }
  }

  // To be called when VaultCreationState.user_exists_only_on_local_storage
  // const onRegisterOnChainOnly = async () => {
  //   if (!existingAccount || !keyName || !masterPassword) {
  //     console.error('Some required data is missing to register on-chain.')
  //     return
  //   }
  //   try {
  //     await gnonative.activateAccount(keyName)
  //     await gnonative.setPassword(masterPassword, existingAccount.address)
  //     if (currentChain?.faucetPortalUrl) {
  //       router.push('/home/vault/new-vault/external-faucet')
  //       return
  //     }
  //     await dispatch(registerAccount()).unwrap()
  //   } catch (error: any) {
  //     console.log(error)
  //     const msg = error['message'] || JSON.stringify(error)
  //     RNAlert.alert('Error', msg)
  //     setError(msg)
  //   }
  // }

  const onBackPress = () => {
    dispatch(resetState()) // clean the form
    router.back()
  }

  return (
    <HomeLayout
      header={<ScreenHeader title="New account" subtitle="1/2" onBackPress={onBackPress} />}
      footer={<Button onPress={onCreate}>Create new account</Button>}
    >
      <>
        <NewVaultForm error={error} />
        <Form.ErrorBox>{error}</Form.ErrorBox>
        <Spacer space={8} />
      </>
    </HomeLayout>
  )
}

/* <>
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
  */
