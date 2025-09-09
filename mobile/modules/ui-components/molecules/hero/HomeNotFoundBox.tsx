import { StyleSheet, View } from 'react-native'
import { HeroBoxLeft } from './HeroBoxLeft'

export const HomeNotFoundBox = () => {
  return (
    <View style={styles.container}>
      <HeroBoxLeft
        title="Not found"
        description="We couldn't find any accounts matching your search. Try adjusting your search criteria."
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
