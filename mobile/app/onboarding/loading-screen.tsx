import { useFocusEffect, useRouter } from 'expo-router'
import { ActivityIndicator, HomeLayout, Spacer, Template, Text } from '@/modules/ui-components'

export default function Page() {
  const router = useRouter()

  useFocusEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/home')
    }, 3000)

    return () => clearTimeout(timer)
  })

  return (
    <HomeLayout header={null} footer={null}>
      <Template.ContainerCenter>
        <ActivityIndicator />
        <Spacer space={64} />
        <Text.LargeTitle style={{ textAlign: 'center', padding: 12 }}>Securing your session...</Text.LargeTitle>
      </Template.ContainerCenter>
    </HomeLayout>
  )
}
