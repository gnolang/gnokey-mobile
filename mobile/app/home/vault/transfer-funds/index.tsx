import { Button, HomeLayout, ScreenHeader, Spacer, Text, TextField, VaultItem } from '@/modules/ui-components'
import {
  txGasFeeEstimation,
  selectTxGasWanted,
  selectVaultToEditWithBalance,
  useAppDispatch,
  useAppSelector,
  txBroadcast,
  selectTxFormMemo,
  setTxFormField,
  selectTxFormAmount,
  selectTxFormToAddress
} from '@/redux'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { ScrollView } from 'react-native'
import { useDispatch } from 'react-redux'

const Page = () => {
  const vault = useAppSelector(selectVaultToEditWithBalance)
  const dispatch = useDispatch()
  const router = useRouter()

  const memo = useAppSelector(selectTxFormMemo)
  const amount = useAppSelector(selectTxFormAmount)
  const toAddress = useAppSelector(selectTxFormToAddress)

  useEffect(() => {
    dispatch(setTxFormField({ field: 'fromAddress', value: vault?.address || '' }))
  }, [dispatch, vault])

  const prepareTransfer = () => {
    if (!vault) return
    try {
      dispatch(txGasFeeEstimation())
      router.push('/home/vault/transfer-funds/confirm')
    } catch (error) {
      console.error('Transfer failed:', error)
    }
  }

  if (!vault) {
    return (
      <HomeLayout header={<ScreenHeader title="Transfer Funds" />}>
        <Text.Body>No vault selected.</Text.Body>
      </HomeLayout>
    )
  }

  return (
    <HomeLayout
      footer={
        <Button onPress={prepareTransfer} color="primary" style={{ width: '100%' }}>
          Next
        </Button>
      }
      header={<ScreenHeader title="Transfer Funds" />}
    >
      <ScrollView>
        <Spacer space={32} />
        <Text.Body_Bold>From</Text.Body_Bold>
        <VaultItem vault={vault} onVaultPress={() => null} />
        <Spacer space={32} />
        <Text.Body_Bold>To</Text.Body_Bold>
        <Spacer space={8} />
        <TextField
          numberOfLines={2}
          multiline
          style={{ minHeight: 55 }}
          value={toAddress}
          onChangeText={(value) => dispatch(setTxFormField({ field: 'toAddress', value }))}
          placeholder="Enter recipient address"
        />
        <Spacer space={32} />
        <Text.Body_Bold>Amount</Text.Body_Bold>
        <Spacer space={8} />
        <TextField
          value={amount}
          leftIcon={<Text.BodyCenterGray>GNOT</Text.BodyCenterGray>}
          onChangeText={(value) => dispatch(setTxFormField({ field: 'amount', value }))}
          placeholder="0.00"
        />
        <Spacer space={32} />
        <Text.Body_Bold>Memo (Optional)</Text.Body_Bold>
        <Spacer space={8} />
        <TextField
          value={memo}
          onChangeText={(value) => dispatch(setTxFormField({ field: 'memo', value }))}
          placeholder="Add a note for this transfer"
        />
      </ScrollView>
    </HomeLayout>
  )
}

export default Page
