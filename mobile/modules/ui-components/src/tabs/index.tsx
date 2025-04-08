import styled from 'styled-components/native'

interface Props {
  children: React.ReactNode
  value?: number
  index?: number
}

export const CustomTabPanel = (props: Props) => {
  const { value, index, children } = props

  if (value !== index) {
    return null
  }

  return <ViewBordered>{children}</ViewBordered>
}

export const ViewBordered = styled.View`
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.black};
  padding: 16px;
`
