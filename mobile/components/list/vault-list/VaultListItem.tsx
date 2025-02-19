import { colors } from "@/assets/styles/colors";
import { KeyInfo } from "@gnolang/gnonative";
import { TouchableOpacity, View } from "react-native";
import styled, { DefaultTheme } from 'styled-components/native'
import { FontAwesome6 } from "@expo/vector-icons";
import { ButtonIcon, Chip, Text } from "@/modules/ui-components";

interface Props {
  vault: KeyInfo;
  chains?: string[];
  onVaultPress: (vault: KeyInfo) => void;
}

const VaultListItem = ({ vault, onVaultPress, chains = [] }: Props) => {

  return (
    <Wrapper onPress={() => onVaultPress(vault)}>

      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
        {chains && chains.length > 0 ? <Chip>
          <Text.Caption style={{ color: '#A1A1A1' }}>{chains.join(', ')}</Text.Caption>
        </Chip> : <Chip>
          <Text.Caption style={{ color: '#A1A1A1' }}>Not registered</Text.Caption>
        </Chip>}
        <View />
        <TouchableOpacity onPress={() => console.log('bookmark')}>
          <FontAwesome6 name="bookmark" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 }}>
        <PlaceHolder />
        <View style={{ flex: 1, paddingLeft: 16 }}>
          <Text.H3>{vault.name}</Text.H3>
          <Text.Caption style={{ textAlign: 'left', color: '#A1A1A1' }}>Created at 2025-02-19</Text.Caption>
        </View>
      </View>

    </Wrapper>
  )
}

const PlaceHolder = styled.View`
  height: 48px;
  width: 48px;
  background-color: #E5E5E5;
  border-color: ${colors.grayscale[500]};
  border-radius:  ${({ theme }: { theme: DefaultTheme }) => theme.borderRadius + 'px'};
`;

const Wrapper = styled(TouchableOpacity)`
  space-between: space-between;
  padding: 12px 12px 8px 12px;
  margin: 4px;
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.white};
  border-radius:  ${({ theme }: { theme: DefaultTheme }) => theme.borderRadius + 'px'};
`;

export default VaultListItem
