import { useEffect, useState } from "react";
import { getCurrentChain, selectSelectedChain, setSelectedChain, useAppDispatch, useAppSelector } from "@/redux";
import { Modal, StyleSheet } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { useGnoNativeContext } from "@gnolang/gnonative";
import { Button, Layout, Ruller, Spacer, ModalContent, ModalHeader, NetworkList, Text, TextInput } from "@/components";
import { NetworkMetainfo } from "@/types";
import { addCustomChain, selectChainsAvailable } from "@/redux";

function Page() {
  const { gnonative } = useGnoNativeContext();
  const navigation = useNavigation();
  const router = useRouter();
  const [loading, setLoading] = useState<string | undefined>(undefined);

  const [chainName, setChainName] = useState<string | undefined>(undefined);
  const [chainURL, setChainURL] = useState<string | undefined>(undefined);
  const [chainID, setChainID] = useState<string | undefined>(undefined);

  const [faucetAddress, setFaucetAddress] = useState<string | undefined>(undefined);

  const [showCustomChain, setShowCustomChain] = useState(false);

  const dispatch = useAppDispatch();

  const selectedChain = useAppSelector(selectSelectedChain);
  const chains = useAppSelector(selectChainsAvailable)

  const onConfirmCustomChain = () => {
    if (!chainName || !chainURL || !chainID) {
      return;
    }

    const newChain: NetworkMetainfo = {
      chainId: chainID,
      chainName: chainName,
      gnoAddress: chainURL,
      faucetAddress,
    };

    dispatch(addCustomChain(newChain));

    setShowCustomChain(false);
  }

  const onCancelCustomChain = () => {
    setShowCustomChain(false);
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        dispatch(setSelectedChain(undefined));
        setLoading('Loading network...');
        await gnonative.getChainID();

        const currentChain = await dispatch(getCurrentChain()).unwrap();
        console.log('xxxxx', currentChain);
        dispatch(setSelectedChain(currentChain));

        setLoading(undefined);
      } catch (error: unknown | Error) {
        setLoading(error?.toString());
        console.log(error);
      }
    });
    return unsubscribe;
  }, [navigation]);

  const onNetworkChange = async (networkMetainfo: NetworkMetainfo) => {
    try {
      setLoading('Changing network...');
      console.log('Changing network', networkMetainfo)
      await gnonative.setChainID(networkMetainfo.chainId);
      await gnonative.setRemote(networkMetainfo.gnoAddress);
      await dispatch(setSelectedChain(networkMetainfo));
      setLoading(undefined);
      router.back();
    } catch (error: unknown | Error) {
      setLoading(error?.toString());
      console.log(error);
    }
  };

  return (
    <Layout.Container>
      <Layout.Body>
        <Text.Title style={styles.title}>Select a Network</Text.Title>
        <Text.Subheadline>Current Network: {selectedChain?.chainId}</Text.Subheadline>
        <Text.Subheadline>{selectedChain?.gnoAddress}</Text.Subheadline>
        <NetworkList currentRemote={selectedChain?.gnoAddress} networkMetainfos={chains} onNetworkChange={onNetworkChange} />
        <Spacer />
        <Button.TouchableOpacity title="Add a custom chain" onPress={() => setShowCustomChain(true)} variant="primary" />
        <Spacer space={16} />
        <Button.TouchableOpacity title="Back" onPress={() => router.back()} variant="secondary" />
      </Layout.Body>
      <Modal visible={showCustomChain} animationType="slide">
        <ModalContent>
          <ModalHeader title="Add a custom Chain" onClose={() => setShowCustomChain(false)} />
          <Text.InputLabel>Chain name:</Text.InputLabel>
          <TextInput
            placeholder="name"
            value={chainName}
            onChangeText={setChainName}
            keyboardType="default"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text.InputLabel>Chain ID:</Text.InputLabel>
          <TextInput
            placeholder="ID"
            value={chainID}
            onChangeText={setChainID}
            keyboardType="default"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text.InputLabel>Chain URL:</Text.InputLabel>
          <TextInput
            placeholder="URL"
            value={chainURL}
            onChangeText={setChainURL}
            keyboardType="url"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text.InputLabel>Faucet URL:</Text.InputLabel>
          <TextInput
            placeholder="Faucet URL"
            value={faucetAddress}
            onChangeText={setFaucetAddress}
            autoCapitalize="none"
            keyboardType="url"
            autoCorrect={false}
          />
          <Spacer />
          <Button.TouchableOpacity title="Save" onPress={onConfirmCustomChain} variant="primary" />
          <Ruller />
          <Button.TouchableOpacity title="Cancel" onPress={onCancelCustomChain} variant="secondary" />
          <Spacer space={16} />
        </ModalContent>
      </Modal>
    </Layout.Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});

export default Page;
