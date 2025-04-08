import { View } from 'react-native'
import { useNavigation } from 'expo-router'
import { useEffect, useState } from 'react'
import { useGnoNativeContext } from '@gnolang/gnonative'
import { signOut, useAppDispatch } from '@/redux'
import { Layout } from '@/components/index'
import { LoadingModal } from '@/components/loading'
import ChangeMasterPassword from '@/views/change-master-password'
import { AppBar, Button, ButtonProfile, Container, FormItemInline, SafeAreaView, Spacer, Text } from '@/modules/ui-components'
import { AntDesign, Feather, FontAwesome6 } from '@expo/vector-icons'
import { FormTextValue } from '@/modules/ui-components/src/form/FormItem'

export default function Page() {
  const [loading, setLoading] = useState(false)
  const [chainID, setChainID] = useState('')
  const [remote, setRemote] = useState('')
  const [showChangePassModal, setShowChangePassModal] = useState(false)

  const { gnonative } = useGnoNativeContext()
  const navigation = useNavigation()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        fetchAccountData()
      } catch (error: unknown | Error) {
        console.log(error)
      }
    })
    return unsubscribe
  }, [navigation])

  const fetchAccountData = async () => {
    const chainId = await gnonative.getChainID()
    const remote = await gnonative.getRemote()
    setChainID(chainId)
    setRemote(remote)
  }

  const onPressChangePass = async () => {
    setShowChangePassModal(true)
  }

  const onPressLogout = async () => {
    dispatch(signOut())
  }

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <AppBar>
          <View />
          <Button
            onPress={() => navigation.goBack()}
            color="tertirary"
            endIcon={<FontAwesome6 name="xmark" size={16} color="black" />}
          >
            Cancel
          </Button>
        </AppBar>

        <Container style={{ flex: 1 }}>
          <Text.H1>My Profile</Text.H1>
          <View style={{ flexDirection: 'row' }}>
            <Text.H1 style={{ color: 'white' }}>Information</Text.H1>
          </View>

          <Spacer />

          <FormItemInline label="Chain ID" labelStyle={{ minWidth: 90 }}>
            <FormTextValue>{chainID}</FormTextValue>
          </FormItemInline>

          <FormItemInline label="Remote" labelStyle={{ minWidth: 90 }}>
            <FormTextValue>{remote}</FormTextValue>
          </FormItemInline>

          <Spacer />

          <ButtonProfile onPress={onPressChangePass} endIcon={<Feather name="lock" size={16} color="black" />}>
            Change master password
          </ButtonProfile>

          <Spacer />

          <ButtonProfile onPress={onPressLogout} endIcon={<AntDesign name="logout" size={16} color="black" />}>
            Logout
          </ButtonProfile>
        </Container>

        <LoadingModal visible={loading} />
      </SafeAreaView>
      <ChangeMasterPassword visible={showChangePassModal} onClose={() => setShowChangePassModal(false)} />
    </>
  )
}
