import styled, { DefaultTheme } from 'styled-components/native'

export const Container = styled.View`
  flex: 1;
  padding-horizontal: 18px;
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.background};
`
