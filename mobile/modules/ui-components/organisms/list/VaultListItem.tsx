import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native'
import styled, { DefaultTheme, useTheme } from 'styled-components/native'
import { AntDesign } from '@expo/vector-icons'
import { Text } from '@/modules/ui-components'
import { Vault } from '@/types'
import { weights } from '@/modules/ui-components/src/text'
import { Ruller } from '@/modules/ui-components/atoms'

interface Props {
  vault: Vault
  onVaultPress: (vault: Vault) => void
  style?: StyleProp<ViewStyle>
}

// SQLite date format is 'YYYY-MM-DD HH:mm:ss'
const dateOnly = (sqliteIsoDate?: string) => {
  return sqliteIsoDate ? sqliteIsoDate.split(' ')[0] : ''
}

const VaultListItem = ({ vault, onVaultPress, style }: Props) => {
  const theme = useTheme()
  return (
    <TouchableOpacity style={[styles.box, style]} onPress={() => onVaultPress(vault)}>
      <View style={styles.content}>
        <PlaceHolder />
        <View style={styles.labels}>
          <Text.Callout weight={weights.bold}>{vault.keyInfo.name}</Text.Callout>
          {vault.description ? <Text.Subheadline style={{ textAlign: 'left' }}>{vault.description}</Text.Subheadline> : null}
          <Text.Caption>Created on {dateOnly(vault.createdAt)}</Text.Caption>
        </View>
        <View style={styles.arrow}>
          <AntDesign name="right" size={24} color={theme.colors.border} />
        </View>
      </View>
      <Ruller />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  box: { marginHorizontal: 0 },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16
  },
  labels: { flex: 1, paddingLeft: 12 },
  arrow: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})

const PlaceHolder = styled.View`
  height: 60px;
  width: 60px;
  background-color: ${({ theme }) => theme.colors.border};
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }: { theme: DefaultTheme }) => theme.borderRadius + 'px'};
`

export { VaultListItem }
