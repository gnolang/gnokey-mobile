import { Form } from '@/modules/ui-components'
import { selectChainsAvailable, useAppSelector, selectCurrentChain, useAppDispatch, setCurrentChain } from '@/redux'
import { NetworkMetainfo } from '@/types'
import { Alert } from 'react-native'

export const NetworkSelectView = () => {
  const dispatch = useAppDispatch()
  const chains = useAppSelector(selectChainsAvailable)
  const currentChain = useAppSelector(selectCurrentChain)

  const onChainSelect = (chain: NetworkMetainfo | undefined) => {
    if (!chain) {
      Alert.alert('No chain selected')
      return
    }
    dispatch(setCurrentChain(chain))
  }

  return (
    <Form.Section title="Select Network">
      {chains.map((chain) => (
        <Form.CheckBox
          key={chain.chainId}
          hint={chain.gnoAddress}
          checked={currentChain?.gnoAddress === chain.gnoAddress}
          onPress={() => onChainSelect(chain)}
        >
          {chain.chainName}
        </Form.CheckBox>
      ))}
      <Form.AddButton onPress={() => console.log('pressed')} />
    </Form.Section>
  )
}
