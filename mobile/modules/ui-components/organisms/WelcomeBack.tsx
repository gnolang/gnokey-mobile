import React from 'react'
import styled from 'styled-components/native'
import { Text } from '../src'

const image = require('../../../assets/images/icon.png')

export function WelcomeBack() {
  return (
    <Container>
      <Slide>
        <SlideImage source={image} resizeMode="contain" />
        <SlideTitle>Welcome back</SlideTitle>
        <SlideDescription>Enter your password to unlock GnoKey Mobile</SlideDescription>
      </Slide>
    </Container>
  )
}

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`

const Slide = styled.View`
  padding: 20px;
  align-items: center;
`

const SlideImage = styled.Image`
  width: 255px;
  height: 255px;
  margin-bottom: 54px;
`

const SlideTitle = styled(Text.H1)`
  margin-bottom: 12px;
`

const SlideDescription = styled(Text.H4)`
  text-align: center;
  font-weight: 400;
`
