import styled from 'styled-components/native'
import { Text } from '@berty/gnonative-ui'
import { walletPalette } from './walletTheme'
import { Section, SectionTitle, Card } from './VaultSection'

type AssetsCardProps = {
  formattedBalance: string
}

export const AssetsCard = ({ formattedBalance }: AssetsCardProps) => {
  return (
    <Section>
      <SectionTitle>Assets</SectionTitle>
      <Card>
        <AssetRow>
          <AssetLeft>
            <AssetBadge>
              <Text.Body style={{ color: walletPalette.surfaceAlt }}>G</Text.Body>
            </AssetBadge>
            <TextGroup>
              <Text.Body style={{ color: walletPalette.ink }}>GNOT</Text.Body>
              <Text.Body style={{ color: walletPalette.inkMuted, fontSize: 12 }}>Gno Token</Text.Body>
            </TextGroup>
          </AssetLeft>
          <Text.Body style={{ color: walletPalette.ink }}>{formattedBalance} GNOT</Text.Body>
        </AssetRow>
      </Card>
    </Section>
  )
}

const AssetRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const AssetLeft = styled.View`
  flex-direction: row;
  align-items: center;
`

const AssetBadge = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
  background-color: #111111;
  margin-right: 10px;
`

const TextGroup = styled.View``
