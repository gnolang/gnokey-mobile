import { View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { NetworkListItem, MenuToggle, Ruller } from "@/components";
import { selectChainsAvailable, selectRegisterAccount, selectSelectedChain, setRegisterAccount, useAppDispatch, useAppSelector } from "@/redux"

const ChainSelectView = () => {

    const isChecked = useAppSelector(selectRegisterAccount)

    const router = useRouter();
    const dispatch = useAppDispatch()

    const chains = useAppSelector(selectChainsAvailable)
    const currentNetwork = useAppSelector(selectSelectedChain)

    const currentNetworkMetainfo = chains.filter(x => x.gnoAddress === currentNetwork?.gnoAddress)[0]

    return (
        <View style={{ borderColor: 'black', borderWidth: 1, borderRadius: 4 }}>
            <MenuToggle isToggleOn={isChecked} onPress={() => dispatch(setRegisterAccount(!isChecked))} >
                Register on `r/demo/users` realm:
            </MenuToggle>
            <Ruller />
            {currentNetwork ?
                <NetworkListItem
                    onPress={() => router.push("/chain-selection")}
                    networkMetainfo={currentNetworkMetainfo}
                    currentRemote={currentNetwork.gnoAddress}
                /> : null}
        </View>
    );
}

export default ChainSelectView;