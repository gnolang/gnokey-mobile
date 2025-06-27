import { Text } from '@/modules/ui-components'
import { View } from 'react-native'

function SearchEmptyList() {
  return (
    <View>
      <Text.Body>No results found</Text.Body>
    </View>
  )
}

export default SearchEmptyList
