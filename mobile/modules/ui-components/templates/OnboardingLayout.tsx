import React, { ReactNode } from 'react'
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView } from 'react-native'
import styled from 'styled-components/native'

interface OnboardingLayoutProps {
  children: ReactNode
  /**
   * Optional footer component to be displayed at the bottom of the layout.
   * This can be used for actions like "Next", "Back", or any other custom footer content.
   **/
  footer?: ReactNode
  /**
   * Optional prop to enable keyboard awareness, adjusting the layout when the keyboard is visible.
   * This is useful for forms or input fields that may be obscured by the keyboard.
   **/
  keyboardAware?: boolean
}

export function OnboardingLayout({ children, footer, keyboardAware }: OnboardingLayoutProps) {
  const scrollContent = (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: 12 }}
      keyboardShouldPersistTaps="handled"
    >
      <Content>{children}</Content>
    </ScrollView>
  )

  return (
    <SafeArea>
      {keyboardAware ? (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          {scrollContent}
          {footer && <FooterContainer>{footer}</FooterContainer>}
        </KeyboardAvoidingView>
      ) : (
        <>
          {scrollContent}
          {footer && <FooterContainer>{footer}</FooterContainer>}
        </>
      )}
    </SafeArea>
  )
}

const FooterContainer = styled.View`
  padding-horizontal: 20px;
`

const SafeArea = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`

const Content = styled.View`
  flex: 1;
`
