import { StyleSheet } from 'react-native'
import { ContainerCenter } from '../../atoms/WelcomeSlide'
import { Spacer, Text } from '../../src'

interface Props {
  img?: React.ReactNode
  title: string
  description?: string
  children?: React.ReactNode
  light?: boolean
}

export const HeroBox = ({ img, title, description, children, light }: Props) => {
  return (
    <ContainerCenter>
      {img ? img : null}
      <Spacer space={56} />
      <Text.LargeTitle style={{ textAlign: 'center' }}>{title}</Text.LargeTitle>
      <Spacer space={16} />
      <Text.Title3CenterGray weight={light ? Text.weights.regular : Text.weights.bold}>{description}</Text.Title3CenterGray>
      {children ? (
        <>
          <Spacer space={16} />
          {children}
        </>
      ) : null}
    </ContainerCenter>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
// flex: 1;
// align-items: center;
// justify-content: center;

