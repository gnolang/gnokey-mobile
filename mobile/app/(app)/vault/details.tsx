import { Layout } from "@/components";
import Button from "@/components/button";
import FormItem from "@/components/form/form-item";
import { ModalConfirm } from "@/components/modal";
import Spacer from "@/components/spacer";
import TextInput from "@/components/textinput";
import { useState } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { deleteVault, selectVaultToEdit, useAppDispatch } from "@/redux";
import { useRouter } from "expo-router";

const Page = () => {

  const vault = useSelector(selectVaultToEdit)
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [vaultName, setVaultName] = useState(vault?.name);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
    <Layout.Container>
      <Layout.Header title="Vault Details" />
      <Layout.Body>
        <View style={{ padding: 16 }}>
          <FormItem label="Vault name">
            <TextInput value={vaultName} placeholder="Vault name" onChangeText={setVaultName} />
          </FormItem>
          <View style={{ flex: 1 }}>
            {/* <Button.TouchableOpacity title="Save" onPress={onSave} style={{ marginTop: 16 }} variant="primary" /> */}
            <Spacer />
            <Button.TouchableOpacity
              title="Destroy Key"
              onPress={onDeleteVault}
              variant="primary-red"
            />
          </View>
        </View>
      </Layout.Body>
      <ModalConfirm
        visible={showDeleteModal}
        title="Delete Vault"
        confirmText="Delete this vault forever"
        message="Are you sure you want to delete this vault?"
        onConfirm={onConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </Layout.Container>
  );
}

export default Page;
