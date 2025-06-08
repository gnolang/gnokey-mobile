import { Form } from '@/modules/ui-components'
import { selectChainsAvailable, useAppSelector, selectSelectedChain, useAppDispatch, setSelectedChain } from '@/redux'
import { NetworkMetainfo } from '@/types'

export const NetworkSelectView = () => {
  const dispatch = useAppDispatch()
  const chains = useAppSelector(selectChainsAvailable)
  const currentChain = useAppSelector(selectSelectedChain)

  const onChainSelect = (chain: NetworkMetainfo | undefined) => {
    dispatch(setSelectedChain(chain))
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
