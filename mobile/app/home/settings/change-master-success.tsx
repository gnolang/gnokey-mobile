import { Button, HomeLayout, ScreenHeader, Template, Text } from '@/modules/ui-components'
import { useRouter } from 'expo-router'
import { useTheme } from 'styled-components/native'

const Page = () => {
  const router = useRouter()
  const theme = useTheme()

  return (
    <HomeLayout
      header={<ScreenHeader title="Password Updated" headerBackVisible={false} />}
      footer={<Button onPress={() => router.replace('/home')}>Done</Button>}
    >
      <Template.ContainerCenterLeft>
        <Text.LargeTitle>Password</Text.LargeTitle>
        <Text.LargeTitle>successfully</Text.LargeTitle>
        <Text.LargeTitle style={{ color: theme.success.text }}>updated</Text.LargeTitle>
        <Text.Caption>You successfully changed the password for GKM.</Text.Caption>
      </Template.ContainerCenterLeft>
    </HomeLayout>
  )
}

export default Page
