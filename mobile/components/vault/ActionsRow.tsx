import { Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import styled from 'styled-components/native'
import { Text } from '@berty/gnonative-ui'
import { walletPalette } from './walletTheme'
import { Section, SectionTitle } from './VaultSection'

type ActionsRowProps = {
  onSend: () => void
  onReceive: () => void
  onCommand: () => void
}

export const ActionsRow = ({ onSend, onReceive, onCommand }: ActionsRowProps) => {
  return (
    <Section>
      <SectionTitle>Actions</SectionTitle>
      <Row>
        <ActionTile onPress={onSend} accessibilityLabel="Send">
          <Ionicons name="arrow-up-outline" size={18} color={walletPalette.ink} />
          <Text.Body style={{ color: walletPalette.ink }}>Send</Text.Body>
        </ActionTile>
        <ActionSpacer />
        <ActionTile onPress={onReceive} accessibilityLabel="Receive">
          <Ionicons name="arrow-down-outline" size={18} color={walletPalette.ink} />
          <Text.Body style={{ color: walletPalette.ink }}>Receive</Text.Body>
        </ActionTile>
        <ActionSpacer />
        <ActionTile onPress={onCommand} accessibilityLabel="Command">
          <Ionicons name="terminal-outline" size={18} color={walletPalette.ink} />
          <Text.Body style={{ color: walletPalette.ink }}>Command</Text.Body>
        </ActionTile>
      </Row>
    </Section>
  )
}

const Row = styled.View`
  flex-direction: row;
`

const ActionTile = styled(Pressable)`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 12px 8px;
  border-radius: 10px;
  background-color: #e3e3e3;
  border-width: 1px;
  border-color: #c8c8c8;
`

const ActionSpacer = styled.View`
  width: 10px;
`
