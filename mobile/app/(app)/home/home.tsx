import { useEffect, useRef, useState } from 'react'
import { FlatList, TextInput, View } from 'react-native'
import { useRouter } from 'expo-router'
import { Layout } from '@/components/index'
import { checkForKeyOnChains, useAppDispatch, useAppSelector, selectVaults, setBookmark, Vault } from '@/redux'
import VaultListItem from '@/components/list/vault-list/VaultListItem'
import { setVaultToEdit, fetchVaults } from '@/redux'
import { AppBar, ButtonIcon, Button, TextField, Spacer, Text } from '@/modules/ui-components'
import { FontAwesome6, FontAwesome } from '@expo/vector-icons'
import styled from 'styled-components/native'
import { ModalConfirm } from '@/components/modal/ModalConfirm'
import { SearchInput } from '@/components/textinput/SearchInput'

export default function Page() {
  const isFirstRender = useRef(true)

  const [nameSearch, setNameSearch] = useState<string>('')
  const [filteredAccounts, setFilteredAccounts] = useState<Vault[]>([])
  const [loading, setLoading] = useState<string | undefined>(undefined)

  const route = useRouter()
  const dispatch = useAppDispatch()
  const vaults = useAppSelector(selectVaults)

  useEffect(() => {
    ;(async () => {
      if (!isFirstRender.current) {
        return
      }

      try {
        setLoading('Loading accounts...')
        await dispatch(fetchVaults()).unwrap()
        dispatch(checkForKeyOnChains()).unwrap()
      } catch (error: unknown | Error) {
        console.error(error)
      } finally {
        isFirstRender.current = false
        setLoading(undefined)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    doSearch()
  }, [nameSearch, vaults])

  const doSearch = () => {
    if (nameSearch) {
      setFilteredAccounts(vaults ? vaults.filter((account) => account.keyInfo.name.includes(nameSearch)) : [])
    } else {
      setFilteredAccounts(vaults || [])
    }
  }

  const onChangeAccountHandler = async (vault: Vault) => {
    await dispatch(setVaultToEdit({ vault }))
    route.push('/home/vault-detail-modal')
  }

  const navigateToAddKey = () => {
    route.push('/home/vault-add-modal')
  }

  const onBookmarkPress = (keyInfo: Vault) => async () => {
    console.log('Bookmark pressed', keyInfo.keyInfo.address)
    dispatch(setBookmark({ keyAddress: keyInfo.keyInfo.address, value: !keyInfo.bookmarked }))
  }

  if (loading) {
    return (
      <Layout.Container>
        <Layout.Body>
          <Text.Body>{loading}</Text.Body>
        </Layout.Body>
      </Layout.Container>
    )
  }

  return (
    <>
      <Layout.Container>
        <AppBar>
          <ButtonIcon onPress={() => route.push('/home/profile')} size={40} color="tertiary">
            <FontAwesome6 name="network-wired" size={20} color="black" />
          </ButtonIcon>
          <ButtonIcon onPress={() => route.push('/home/profile')} size={40} color="tertiary">
            <FontAwesome6 name="user" size={20} color="black" />
          </ButtonIcon>
        </AppBar>

        <BodyAlignedBotton>
          <Text.H1>Your Safe</Text.H1>
          <View style={{ flexDirection: 'row' }}>
            <Text.H1 style={{ color: 'white' }}>Vault List</Text.H1>
          </View>

          <Spacer />

          <View style={{ padding: 4 }}>
            <View style={{ flexDirection: 'row' }}>
              <SearchInput placeholder="Search Vault" onChangeText={setNameSearch} autoCapitalize="none" autoCorrect={false} />
              <ButtonIcon onPress={doSearch} color="tertiary">
                <FontAwesome name="search" size={16} color="black" />
              </ButtonIcon>
              <Spacer spaceH={16} />
              <ButtonIcon onPress={navigateToAddKey} color="tertiary">
                <FontAwesome6 name="add" size={16} color="black" />
              </ButtonIcon>
            </View>
          </View>
          <Text.Body style={{ textAlign: 'center', paddingTop: 8 }}>
            {filteredAccounts.length} {filteredAccounts.length > 1 ? 'results' : 'result'}
          </Text.Body>
          <Spacer />

          {filteredAccounts && (
            <FlatList
              data={filteredAccounts}
              contentContainerStyle={{ paddingBottom: 120 }}
              renderItem={({ item }) => (
                <VaultListItem
                  vault={item}
                  onVaultPress={onChangeAccountHandler}
                  chains={item.chains}
                  onBookmarkPress={onBookmarkPress(item)}
                />
              )}
              keyExtractor={(item) => item.keyInfo.name}
              ListEmptyComponent={vaults?.length === 0 ? <ShowModal onConfirm={navigateToAddKey} /> : null}
            />
          )}
        </BodyAlignedBotton>
      </Layout.Container>
    </>
  )
}

const ShowModal = ({ onConfirm }: { onConfirm: () => void }) => {
  const [visible, setVisible] = useState<boolean>(true)
  return (
    <ModalConfirm
      visible={visible}
      onCancel={() => setVisible(false)}
      onConfirm={() => {
        onConfirm()
      }}
      title="Not Found"
      confirmText="Add Vault"
      message="Your Vault doesn't exist. Do you want to create a new one?"
    />
  )
}

export const BodyAlignedBotton = styled.View`
  width: 100%;
  height: 100%;
  padding-top: 4px;
  padding-horizontal: 8px;
  justify-content: flex-end;
  padding-bottom: 12px;
`
