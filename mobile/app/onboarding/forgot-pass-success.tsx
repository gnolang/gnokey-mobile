import { useRouter } from 'expo-router'
import { Button, HomeLayout } from '@/modules/ui-components'
import { HeroBox } from '@/modules/ui-components/molecules'

export default function Page() {
  const router = useRouter()

  const onCreateAccount = async () => {
    router.navigate('/onboarding')
  }

  return (
    <HomeLayout header={null} footer={<Button onPress={onCreateAccount}>Create GKM Account</Button>}>
      <HeroBox
        title="Your account is now erased"
        description="All the account data have been removed and are now impossible to retrieve. Please create a new account."
      />
    </HomeLayout>
  )
}
