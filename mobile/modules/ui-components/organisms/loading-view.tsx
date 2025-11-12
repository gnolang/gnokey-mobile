import styled from 'styled-components/native'
import { Text } from '@berty/gnonative-ui'
import { ActivityIndicator } from 'react-native'

export const WelcomeBackError = ({ error }: { error?: string }) => {
  return (
    <Container>
      <ActivityIndicator size="large" color="#0000ff" />
      <Title>Securing your session...</Title>
    </Container>
  )
}

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`

const Title = styled(Text.H1)`
  margin-bottom: 12px;
`
