import { useEffect, useRef, useState } from 'react'
import { FlatList, TouchableOpacity, View } from 'react-native'
import { useRouter } from 'expo-router'
import { Layout } from '@/components/index'
import {
  checkForKeyOnChains,
  useAppDispatch,
  useAppSelector,
  selectVaults,
  setBookmark,
  Vault,
  selectCurrentChain
} from '@/redux'
import VaultListItem from '@/components/list/vault-list/VaultListItem'
import { setVaultToEdit, fetchVaults } from '@/redux'
import { AppBar, Button, TextField, Spacer, Text, Container, SafeAreaView } from '@/modules/ui-components'
import { FontAwesome6 } from '@expo/vector-icons'
import styled from 'styled-components/native'

export default function Page() {
  const isFirstRender = useRef(true)

  const [nameSearch, setNameSearch] = useState<string>('')
  const [filteredAccounts, setFilteredAccounts] = useState<Vault[]>([])
  const [loading, setLoading] = useState<string | undefined>(undefined)
  const currentChain = useAppSelector(selectCurrentChain)

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
    if (nameSearch) {
      setFilteredAccounts(vaults ? vaults.filter((account) => account.keyInfo.name.includes(nameSearch)) : [])
    } else {
      setFilteredAccounts(vaults || [])
    }
  }, [nameSearch, vaults])

  const onChangeAccountHandler = async (vault: Vault) => {
    await dispatch(setVaultToEdit({ vault }))
    route.push('/home/vault-detail-modal')
  }

  const navigateToAddKey = () => {
    route.push('home/vault')
  }

  const onBookmarkPress = (keyInfo: Vault) => async () => {
    console.log('Bookmark pressed', keyInfo.keyInfo.address)
    dispatch(setBookmark({ keyAddress: keyInfo.keyInfo.address, value: !keyInfo.bookmarked }))
  }

  if (loading) {
    return (
      <Container>
        <Layout.Body>
          <Text.Body>{loading}</Text.Body>
        </Layout.Body>
      </Container>
    )
  }

  return (
    <>
      <Container>
        <SafeAreaView style={{ marginBottom: 40 }}>
          <AppBar>
            <View>
              <Text.H3>GnoKey Mobile</Text.H3>
              <Text.Caption>{currentChain?.chainName}</Text.Caption>
            </View>
            <TouchableOpacity onPress={() => route.navigate('/home/settings')}>
              <Text.Caption>Settings</Text.Caption>
            </TouchableOpacity>
          </AppBar>
          <TextField
            placeholder="Search Vault"
            value={nameSearch}
            onChangeText={setNameSearch}
            autoCapitalize="none"
            autoCorrect={false}
            hideError
          />
          <Text.Body style={{ textAlign: 'center' }}>
            {filteredAccounts.length} {filteredAccounts.length > 1 ? 'results' : 'result'}
          </Text.Body>
          <Spacer space={8} />
          <Content>
            <Body>
              {filteredAccounts && (
                <FlatList
                  data={filteredAccounts}
                  renderItem={({ item }) => (
                    <VaultListItem
                      vault={item}
                      onVaultPress={onChangeAccountHandler}
                      chains={item.chains}
                      onBookmarkPress={onBookmarkPress(item)}
                    />
                  )}
                  keyExtractor={(item) => item.keyInfo.name}
                />
              )}
            </Body>
            <Botton>
              <Button onPress={navigateToAddKey} color="primary" endIcon={<FontAwesome6 name="add" size={16} color="black" />}>
                New Account Key
              </Button>
            </Botton>
          </Content>
        </SafeAreaView>
      </Container>
    </>
  )
}

const Body = styled.View`
  flex: 1;
`
const Botton = styled.View`
  margin-top: 6px;
`
const Content = styled.View`
  flex: 1;
`
