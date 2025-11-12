import { ScreenHeader, formatter, FormItem } from '@/modules/ui-components'
import { Ruller, Button, Spacer, HomeLayout } from '@/modules/gnonative-ui/dist'
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
        <Spacer space={8} />
        <FormItem label="From" value={form.fromAddress} />
        <Spacer space={8} />
        <Ruller spacer={4} />
        <FormItem label="To" value={form.toAddress} />
        <Ruller spacer={4} />
        <FormItem label="Amount" value={`${form.amount} GNOT`} />
        <Ruller spacer={4} />
        <FormItem label="Gas Fee" value={`${formatter.balance(txGasWanted)} GNOT (estimated)`} />
        <Ruller spacer={4} />
        <FormItem label="Memo" value={form.memo} />
        <Ruller spacer={4} />
        <FormItem label="Network" value={vault?.chain?.chainName || 'Unknown'} />
        <Ruller spacer={4} />
      </ScrollView>
    </HomeLayout>
  )
}
export default Page
