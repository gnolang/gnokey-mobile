import { useEffect, useMemo, useRef, useState } from 'react'
import { FlatList, TouchableOpacity } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { Layout } from '@/components/index'
import { fetchBalances, useAppDispatch, useAppSelector, selectVaultsWithBalances, generateNewPhrase } from '@/redux'
import { setVaultToEdit, fetchVaults } from '@/redux'
import {
  Container,
  HomeEmptyBox,
  HomeNotFoundBox,
  HorizontalGroup,
  ScreenHeader,
  NetworkButtonModal,
  VaultListItem
} from '@/modules/ui-components'
import { Text, Spacer, HomeLayout, Button } from '@/modules/gnonative-ui/dist'
import { FontAwesome6 } from '@expo/vector-icons'
import { useTheme } from 'styled-components/native'
import { Vault } from '@/types'
import TextInputStyled from '@/modules/ui-components/organisms/input/TextInputStyled'

export default function Page() {
  const isFirstRender = useRef(true)

  const [nameSearch, setNameSearch] = useState<string>('')
  const [loading, setLoading] = useState<string | undefined>(undefined)
  const [refreshing, setRefreshing] = useState(false)
  const theme = useTheme()

  const route = useRouter()
  const dispatch = useAppDispatch()
  const vaults = useAppSelector(selectVaultsWithBalances)

  const filteredAccounts = useMemo(() => {
    if (nameSearch) {
      return vaults ? vaults.filter((account) => account.keyInfo.name.includes(nameSearch)) : []
    }
    return vaults || []
  }, [nameSearch, vaults])

  useEffect(() => {
    ;(async () => {
      if (!isFirstRender.current) {
        return
      }

      try {
        setLoading('Loading accounts...')
        const v = await dispatch(fetchVaults()).unwrap()
        dispatch(fetchBalances(v))
      } catch (error: unknown | Error) {
        console.error(error)
      } finally {
        isFirstRender.current = false
        setLoading(undefined)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const refreshBalances = async () => {
    if (vaults) {
      try {
        setRefreshing(true)
        await dispatch(fetchBalances(vaults))
      } catch (error: unknown | Error) {
        console.error(error)
      } finally {
        setRefreshing(false)
      }
    }
  }

  const onChangeAccountHandler = async (vault: Vault) => {
    await dispatch(setVaultToEdit({ vault }))
    route.push('/home/vault/edit')
  }

  const navigateToAddKey = () => {
    dispatch(generateNewPhrase())
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
        contentPadding={20}
        header={
          <ScreenHeader
            title={`${filteredAccounts.length} ${filteredAccounts.length > 1 ? 'accounts' : 'account'}`}
            headerBackVisible={false}
            rightComponent={<NetworkButtonModal />}
          >
            <Spacer space={16} />
            <TextInputStyled
              placeholder="Search"
              value={nameSearch}
              onChangeText={setNameSearch}
              autoCapitalize="none"
              autoCorrect={false}
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
            refreshing={refreshing}
            onRefresh={refreshBalances}
          />
        )}
      </HomeLayout>
    </>
  )
}
