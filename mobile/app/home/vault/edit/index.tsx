import { Alert } from 'react-native'
import { useState } from 'react'
import { ModalConfirm } from '@/components/modal'
import { useSelector } from 'react-redux'
import { deleteVault, fetchVaults, selectVaultToEditWithBalance, updateVault, useAppDispatch } from '@/redux'
import { useNavigation, useRouter } from 'expo-router'
import { Button, Text, Container, Spacer, ScreenHeader, HomeLayout } from '@/modules/ui-components'
import { Form, InputWithLabel } from '@/modules/ui-components/molecules'
import { Ruller } from '@/modules/ui-components/atoms'
import { LinkHeader } from '@/modules/ui-components/src/text'
import { formatter } from '@/modules/utils/format'

const Page = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const navigation = useNavigation()

  const vault = useSelector(selectVaultToEditWithBalance)

  const [vaultName, setVaultName] = useState(vault?.keyInfo.name || 'no named vault')
  const [description, setDescription] = useState(vault?.description || '')
  const [showDeleteModal, setShowDeleteModal] = useState(false)

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

  if (!vault) {
    return (
      <Container>
        <Text.Body>No vault selected.</Text.Body>
        <Spacer />
        <Button onPress={() => navigation.goBack()} color="primary">
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
          <Form.Section title="Info" rightActions={<LinkHeader onPress={() => setShowDeleteModal(true)}>Delete</LinkHeader>} />
        }
        footer={
          <Button onPress={onUpdateAccount} color="primary">
            Update Account
          </Button>
        }
      >
        <Container style={{ flex: 1 }}>
          <Ruller spacer={16} />
          <InputWithLabel label="Name" placeholder="Name" onChangeText={setVaultName} value={vaultName} noEdit />
          <Ruller spacer={16} />
          <InputWithLabel label="Description" placeholder="Description" onChangeText={setDescription} value={description} />
          <Ruller spacer={16} />
          <InputWithLabel label="Address" placeholder="Address" value={vault.address} noEdit />
          <Ruller spacer={16} />
          <InputWithLabel
            label="Chain"
            placeholder="Chain"
            value={vault.chain ? vault.chain.chainName : 'No User Registration'}
            noEdit
          />
          <Ruller spacer={16} />
          <InputWithLabel
            label="Created At"
            placeholder="Created At"
            value={vault.createdAt ? formatter.date(vault.createdAt) : ''}
            noEdit
          />
          <Ruller spacer={16} />
          <InputWithLabel label="Balance" placeholder="Balance" value={formatter.balance(vault.balance)} noEdit />
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
