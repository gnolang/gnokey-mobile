import { useRouter } from 'expo-router'
import { HomeLayout, OnboardingCarousel, OnboardingFooter, BetaVersionHeader } from '@/modules/ui-components'

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
