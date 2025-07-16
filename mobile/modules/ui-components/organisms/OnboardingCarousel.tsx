import React, { useRef, useState } from 'react'
import { FlatList, useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'
import { Text } from '../src'

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
    <Container>
      <FlatList
        style={{ width }}
        contentContainerStyle={{ alignItems: 'center' }}
        data={slides}
        ref={flatListRef}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <Slide width={width}>
            <SlideImage source={item.image} resizeMode="contain" />
            <SlideTitle>{item.title}</SlideTitle>
            <SlideDescription>{item.description}</SlideDescription>
          </Slide>
        )}
      />
      <DotContainer>
        {slides.map((_, i) => (
          <Dot key={i} active={i === currentIndex} />
        ))}
      </DotContainer>
    </Container>
  )
}

const Container = styled.View`
  align-items: center;
  justify-content: center;
`

const Slide = styled.View<{ width: number }>`
  width: ${(props) => props.width}px;
  padding: 40px 20px;
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
`

const DotContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #eee;
  padding: 8px 16px;
  border-radius: 20px;
`

const Dot = styled.View<{ active: boolean }>`
  width: ${(props) => (props.active ? 10 : 6)}px;
  height: ${(props) => (props.active ? 10 : 6)}px;
  background-color: ${(props) => (props.active ? '#000' : '#888')};
  border-radius: 5px;
  margin: 0 4px;
`
