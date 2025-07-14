import { useRouter } from 'expo-router'
import { BetaVersionBanner } from '@/components/index'
import { OnboardingCarousel, OnboardingLayout } from '@/modules/ui-components'
import { OnboardingFooter } from '@/modules/ui-components/organisms/OnboardingFooter'

export default function Page() {
  const route = useRouter()

  const onStartOnboardingPress = () => {
    route.push('/onboarding/setup-pass')
  }

  return (
    <OnboardingLayout footer={<OnboardingFooter onStartOnboardingPress={onStartOnboardingPress} />}>
      <BetaVersionBanner />
      <OnboardingCarousel />
    </OnboardingLayout>
  )
}
