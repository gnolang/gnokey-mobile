import React, { ReactNode } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'
import { Spacer } from '../src'

interface Props {
  children: ReactNode
  footer?: ReactNode
  header: ReactNode
  subHeader?: ReactNode
  contentPadding?: 20 | 32
  footerWithBorder?: boolean
}

export function HomeLayout({ children, footer, header, subHeader, contentPadding = 32, footerWithBorder }: Props) {
  const insets = useSafeAreaInsets()
  return (
    <>
      {header}
      <Content style={{ paddingHorizontal: contentPadding }}>
        {subHeader && (
          <>
            <Spacer space={16} />
            {subHeader}
          </>
        )}
        {children}
      </Content>
      {footer && (
        <BottonPanel
          $footerWithBorder={footerWithBorder}
          style={{ paddingHorizontal: contentPadding, paddingBottom: Math.max(insets.bottom, 16) }}>
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

export const BottonPanel = styled.View<{ $footerWithBorder?: boolean }>`
  justify-content: space-between;
  align-items: center;
  padding-top: 22px;
  padding-horizontal: 20px;
  border-top-width: ${({ $footerWithBorder }) => ($footerWithBorder ? '0.5px' : '0px')};
  border-top-color: ${({ theme, $footerWithBorder }) => ($footerWithBorder ? theme.colors.border : 'transparent')};
  background-color: ${({ theme, $footerWithBorder }) =>
    $footerWithBorder ? theme.colors.backgroundSecondary : theme.colors.background};
`
