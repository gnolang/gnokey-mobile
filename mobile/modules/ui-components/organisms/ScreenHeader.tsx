import React from 'react'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { NativeStackHeaderProps } from '@react-navigation/native-stack'
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import { Spacer } from '../src'

export type ScreenHeaderProps = {
  subtitle?: string
  title?: string
} & NativeStackHeaderProps

function ScreenHeader(props: ScreenHeaderProps) {
  const { title, subtitle } = props
  const theme = useTheme()

  return (
    <SafeAreaView style={{ backgroundColor: theme.colors.backgroundSecondary }}>
      <StatusBar barStyle="dark-content" />
      <View style={{ marginHorizontal: 16, marginBottom: 12 }}>
        <Row>
          <BackButton />
        </Row>
        <Spacer space={8} />
        <Row>
          <Title>{title}</Title>
          <Subtitle>{subtitle}</Subtitle>
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
      <Ionicons name="chevron-back" size={20} color="#007AFF" />
      <BackLabel style={styles.backText}>Back</BackLabel>
    </TouchableOpacity>
  )
}

const Title = styled(Text)`
  font-weight: 700;
  font-size: 34px;
  line-height: 34px;
  letter-spacing: 0.41px;
`

const Subtitle = styled(Text)`
  font-weight: 590;
  font-size: 20px;
  line-height: 20px;
  letter-spacing: -0.24px;
`

const Row = styled.View`
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
  height: 29px;
`

const BackLabel = styled(Text)`
  color: #007aff;
  font-weight: 400;
  font-size: 17px;
  line-height: 22px;
  letter-spacing: -0.41px;
`

const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1
  },
  backText: {
    color: '#007AFF',
    fontSize: 17,
    fontWeight: '400'
  }
})

export default ScreenHeader
