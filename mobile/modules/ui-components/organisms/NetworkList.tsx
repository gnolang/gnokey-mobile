import { FlatList } from 'react-native'
import { NetworkListItem } from '../molecules/NetworkListItem'
import { NetworkMetainfo } from '@/types'

interface Props {
  networks: NetworkMetainfo[]
  onNetworkSelect: (network?: NetworkMetainfo) => void
  currentNetwork?: NetworkMetainfo | null
}

export const NetworkList = ({ networks, onNetworkSelect, currentNetwork }: Props) => (
  <FlatList
    data={networks}
    renderItem={({ item }) => (
      <NetworkListItem
        key={item.chainName}
        name={item.chainName}
        onPress={() => onNetworkSelect(item)}
        isSelected={currentNetwork?.id === item.id}
      />
    )}
    keyExtractor={(item) => item.chainName}
  />
)
