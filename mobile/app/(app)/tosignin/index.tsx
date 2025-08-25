import { Layout } from '@/components'
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
import { useCallback, useEffect, useState } from 'react'
import { FlatList } from 'react-native'
import * as Linking from 'expo-linking'
import { Button, Container, SafeAreaView, Spacer, Text } from '@/modules/ui-components'
import { Vault } from '@/types'
import { BetaVersionMiniBanner } from '@/modules/ui-components/molecules'

export default function Page() {
  const [loading, setLoading] = useState<string | undefined>(undefined)

  const navigation = useNavigation()
  const dispatch = useAppDispatch()

  const vaults = useAppSelector(selectVaults)
  const callback = useAppSelector(selectCallback)
  const clientName = useAppSelector(selectClientName)

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        setLoading('Loading accounts...')

        if (!vaults || vaults.length === 0) {
          await dispatch(fetchVaults()).unwrap()
          dispatch(checkForKeyOnChains()).unwrap()
        }
      } catch (error: unknown | Error) {
        console.error(error)
      } finally {
        setLoading(undefined)
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
    <>
      <Container>
        <SafeAreaView>
          <BetaVersionMiniBanner />
          <Layout.BodyAlignedBotton>
            <Text.H3>Select a key to sign in into {clientName}</Text.H3>
            <Spacer space={16} />

            {vaults && (
              <FlatList
                data={vaults}
                renderItem={({ item }) => <VaultListItem vault={item} onVaultPress={returnKeyAddressToSoliciting} />}
                keyExtractor={(item) => item.keyInfo.name}
                ListEmptyComponent={<Text.Body>There are no items to list.</Text.Body>}
              />
            )}
            <Button color="primary" onPress={onCancel} loading={loading !== undefined}>
              Cancel
            </Button>
          </Layout.BodyAlignedBotton>
        </SafeAreaView>
      </Container>
    </>
  )
}
