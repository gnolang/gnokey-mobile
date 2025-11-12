import { useCallback, useEffect, useState } from 'react'
import { Layout } from '@/components'
import { fetchBalances, fetchVaults, selectCallback, selectVaults, useAppDispatch, useAppSelector } from '@/redux'
import { useGnoNativeContext } from '@gnolang/gnonative'
import { router, useNavigation } from 'expo-router'
import { FlatList } from 'react-native'
import * as Linking from 'expo-linking'
import { VaultListItem } from '@/modules/ui-components'
import { Text, Spacer, Button, HomeLayout } from '@berty/gnonative-ui'
import { Vault } from '@/types'

export default function Page() {
  const [loading, setLoading] = useState<string | undefined>(undefined)

  const { gnonative } = useGnoNativeContext()
  const navigation = useNavigation()

  const dispatch = useAppDispatch()

  const vaults = useAppSelector(selectVaults)
  const callback = useAppSelector(selectCallback)

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        setLoading('Loading accounts...')

        const v = await dispatch(fetchVaults()).unwrap()
        dispatch(fetchBalances(v))
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
      console.log('returnKeyAddressToSoliciting', keyInfo, callback)

      const bech32 = await gnonative.addressToBech32(keyInfo?.keyInfo?.address)

      Linking.openURL(`${callback}?address=${bech32}`)

      router.push('/home')
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [callback]
  )

  return (
    <>
      <HomeLayout header={null} footer={null}>
        <Layout.BodyAlignedBotton>
          <Text.H3>Select a key to create the transaction</Text.H3>
          <Spacer space={16} />

          {vaults && (
            <FlatList
              data={vaults}
              renderItem={({ item }) => <VaultListItem vault={item} onVaultPress={returnKeyAddressToSoliciting} />}
              keyExtractor={(item) => item.keyInfo.name}
              ListEmptyComponent={<Text.Body>There are no items to list.</Text.Body>}
            />
          )}
          <Button color="primary" loading={loading !== undefined} onPress={() => router.push('/home')}>
            Cancel
          </Button>
        </Layout.BodyAlignedBotton>
      </HomeLayout>
    </>
  )
}
