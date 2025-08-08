import styled from 'styled-components/native'
import { Text } from '../src'

export const SlideTitle = styled(Text.LargeTitle)`
  margin-bottom: 12px;
`

export const SlideDescription = styled(Text.Title3)`
  margin-top: 12px;
  text-align: center;
  color: ${(props) => props.theme.colors.gray};
`

export const SlideImage = styled.Image`
  width: 255px;
  height: 255px;
  margin-bottom: 54px;
`

export const SlideItem = styled.View<{ width: string }>`
  width: ${(props) => props.width};
  padding: 0px 52px;
  align-items: center;
`

export const DotContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #eee;
  padding: 8px 16px;
  border-radius: 20px;
`

export const Dot = styled.View<{ active: boolean }>`
  width: ${(props) => (props.active ? 10 : 6)}px;
  height: ${(props) => (props.active ? 10 : 6)}px;
  background-color: ${(props) => (props.active ? '#000' : '#888')};
  border-radius: 5px;
  margin: 0 4px;
`

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  padding-top: 32px;
`
