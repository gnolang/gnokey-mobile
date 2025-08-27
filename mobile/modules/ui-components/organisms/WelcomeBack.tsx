import React from 'react'
import { SlideImage } from '../atoms/WelcomeSlide'
import HeroBox from '../molecules/HeroBox'
import { useKeyboard } from '@/hooks/useKeyboard'

const image = require('../../../assets/images/icon.png')

export function WelcomeBack() {
  const { willShow } = useKeyboard()
  return (
    <HeroBox
      img={!willShow && <SlideImage source={image} resizeMode="contain" />}
      title="Welcome back"
      description="Enter your password to unlock GnoKey Mobile"
    />
  )
}
