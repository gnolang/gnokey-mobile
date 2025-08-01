import { View } from 'react-native'
import { ModalHeaderOvalIcon } from '../atoms/Modal'
import styled from 'styled-components/native'
import { Spacer, TextField } from '../src'

export const ModalHeader = ({ children }: React.PropsWithChildren) => (
  <Content>
    <ModalHeaderOvalIcon />
    {children}
  </Content>
)

const Content = styled(View)`
  padding-vertical: 8px;
  align-items: center;
  justify-content: center;
`

export const ModalHeaderSearch = ({
  searchQuery,
  onChangeText
}: {
  searchQuery: string
  onChangeText: (query: string) => void
}) => (
  <Content>
    <ModalHeaderOvalIcon />
    <Spacer space={8} />
    <TextField placeholder="Search" value={searchQuery} onChangeText={onChangeText} />
  </Content>
)
