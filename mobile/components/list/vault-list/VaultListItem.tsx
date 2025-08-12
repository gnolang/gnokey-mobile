import { StyleSheet, TouchableOpacity, View } from 'react-native'
import styled, { DefaultTheme, useTheme } from 'styled-components/native'
import { AntDesign } from '@expo/vector-icons'
import { Text } from '@/modules/ui-components'
import Ruller from '@/components/row/Ruller'
import { Vault } from '@/types'

interface Props {
  vault: Vault
  chains?: string[]
  onVaultPress: (vault: Vault) => void
  onBookmarkPress?: (vault: Vault) => void
}

// SQLite date format is 'YYYY-MM-DD HH:mm:ss'
const dateOnly = (sqliteIsoDate?: string) => {
  return sqliteIsoDate ? sqliteIsoDate.split(' ')[0] : ''
}

const VaultListItem = ({ vault, onVaultPress, chains = [], onBookmarkPress }: Props) => {
  const theme = useTheme()
  return (
    <TouchableOpacity onPress={() => onVaultPress(vault)}>
      <View style={styles.content}>
        <PlaceHolder />
        <View style={styles.group}>
          <Text.H3>{vault.keyInfo.name}</Text.H3>
          {vault.description ? <Text.Body style={{ textAlign: 'left' }}>{vault.description}</Text.Body> : null}
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
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 24
  },
  group: { flex: 1, paddingLeft: 12 },
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

export default VaultListItem
