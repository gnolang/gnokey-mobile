import { View } from 'react-native'
import { useEffect, useMemo, useState } from 'react'
import { SeedInputItem } from './SeedInputItem'
import { useAppDispatch, useAppSelector, setPhrase, selectPhrase } from '@/redux'

interface Props {
  length: 12 | 24
}

export const SeedInputs = ({ length }: Props) => {
  const dispatch = useAppDispatch()

  const seed = useAppSelector(selectPhrase)
  const [mnemonicWords, setMnemonicWords] = useState<string[]>(Array(length).fill(''))

  useEffect(() => {
    if (seed && seed.length > 0) {
      setMnemonicWords(seed.split(' '))
    } else {
      setMnemonicWords(Array(length).fill(''))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed])

  const pairs = useMemo(() => Array.from({ length: length / 2 }).fill(''), [length])

  const handleChangeText = (index: number, text: string) => {
    const newMnemonicWords = [...mnemonicWords]
    newMnemonicWords[index] = text
    dispatch(setPhrase(newMnemonicWords.join(' ')))
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
