import React, { ReactNode } from 'react'
import { SafeAreaView, ScrollView } from 'react-native'
import styled from 'styled-components/native'

interface OnboardingLayoutProps {
  children: ReactNode
  footer?: ReactNode
}

export function OnboardingLayout({ children, footer }: OnboardingLayoutProps) {
  return (
    <SafeArea>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: 12 }}>
        <Content>{children}</Content>
        {footer && <FooterContainer>{footer}</FooterContainer>}
      </ScrollView>
    </SafeArea>
  )
}

const SafeArea = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`

const Content = styled.View`
  flex: 1;
`

const FooterContainer = styled.View`
  padding: 0px 0px;
`
