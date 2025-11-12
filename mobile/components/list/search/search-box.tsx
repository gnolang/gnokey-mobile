import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icons from '../../icons'
import { useTheme } from 'styled-components/native'
import { TextFieldBasic } from '@/components/input'

type Props = {
  onChangeText: (text: string) => void
}

const SearchBox = ({ onChangeText }: Props) => {
  const theme = useTheme()
  return (
    <SafeAreaView>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <TextFieldBasic
          style={[styles.input, { color: theme.colors.black }]}
          placeholder="Search"
          placeholderTextColor={theme.colors.gray}
          onChangeText={onChangeText}
        />
        <Icons.Search color={theme.colors.gray} />
      </View>
    </SafeAreaView>
  )
}

export default SearchBox

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 8
  },
  input: {
    flex: 1
  }
})
