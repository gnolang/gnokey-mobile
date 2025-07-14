import styled from 'styled-components/native'
import { Text } from '../src'

export const WelcomeBackError = ({ error }: { error?: string }) => {
  return (
    <Container>
      <Slide>
        <SlideTitle>Login Error</SlideTitle>
        <SlideDescription>{error ? error : 'Sorry, we could not unlock your account.'}</SlideDescription>
      </Slide>
    </Container>
  )
}

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`

const Slide = styled.View`
  align-items: center;
`

const SlideTitle = styled(Text.H1)`
  margin-bottom: 12px;
`

const SlideDescription = styled(Text.H4_Regular)`
  text-align: center;
`
