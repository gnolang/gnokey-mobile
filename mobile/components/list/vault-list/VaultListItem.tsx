import { colors } from "@/assets/styles/colors";
import Text from "@/components/text";
import { KeyInfo } from "@gnolang/gnonative";
import { TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import AntDesign from '@expo/vector-icons/AntDesign';

interface Props {
  vault: KeyInfo;
  onVaultPress: (vault: KeyInfo) => void;
}

const VaultListItem = ({ vault, onVaultPress }: Props) => {

  return (
    <Container onPress={() => onVaultPress(vault)}>
      <View style={{ flex: 1 }}>
        <Text.Title>{vault.name}</Text.Title>
      </View>
      <AntDesign name="edit" size={24} color="black" />
    </Container>
  )
}

const Container = styled(TouchableOpacity)`
  border-width: 1px;
  border-color: ${colors.grayscale[500]};
  margin: 4px;
  height: 64px;
  padding: 16px;
  flex-direction: row;
  space-between: space-between;
`;

export default VaultListItem
