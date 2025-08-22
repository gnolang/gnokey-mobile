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
  onBackPress?: () => void
  children?: React.ReactNode
  rightComponent?: React.ReactNode
} & NativeStackHeaderProps

function ScreenHeader(props: ScreenHeaderProps) {
  const { title, subtitle, headerBackVisible = true, onBackPress, children, rightComponent } = props
  const theme = useTheme()

  return (
    <SafeAreaView style={{ backgroundColor: theme.colors.backgroundSecondary }}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.horizontalGroup}>
        <Row style={styles.backButtonBox}>{headerBackVisible && <BackButton onBackPress={onBackPress} />}</Row>
        <Spacer space={8} />
        <Row>
          <Text.LargeTitle>{title}</Text.LargeTitle>
          <Text.Title3>{subtitle}</Text.Title3>
          {rightComponent && <View style={{ marginLeft: 'auto' }}>{rightComponent}</View>}
        </Row>
        {children}
      </View>
    </SafeAreaView>
  )
}

const BackButton = ({ onBackPress }: { onBackPress?: () => void }) => {
  const navigation = useRouter()
  if (!navigation.canGoBack()) {
    return null
  }
  return (
    <TouchableOpacity style={styles.backButton} onPress={() => (onBackPress ? onBackPress() : navigation.back())}>
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
  },
  backButtonBox: {
    minHeight: 25
  },
  horizontalGroup: { marginHorizontal: 20, marginBottom: 12 }
})

export default ScreenHeader
