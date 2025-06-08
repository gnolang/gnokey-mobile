import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

interface Props {
  children: React.ReactNode | React.ReactNode[]
  title?: string | React.ReactNode
  hint?: string
}

export const Section: React.FC<Props> = (props) => {
  const { children, title } = props
  const childrenWithSeparator = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      return (
        <React.Fragment key={index}>
          {child}
          {index < React.Children.count(children) - 1 && <Ruller />}
        </React.Fragment>
      )
    }
    return child
  })

  return (
    <>
      {title ? (
        <View style={{ marginBottom: 8 }}>
          <Title>{title}</Title>
        </View>
      ) : null}
      <SectionStyleContext>{childrenWithSeparator}</SectionStyleContext>
    </>
  )
}

const Title = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.textMuted};
`

const Ruller = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border};
  margin: 16px 0;
`

const SectionStyleContext = styled(View)`
  padding: 16px 8px 16px 16px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
`
