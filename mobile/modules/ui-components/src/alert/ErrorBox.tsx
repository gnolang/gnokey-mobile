import { Text, View } from 'react-native'
import styled, { DefaultTheme } from 'styled-components/native'

export const ErrorBox = ({ children }: { children: React.ReactNode }) => {

  if (!children) return <View style={{ height: 40 }} />

  return (
    <ErrorBoxWrapper>
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
	min-height: 40px;
	padding: 12px;
	color: black;
	border-radius: ${(props) => props.theme.borderRadius || 40}px;
	background-color: ${({ theme }) => theme.error.background};
`
