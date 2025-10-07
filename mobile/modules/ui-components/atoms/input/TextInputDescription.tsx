import styled from 'styled-components/native'
import { Text } from '../../src'

export const TextInputDescription = styled(Text.Subheadline)`
  font-weight: ${Text.weights.regular};
  letter-spacing: -0.24px;
  line-height: 20px;
  padding-bottom: 8px;
  color: ${(props) => props.theme.text.textMuted};
`
