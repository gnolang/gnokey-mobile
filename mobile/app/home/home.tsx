import { useEffect, useRef, useState } from 'react'
import { FlatList, TouchableOpacity } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { Layout } from '@/components/index'
import {
  checkForKeyOnChains,
  useAppDispatch,
  useAppSelector,
  selectVaults,
  setCurrentChain,
  selectCurrentChain,
  selectChainsAvailable
} from '@/redux'
import VaultListItem from '@/components/list/vault-list/VaultListItem'
import { setVaultToEdit, fetchVaults } from '@/redux'
import { Button, TextField, Text, Container, HomeLayout, Spacer } from '@/modules/ui-components'
import { FontAwesome6, FontAwesome5 } from '@expo/vector-icons'
import { useTheme } from 'styled-components/native'
import { HomeEmptyBox, HomeNotFoundBox } from '@/modules/ui-components/molecules'
import { NetworkSelectionModal } from '@/modules/ui-components/organisms'
import { Vault } from '@/types'
import { HorizontalGroup, ScreenHeader } from '@/modules/ui-components/templates'

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
          route.push('/home/network/new')
        }}
        networks={networks}
        currentNetwork={currentChain}
      />
      <HomeLayout
        footerWithBorder
        contentPadding={32}
        header={
          <ScreenHeader
            title={`${filteredAccounts.length} ${filteredAccounts.length > 1 ? 'accounts' : 'account'}`}
            headerBackVisible={false}
            rightComponent={
              <TouchableOpacity onPress={() => setShowNetworkModal(true)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FontAwesome5 name="network-wired" size={20} color={theme.colors.link} style={{ marginRight: 4 }} />
                <Text.LinkText>{currentChain ? currentChain.chainName : 'No Registration'}</Text.LinkText>
              </TouchableOpacity>
            }
          >
            <Spacer space={16} />
            <TextField
              placeholder="Search"
              value={nameSearch}
              onChangeText={setNameSearch}
              autoCapitalize="none"
              autoCorrect={false}
              hideError
              leftIcon={<FontAwesome6 name="magnifying-glass" size={16} color={theme.text.textMuted} />}
            />
          </ScreenHeader>
        }
        footer={
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
        }
      >
        {filteredAccounts && (
          <FlatList
            data={filteredAccounts}
            ListEmptyComponent={vaults?.length === 0 ? <HomeEmptyBox /> : <HomeNotFoundBox />}
            renderItem={({ item }) => <VaultListItem vault={item} onVaultPress={onChangeAccountHandler} />}
            keyExtractor={(item) => item.keyInfo.name}
            contentContainerStyle={{ paddingBottom: 80, flexGrow: 1 }}
          />
        )}
      </HomeLayout>
    </>
  )
}
