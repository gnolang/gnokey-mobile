import React, { ReactNode } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

interface Props {
  children: ReactNode
  footer?: ReactNode
  header: ReactNode
  contentPadding?: 20 | 32
}

export function HomeLayout({ children, footer, header, contentPadding = 32 }: Props) {
  const insets = useSafeAreaInsets()
  return (
    <>
      {header}
      <Content style={{ paddingHorizontal: contentPadding }}>{children}</Content>
      {footer && (
        <BottonPanel style={{ paddingHorizontal: contentPadding, paddingBottom: Math.max(insets.bottom, 16) }}>
          {footer}
        </BottonPanel>
      )}
    </>
  )
}

const Content = styled(View)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`

export const BottonPanel = styled.View`
  border-top-width: 0.5px;
  border-top-color: ${({ theme }) => theme.colors.border};
  justify-content: space-between;
  align-items: center;
  padding-top: 22px;
  padding-horizontal: 20px;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
`
