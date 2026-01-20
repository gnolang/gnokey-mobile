import { Text, Spacer, Button, HomeLayout } from '@berty/gnonative-ui'
import {
  existingAccountSelector,
  newAccountSelector,
  registerAccount,
  selectLoadingAddVault,
  signUpStateSelector,
  useAppDispatch,
  useAppSelector,
  VaultCreationState
} from '@/redux'
import { TextCopy, Icons } from '@/components'
import { useTheme } from 'styled-components/native'
import { useGnoNativeContext } from '@gnolang/gnonative'
import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { LoadingModal } from '@/components/loading'
import { openFaucet, sliceString, ScreenHeader } from '@/components'

export default function Page() {
  const newAccount = useAppSelector(newAccountSelector)
  const existingAccount = useAppSelector(existingAccountSelector)
  const signUpState = useAppSelector(signUpStateSelector)
  const loading = useAppSelector(selectLoadingAddVault)

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
    ;(async () => {
      if (!existingAccount) return
      const address = await gnonative.addressToBech32(existingAccount.address)
      setAddressBech32(address)
    })()
  }, [existingAccount, gnonative])

  useEffect(() => {
    if (signUpState === VaultCreationState.account_registered) {
      router.replace('/home/vault/add/new-vault-success')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signUpState])

  const continueToVaultCreation = async () => {
    const account = newAccount || existingAccount
    if (!account) {
      console.error('No account found, cannot continue to vault creation.')
      return
    }
    console.log('Continuing to vault creation...')
    await dispatch(registerAccount()).unwrap()
  }

  return (
    <HomeLayout header={<ScreenHeader title="External Faucet" />}>
      <LoadingModal visible={loading} />
      <Spacer />
      <Text.Title2>To fund your Account Key, please open the Gno Faucet website and request tokens for your address.</Text.Title2>
      <Spacer space={24} />
      <TextCopy text={addressBech32}>
        <Text.Body style={{ color: theme.colors.primary }}>1 - Press here to copy your address:</Text.Body>
        <Spacer space={8} />
        <Text.Body style={{ textAlign: 'left' }}>
          {addressBech32 ? sliceString(addressBech32) : 'Loading...'} &nbsp;
          <Icons.CopyIcon />
        </Text.Body>
      </TextCopy>

      <Spacer space={24} />

      <Text.Body style={{ color: theme.colors.primary }}>2 - Open Gno Faucet and request tokens:</Text.Body>
      <Spacer space={8} />
      <Text.Body style={{ color: theme.error.text }}>(Minimum 20 GNOTs)</Text.Body>
      <Spacer space={8} />
      <Button onPress={openFaucet}>Open Gno Faucet and request tokens</Button>

      <Spacer space={24} />

      <Text.Body style={{ color: theme.colors.primary }}>
        3 - After completing the faucet process, return to this app to continue.
      </Text.Body>
      <Spacer space={8} />
      <Button onPress={() => continueToVaultCreation()}>Continue to Account Key Creation</Button>
    </HomeLayout>
  )
}
