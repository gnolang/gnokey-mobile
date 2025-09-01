import styled from 'styled-components/native'

export { OnboardingLayout } from './OnboardingLayout'
export { ModalTemplate } from './ModalLayout'
export { HomeLayout } from './HomeLayout'
export { default as ScreenHeader } from './ScreenHeader'
export { ListTemplate } from './ListTemplate'

/**
 * HorizontalGroup is a styled component that arranges its children in a horizontal row.
 */
export const HorizontalGroup = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

const ContainerCenterLeft = styled.View`
  flex: 1;
  justify-content: center;
`

const ContainerCenter = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`

export const Template = {
  ContainerCenterLeft,
  ContainerCenter
}
