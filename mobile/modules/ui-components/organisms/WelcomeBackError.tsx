import HeroBox from '../molecules/HeroBox'

export const WelcomeBackError = ({ error }: { error?: string }) => {
  return <HeroBox title="Login Error" description={error ? error : 'Sorry, we could not unlock your account.'} />
}
