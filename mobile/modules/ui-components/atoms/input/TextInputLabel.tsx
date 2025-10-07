import styled from 'styled-components/native'
import { Text } from '../../src'

export const TextInputLabel = styled(Text.Subheadline)`
  color: ${(props) => props.theme.textinputs.label};
  line-height: 20px;
  font-weight: ${Text.weights.semibold};
  padding-bottom: 4px;
`
