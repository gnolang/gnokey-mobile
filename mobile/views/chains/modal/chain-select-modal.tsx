import { NetworkListItem } from '@/components'
import { Button } from '@/modules/ui-components'
import { NetworkMetainfo } from '@/types'
import { FontAwesome6 } from '@expo/vector-icons'
import { FlatList, Modal, SafeAreaView, View } from 'react-native'
import { useTheme } from 'styled-components/native'
import { selectChainsAvailable, useAppSelector } from '@/redux'

interface Props {
  visible: boolean
  currentChain?: NetworkMetainfo
  onChainSelect: (chain?: NetworkMetainfo) => void
  onCancel: () => void
  onAddChainPress: () => void
}

export const ChainSelectModal = ({ visible, currentChain, onChainSelect, onCancel, onAddChainPress }: Props) => {
  const theme = useTheme()
  const chains = useAppSelector(selectChainsAvailable)

  return (
    <Modal visible={visible} transparent>
      <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <SafeAreaView style={{ width: '94%', alignItems: 'center' }}>
          <View style={{ width: '100%', backgroundColor: theme.colors.white, borderRadius: theme.borderRadius, padding: 20 }}>
            <FlatList
              contentContainerStyle={{ flexGrow: 1, maxHeight: 400 }}
              data={chains}
              renderItem={({ item }) => (
                <NetworkListItem
                  key={item.chainName}
                  title={item.chainName}
                  address={item.gnoAddress}
                  faucet={item.faucetAddress}
                  inUse={currentChain?.gnoAddress === item.gnoAddress}
                  onPress={() => onChainSelect(item)}
                />
              )}
            />

            <NetworkListItem key="not-registered" title="Do Not Register" onPress={() => onChainSelect(undefined)} />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 40 }}>
              <Button color="secondary" onPress={onCancel} endIcon={<FontAwesome6 name="xmark" size={16} color="black" />}>
                Cancel
              </Button>
              <Button color="secondary" onPress={onAddChainPress} endIcon={<FontAwesome6 name="plus" size={16} color="black" />}>
                Add a Chain
              </Button>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  )
}
