import { Layout } from "@/components/index";
import ModalHeader from "@/components/layout/modal-header";
import FollowsList from "@/components/list/follows/follows-list";
import Text from "@/components/text";
import { Following } from "@/types";
import { StyleSheet, View } from "react-native";

interface Props {
  data: Following[];
  onPress: (item: Following) => void;
}

function FollowModalContent({ data, onPress }: Props) {
  return (
    <View style={styles.container}>
      <ModalHeader>
        <Text.Title>Following</Text.Title>
      </ModalHeader>
      <Layout.Body>
        <FollowsList data={data} onPress={onPress} />
      </Layout.Body>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
  },
});

export default FollowModalContent;
