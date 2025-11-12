import { Button, ButtonText, Spacer, Text } from '@berty/gnonative-ui'

interface Props {
  onStartOnboardingPress: () => void
}

export const OnboardingFooter = ({ onStartOnboardingPress }: Props) => {
  return (
    <>
      <Button color="primary" onPress={onStartOnboardingPress}>
        Create GKM Account
      </Button>
      <Spacer space={16} />
      <ButtonText onPress={() => console.log('TODO: visit GKM support')}>
        <Text.LinkTextMutedSmall>Need help? Visit GKM Support</Text.LinkTextMutedSmall>
      </ButtonText>
    </>
  )
}
