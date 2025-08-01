import { useMemo, useState } from 'react'
import { ModalTemplate } from '../templates'
import { NetworkList } from './NetworkList'
import { NetworkMetainfo } from '@/types'
import styled from 'styled-components/native'
import { ModalHeaderSearch } from '../molecules/Modal'
import { Button } from '../src'

interface Props {
  visible: boolean
  onClose: () => void
  onNetworkSelect: (network?: NetworkMetainfo) => void
  onAddChain: () => void
  networks: NetworkMetainfo[]
  currentNetwork?: NetworkMetainfo | null
}

const noUserRegistrationItem = {
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

  return (
    <ModalTemplate
      visible={visible}
      onClose={onClose}
      header={<ModalHeaderSearch searchQuery={searchQuery} onChangeText={setSearchQuery} />}
      footer={<Button onPress={onAddChain}>Add a chain</Button>}
    >
      <>
        <Container>
          <NetworkList
            networks={filteredNetworks}
            onNetworkSelect={(n) => (n?.id ? onNetworkSelect(n) : onNetworkSelect(undefined))}
            currentNetwork={currentNetwork}
          />
        </Container>
      </>
    </ModalTemplate>
  )
}

const Container = styled.View`
  height: 250px;
`
