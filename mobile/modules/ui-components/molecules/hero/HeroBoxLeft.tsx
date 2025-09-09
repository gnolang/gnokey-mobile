import { Spacer, Text } from '../../src'

interface Props {
  title: string
  description?: string
  textAlign?: 'left' | 'center'
}

export const HeroBoxLeft = ({ title, description }: Props) => {
  return (
    <>
      <Spacer space={56} />
      <Text.LargeTitle>{title}</Text.LargeTitle>
      <Spacer space={16} />
      <Text.Callout>{description}</Text.Callout>
      <Spacer space={64} />
      <Spacer space={64} />
    </>
  )
}

export const HeroBoxInternal = ({ title, description }: Props) => {
  return (
    <>
      <Spacer space={16} />
      <Text.Title2 style={{ textAlign: 'left' }}>{title}</Text.Title2>
      <Spacer space={8} />
      <Text.Title3_Muted style={{ textAlign: 'left' }}>{description}</Text.Title3_Muted>
    </>
  )
}
