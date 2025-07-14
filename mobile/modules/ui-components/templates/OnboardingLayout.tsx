import React, { ReactNode } from 'react'
import { SafeAreaView } from 'react-native'
import styled from 'styled-components/native'

interface OnboardingLayoutProps {
  children: ReactNode
  footer?: ReactNode
}

export function OnboardingLayout({ children, footer }: OnboardingLayoutProps) {
  return (
    <SafeArea>
      <ScrollContainer contentContainerStyle={{ flexGrow: 1 }}>
        <Content>{children}</Content>
        {footer && <FooterContainer>{footer}</FooterContainer>}
      </ScrollContainer>
    </SafeArea>
  )
}

const SafeArea = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`

const ScrollContainer = styled.ScrollView`
  flex: 1;
`

const Content = styled.View`
  flex: 1;
`

const FooterContainer = styled.View`
  padding: 16px 24px;
  background-color: #ffffff;
`
