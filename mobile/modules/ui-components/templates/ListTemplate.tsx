import React from 'react'
import { FlatList, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Spacer } from '../src'
import { useTheme } from 'styled-components/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface ListTemplateProps<T> {
  header: React.ReactNode
  subHeader: React.ReactNode
  footer: React.ReactNode
  data: T[]
  renderItem: ({ item, index }: { item: T; index: number }) => React.ReactElement
  keyExtractor: (item: T) => string
  showsVerticalScrollIndicator?: boolean
  contentContainerStyle?: object
}

export function ListTemplate<T>({
  header,
  subHeader,
  footer,
  data,
  renderItem,
  keyExtractor,
  showsVerticalScrollIndicator = false,
  contentContainerStyle = { paddingVertical: 10 }
}: ListTemplateProps<T>) {
  const theme = useTheme()
  const insets = useSafeAreaInsets()
  const paddingBottom = insets.bottom || 20

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {header}
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <Spacer space={16} />
        {subHeader}
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          contentContainerStyle={contentContainerStyle}
        />
        <View style={{ paddingBottom }}>{footer}</View>
      </View>
    </GestureHandlerRootView>
  )
}
