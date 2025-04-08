import { Text, View } from 'react-native'
import styled from 'styled-components/native'

type Props = {
  children?: string
} & React.ComponentProps<typeof View>

export const ErrorBox = ({ children, style, ...rest }: Props) => {
  if (!children) return <View style={[{ height: 30 }, style]} {...rest} />

  return (
    <ErrorBoxWrapper style={style} {...rest}>
      <Text>{children}</Text>
    </ErrorBoxWrapper>
  )
}

const ErrorBoxWrapper = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: center;
  font-size: 14px;
  height: 30px;
  padding-horizontal: 8px;
  color: black;
  border-radius: ${(props) => props.theme.borderRadius || 20}px;
  background-color: ${({ theme }) => theme.error.background};
`
