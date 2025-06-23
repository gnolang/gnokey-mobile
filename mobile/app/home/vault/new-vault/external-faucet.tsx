import { Container, Spacer, Text } from '@/modules/ui-components'
import { Linking } from 'react-native'
import { Button } from '@/modules/ui-components'
import {
  newAccountSelector,
  onboarding,
  resetState,
  selectOnboardingLoading,
  signUpStateSelector,
  useAppDispatch,
  useAppSelector,
  VaultCreationState
} from '@/redux'
import { TextCopy } from '@/components'
import { useTheme } from 'styled-components/native'
import { Octicons } from '@expo/vector-icons'
import { useGnoNativeContext } from '@gnolang/gnonative'
import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { LoadingModal } from '@/components/loading'

export default function Page() {
  const newAccount = useAppSelector(newAccountSelector)
  const signUpState = useAppSelector(signUpStateSelector)
  const loading = useAppSelector(selectOnboardingLoading)

  const theme = useTheme()
  const { gnonative } = useGnoNativeContext()
  const dispatch = useAppDispatch()
  const router = useRouter()

  const [addressBech32, setAddressBech32] = useState<string | undefined>(undefined)

  useEffect(() => {
    ;(async () => {
      if (!newAccount) return

      const address = await gnonative.addressToBech32(newAccount.address)
      setAddressBech32(address)
    })()
  }, [newAccount, gnonative])

  useEffect(() => {
    if (
      signUpState === VaultCreationState.account_created ||
      signUpState === VaultCreationState.masterkey_created_external_faucet
    ) {
      router.replace('/home/vault/new-vault/new-vault-success')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signUpState])

  const openFaucet = () => {
    Linking.openURL('https://faucet.gno.land/')
  }

  const continueToVaultCreation = async () => {
    if (!newAccount) {
      console.error('No new account found, cannot continue to vault creation.')
      return
    }
    console.log('Continuing to vault creation...')
    await dispatch(onboarding({ account: newAccount })).unwrap()
  }

  return (
    <Container>
      <LoadingModal visible={loading} />
      <Spacer />
      <Text.H3>To fund your master key, please open the Gno Faucet website and request tokens for your address.</Text.H3>
      <Spacer space={24} />
      <TextCopy text={addressBech32}>
        <Text.Body style={{ color: theme.colors.primary }}>1 - Press here to copy address:</Text.Body>
        <Text.Body style={{ textAlign: 'center' }}>
          {addressBech32} &nbsp;
          <Octicons name="copy" size={12} color={theme.colors.primary} />
        </Text.Body>
      </TextCopy>
      <Spacer />

      <Text.Body style={{ color: theme.colors.primary }}>2 - Open Gno Faucet:</Text.Body>
      <Button onPress={openFaucet}>Open Gno Faucet</Button>
      <Spacer space={24} />
      <Text.Body style={{ color: theme.colors.primary }}>
        3 - After completing the faucet process, return to this app to continue.
      </Text.Body>
      <Button onPress={() => continueToVaultCreation()}>Continue to Master Key Creation</Button>
    </Container>
  )
}
