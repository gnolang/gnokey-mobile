import { StyleSheet, Text, TextInput, View } from 'react-native'

interface Props {
  index: number
  onChangeText: (text: string) => void
  value?: string
}

export const SeedInputItem = ({ index, onChangeText, value }: Props) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={styles.textIndex}>{index}</Text>
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
  textIndex: {
    width: 20
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    height: 30,
    margin: 0,
    padding: 0,
    paddingHorizontal: 8,
    width: 130
  }
})
