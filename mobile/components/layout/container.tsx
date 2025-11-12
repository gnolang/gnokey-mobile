import React from 'react'
import styled from 'styled-components/native'
import { SafeAreaView } from '../SafeAreaView'

const Wrapper = styled.View`
  flex: 1;
  padding: 8px;
`

const Container = ({ children }: React.PropsWithChildren) => {
  return (
    <Wrapper>
      <SafeAreaView>{children}</SafeAreaView>
    </Wrapper>
  )
}

export default Container
