import React, { ReactNode } from 'react'
import { StyleSheet, SafeAreaView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

interface OnboardingLayoutProps {
  children: ReactNode
  footer: ReactNode
}

export function HomeLayout({ children, footer }: OnboardingLayoutProps) {
  const insets = useSafeAreaInsets()
  return (
    <>
      <SafeArea>
        <View style={styles.content}>{children}</View>
      </SafeArea>
      <BottonPanel style={{ paddingBottom: Math.max(insets.bottom, 16) }}>{footer}</BottonPanel>
    </>
  )
}

const SafeArea = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20
  }
})

export const BottonPanel = styled.View`
  border-top-width: 0.5px;
  border-top-color: ${({ theme }) => theme.colors.border};
  justify-content: space-between;
  align-items: center;
  padding-top: 22px;
  padding-horizontal: 20px;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
`
