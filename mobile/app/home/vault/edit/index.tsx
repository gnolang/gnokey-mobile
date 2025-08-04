import { Ruller } from '@/components'
import { ModalConfirm } from '@/components/modal'
import { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import { deleteVault, fetchVaults, selectVaultToEdit, updateVault, useAppDispatch } from '@/redux'
import { Stack, useNavigation, useRouter } from 'expo-router'
import { useGnoNativeContext } from '@gnolang/gnonative'
import { Button, Text, Container, Spacer, OnboardingLayout } from '@/modules/ui-components'
import styled from 'styled-components/native'
import ScreenHeader from '@/modules/ui-components/organisms/ScreenHeader'
import { InputWithLabel } from '@/modules/ui-components/molecules'

const Page = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const navigation = useNavigation()
  const { gnonative } = useGnoNativeContext()

  const vault = useSelector(selectVaultToEdit)

  const [vaultName, setVaultName] = useState(vault?.keyInfo.name || 'no named vault')
  const [description, setDescription] = useState(vault?.description || '')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [addressBech32, setAddressBech32] = useState('')

  useEffect(() => {
    ;(async () => {
      if (!vault) return
      const address = await gnonative.addressToBech32(vault.keyInfo.address)
      setAddressBech32(address)
    })()
  }, [vault, gnonative])

  const onConfirmDelete = async () => {
    if (!vault) return
    await dispatch(deleteVault({ vault })).unwrap()
    await dispatch(fetchVaults()).unwrap()
    setShowDeleteModal(false)
    router.replace({ pathname: '/home/vault/edit/remove-success', params: { keyName: vaultName } })
    navigation.goBack()
  }

  const onUpdateAccount = async () => {
    if (!vault) return
    const params = { vault, keyName: vaultName, description }
    await dispatch(updateVault(params)).unwrap()
    await dispatch(fetchVaults()).unwrap()
    router.replace({
      pathname: '/home/vault/edit/edit-success',
      params: { keyName: vaultName }
    })
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
      <Stack.Screen
        options={{
          header: (props) => <ScreenHeader {...props} title={vault.keyName} />
        }}
      />
      <OnboardingLayout
        footer={
          <Button onPress={onUpdateAccount} color="primary">
            Update Account 2
          </Button>
        }
      >
        <Container style={{ flex: 1 }}>
          <Spacer space={16} />
          <RowSpaceBetween>
            <Text.Title2>Info</Text.Title2>
            <TouchableOpacity onPress={() => setShowDeleteModal(true)}>
              <Text.LinkText>Delete</Text.LinkText>
            </TouchableOpacity>
          </RowSpaceBetween>

          <Ruller spacer={16} />
          <InputWithLabel label="Name" placeholder="Name" onChangeText={setVaultName} value={vaultName} />
          <Ruller spacer={16} />
          <InputWithLabel label="Description" placeholder="Description" onChangeText={setDescription} value={description} />
          <Ruller spacer={16} />
          <InputWithLabel label="Address" placeholder="Address" value={addressBech32} noEdit />
          <Ruller spacer={16} />
          <InputWithLabel label="Chain" placeholder="Chain" value={vault.chainIds} noEdit />
          <Ruller spacer={16} />
        </Container>

        <ModalConfirm
          visible={showDeleteModal}
          title="Delete Vault"
          confirmText="Delete"
          message="Are you sure you want to delete this vault?"
          onConfirm={onConfirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      </OnboardingLayout>
    </>
  )
}

const RowSpaceBetween = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export default Page
