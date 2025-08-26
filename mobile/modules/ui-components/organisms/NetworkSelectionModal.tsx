import { useCallback, useMemo, useState } from 'react'
import { ModalTemplate } from '../templates'
import { NetworkMetainfo } from '@/types'
import { ModalHeaderSearch } from '../molecules/Modal'
import { Button } from '../src'
import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import { NetworkListItem } from '../molecules/NetworkListItem'

interface Props {
  visible: boolean
  onClose: () => void
  onNetworkSelect: (network?: NetworkMetainfo) => void
  onAddChain: () => void
  networks: NetworkMetainfo[]
  currentNetwork?: NetworkMetainfo | null
}

const noUserRegistrationItem = {
  id: null,
  chainName: 'No User Registration',
  chainId: null,
  rpcUrl: null,
  faucetUrl: null
} as unknown as NetworkMetainfo

export const NetworkSelectionModal = ({ visible, onClose, onNetworkSelect, onAddChain, networks, currentNetwork }: Props) => {
  const [searchQuery, setSearchQuery] = useState<string>('')

  const networksWithNoUser = useMemo(() => {
    return [noUserRegistrationItem, ...networks]
  }, [networks])

  const filteredNetworks = useMemo(() => {
    if (!searchQuery) return networksWithNoUser
    return networksWithNoUser.filter((network) => network.chainName.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [searchQuery, networksWithNoUser])

  const renderItem = useCallback(
    ({ item }: { item: NetworkMetainfo }) => (
      <NetworkListItem
        key={item.id}
        name={item.chainName}
        onPress={() => onNetworkSelect(item.id === noUserRegistrationItem.id ? undefined : item)}
        isSelected={currentNetwork?.id === item.id || (item.id === null && !currentNetwork)}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentNetwork]
  )

  return (
    <ModalTemplate
      visible={visible}
      onClose={onClose}
      footer={<Button onPress={onAddChain}>Add a chain</Button>}
      header={<ModalHeaderSearch searchQuery={searchQuery} onChangeText={setSearchQuery} />}
    >
      <BottomSheetFlatList
        data={filteredNetworks}
        keyExtractor={(i) => i.id?.toString() || 'no-user-registration'}
        renderItem={renderItem}
        style={{
          marginBottom: 80
        }}
      />
    </ModalTemplate>
  )
}
