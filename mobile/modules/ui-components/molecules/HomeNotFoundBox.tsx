import { View } from 'react-native'
import { HeroBoxLeft } from './hero/HeroBoxLeft'

export const HomeNotFoundBox = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <HeroBoxLeft
        title="Not found"
        description="We couldn't find any accounts matching your search. Try adjusting your search criteria."
      />
    </View>
  )
}
