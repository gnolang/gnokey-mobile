import { Pressable } from 'react-native'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import styled from 'styled-components/native'
import { Text, Ruller } from '@berty/gnonative-ui'
import { InputWithLabel } from '@/components'
import { FormItem } from '@berty/gnonative-ui'
import { Icons } from '@/components'
import { walletPalette } from './walletTheme'
import { Section, Card, SectionTitle } from './VaultSection'

type AccountDetailsSectionProps = {
  name: string
  description: string
  onDescriptionChange: (value: string) => void
  address: string
  createdAtLabel: string
  onSave: () => void
  defaultOpen?: boolean
}

export const AccountDetailsSection = ({
  name,
  description,
  onDescriptionChange,
  address,
  createdAtLabel,
  onSave,
  defaultOpen = false
}: AccountDetailsSectionProps) => {
  const [showDetails, setShowDetails] = useState(defaultOpen)

  return (
    <Section>
      <SectionToggle onPress={() => setShowDetails(!showDetails)} accessibilityLabel="Toggle account details">
        <ToggleTitle>Account Details</ToggleTitle>
        <Ionicons name={showDetails ? 'chevron-up' : 'chevron-down'} size={18} color={walletPalette.ink} />
      </SectionToggle>
      {showDetails && (
        <Card>
          <DetailsHeader>
            <Text.Body style={{ color: walletPalette.inkMuted }}>Edit details</Text.Body>
            <SmallButton onPress={onSave} accessibilityLabel="Save description">
              <Ionicons name="save-outline" size={14} color={walletPalette.ink} />
              <Text.Body style={{ color: walletPalette.ink, marginLeft: 6 }}>Save</Text.Body>
            </SmallButton>
          </DetailsHeader>
          <Ruller spacer={8} />
          <FormItem label="Name" value={name} />
          <Ruller spacer={8} />
          <InputWithLabel label="Description" placeholder="Description" onChangeText={onDescriptionChange} value={description} />
          <Ruller spacer={12} />
          <FormItem
            label="Address"
            copyTextValue={address}
            endAdornment={<Icons.CopyIcon muted />}
            value={<Text.Body>{address}</Text.Body>}
          />
          <Ruller spacer={8} />
          <FormItem label="Created At" value={createdAtLabel} />
        </Card>
      )}
    </Section>
  )
}

const SectionToggle = styled(Pressable)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const ToggleTitle = styled(SectionTitle)`
  margin-bottom: 0;
`

const SmallButton = styled(Pressable)`
  flex-direction: row;
  align-items: center;
  padding: 6px 10px;
  border-radius: 8px;
  background-color: #f7f7f7;
  border-width: 1px;
  border-color: #c8c8c8;
`

const DetailsHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`
