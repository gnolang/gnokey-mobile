import VaultListItem from '@/components/list/vault-list/VaultListItem'
import {
  clearLinking,
  selectCallback,
  selectClientName,
  selectVaults,
  sendAddressToSoliciting,
  useAppDispatch,
  useAppSelector,
  fetchVaults,
  checkForKeyOnChains
} from '@/redux'
import { router, useNavigation } from 'expo-router'
import { useCallback, useEffect } from 'react'
import * as Linking from 'expo-linking'
import { ListTemplate, ScreenHeader, NetworkButtonModal } from '@/modules/ui-components'
import { Vault } from '@/types'
import { Form } from '@/modules/ui-components/molecules'

export default function Page() {
  const navigation = useNavigation()
  const dispatch = useAppDispatch()

  const vaults = useAppSelector(selectVaults)
  const callback = useAppSelector(selectCallback)
  const clientName = useAppSelector(selectClientName)

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        if (!vaults || vaults.length === 0) {
          await dispatch(fetchVaults()).unwrap()
          dispatch(checkForKeyOnChains()).unwrap()
        }
      } catch (error: unknown | Error) {
        console.error(error)
      }
    })
    return unsubscribe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation])

  const returnKeyAddressToSoliciting = useCallback(
    async (keyInfo: Vault) => {
      await dispatch(sendAddressToSoliciting({ keyInfo: keyInfo.keyInfo })).unwrap()

      router.push('/home')
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [callback]
  )

  const onCancel = () => {
    dispatch(clearLinking())
    Linking.openURL(`${callback}?status=cancelled`)
    router.replace('/home')
  }

  return (
    <ListTemplate<Vault>
      header={<ScreenHeader title={`Sign In`} rightComponent={<NetworkButtonModal />} />}
      subHeader={<Form.Section title={`Select an Account to Sign In into ${clientName}`} />}
      footer={null}
      data={vaults || []}
      renderItem={({ item }) => (
        <VaultListItem style={{ paddingHorizontal: 20 }} vault={item} onVaultPress={returnKeyAddressToSoliciting} />
      )}
      keyExtractor={(item) => item.keyInfo.name}
    />
  )
}
