import { Layout, TextCopy } from "@/components";
import FormItem from "@/components/form/form-item";
import { ModalConfirm } from "@/components/modal";
import Spacer from "@/components/spacer";
import TextInput from "@/components/textinput";
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
          <Text.H1>Vault Details</Text.H1>

          <Spacer />

          <FormItem label="Vault name">
            <TextField value={vaultName} placeholder="Vault name" onChangeText={setVaultName} />
          </FormItem>

          <FormItem label="Address">
            <TextCopy text={addressBech32} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text.Body style={{ color: theme.colors.white, flexWrap: 'wrap' }} numberOfLines={2}>{addressBech32.substring(0, 20)}\n{addressBech32.substring(20)}&nbsp;
                &nbsp;
                <Octicons name="copy" size={12} color={theme.colors.white} />
              </Text.Body>
            </TextCopy>
          </FormItem>

          <Spacer />

          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <Button color="danger" onPress={onDeleteVault}>Destroy Key</Button>
          </View>


        </Container>

        <ModalConfirm
          visible={showDeleteModal}
          title="Delete Vault"
          confirmText="Delete this vault forever"
          message="Are you sure you want to delete this vault?"
          onConfirm={onConfirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      </SafeAreaView>
    </>
  );
}

export default Page;
