import React from 'react'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { NativeStackHeaderProps } from '@react-navigation/native-stack'
import { SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import { Spacer, Text } from '../src'

export type ScreenHeaderProps = {
  subtitle?: string
  title?: string
  headerBackVisible?: boolean
} & NativeStackHeaderProps

function ScreenHeader(props: ScreenHeaderProps) {
  const { title, subtitle, headerBackVisible = true } = props
  const theme = useTheme()

  return (
    <SafeAreaView style={{ backgroundColor: theme.colors.backgroundSecondary }}>
      <StatusBar barStyle="dark-content" />
      <View style={{ marginHorizontal: 16, marginBottom: 12 }}>
        <Row>{headerBackVisible && <BackButton />}</Row>
        <Spacer space={8} />
        <Row>
          <Text.LargeTitle>{title}</Text.LargeTitle>
          <Text.Title3>{subtitle}</Text.Title3>
        </Row>
      </View>
    </SafeAreaView>
  )
}

const BackButton = () => {
  const navigation = useRouter()
  if (!navigation.canGoBack()) {
    return null
  }
  return (
    <TouchableOpacity style={styles.backButton} onPress={() => navigation.back()}>
      <Ionicons name="chevron-back" size={20} color="#007aff" />
      <BackLabel>Back</BackLabel>
    </TouchableOpacity>
  )
}

const Row = styled.View`
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
`

const BackLabel = styled(Text.Title3)`
  color: #007aff;
  font-weight: 400;
`

const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  }
})

export default ScreenHeader
