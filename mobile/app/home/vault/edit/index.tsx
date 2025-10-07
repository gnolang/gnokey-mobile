import { Alert } from 'react-native'
import { useState } from 'react'
import { ModalConfirm } from '@/components'
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
import { Button, Text, Container, Spacer, ScreenHeader, HomeLayout, FormItem } from '@/modules/ui-components'
import { Form, InputWithLabel } from '@/modules/ui-components/molecules'
import { CopyIcon, Ruller, VaultOptionsButton } from '@/modules/ui-components/atoms'
import { formatter } from '@/modules/ui-components/utils/format'
import { openFaucet } from '@/modules/ui-components/utils/index'
import { AntDesign } from '@expo/vector-icons'
import { useTheme } from 'styled-components/native'

const Page = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const theme = useTheme()

  const vault = useAppSelector(selectVaultToEditWithBalance)
  const network = useAppSelector(selectCurrentChain)
  const isDevMode = useAppSelector(selectDevMode)
  const hasFaucetPortal = network?.faucetPortalUrl && network?.faucetPortalUrl.length > 0

  const [vaultName] = useState(vault?.keyInfo.name || 'no named vault')
  const [description, setDescription] = useState(vault?.description || '')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const onConfirmDelete = async () => {
    if (!vault) return
    await dispatch(deleteVault({ vault })).unwrap()
    await dispatch(fetchVaults()).unwrap()
    setShowDeleteModal(false)
    router.replace({ pathname: '/home/vault/edit/remove-success', params: { keyName: vaultName } })
  }

  const onUpdateAccount = async () => {
    if (!vault) {
      Alert.alert('Error', 'No vault selected for update.')
      return
    }
    const params = { vault, keyName: vaultName, description }
    try {
      await dispatch(updateVault(params)).unwrap()
      await dispatch(fetchVaults()).unwrap()
      router.replace({
        pathname: '/home/vault/edit/edit-success',
        params: { keyName: vaultName }
      })
    } catch (error: any) {
      Alert.alert('Error', `Failed to update vault: ${error.message}`)
      console.error('Update vault error:', error)
    }
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
          <FormItem label="Name" value={vaultName} />
          <Ruller spacer={4} />
          <Spacer spaceH={4} />
          <InputWithLabel label="Description" placeholder="Description" onChangeText={setDescription} value={description} />
          <Ruller spacer={16} />
          <FormItem
            label="Address"
            copyTextValue={vault.address}
            endAdornment={<CopyIcon muted />}
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

export default Page
