import { ScreenHeader, TextInputLabel, VaultItem, TextFieldForm } from '@/components'
import { Button, Spacer, HomeLayout } from '@berty/gnonative-ui'
import { Text } from '@berty/gnonative-ui'
import {
  txFeeEstimation,
  selectVaultToEditWithBalance,
  useAppSelector,
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
      dispatch(txFeeEstimation())
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
        <Spacer space={24} />
        <TextInputLabel>From</TextInputLabel>
        <VaultItem vault={vault} onVaultPress={() => null} />

        <Spacer space={24} />
        <TextFieldForm
          label="To Address"
          numberOfLines={2}
          multiline
          style={{ minHeight: 55 }}
          value={toAddress}
          onChangeText={(value) => dispatch(setTxFormField({ field: 'toAddress', value }))}
          placeholder="Enter recipient address"
        />

        <Spacer space={24} />
        <TextFieldForm
          label="Amount"
          keyboardType="decimal-pad"
          value={amount}
          leftIcon={<Text.BodyCenterGray>GNOT</Text.BodyCenterGray>}
          onChangeText={(value) => dispatch(setTxFormField({ field: 'amount', value }))}
          placeholder="0.00"
        />

        <Spacer space={24} />
        <TextFieldForm
          label="Memo (Optional)"
          value={memo}
          onChangeText={(value) => dispatch(setTxFormField({ field: 'memo', value }))}
          placeholder="Add a note for this transfer"
        />

        <Spacer space={24} />
        <TextInputLabel>Network</TextInputLabel>
        <TextFieldForm value={vault.chain?.chainName || 'Unknown'} editable={false} style={{ backgroundColor: 'transparent' }} />
      </ScrollView>
    </HomeLayout>
  )
}

export default Page
