import { LeftContainer } from '../atoms/Layout'
import { Spacer, Text } from '../src'

interface Props {
  title: string
  description?: string
}

export const HeroBoxLeft = ({ title, description }: Props) => {
  return (
    <LeftContainer>
      <Spacer space={56} />
      <Text.LargeTitle>{title}</Text.LargeTitle>
      <Spacer space={16} />
      <Text.Callout>{description}</Text.Callout>
      <Spacer space={64} />
      <Spacer space={64} />
    </LeftContainer>
  )
}
