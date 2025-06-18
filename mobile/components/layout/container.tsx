import { SafeAreaView } from '@/modules/ui-components'
import React from 'react'
import styled, { DefaultTheme } from 'styled-components/native'

const Wrapper = styled.View`
  flex: 1;
  padding: 8px;
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.primary};
`

const Container = ({ children }: React.PropsWithChildren) => {
  return (
    <Wrapper>
      <SafeAreaView>{children}</SafeAreaView>
    </Wrapper>
  )
}

export default Container
