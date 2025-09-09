import { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { useTheme } from 'styled-components/native'
import { FontAwesome5 } from '@expo/vector-icons'
import { Text } from '../src'
import { NetworkSelectionModal } from '.'
import { useAppDispatch, useAppSelector, setCurrentChain, selectCurrentChain, selectChainsAvailable, fetchVaults } from '@/redux'

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
      </TouchableOpacity>

      <NetworkSelectionModal
        visible={showNetworkModal}
        onClose={() => setShowNetworkModal(false)}
        onNetworkSelect={async (v) => {
          setShowNetworkModal(false)
          await dispatch(setCurrentChain(v)).unwrap()
          dispatch(fetchVaults())
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
