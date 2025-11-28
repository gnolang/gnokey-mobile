import { Alert } from 'react-native'
import { useState } from 'react'
import {
  deleteVault,
  fetchBalances,
  fetchVaults,
  selectCurrentChain,
  selectDevMode,
  selectVaultToEditWithBalance,
  updateVault,
  useAppDispatch,
  useAppSelector
} from '@/redux'
import { useRouter } from 'expo-router'
import { ScreenHeader, ModalConfirm, openFaucet, formatter } from '@/components'
import { Text, Form, Spacer, Button, HomeLayout, Ruller } from '@berty/gnonative-ui'
import { InputWithLabel } from '@/components'
import { AntDesign } from '@expo/vector-icons'
import styled, { DefaultTheme, useTheme } from 'styled-components/native'
import { VaultOptionsButton, Icons } from '@/components'
import { FormItem } from '@berty/gnonative-ui'
import Clipboard from '@react-native-clipboard/clipboard'

const Page = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const theme = useTheme()

  const vault = useAppSelector(selectVaultToEditWithBalance)
  const network = useAppSelector(selectCurrentChain)
  const isDevMode = useAppSelector(selectDevMode)
  const hasFaucetPortal = network?.faucetPortalUrl && network?.faucetPortalUrl.length > 0

  const [description, setDescription] = useState(vault?.description || '')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const onConfirmDelete = async () => {
    if (!vault) return
    await dispatch(deleteVault({ vault })).unwrap()
    await dispatch(fetchVaults()).unwrap()
    setShowDeleteModal(false)
    router.replace({ pathname: '/home/vault/edit/remove-success', params: { keyName: vault?.keyInfo.name } })
  }

  const onUpdateAccount = async () => {
    if (!vault) {
      Alert.alert('Error', 'No vault selected for update.')
      return
    }
    const params = { vault, keyName: vault?.keyInfo.name, description }
    try {
      await dispatch(updateVault(params)).unwrap()
      await dispatch(fetchVaults()).unwrap()
      router.replace({
        pathname: '/home/vault/edit/edit-success',
        params: { keyName: vault?.keyInfo.name }
      })
    } catch (error: any) {
      Alert.alert('Error', `Failed to update vault: ${error.message}`)
      console.error('Update vault error:', error)
    }
  }

  // Get the command from the clipboard (from the gnoweb help page), parse and return an objects with the fields.
  // If the text on the clipboard is can't be parsed as a command, return null.
  const parseCommand = async () => {
    const command = await Clipboard.getString()
    let pkgPath:string
    let func:string
    let allArgs:string
    let send:string
    let chainId:string
    let remote:string
    let address:string

    // Try the "Fast" format
    const commandRegex = /gnokey maketx call -pkgpath "([^"]+)" -func "([^"]+)" (.*)-gas-fee \w+ -gas-wanted \w+ -send "([^"]*)" -broadcast -chainid "([^"]+)" -remote "([^"]+)" (\w+)/g
    const commandMatch = commandRegex.exec(command)
    if (commandMatch) {
      pkgPath = commandMatch![1]
      func = commandMatch![2]
      allArgs = commandMatch![3]
      send = commandMatch![4]
      chainId = commandMatch![5]
      remote = commandMatch![6]
      address = commandMatch![7]
    } else {
      // Try the "Full Security" format
      const commandRegex1 = /gnokey maketx call -pkgpath "([^"]+)" -func "([^"]+)" (.*)-gas-fee \w+ -gas-wanted \w+ -send "([^"]*)" (\w+) > call.tx\ngnokey sign -tx-path call.tx -chainid "([^"]+)"/g
      const commandRegex2 = /gnokey broadcast -remote "([^"]+)"/g
      const commandMatch1 = commandRegex1.exec(command)
      const commandMatch2 = commandRegex2.exec(command)
      if (commandMatch1 && commandMatch2) {
        pkgPath = commandMatch1![1]
        func = commandMatch1![2]
        allArgs = commandMatch1![3]
        send = commandMatch1![4]
        address = commandMatch1![5]
        remote = commandMatch2![1]
        chainId = commandMatch1![6]
      } else {
        return null
      }
    }

    // Get the args list
    const argsRegex = /-args "([^"]*)" /g
    let args:string[] = []
    let match
    while ((match = argsRegex.exec(allArgs)) !== null) {
      args.push(match[1])
    }

    return { pkgPath, func, args, send, chainId, remote, address }
  }

  const refreshBalance = async () => {
    if (!vault) return
    try {
      setRefreshing(true)
      await dispatch(fetchBalances([vault]))
    } catch (error: unknown | Error) {
      console.error(error)
    } finally {
      setRefreshing(false)
    }
  }

  if (!vault) {
    return (
      <Container>
        <Text.Body>No vault selected.</Text.Body>
        <Spacer />
        <Button onPress={() => router.back()} color="primary">
          Go Back
        </Button>
      </Container>
    )
  }

  return (
    <>
      <HomeLayout
        contentPadding={20}
        header={<ScreenHeader title={vault.keyName} />}
        subHeader={
          <Form.Section
            title="Info"
            rightActions={
              <VaultOptionsButton
                isDevMode={isDevMode}
                onTransfer={() => router.navigate({ pathname: '/home/vault/transfer-funds' })}
                onDelete={() => setShowDeleteModal(true)}
                onRefreshBalance={refreshBalance}
              />
            }
          />
        }
        footer={
          <Button onPress={onUpdateAccount} color="primary">
            Update Account
          </Button>
        }
      >
        <Container style={{ flex: 1 }}>
          <Ruller spacer={4} />
          <FormItem label="Name" value={vault?.keyInfo.name} />
          <Ruller spacer={4} />
          <Spacer spaceH={4} />
          <InputWithLabel label="Description" placeholder="Description" onChangeText={setDescription} value={description} />
          <Ruller spacer={16} />
          <FormItem
            label="Address"
            copyTextValue={vault.address}
            endAdornment={<Icons.CopyIcon muted />}
            value={<Text.Body>{vault.address}</Text.Body>}
          />
          <Spacer spaceH={4} />
          <Ruller spacer={4} />
          <FormItem label="Chain" value={vault.chain ? vault.chain.chainName : 'No User Registration'} />
          <Ruller spacer={4} />
          <FormItem label="Created At" value={vault.createdAt ? formatter.date(vault.createdAt) : ''} />
          <Ruller spacer={4} />
          <FormItem
            label="Balance"
            value={refreshing ? 'Refreshing...' : `${formatter.balance(vault.balance)} GNOT`}
            endAdornment={
              hasFaucetPortal && <AntDesign name="right" size={18} color={theme.colors.border} onPress={openFaucet} />
            }
          />
          <Ruller spacer={4} />
        </Container>

        <ModalConfirm
          visible={showDeleteModal}
          title="Delete Account"
          confirmText="Delete"
          message="Are you sure you want to delete this account?"
          onConfirm={onConfirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      </HomeLayout>
    </>
  )
}

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.background};
`

export default Page
