import React from 'react'
import { TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'
import { Ionicons } from '@expo/vector-icons' // Using Expo icons for checkmark
import * as Text from '../text'

export interface CheckboxProps {
  label: string
  checked: boolean
  onPress: () => void
}

export const Checkbox = ({ label, checked, onPress }: CheckboxProps) => {
  return (
    <CheckboxContainer onPress={onPress} activeOpacity={0.7}>
      <Box checked={checked}>{checked && <Ionicons name="checkmark" size={18} color="white" />}</Box>
      <Text.Body>{label}</Text.Body>
    </CheckboxContainer>
  )
}

const CheckboxContainer = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
`

const Box = styled.View<{ checked?: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border-width: 2px;
  border-color: ${({ checked }) => (checked ? '#007AFF' : '#aaa')};
  background-color: ${({ checked }) => (checked ? '#007AFF' : 'transparent')};
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`
