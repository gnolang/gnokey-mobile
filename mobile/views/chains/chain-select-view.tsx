import { View } from 'react-native'
import React from 'react'
import { addCustomChain, selectSelectedChain, setSelectedChain, useAppDispatch, useAppSelector } from '@/redux'
import { Spacer, Text } from '@/modules/ui-components'
import { NetworkMetainfo } from '@/types'
import { useTheme } from 'styled-components'
import styled, { DefaultTheme } from 'styled-components/native'
import { FontAwesome6 } from '@expo/vector-icons'
import { ChainSelectModal } from './modal/chain-select-modal'
import { ChainAddModal, Form } from './modal/chain-add-modal'

export const ChainSelectView = () => {
  const [showModalChain, setShowModalChain] = React.useState(false)
  const [showChainAdd, setShowChainAdd] = React.useState(false)

  const dispatch = useAppDispatch()
  const theme = useTheme()

  const currentChain = useAppSelector(selectSelectedChain)

  const onChainSelect = (chain: NetworkMetainfo | undefined) => {
    setShowModalChain(false)
    dispatch(setSelectedChain(chain))
  }

  const onAddChainPress = () => {
    setShowChainAdd(true)
    setShowModalChain(false)
  }

  const onCancel = () => {
    setShowModalChain(false)
    setShowChainAdd(false)
  }

  const onSaveChain = async (form: Form) => {
    console.log('Saving Chain', form)
    dispatch(addCustomChain(form))
    setShowChainAdd(false)
    setShowModalChain(true)
  }

  return (
    <>
      <View style={{ flexDirection: 'row' }}>
        <Text.Body>Select Network to </Text.Body>
        <Text.Body style={{ color: theme.colors.white }}>&nbsp;Register Username</Text.Body>
      </View>
      <Spacer />

      <SelectWrapper onPress={() => setShowModalChain(!showModalChain)} hasItem={Boolean(currentChain)}>
        {currentChain ? (
          <Text.H3 style={{ color: theme.colors.black }}>{currentChain.chainName}</Text.H3>
        ) : (
          <Text.H3 style={{ color: theme.colors.black }}>Do not register</Text.H3>
        )}
        <FontAwesome6 name="chevron-down" size={24} color={theme.colors.black} />
      </SelectWrapper>

      <ChainSelectModal
        visible={showModalChain}
        currentChain={currentChain}
        onChainSelect={onChainSelect}
        onCancel={onCancel}
        onAddChainPress={onAddChainPress}
      />
      <ChainAddModal visible={showChainAdd} onCancel={onCancel} onSaveChain={onSaveChain} />
    </>
  )
}

const SelectWrapper = styled.TouchableOpacity<{ hasItem?: boolean }>`
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 50px;
  border-radius: ${(props) => props.theme.borderRadius}px;
  border-width: 1px;
  background-color: ${({ theme, hasItem }: { theme: DefaultTheme; hasItem?: boolean }) =>
    hasItem ? theme.colors.white : 'undefined'};
  border-color: ${({ theme, hasItem }: { theme: DefaultTheme; hasItem?: boolean }) =>
    hasItem ? theme.colors.white : theme.colors.black};
  padding-horizontal: 20px;
`
