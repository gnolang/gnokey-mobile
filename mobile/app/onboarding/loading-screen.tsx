import { useFocusEffect, useRouter } from 'expo-router'
import { HomeLayout, Spacer, Template, Text } from '@/modules/ui-components'
import ActivityIndicator from '@/components/atoms/activity-indicator'

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
