import { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { useTheme } from 'styled-components/native'
import { FontAwesome5 } from '@expo/vector-icons'
import { Text } from '../src'
import { NetworkSelectionModal } from '.'
import {
  useAppDispatch,
  useAppSelector,
  setCurrentChain,
  selectCurrentChain,
  selectChainsAvailable,
  fetchVaults,
  fetchBalances
} from '@/redux'

const NetworkButtonModal = () => {
  const theme = useTheme()
  const [showNetworkModal, setShowNetworkModal] = useState(false)
  const route = useRouter()
  const dispatch = useAppDispatch()
  const networks = useAppSelector(selectChainsAvailable)
  const currentChain = useAppSelector(selectCurrentChain)

  return (
    <>
      <TouchableOpacity onPress={() => setShowNetworkModal(true)} style={{ flexDirection: 'row', alignItems: 'center' }}>
        <FontAwesome5 name="network-wired" size={20} color={theme.colors.link} style={{ marginRight: 4 }} />
        <Text.LinkText>{currentChain ? currentChain.chainName : 'No Registration'}</Text.LinkText>
        <FontAwesome5 name="chevron-down" size={12} color={theme.colors.link} style={{ margin: 4 }} />
      </TouchableOpacity>

      <NetworkSelectionModal
        visible={showNetworkModal}
        onClose={() => setShowNetworkModal(false)}
        onNetworkSelect={async (network) => {
          setShowNetworkModal(false)
          await dispatch(setCurrentChain(network)).unwrap()
          const v = await dispatch(fetchVaults()).unwrap()
          dispatch(fetchBalances(v))
        }}
        onAddChain={() => {
          setShowNetworkModal(false)
          route.push('/home/network/new')
        }}
        networks={networks}
        currentNetwork={currentChain}
      />
    </>
  )
}

export { NetworkButtonModal }
