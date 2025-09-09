import { useEffect, useRef, useState } from 'react'
import { FlatList, TouchableOpacity } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { Layout } from '@/components/index'
import { checkForKeyOnChains, useAppDispatch, useAppSelector, selectVaults } from '@/redux'
import { setVaultToEdit, fetchVaults } from '@/redux'
import {
  Button,
  TextField,
  Text,
  Container,
  HomeLayout,
  Spacer,
  HomeEmptyBox,
  HomeNotFoundBox,
  HorizontalGroup,
  ScreenHeader,
  NetworkButtonModal
} from '@/modules/ui-components'
import VaultListItem from '@/components/list/vault-list/VaultListItem'
import { FontAwesome6 } from '@expo/vector-icons'
import { useTheme } from 'styled-components/native'
import { Vault } from '@/types'

export default function Page() {
  const isFirstRender = useRef(true)

  const [nameSearch, setNameSearch] = useState<string>('')
  const [filteredAccounts, setFilteredAccounts] = useState<Vault[]>([])
  const [loading, setLoading] = useState<string | undefined>(undefined)
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
      <HomeLayout
        footerWithBorder
        contentPadding={32}
        header={
          <ScreenHeader
            title={`${filteredAccounts.length} ${filteredAccounts.length > 1 ? 'accounts' : 'account'}`}
            headerBackVisible={false}
            rightComponent={<NetworkButtonModal />}
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
