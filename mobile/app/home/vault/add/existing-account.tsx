import React from 'react'
import { View } from 'react-native'
import { Button, Text, Spacer, HomeLayout, ScreenHeader } from '@/modules/ui-components'
import { importKey, selectAddVaultExistingName, useAppDispatch, useAppSelector } from '@/redux'
import { useRouter } from 'expo-router'

const Page = () => {
  const router = useRouter()
  const existingName = useAppSelector(selectAddVaultExistingName)
  const dispatch = useAppDispatch()

  const onChooseAnother = () => {
    router.replace({ pathname: '/home/vault/add' })
  }

  const onReuse = async () => {
    if (!existingName) {
      console.error('No existing name found')
      return
    }
    dispatch(importKey({ vaultName: existingName }))
    router.replace('/home/vault/add/new-vault-loading')
  }

  if (!existingName) {
    return (
      <HomeLayout
        header={<ScreenHeader title="Reuse Account Name" />}
        footer={
          <Button color="primary" onPress={() => onChooseAnother()}>
            Go Back
          </Button>
        }
      >
        <View>
          <Text.Title1>Account Name Not Found</Text.Title1>
          <Spacer space={16} />
          <Text.Body>We could not find the existing account name. Please go back and try again.</Text.Body>
          <Spacer space={32} />
        </View>
      </HomeLayout>
    )
  }

  return (
    <HomeLayout
      header={<ScreenHeader title="Reuse Account Name" onBackPress={onChooseAnother} />}
      footer={
        <>
          <Button color="primary" onPress={onReuse}>
            {`Continue with ${existingName}`}
          </Button>
          <Spacer space={16} />
          <Button color="secondary" onPress={onChooseAnother}>
            Go Back
          </Button>
        </>
      }
    >
      <View>
        <Spacer space={32} />
        <Text.Title3>Seed Phrase Already Registered</Text.Title3>
        <Spacer space={16} />
        <Text.Body>
          The name <Text.Body_Bold>{existingName}</Text.Body_Bold> is already registered on-chain for this seed phrase.
        </Text.Body>
        <Spacer space={16} />
        <Text.Body>
          You can import this account and use the existing name. The app will not register a new account, but will import your key
          and link it to the on-chain account named <Text.Body_Bold>{existingName}</Text.Body_Bold>.
        </Text.Body>
        <Spacer space={32} />
      </View>
    </HomeLayout>
  )
}

export default Page
