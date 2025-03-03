import {  View } from "react-native";
import React from "react";
import { selectChainsAvailable, selectSelectedChain, setSelectedChain, useAppDispatch, useAppSelector } from "@/redux"
import { Select, Spacer, Text } from "@/modules/ui-components";
import { NetworkMetainfo } from "@/types";
import { useTheme } from "styled-components";
import { useRouter } from "expo-router";

const ChainSelectView = () => {
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const router = useRouter()

  const chains = useAppSelector(selectChainsAvailable)
  const currentNetwork = useAppSelector(selectSelectedChain)

  const onNetworkChange = (chain: NetworkMetainfo | undefined) => {
    dispatch(setSelectedChain(chain))
  }


  const onAddChainPress = () => {
    // dispatch()
  }

  return (
    <>
      <Spacer />
      <View style={{ flexDirection: 'row' }}>
        <Text.Body>Select Network to </Text.Body>
        <Text.Body style={{color: theme.colors.white}}>&nbsp;Register Username</Text.Body>
      </View>
      <Spacer />
      <Select items={chains} selectedItem={currentNetwork} onChange={onNetworkChange} onAddChainPress={onAddChainPress} />
    </>
  )
}

export default ChainSelectView;
