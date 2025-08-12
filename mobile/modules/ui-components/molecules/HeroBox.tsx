import { SlideDescription, SlideTitle, TopCenterContainer } from '../atoms/WelcomeSlide'

interface Props {
  img?: React.ReactNode
  title: string
  description?: string
}

const HeroBox = ({ img, title, description }: Props) => {
  return (
    <TopCenterContainer>
      {img ? img : null}
      <SlideTitle>{title}</SlideTitle>
      <SlideDescription>{description}</SlideDescription>
    </TopCenterContainer>
  )
}

export default HeroBox
