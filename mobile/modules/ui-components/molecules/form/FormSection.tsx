import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Spacer, Text } from '../../src'
import { Ruller } from '../../atoms'

interface Props {
  children?: React.ReactNode | React.ReactNode[]
  rightActions?: React.ReactNode
  title: string
  hint?: string
}

export const Section: React.FC<Props> = (props) => {
  const { children, title, rightActions } = props
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
      <View>
        <View style={styles.row}>
          <Text.Title2>{title}</Text.Title2>
          {rightActions}
        </View>
        <Spacer space={8} />
      </View>
      {childrenWithSeparator}
    </>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
})
