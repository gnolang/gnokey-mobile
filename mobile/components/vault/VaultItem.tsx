import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native'
import styled, { DefaultTheme } from 'styled-components/native'
import { Text } from '@berty/gnonative-ui'
import { Vault } from '@/types'
import { sliceString, formatter } from '@/components'

interface Props {
  vault: Vault
  onVaultPress: (vault: Vault) => void
  style?: StyleProp<ViewStyle>
}

const VaultItem = ({ vault, onVaultPress, style }: Props) => {
  return (
    <TouchableOpacity style={[styles.box, style]} onPress={() => onVaultPress(vault)}>
      <View style={styles.content}>
        <PlaceHolder />
        <View style={styles.labels}>
          <HStack>
            <Text.Callout weight={Text.weights.bold}>{vault.keyInfo.name}</Text.Callout>
            <Text.CalloutMutedBold>{formatter.balance(vault.balance)} GNOT </Text.CalloutMutedBold>
          </HStack>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text.SubheadlineMuted style={{ textAlign: 'left', maxWidth: 160 }} ellipsizeMode="tail" numberOfLines={1}>
              {vault.description}
            </Text.SubheadlineMuted>
          </View>
          <Text.SubheadlineMuted>{sliceString(vault.address)}</Text.SubheadlineMuted>
        </View>
      </View>
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

export { VaultItem }
