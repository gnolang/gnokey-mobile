import styled, { DefaultTheme } from 'styled-components/native'

export const Container = styled.View`
	flex: 1;
	padding: 22px;
	background-color: ${({ theme }: { theme: DefaultTheme }) => theme.textinputs?.background};
`
