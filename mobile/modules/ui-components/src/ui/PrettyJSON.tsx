import React from 'react'
import { ScrollView, Text, StyleSheet, Platform } from 'react-native'

export const PrettyJSON = ({ data }: { data: object }) => {
  const formatted = JSON.stringify(data, null, 2)

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.jsonText}>{formatted}</Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 400,
    padding: 10,
    backgroundColor: '#f4f4f4',
    borderRadius: 8
  },
  jsonText: {
    fontFamily: Platform.select({
      ios: 'Courier',
      android: 'monospace',
      default: 'monospace'
    }),
    fontSize: 14,
    color: '#333'
  }
})
