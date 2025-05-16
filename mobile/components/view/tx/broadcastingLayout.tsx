import { Text } from '@/modules/ui-components'
import React from 'react'
import { StyleSheet, View } from 'react-native'

type Props = {
  title: string
  iconView: React.ReactNode
  actions?: React.ReactNode
  details?: React.ReactNode
}

export const BroadcastingLayout = ({ title = 'Title', iconView = null, actions = null, details = null }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.centerView}>
        <View style={styles.title}>
          <Text.H3>{title}</Text.H3>
        </View>
        <View style={styles.iconView}>{iconView}</View>
      </View>

      <View style={styles.details}>{details}</View>

      <View style={styles.actions}>{actions}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    paddingTop: 80
  },
  centerView: {
    alignItems: 'center'
  },
  title: {},
  iconView: {
    marginTop: 40
  },
  details: {
    flex: 1
  },
  actions: {}
})
