import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux";
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
  const [currentChainId, setCurrentChainId] = useState<string | undefined>(undefined);
  const [currentRemote, setCurrentRemote] = useState<string | undefined>(undefined);

  const [chainName, setChainName] = useState<string | undefined>(undefined);
  const [chainURL, setChainURL] = useState<string | undefined>(undefined);
  const [chainID, setChainID] = useState<string | undefined>(undefined);

  const [showCustomChain, setShowCustomChain] = useState(false);

  const dispatch = useAppDispatch();
  const chains = useAppSelector(selectChainsAvailable)

  const onConfirmCustomChain = () => {
    if (!chainName || !chainURL || !chainID) {
      return;
    }


    const newChain: NetworkMetainfo = {
      chainName: chainName,
      gnoAddress: chainURL,
      chainId: chainID,
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
        setCurrentChainId(undefined);
        setCurrentRemote(undefined);
        setLoading('Loading network...');
        const chainId = await gnonative.getChainID();
        const remote = await gnonative.getRemote();
        setCurrentChainId(chainId);
        setCurrentRemote(remote);
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
        <Text.Subheadline>Current Network: {currentChainId}</Text.Subheadline>
        <Text.Subheadline>{currentRemote}</Text.Subheadline>
        <NetworkList currentRemote={currentRemote} networkMetainfos={chains} onNetworkChange={onNetworkChange} />
        <Spacer />
        <Button.TouchableOpacity title="Add a custom chain" onPress={() => setShowCustomChain(true)} variant="primary" />
        <Spacer space={16} />
        <Button.TouchableOpacity title="Back" onPress={() => router.back()} variant="secondary" />
      </Layout.Body>
      <Modal visible={showCustomChain} animationType="slide" transparent>
        <ModalContent>
          <ModalHeader title="Add a custom Chain" onClose={() => setShowCustomChain(false)} />
          <Text.InputLabel>Chain name:</Text.InputLabel>
          <TextInput
            placeholder="name"
            value={chainName}
            onChangeText={setChainName}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text.InputLabel>Chain URL:</Text.InputLabel>
          <TextInput
            placeholder="URL"
            value={chainURL}
            onChangeText={setChainURL}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text.InputLabel>Chain ID:</Text.InputLabel>
          <TextInput
            placeholder="ID"
            value={chainID}
            onChangeText={setChainID}
            autoCapitalize="none"
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
