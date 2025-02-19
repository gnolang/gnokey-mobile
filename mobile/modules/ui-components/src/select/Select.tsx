import React from "react";
import styled, { DefaultTheme, useTheme } from "styled-components/native"
import { FontAwesome6 } from "@expo/vector-icons";
import { Button } from "../buttons";
import * as Text from "../text";
import { FlatList, Modal, SafeAreaView, TouchableOpacityProps, View } from "react-native";
import { NetworkListItem } from "../../../../components";
import { NetworkMetainfo } from "@/types";

export type SelectProps = {
  items: NetworkMetainfo[],
  selectedItem?: NetworkMetainfo,
  onChange: (item: NetworkMetainfo | undefined) => void
} & TouchableOpacityProps & React.PropsWithChildren

export const Select: React.FC<SelectProps> = (props) => {
  const { selectedItem, items, onChange } = props

  const theme = useTheme()
  const [open, setOpen] = React.useState(false)

  return <SelectWrapper {...props} onPress={() => setOpen(!open)} hasItem={Boolean(selectedItem)}>
    <>
      {selectedItem ? <Text.H3 style={{ color: theme.colors.black }}>{selectedItem.chainName}</Text.H3> : <Text.H3 style={{ color: theme.colors.black }}>Do not register</Text.H3>}
      <FontAwesome6 name="chevron-down" size={24} color={theme.colors.black} />
    </>


    <Modal visible={open} transparent animationType="slide">
      <View style={{ flex: 1, justifyContent: "flex-end", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
        <SafeAreaView style={{ width: '94%', alignItems: "center" }}>
          <View style={{ width: '100%', backgroundColor: theme.colors.white, borderRadius: theme.borderRadius, padding: 20 }}>

            <FlatList
              contentContainerStyle={{ flexGrow: 1, maxHeight: 400 }}
              data={items}
              renderItem={({ item }) => <NetworkListItem
                key={item.chainName}
                networkMetainfo={item}
                currentRemote={selectedItem?.gnoAddress}
                onPress={x => {
                  onChange(x)
                  setOpen(false)
                }}
              />}
            />


            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 40 }} >
              <Button color="secondary"
                onPress={() => {
                  onChange(undefined)
                  setOpen(false)
                }}
                endIcon={<FontAwesome6 name='xmark' size={16} color='black' />}>Not Register</Button>
              <Button color="secondary"
                endIcon={<FontAwesome6 name='plus' size={16} color='black' />}>Add a Chain</Button>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>


  </SelectWrapper>
}

const SelectWrapper = styled.TouchableOpacity<{ hasItem?: boolean }>`
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 50px;
  border-radius: ${(props) => props.theme.borderRadius}px;
  border-width: 1px;
  background-color: ${({ theme, hasItem }: { theme: DefaultTheme, hasItem?: boolean }) => hasItem ? theme.colors.white : 'undefined'};
  border-color:  ${({ theme, hasItem }: { theme: DefaultTheme, hasItem?: boolean }) => hasItem ? theme.colors.white : theme.colors.black};
  padding-horizontal: 20px;


`
