import { useRouter } from 'expo-router'
import { Button } from '@berty/gnonative-ui'

interface Props {
  onPress?: () => void
}

const ButtonBack = ({ onPress }: Props) => {
  const router = useRouter()

  return (
    <Button color="primary" onPress={() => (onPress ? onPress() : router.canGoBack() && router.back())}>
      Go Back
    </Button>
  )
}

export { ButtonBack }
