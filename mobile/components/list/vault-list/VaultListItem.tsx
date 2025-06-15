import { TouchableOpacity, View } from 'react-native'
import styled, { DefaultTheme, useTheme } from 'styled-components/native'
import { FontAwesome } from '@expo/vector-icons'
import { Chip, Text } from '@/modules/ui-components'
import { Vault } from '@reduxjs/toolkit'

interface Props {
  vault: Vault
  chains?: string[]
  onVaultPress: (vault: Vault) => void
  onBookmarkPress?: (vault: Vault) => void
}

const VaultListItem = ({ vault, onVaultPress, chains = [], onBookmarkPress }: Props) => {
  const theme = useTheme()
  return (
    <Wrapper onPress={() => onVaultPress(vault)}>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
        {chains && chains.length > 0 ? (
          <Chip>
            <Text.Caption style={{ color: theme.colors.gray }}>{chains.join(', ')}</Text.Caption>
          </Chip>
        ) : (
          <Chip>
            <Text.Caption style={{ color: theme.colors.gray }}>Not registered</Text.Caption>
          </Chip>
        )}
        <View />
        {onBookmarkPress ? (
          <TouchableOpacity onPress={() => onBookmarkPress(vault)}>
            <FontAwesome name={vault.bookmarked ? 'star' : 'star-o'} size={24} color={theme.colors.black} />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 }}>
        <PlaceHolder />
        <View style={{ flex: 1, paddingLeft: 16 }}>
          <Text.H3>{vault.keyInfo.name}</Text.H3>
          <Text.Caption style={{ textAlign: 'left', color: theme.colors.gray }}>Created at 2025-02-19</Text.Caption>
        </View>
      </View>
    </Wrapper>
  )
}

const PlaceHolder = styled.View`
  height: 48px;
  width: 48px;
  background-color: ${({ theme }) => theme.colors.gray};
  border-color: ${({ theme }) => theme.colors.gray};
  border-radius: ${({ theme }: { theme: DefaultTheme }) => theme.borderRadius + 'px'};
`

const Wrapper = styled(TouchableOpacity)`
  space-between: space-between;
  padding: 12px 12px 8px 12px;
  margin: 4px;
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.white};
  border-radius: ${({ theme }: { theme: DefaultTheme }) => theme.borderRadius + 'px'};
`

export default VaultListItem
