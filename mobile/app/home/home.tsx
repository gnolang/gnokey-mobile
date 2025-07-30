import { useEffect, useRef, useState } from 'react'
import { FlatList, TouchableOpacity } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { BetaVersionMiniBanner, Layout } from '@/components/index'
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
import { AppBar, Button, TextField, Spacer, Text, Container, SafeAreaView, BottonPanel } from '@/modules/ui-components'
import { FontAwesome6 } from '@expo/vector-icons'
import styled from 'styled-components/native'
import { EmptyView } from '@/views'

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
    route.push('home/vault/new-vault')
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
            <Text.H2 style={{ textAlign: 'center' }}>
              {filteredAccounts.length} {filteredAccounts.length > 1 ? 'accounts' : 'account'}
            </Text.H2>
            <TouchableOpacity
              onPress={() => route.navigate('/home/settings')}
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <FontAwesome6 name="gear" size={12} color="#888" style={{ marginRight: 4 }} />
              <Text.Caption>{currentChain?.chainName}</Text.Caption>
            </TouchableOpacity>
          </AppBar>
          <TextField
            placeholder="Search Vault"
            style={{ marginHorizontal: 10 }}
            value={nameSearch}
            onChangeText={setNameSearch}
            autoCapitalize="none"
            autoCorrect={false}
            hideError
          />
          <BetaVersionMiniBanner />
          <Spacer />
          <Content>
            <Body>
              {vaults?.length === 0 && <EmptyView />}
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
            {/* <Botton>
              <Button onPress={navigateToAddKey} color="primary" endIcon={<FontAwesome6 name="add" size={16} color="black" />}>
                New Account Key
              </Button>
            </Botton> */}
          </Content>
        </SafeAreaView>
      </Container>
      <BottonPanel>
        <HorizontalGroup>
          <Button
            onPress={navigateToAddKey}
            color="primary"
            startIcon={<FontAwesome6 name="add" size={16} color="white" />}
            style={{ width: 230 }}
          >
            Add Account
          </Button>
          <Link href="/home/settings" asChild>
            <TouchableOpacity>
              <Text.Link>Settings</Text.Link>
            </TouchableOpacity>
          </Link>
        </HorizontalGroup>
      </BottonPanel>
    </>
  )
}

const Body = styled.View`
  flex: 1;
`
const HorizontalGroup = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`
const Content = styled.View`
  flex: 1;
`
