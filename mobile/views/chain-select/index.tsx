import { View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { NetworkListItem, MenuToggle } from "@/components";
import { NetworkMetainfo } from "@/types";
import { selectRegisterAccount, setRegisterAccount, useAppDispatch, useAppSelector } from "@/redux"

interface Props {
    currentRemote: string | undefined
    chains: NetworkMetainfo[]
}

const ChainSelectView = ({ currentRemote, chains = [] }: Props) => {

    const isChecked = useAppSelector(selectRegisterAccount)

    const router = useRouter();
    const dispatch = useAppDispatch()

    const currentNetworkMetainfo = chains.filter(x => x.gnoAddress === currentRemote)[0]

    return (
        <View style={{ borderColor: 'black', borderWidth: 1, borderRadius: 4 }}>
            <MenuToggle isToggleOn={isChecked} onPress={() => dispatch(setRegisterAccount(!isChecked))} >
                Register username on the chain
            </MenuToggle>
            {currentRemote && isChecked ?
                <NetworkListItem
                    onPress={() => router.push("/chain-selection")}
                    networkMetainfo={currentNetworkMetainfo}
                    currentRemote={currentRemote}
                /> : null}
        </View>
    );
}

export default ChainSelectView;