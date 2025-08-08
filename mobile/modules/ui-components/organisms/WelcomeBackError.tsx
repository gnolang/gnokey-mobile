import { Spacer } from '../src'
import { SlideDescription, SlideItem, SlideTitle, Container } from '../atoms/WelcomeSlide'
import { useWindowDimensions } from 'react-native'

export const WelcomeBackError = ({ error }: { error?: string }) => {
  const { width } = useWindowDimensions()
  return (
    <Container>
      <SlideItem width={width + 'px'}>
        <Spacer space={200} />
        <SlideTitle>Login Error</SlideTitle>
        <SlideDescription>{error ? error : 'Sorry, we could not unlock your account.'}</SlideDescription>
      </SlideItem>
    </Container>
  )
}
