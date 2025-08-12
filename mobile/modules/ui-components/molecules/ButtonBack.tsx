import { useRouter } from 'expo-router'
import { Button } from '../src'

const ButtonBack = () => {
  const router = useRouter()

  return (
    <Button
      color="primary"
      onPress={() => {
        router.canGoBack() && router.back()
      }}
    >
      Go Back
    </Button>
  )
}

export { ButtonBack }
