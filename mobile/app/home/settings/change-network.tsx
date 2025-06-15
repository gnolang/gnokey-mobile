import { ScrollView } from 'react-native'
import { Container, SafeAreaView, Spacer } from '@/modules/ui-components'
import { NetworkSelectView } from '@/views'

export default function Page() {
  return (
    <Container>
      <SafeAreaView>
        <ScrollView>
          <Spacer />
          <NetworkSelectView />
          <Spacer />
        </ScrollView>
      </SafeAreaView>
    </Container>
  )
}
