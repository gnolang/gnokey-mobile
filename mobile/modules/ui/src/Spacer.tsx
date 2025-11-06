import { type JSX } from 'react'
import { View } from 'react-native'

interface Props {
  space?: 4 | 8 | 16 | 24 | 32 | 40 | 48 | 56 | 64 | 200
  spaceH?: 4 | 8 | 16 | 24 | 32 | 40 | 48 | 56 | 64 | 200
}

function Spacer({ space = 16, spaceH = 4 }: Props): JSX.Element {
  return <View style={{ height: space, width: spaceH }} />
}

export { Spacer }
