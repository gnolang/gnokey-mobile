import { useEffect, useState } from 'react'
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import { useRouter } from 'expo-router'
import { Layout } from '@/components/index'
import {
  getInitialState,
  selectAction,
  selectInitialized,
  selectMasterPassword,
  changeMasterPass,
  useAppDispatch,
  useAppSelector,
  createMasterPass
} from '@/redux'
import SignInView from '@/views/signin'
import SignUpView from '@/views/signup'
import { Container, Spacer, Text } from '@/modules/ui-components'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Root() {
  const route = useRouter()

  const [error, setError] = useState<string | undefined>(undefined)

  const dispatch = useAppDispatch()

  const appInitialized = useAppSelector(selectInitialized)
  const hasMasterPassword = useAppSelector(selectMasterPassword)
  const action = useAppSelector(selectAction)

  useEffect(() => {
    dispatch(getInitialState())
  }, [dispatch])

  const onCreateMasterPass = async (masterPassword: string) => {
    try {
      await dispatch(createMasterPass({ masterPassword })).unwrap()

      naviateTo()
    } catch (error: any) {
      console.log('error', error.message)
      setError(error?.message)
    }
  }

  const onUnlokPress = async (masterPassword: string) => {
    try {
      await dispatch(changeMasterPass({ masterPassword })).unwrap()

      naviateTo()
    } catch (error: any) {
      console.log('error', error.message)
      setError(error?.message)
    }
  }

  const naviateTo = () => {
    if (action) {
      route.replace(action)
    } else {
      route.replace('/home')
    }
  }

  if (!appInitialized) {
    return (
      // TODO: avoid flickering
      <Layout.Container>
        <Layout.Body style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text.Body>Loading App...</Text.Body>
        </Layout.Body>
      </Layout.Container>
    )
  }

  return (
    <Container>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.inner}>
              <View style={styles.innerGroup}>
                <Text.H1>GnoKey Mobile</Text.H1>
                <Spacer space={16} />
                <Text.Body>The Gno Key Management Tool</Text.Body>
              </View>

              <View style={styles.bottonGroup}>
                {hasMasterPassword ? (
                  <SignInView
                    onUnlokPress={onUnlokPress}
                    error={error}
                    onForgotPasswordPress={() => route.push('/forgot-pass')}
                  />
                ) : null}
                {!hasMasterPassword ? <SignUpView onCreateMasterPress={onCreateMasterPass} error={error} /> : null}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  inner: {
    flex: 1
  },
  innerGroup: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottonGroup: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
})
