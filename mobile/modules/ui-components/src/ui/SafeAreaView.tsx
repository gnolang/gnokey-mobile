import styled, { DefaultTheme } from 'styled-components/native'

export const SafeAreaView = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.primary};
`
