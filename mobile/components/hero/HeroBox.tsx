import { ContainerCenter, Spacer, Text } from '@berty/gnonative-ui'

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
