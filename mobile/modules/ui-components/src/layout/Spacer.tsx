import React from 'react'
import { View } from 'react-native'

interface Props {
  space?: 4 | 8 | 16 | 24 | 32 | 40 | 48 | 56 | 64 | 200
  spaceH?: 4 | 8 | 16 | 24 | 32 | 40 | 48 | 56 | 64 | 200
}

const Spacer: React.FC<Props> = ({ space = 16, spaceH = 0 }) => {
  return React.createElement(View, { style: { height: space, width: spaceH } })
}

export { Spacer }
