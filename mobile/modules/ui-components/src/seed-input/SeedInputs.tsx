import { View } from 'react-native'
import { useEffect, useMemo, useState } from 'react'
import { SeedInputItem } from './SeedInputItem'

interface Props {
  length: 12 | 24
  initialValue: string
  onChange: (v: string) => void
}

export const SeedInputs = ({ length, initialValue, onChange = () => {} }: Props) => {
  const [mnemonicWords, setMnemonicWords] = useState<string[]>(initialValue.split(' '))

  useEffect(() => {
    setMnemonicWords(initialValue.split(' '))
  }, [initialValue])

  const pairs = useMemo(() => Array(Math.round(length / 2)).fill(''), [length])

  const handleChangeText = (index: number, text: string) => {
    const newMnemonicWords = [...mnemonicWords]
    newMnemonicWords[index] = text
    setMnemonicWords(newMnemonicWords)
    onChange(newMnemonicWords.join(' '))
  }

  return (
    <View>
      {pairs.map((_, rowIdx) => (
        <View
          key={rowIdx}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 12,
            width: '100%'
          }}
        >
          {[0, 1].map((colIdx) => {
            const index = rowIdx * 2 + colIdx
            return (
              <SeedInputItem
                key={index}
                index={index + 1}
                value={mnemonicWords[index]}
                onChangeText={(text) => handleChangeText(index, text)}
              />
            )
          })}
        </View>
      ))}
    </View>
  )
}
