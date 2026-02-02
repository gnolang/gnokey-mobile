import { Alert, ScrollView, View } from 'react-native'
import { useState } from 'react'
import {
  deleteVault,
  estimateTxCommand,
  fetchBalances,
  fetchVaults,
  selectCurrentChain,
  selectDevMode,
  selectVaultToEditWithBalance,
  setParsedCommand,
  updateVault,
  useAppDispatch,
  useAppSelector
} from '@/redux'
import { useRouter } from 'expo-router'
import { ScreenHeader, ModalConfirm, openFaucet, formatter } from '@/components'
import { Button, Spacer, Text, HomeLayout } from '@berty/gnonative-ui'
import { VaultOptionsButton } from '@/components'
import { AccountDetailsSection, ActionsRow, ActivityCard, AssetsCard, BalanceCard, walletPalette } from '@/components'
import * as Clipboard from 'expo-clipboard'
import { parseCommand } from '@/modules/utils/commandParser'

const Page = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const vault = useAppSelector(selectVaultToEditWithBalance)
  const network = useAppSelector(selectCurrentChain)
  const isDevMode = useAppSelector(selectDevMode)
  const hasFaucetPortal = !!(network?.faucetPortalUrl && network.faucetPortalUrl.length > 0)

  const [description, setDescription] = useState(vault?.description || '')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const chainLabel = vault?.chain ? String(vault.chain.chainName) : 'No User Registration'
  const balanceValue = vault?.balance
  const formattedBalance = refreshing ? 'Refreshing...' : String(formatter.balance(balanceValue) ?? '0')
  const address = String(vault?.address ?? '')
  const shortAddress = address.length > 28 ? `${address.slice(0, 16)}...${address.slice(-10)}` : address
  const createdAtLabel = vault?.createdAt ? formatter.date(vault.createdAt) : ''

  const onConfirmDelete = async () => {
    if (!vault) return
    await dispatch(deleteVault({ vault })).unwrap()
    await dispatch(fetchVaults()).unwrap()
    setShowDeleteModal(false)
    router.replace({ pathname: '/home/vault/edit/remove-success', params: { keyName: vault?.keyInfo.name } })
  }

  const onUpdateAccount = async () => {
    if (!vault) {
      Alert.alert('Error', 'No vault selected for update.')
      return
    }
    const params = { vault, keyName: vault?.keyInfo.name, description }
    try {
      await dispatch(updateVault(params)).unwrap()
      await dispatch(fetchVaults()).unwrap()
      router.replace({
        pathname: '/home/vault/edit/edit-success',
        params: { keyName: vault?.keyInfo.name }
      })
    } catch (error: any) {
      Alert.alert('Error', `Failed to update vault: ${error.message}`)
      console.error('Update vault error:', error)
    }
  }

  const refreshBalance = async () => {
    if (!vault) return
    try {
      setRefreshing(true)
      await dispatch(fetchBalances([vault]))
    } catch (error: unknown | Error) {
      console.error(error)
    } finally {
      setRefreshing(false)
    }
  }

  const onPasteGnokeyCommand = async () => {
    const text = await Clipboard.getStringAsync()
    if (text) {
      const parsed = parseCommand(text)
      if (parsed) {
        dispatch(setParsedCommand(parsed))
        dispatch(estimateTxCommand())
        router.navigate({ pathname: '/home/vault/command' })
      } else {
        Alert.alert("Please copy a valid Gnokey command and try again. \nEg: 'gnokey maketx call ...'")
      }
    }
  }

  const onCopyAddress = async () => {
    if (!vault?.address) return
    await Clipboard.setStringAsync(address)
    Alert.alert('Copied', 'Address copied to clipboard.')
  }

  const onReceive = async () => {
    await onCopyAddress()
  }

  if (!vault) {
    return (
      <View style={{ flex: 1, padding: 20 }}>
        <Text.Body>No vault selected.</Text.Body>
        <Spacer />
        <Button onPress={() => router.back()} color="primary">
          Go Back
        </Button>
      </View>
    )
  }

  return (
    <>
      <HomeLayout
        contentPadding={20}
        header={
          <ScreenHeader
            title={vault.keyName}
            rightComponent={
              <VaultOptionsButton
                isDevMode={isDevMode}
                onTransfer={() => router.navigate({ pathname: '/home/vault/transfer-funds' })}
                onDelete={() => setShowDeleteModal(true)}
                onRefreshBalance={refreshBalance}
                onPasteGnokeyCommand={onPasteGnokeyCommand}
              />
            }
          >
            <Text.Body style={{ color: walletPalette.inkMuted }}>{chainLabel}</Text.Body>
          </ScreenHeader>
        }
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          <BalanceCard
            formattedBalance={formattedBalance}
            shortAddress={shortAddress}
            hasFaucetPortal={hasFaucetPortal}
            refreshing={refreshing}
            onCopyAddress={onCopyAddress}
            onOpenFaucet={openFaucet}
            onRefreshBalance={refreshBalance}
          />
          <ActionsRow
            onSend={() => router.navigate({ pathname: '/home/vault/transfer-funds' })}
            onReceive={onReceive}
            onCommand={onPasteGnokeyCommand}
          />
          <AssetsCard formattedBalance={formattedBalance} />
          <AccountDetailsSection
            name={String(vault.keyInfo.name)}
            description={description}
            onDescriptionChange={setDescription}
            address={address}
            createdAtLabel={createdAtLabel}
            onSave={onUpdateAccount}
          />
          <ActivityCard />
        </ScrollView>

        <ModalConfirm
          visible={showDeleteModal}
          title="Delete Account"
          confirmText="Delete"
          message="Are you sure you want to delete this account?"
          onConfirm={onConfirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      </HomeLayout>
    </>
  )
}

export default Page
