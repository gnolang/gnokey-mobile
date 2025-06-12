import { ScrollView } from 'react-native'
import { useFocusEffect } from 'expo-router'
import { useCallback } from 'react'
import { Container, SafeAreaView, Spacer } from '@/modules/ui-components'
import { NetworkSelectView } from '@/views'
import { getCurrentChain, useAppDispatch } from '@/redux'

export default function Page() {
  const dispatch = useAppDispatch()

  useFocusEffect(
    useCallback(() => {
      dispatch(getCurrentChain())
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  )

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
