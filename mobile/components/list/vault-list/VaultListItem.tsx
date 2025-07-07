import { TouchableOpacity, View } from 'react-native'
import styled, { DefaultTheme, useTheme } from 'styled-components/native'
import { AntDesign } from '@expo/vector-icons'
import { Text } from '@/modules/ui-components'
import { Vault } from '@reduxjs/toolkit'
import Ruller from '@/components/row/Ruller'

interface Props {
  vault: Vault
  chains?: string[]
  onVaultPress: (vault: Vault) => void
  onBookmarkPress?: (vault: Vault) => void
}

const VaultListItem = ({ vault, onVaultPress, chains = [], onBookmarkPress }: Props) => {
  const theme = useTheme()
  return (
    <Container onPress={() => onVaultPress(vault)}>
      <Content>
        <PlaceHolder />
        <View style={{ flex: 1, paddingLeft: 12 }}>
          <Text.H3>{vault.keyInfo.name}</Text.H3>
          {vault.description ? <Text.Body style={{ textAlign: 'left' }}>{vault.description}</Text.Body> : null}
          <Text.Caption style={{ textAlign: 'left', color: theme.text.textMuted }}>Created at 2025-02-19</Text.Caption>
        </View>
        <BookmarkAreaTopAligned>
          {/* {onBookmarkPress ? (
            <TouchableOpacity onPress={() => onBookmarkPress(vault)}>
              <FontAwesome name={vault.bookmarked ? 'star' : 'star-o'} size={24} color={theme.colors.black} />
            </TouchableOpacity>
          ) : null} */}
          <AntDesign name="right" size={24} color={theme.colors.border} />
        </BookmarkAreaTopAligned>
      </Content>
      <Ruller />
    </Container>
  )
}

const Content = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  padding: 24px 20px 024px 20px;
`

const BookmarkAreaTopAligned = styled.View`
  flex-direction: row;
  align-items: center;
`

const PlaceHolder = styled.View`
  height: 60px;
  width: 60px;
  background-color: ${({ theme }) => theme.colors.border};
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }: { theme: DefaultTheme }) => theme.borderRadius + 'px'};
`

const Container = styled(TouchableOpacity)`
  space-between: space-between;
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.white};
  border-radius: ${({ theme }: { theme: DefaultTheme }) => theme.borderRadius + 'px'};
`

export default VaultListItem
