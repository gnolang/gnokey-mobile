import { View } from 'react-native'
import { HeroBoxLeft } from './HeroBoxLeft'

export const HomeNotFoundBox = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'green' }}>
      <HeroBoxLeft
        title="Create your first account"
        description="As a new user, your first step is to create a new gno account in the app to securely store your data."
      />
    </View>
  )
}
