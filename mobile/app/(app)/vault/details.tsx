import { TextCopy } from "@/components";
import { ModalConfirmDelete } from "@/components/modal";
import Spacer from "@/components/spacer";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { deleteVault, selectVaultToEdit, useAppDispatch } from "@/redux";
import { useNavigation, useRouter } from "expo-router";
import { useGnoNativeContext } from "@gnolang/gnonative";
import { AppBar, SafeAreaView, Button, Text, Container, TextField } from "@/modules/ui-components";
import { FontAwesome6, Octicons } from "@expo/vector-icons";
import { useTheme } from "styled-components/native";

const Page = () => {

  const vault = useSelector(selectVaultToEdit)
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [vaultName, setVaultName] = useState(vault?.name);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [addressBech32, setAddressBech32] = useState('');

  const navigation = useNavigation();

  const { gnonative } = useGnoNativeContext();
  const theme = useTheme();

  useEffect(() => {
    (
      async () => {
        if (!vault) return;
        const address = await gnonative.addressToBech32(vault.address);
        setAddressBech32(address);
      }
    )()
  }, [vault]);

  const onSave = () => {
    // TODO: VALIDATE THE NAME HERE
    // TODO: restrict text input to lowercase
    // dispatch(saveVault({ name: vaultName }));
  }

  const onDeleteVault = async () => {
    setShowDeleteModal(true);
  };

  const onConfirmDelete = async () => {
    if (!vault) return;
    await dispatch(deleteVault({ vault })).unwrap()
    setShowDeleteModal(false);
    router.replace("/home");
  }

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <AppBar>
          <View />
          <Button onPress={() => navigation.goBack()} color='tertirary' endIcon={<FontAwesome6 name='xmark' size={16} color='black' />}>
            Cancel
          </Button>
        </AppBar>

        <Container style={{ flex: 1 }}>

          <Text.H1>Update the</Text.H1>
          <View style={{ flexDirection: 'row' }}>
            <Text.H1>Vault </Text.H1>
            <Text.H1 style={{ color: 'white' }} >Data</Text.H1>
          </View>

          <Spacer space={32} />

          <TextField label="Vault name" value={vaultName} placeholder="Vault name" onChangeText={setVaultName} />

          <Spacer />
          <Spacer />

          <TextCopy text={addressBech32} style={{ flexDirection: 'row' }}>
            <View style={{ flexDirection: 'row' }}>
              <TextField label="Address" value={addressBech32} style={{ height: 50 }} multiline editable={false} />
            </View>
            <Octicons name="copy" size={12} color={theme.colors.white} style={{ paddingTop: 20 }} />
          </TextCopy>


          <Spacer />

          <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'flex-end' }}>
            <Button style={{ width: 110 }} color="tertirary" onPress={onDeleteVault}
              endIcon={
                <FontAwesome6 name='trash-can' size={16} color='black' />
              }>Delete</Button>
            {/* <Button style={{  width: 110 }} color="primary" onPress={onDeleteVault}>Delete</Button> */}
            {/* <Button style={{  width: 110 }} color="primary" onPress={onDeleteVault}>Delete</Button> */}
            <View style={{ width: 110 }} />
            <View style={{ width: 110 }} />
          </View>

        </Container>

        <ModalConfirmDelete
          visible={showDeleteModal}
          title="Delete Vault"
          confirmText="Delete"
          message="Are you sure you want to delete this vault?"
          onConfirm={onConfirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      </SafeAreaView>
    </>
  );
}

export default Page;
