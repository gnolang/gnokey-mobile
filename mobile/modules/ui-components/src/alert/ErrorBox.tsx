import { View } from 'react-native'
import styled from 'styled-components/native'

type Props = {
  children?: string
} & React.ComponentProps<typeof View>

export const ErrorBox = ({ children, style, ...rest }: Props) => {
  if (!children) return <View style={[{ minHeight: 30 }, style]} {...rest} />

  return (
    <ErrorBoxWrapper style={style} {...rest}>
      <TextStyled numberOfLines={0}>{children}</TextStyled>
    </ErrorBoxWrapper>
  )
}

const ErrorBoxWrapper = styled.View`
  align-self: stretch;
  justify-content: center;
  min-height: 30px;
  padding-horizontal: 4px;
  color: black;
  border-radius: ${(props) => props.theme.borderRadius || 8}px;
  background-color: ${({ theme }) => theme.error.background};
  flex-wrap: wrap;
`

const TextStyled = styled.Text`
  size: 10px;
  flexwrap: wrap;
  color: red;
  align-self: center;
`
