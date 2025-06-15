import { Form } from '@/modules/ui-components'
import { selectChainsAvailable, useAppSelector, selectCurrentChain, useAppDispatch, setCurrentChain, saveChain } from '@/redux'
import { NetworkMetainfo } from '@/types'
import { useState } from 'react'
import { Alert } from 'react-native'
import { ChainAddModal } from './modal/chain-add-modal'

export const NetworkSelectView = () => {
  const dispatch = useAppDispatch()
  const chains = useAppSelector(selectChainsAvailable)
  const currentChain = useAppSelector(selectCurrentChain)
  const [isAddModalVisible, showAddModal] = useState(false)

  const onChainSelect = (chain: NetworkMetainfo | undefined) => {
    if (!chain) {
      Alert.alert('No chain selected')
      return
    }
    dispatch(setCurrentChain(chain))
  }

  const onSaveChain = (chain: NetworkMetainfo) => {
    if (!chain) {
      Alert.alert('No chain provided')
      return
    }
    dispatch(saveChain(chain))
    showAddModal(false)
  }

  return (
    <>
      <Form.Section title="Select Network">
        {chains.map((chain) => (
          <Form.CheckBox
            key={chain.chainId}
            hint={chain.rpcUrl}
            checked={currentChain?.rpcUrl === chain.rpcUrl}
            onPress={() => onChainSelect(chain)}
          >
            {chain.chainName}
          </Form.CheckBox>
        ))}
        <Form.AddButton onPress={() => showAddModal(true)} />
      </Form.Section>
      <ChainAddModal visible={isAddModalVisible} onSaveChain={onSaveChain} onCancel={() => showAddModal(false)} />
    </>
  )
}
