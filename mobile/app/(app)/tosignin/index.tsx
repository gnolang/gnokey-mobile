import { useCallback, useEffect } from 'react'
import { router, useNavigation } from 'expo-router'
import * as Linking from 'expo-linking'
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
import { ListTemplate, ScreenHeader, NetworkButtonModal, VaultListItem, Form, HeroBoxLeft } from '@/modules/ui-components'
import { Vault } from '@/types'
import { View } from 'react-native'

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
      contentContainerStyle={{ flexGrow: 1 }}
      header={<ScreenHeader title="Sign In" rightComponent={<NetworkButtonModal />} onBackPress={onCancel} />}
      subHeader={vaults && vaults.length > 0 ? <Form.Section title={`Select an account to sign in to ${clientName}`} /> : null}
      footer={null}
      data={vaults || []}
      renderItem={({ item }) => (
        <VaultListItem style={{ paddingHorizontal: 20 }} vault={item} onVaultPress={returnKeyAddressToSoliciting} />
      )}
      emptyComponent={
        <HeroBoxLeft
          title="No Accounts"
          description={`You don't have any accounts yet on this network to sign in to ${clientName}.`}
        />
      }
      keyExtractor={(item) => item.keyInfo.name}
    />
  )
}
