import React from 'react'
import { FlatList, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Ruller } from '../atoms'
import { Spacer } from '../src'
import { useTheme } from 'styled-components/native'

interface ListTemplateProps<T> {
  header: React.ReactNode
  subHeader: React.ReactNode
  data: T[]
  renderItem: ({ item, index }: { item: T; index: number }) => React.ReactElement
  keyExtractor: (item: T) => string
  showsVerticalScrollIndicator?: boolean
  contentContainerStyle?: object
}

export function ListTemplate<T>({
  header,
  subHeader,
  data,
  renderItem,
  keyExtractor,
  showsVerticalScrollIndicator = false,
  contentContainerStyle = { paddingVertical: 10 }
}: ListTemplateProps<T>) {
  const theme = useTheme()
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {header}
      <View style={{ paddingHorizontal: 20 }}>
        <Spacer space={16} />
        {subHeader}
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        contentContainerStyle={contentContainerStyle}
        ItemSeparatorComponent={() => <Ruller />}
      />
    </GestureHandlerRootView>
  )
}
