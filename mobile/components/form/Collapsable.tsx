import { TouchableOpacity } from 'react-native'
import { Text, Ruller } from '@berty/gnonative-ui'
import { useState } from 'react'

export const Collapsable = ({ children }: React.PropsWithChildren) => {
  const [visible, setVisible] = useState(false)

  if (!visible) {
    return (
      <TouchableOpacity onPress={() => setVisible(true)} style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Text.Body>Show more details...</Text.Body>
      </TouchableOpacity>
    )
  }

  return (
    <>
      {children}

      <Ruller />

      <TouchableOpacity onPress={() => setVisible(false)} style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Text.Body>Hide details</Text.Body>
      </TouchableOpacity>
    </>
  )
}
