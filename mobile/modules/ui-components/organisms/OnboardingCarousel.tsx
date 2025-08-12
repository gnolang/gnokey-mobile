import React, { useRef, useState } from 'react'
import { FlatList, useWindowDimensions } from 'react-native'
import { Spacer } from '../src'
import { Dot, DotContainer, SlideImage, BoxToScroll, TopCenterContainer } from '../atoms/WelcomeSlide'
import HeroBox from '../molecules/HeroBox'

const slides = [
  {
    title: 'GnoKey Mobile',
    description: 'A short, complete sentence that takes up first, second and third line of the paragraph',
    image: require('../../../assets/images/icon.png') // TODO: Replace with real asset
  },
  {
    title: 'Feature',
    description: 'Another screen with GKM description for user to let him understand what this app is about',
    image: require('../../../assets/images/icon.png') // TODO: Replace with real asset
  },
  {
    title: 'Feature 2',
    description: 'Another screen with GKM description for user to let him understand what this app is about',
    image: require('../../../assets/images/icon.png') // TODO: Replace with real asset
  }
  // TODO: Add more slides if needed
]

export function OnboardingCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)
  const { width } = useWindowDimensions()

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index)
    }
  }).current

  return (
    <TopCenterContainer>
      <FlatList
        style={{ width }}
        data={slides}
        ref={flatListRef}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <BoxToScroll width={width + 'px'}>
            <HeroBox
              img={<SlideImage source={item.image} resizeMode="contain" />}
              title={item.title}
              description={item.description}
            />
          </BoxToScroll>
        )}
      />
      <DotContainer>
        {slides.map((_, i) => (
          <Dot key={i} active={i === currentIndex} />
        ))}
      </DotContainer>
      <Spacer space={48} />
    </TopCenterContainer>
  )
}
