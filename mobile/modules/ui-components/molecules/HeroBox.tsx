import { TopCenterContainer } from '../atoms/WelcomeSlide'
import { Spacer, Text } from '../src'

interface Props {
  img?: React.ReactNode
  title: string
  description?: string
  children?: React.ReactNode
}

const HeroBox = ({ img, title, description, children }: Props) => {
  return (
    <TopCenterContainer>
      {img ? img : null}
      <Spacer space={56} />
      <Text.LargeTitle>{title}</Text.LargeTitle>
      <Spacer space={16} />
      <Text.Title3CenterGray>{description}</Text.Title3CenterGray>
      {children ? (
        <>
          <Spacer space={16} />
          {children}
        </>
      ) : null}
    </TopCenterContainer>
  )
}

export default HeroBox
