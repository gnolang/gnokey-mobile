import { useRouter } from 'expo-router'
import { Button, HomeLayout, Template, ScreenHeader, Text } from '@/modules/ui-components'

const Page = () => {
  const router = useRouter()

  const goHomePress = () => {
    router.push('/')
  }

  return (
    <HomeLayout
      header={<ScreenHeader title="Error" headerBackVisible={false} />}
      footer={<Button onPress={goHomePress}>Go Home</Button>}
    >
      <Template.ContainerCenter style={{ gap: 16 }}>
        <Text.LargeTitle>Unexpected Error</Text.LargeTitle>
        <Text.BodyCenterGray>This is embarrassing. An unexpected error occurred.</Text.BodyCenterGray>
      </Template.ContainerCenter>
    </HomeLayout>
  )
}
export default Page
