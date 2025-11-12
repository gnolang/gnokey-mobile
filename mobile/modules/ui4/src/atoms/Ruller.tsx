import styled from 'styled-components/native'

const Ruller = styled.View<{ spacer?: number }>`
  margin: ${({ spacer }) => (spacer ? `${spacer}px 0` : 0)};
  height: 1px;
  background-color: ${({ theme }) => theme?.colors?.border};
  width: 100%;
`

export default Ruller
