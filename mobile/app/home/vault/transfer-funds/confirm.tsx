import { Button, FormItem, HomeLayout, Ruller, ScreenHeader, Spacer, formatter } from '@/modules/ui-components'
import {
  selectTxGasWanted,
  selectVaultToEditWithBalance,
  useAppDispatch,
  useAppSelector,
  txBroadcast,
  selectTxForm
} from '@/redux'
import { useRouter } from 'expo-router'
import { ScrollView } from 'react-native'

const Page = () => {
  const txGasWanted = useAppSelector(selectTxGasWanted)
  const dispatch = useAppDispatch()
  const vault = useAppSelector(selectVaultToEditWithBalance)
  const form = useAppSelector(selectTxForm)
  const router = useRouter()

  const broadcastTransfer = async () => {
    console.log('Broadcasting transactionx...')
    if (!txGasWanted || !vault) return
    try {
      console.log('Broadcasting transaction...')
      await dispatch(txBroadcast({ fromAddress: vault.keyInfo.address })).unwrap()
      router.replace('/home/vault/transfer-funds/transfer-success')
    } catch (error) {
      console.error('Broadcast failed:', error)
    }
  }

  return (
    <HomeLayout
      header={<ScreenHeader title="Summary" />}
      footer={
        <Button onPress={broadcastTransfer} color="primary" disabled={!txGasWanted}>
          {txGasWanted ? 'Confirm' : 'Loading...'}
        </Button>
      }
    >
      <ScrollView>
        <Spacer space={32} />
        <Ruller />
        <FormItem label="From" value={form.fromAddress} />
        <Ruller />
        <FormItem label="To" value={form.toAddress} />
        <Ruller />
        <FormItem label="Amount" value={`${form.amount} GNOT`} />
        <Ruller />
        <FormItem label="Gas Fee" value={`${formatter.balance(txGasWanted)} GNOT (estimated)`} />
        <Ruller />
        <FormItem label="Memo" value={form.memo} />
        <Ruller />
      </ScrollView>
    </HomeLayout>
  )
}
export default Page
