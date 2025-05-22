import { StyleSheet, Text, TextInput, View } from 'react-native'

interface Props {
  index: number
  onChangeText: (text: string) => void
  value?: string
}

export const SeedInputItem = ({ index, onChangeText, value }: Props) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text>{index}</Text>
      <TextInput
        onChangeText={onChangeText}
        style={styles.textInput}
        value={value}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="off"
        textContentType="none"
        returnKeyType="done"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    height: 30,
    width: 150,
    paddingHorizontal: 4,
    marginLeft: 2
  }
})
