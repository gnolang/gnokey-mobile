import { Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import styled from 'styled-components/native'
import { Text } from '@berty/gnonative-ui'
import { Icons } from '@/components'
import { walletPalette } from './walletTheme'

type BalanceCardProps = {
  formattedBalance: string
  shortAddress: string
  hasFaucetPortal: boolean
  refreshing: boolean
  onCopyAddress: () => void
  onOpenFaucet: () => void
  onRefreshBalance: () => void
}

export const BalanceCard = ({
  formattedBalance,
  shortAddress,
  hasFaucetPortal,
  refreshing,
  onCopyAddress,
  onOpenFaucet,
  onRefreshBalance
}: BalanceCardProps) => {
  return (
    <Container>
      <BalanceTopRow>
        <Text.Body style={{ color: walletPalette.inkMuted }}>Total Balance</Text.Body>
        <BalanceActions>
          <IconButton onPress={onRefreshBalance} disabled={refreshing} accessibilityLabel="Refresh balance">
            <Ionicons name="refresh" size={14} color={walletPalette.ink} />
          </IconButton>
          {hasFaucetPortal && (
            <FaucetLink onPress={onOpenFaucet}>
              <Text.Body style={{ color: walletPalette.accent, marginRight: 4 }}>Faucet</Text.Body>
              <Ionicons name="chevron-forward" size={14} color={walletPalette.accent} />
            </FaucetLink>
          )}
        </BalanceActions>
      </BalanceTopRow>
      <BalanceValueRow>
        <Text.H1 style={{ color: walletPalette.ink }}>{formattedBalance}</Text.H1>
        <Text.Body style={{ marginLeft: 8, color: walletPalette.inkMuted }}>GNOT</Text.Body>
      </BalanceValueRow>
      <AddressPill onPress={onCopyAddress} accessibilityLabel="Copy address">
        <Text.Body style={{ color: walletPalette.ink }}>{shortAddress}</Text.Body>
        <Icons.CopyIcon muted />
      </AddressPill>
    </Container>
  )
}

const Container = styled.View`
  padding: 16px;
  border-radius: 12px;
  background-color: #e3e3e3;
  border-width: 1px;
  border-color: #c8c8c8;
`

const BalanceTopRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const BalanceActions = styled.View`
  flex-direction: row;
  align-items: center;
`

const IconButton = styled(Pressable)`
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background-color: #f7f7f7;
  border-width: 1px;
  border-color: #c8c8c8;
  margin-right: 8px;
`

const BalanceValueRow = styled.View`
  flex-direction: row;
  align-items: baseline;
  margin-top: 8px;
  margin-bottom: 12px;
`

const AddressPill = styled(Pressable)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 10px;
  background-color: #f7f7f7;
  border-width: 1px;
  border-color: #c8c8c8;
`

const FaucetLink = styled(Pressable)`
  flex-direction: row;
  align-items: center;
`
