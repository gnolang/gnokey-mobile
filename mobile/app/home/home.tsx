import { useEffect, useRef, useState } from 'react'
import { FlatList, TouchableOpacity } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { Layout } from '@/components/index'
import {
  checkForKeyOnChains,
  useAppDispatch,
  useAppSelector,
  selectVaults,
  setBookmark,
  setCurrentChain,
  selectCurrentChain,
  selectChainsAvailable
} from '@/redux'
import VaultListItem from '@/components/list/vault-list/VaultListItem'
import { setVaultToEdit, fetchVaults } from '@/redux'
import { AppBar, Button, TextField, Text, Container, SafeAreaView, BottonPanel } from '@/modules/ui-components'
import { FontAwesome6 } from '@expo/vector-icons'
import styled, { useTheme } from 'styled-components/native'
import { EmptyView } from '@/views'
import { NetworkSelectionModal } from '@/modules/ui-components/organisms/NetworkSelectionModal'
import { Vault } from '@/types'

export default function Page() {
  const isFirstRender = useRef(true)

  const [showNetworkModal, setShowNetworkModal] = useState(false)
  const [nameSearch, setNameSearch] = useState<string>('')
  const [filteredAccounts, setFilteredAccounts] = useState<Vault[]>([])
  const [loading, setLoading] = useState<string | undefined>(undefined)
  const currentChain = useAppSelector(selectCurrentChain)
  const networks = useAppSelector(selectChainsAvailable)
  const theme = useTheme()

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
    route.push('/home/vault/edit')
  }

  const navigateToAddKey = () => {
    route.push('home/vault/add')
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
      <NetworkSelectionModal
        visible={showNetworkModal}
        onClose={() => setShowNetworkModal(false)}
        onNetworkSelect={async (v) => {
          setShowNetworkModal(false)
          await dispatch(setCurrentChain(v)).unwrap()
          dispatch(fetchVaults())
        }}
        onAddChain={() => {
          setShowNetworkModal(false)
          route.push('/home/(modal)/new-network')
        }}
        networks={networks}
        currentNetwork={currentChain}
      />
      <Container>
        <SafeAreaView style={{ marginBottom: 40 }}>
          <AppBar>
            <Text.H2 style={{ textAlign: 'center' }}>
              {filteredAccounts.length} {filteredAccounts.length > 1 ? 'accounts' : 'account'}
            </Text.H2>
            <TouchableOpacity onPress={() => setShowNetworkModal(true)} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <FontAwesome6 name="gear" size={20} color={theme.colors.link} style={{ marginRight: 4 }} />
              <Text.LinkText>{currentChain ? currentChain.chainName : 'No Registration'}</Text.LinkText>
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
                  contentContainerStyle={{ paddingBottom: 80 }}
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
              <Text.LinkText>Settings</Text.LinkText>
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
