import styled, { DefaultTheme } from 'styled-components/native'

export const AppBar = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.background};
`
