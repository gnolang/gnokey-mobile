import { Alert, View } from 'react-native'
import { useRouter } from 'expo-router'
import { enableBiometric, useAppDispatch } from '@/redux'
import { Button, HomeLayout, ScreenHeader, Spacer } from '@/modules/ui-components'
import { HeroBox } from '@/modules/ui-components/molecules'
import { LocalSvg } from 'react-native-svg/css'

export default function Page() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const onActivateFaceId = async () => {
    try {
      const res = await dispatch(enableBiometric(true)).unwrap()
      console.log('Biometric enabled successfully: ', res)
      if (res) {
        router.replace('/onboarding/loading-screen')
      }
    } catch (error: any) {
      console.error('Failed to enable biometric:', error)
      Alert.alert('Error', 'Failed to enable biometric authentication. Please try again.', [{ text: 'OK' }])
      return
    }
  }

  const onSkip = async () => {
    router.navigate('/onboarding/loading-screen')
  }

  return (
    <HomeLayout
      header={<ScreenHeader title="GKM Account" subtitle="2/2" />}
      footer={
        <View style={{ width: '100%' }}>
          <Button onPress={onActivateFaceId}>Activate FaceID</Button>
          <Spacer space={16} />
          <Button onPress={onSkip} color="secondary">
            Skip for now
          </Button>
        </View>
      }
    >
      <HeroBox
        img={
          <LocalSvg
            width={98}
            height={98}
            style={{
              alignSelf: 'center'
            }}
            asset={require('../../assets/images/biometrics.svg')}
          />
        }
        title="Secure your account access"
        description="Enable password and Face ID to secure access to your accounts. This is highly recommended"
      ></HeroBox>
    </HomeLayout>
  )
}
