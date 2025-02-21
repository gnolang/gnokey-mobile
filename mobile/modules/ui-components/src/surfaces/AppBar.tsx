import styled, { DefaultTheme } from 'styled-components/native'

export const AppBar = styled.View`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding: 16px;
	background-color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.primary};
`
