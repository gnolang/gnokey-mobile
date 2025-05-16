import { StyleSheet, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'

const IconClose = () => <Ionicons name="close" size={24} color="black" />
const IconLeft = () => <Ionicons name="arrow-back" size={24} color="black" />

interface Props {
  onCloseHandler?: () => object
  iconType?: 'close' | 'back'
}

function ClosePage({ onCloseHandler, iconType = 'close' }: Props) {
  const router = useRouter()

  const onPress = () => {
    onCloseHandler ? onCloseHandler() : router.back()
  }

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      {iconType === 'close' ? <IconClose /> : <IconLeft />}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    paddingLeft: 10,
    paddingTop: 40
  }
})

export default ClosePage
