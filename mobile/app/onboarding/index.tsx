import { useRouter } from 'expo-router'
import { OnboardingCarousel, OnboardingFooter, BetaVersionHeader } from '@/modules/ui-components'
import { HomeLayout } from '@/modules/gnonative-ui/dist'

export default function Page() {
  const route = useRouter()

  const onStartOnboardingPress = () => {
    route.push('/onboarding/setup-pass')
  }

  return (
    <HomeLayout header={<BetaVersionHeader />} footer={<OnboardingFooter onStartOnboardingPress={onStartOnboardingPress} />}>
      <OnboardingCarousel />
    </HomeLayout>
  )
}
