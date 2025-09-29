import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native'
import styled, { DefaultTheme, useTheme } from 'styled-components/native'
import { AntDesign } from '@expo/vector-icons'
import { Text, Ruller } from '@/modules/ui-components'
import { Vault } from '@/types'
import { weights } from '@/modules/ui-components/src/text'
import { formatter } from '@/modules/utils/format'
import { sliceString } from '../../utils'

interface Props {
  vault: Vault
  onVaultPress: (vault: Vault) => void
  style?: StyleProp<ViewStyle>
}

const VaultListItem = ({ vault, onVaultPress, style }: Props) => {
  const theme = useTheme()
  return (
    <TouchableOpacity style={[styles.box, style]} onPress={() => onVaultPress(vault)}>
      <View style={styles.content}>
        <PlaceHolder />
        <View style={styles.labels}>
          <HStack>
            <Text.Callout weight={weights.bold}>{vault.keyInfo.name}</Text.Callout>
            <Text.CalloutMutedBold>{formatter.balance(vault.balance)} GNOT </Text.CalloutMutedBold>
          </HStack>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text.SubheadlineMuted style={{ textAlign: 'left', maxWidth: 160 }} ellipsizeMode="tail" numberOfLines={1}>
              {vault.description}
            </Text.SubheadlineMuted>
          </View>
          <Text.SubheadlineMuted>{sliceString(vault.address)}</Text.SubheadlineMuted>
        </View>
        <View style={styles.arrow}>
          <AntDesign name="right" size={14} color={theme.text.textMuted} />
        </View>
      </View>
      <Ruller />
    </TouchableOpacity>
  )
}

const HStack = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const styles = StyleSheet.create({
  box: { height: 80 },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    alignItems: 'center'
  },
  labels: { flex: 1, paddingLeft: 12 },
  arrow: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})

const PlaceHolder = styled.View`
  height: 40px;
  width: 40px;
  background-color: ${({ theme }) => theme.colors.border};
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }: { theme: DefaultTheme }) => theme.borderRadius + 'px'};
`

export { VaultListItem }
