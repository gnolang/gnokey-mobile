import styled from 'styled-components/native'
import { Text } from '@berty/gnonative-ui'
import { walletPalette } from './walletTheme'
import { Section, SectionTitle, Card } from './VaultSection'

type ActivityCardProps = {
  emptyText?: string
}

export const ActivityCard = ({ emptyText = 'Coming soon.' }: ActivityCardProps) => {
  return (
    <Section>
      <SectionTitle>Activity</SectionTitle>
      <Card>
        <EmptyState>
          <Text.Body style={{ color: walletPalette.inkMuted }}>{emptyText}</Text.Body>
        </EmptyState>
      </Card>
    </Section>
  )
}

const EmptyState = styled.View`
  padding: 12px 0;
  align-items: center;
  justify-content: center;
`
