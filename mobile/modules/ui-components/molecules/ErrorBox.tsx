import { Text } from '../src'
import HeroBox from './HeroBox'

interface Props {
  title: string
  description: string
  errorDetails?: string
}

const ErrorBox = ({ title, description, errorDetails }: Props) => {
  return (
    <HeroBox title={title} description={description}>
      {errorDetails ? <Text.BodyCenterGray>{errorDetails}</Text.BodyCenterGray> : null}
    </HeroBox>
  )
}

export default ErrorBox
