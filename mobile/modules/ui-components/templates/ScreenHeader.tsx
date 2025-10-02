import React from 'react'
import { useRouter } from 'expo-router'
import { StatusBar, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from 'styled-components/native'
import { Spacer, Text } from '../src'
import HeaderActionButton from '../atoms/button/HeaderActionButton'

export type ScreenHeaderProps = {
  subtitle?: string
  title?: string
  headerBackVisible?: boolean
  onBackPress?: () => void
  children?: React.ReactNode
  rightComponent?: React.ReactNode
}

function ScreenHeader(props: ScreenHeaderProps) {
  const { title, subtitle, headerBackVisible = true, onBackPress, children, rightComponent } = props
  const theme = useTheme()

  return (
    <SafeAreaView style={{ backgroundColor: theme.colors.backgroundSecondary }}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.horizontalGroup}>
        <View style={styles.backButtonBox}>{headerBackVisible && <BackButton onBackPress={onBackPress} />}</View>
        <Spacer space={8} />
        <View style={styles.row}>
          <Text.LargeTitle>{title}</Text.LargeTitle>
          <Text.Title3>{subtitle}</Text.Title3>
          {rightComponent && <View style={{ marginLeft: 'auto' }}>{rightComponent}</View>}
        </View>
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
  return <HeaderActionButton onPress={() => (onBackPress ? onBackPress() : navigation.back())} label="Back" icon="chevron-back" />
}

const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  backButtonBox: {
    minHeight: 25
  },
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between'
  },
  horizontalGroup: { marginHorizontal: 20, marginBottom: 12 }
})

export default ScreenHeader
