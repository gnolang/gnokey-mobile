import styled from 'styled-components/native'
import { Button, ButtonText, Spacer, Text } from '../src'

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
        <Link>Need help? Visit GKM Support</Link>
      </ButtonText>
    </>
  )
}

const Link = styled(Text.Link)`
  color: ${({ theme }) => theme.text.textMuted};
`
