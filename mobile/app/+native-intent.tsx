import { showValidationErrors, validateDeepLink, ValidationResult } from '@/modules/deeplink'
import * as Linking from 'expo-linking'

interface Props {
  path: string
  initial: boolean
}

export function redirectSystemPath({ path, initial }: Props) {
  try {
    const linkingParsedURL = Linking.parse(path)

    if (linkingParsedURL.scheme === null) {
      return path
    }

    if (linkingParsedURL.scheme === 'land.gno.gnokey') {
      const validation: ValidationResult = validateDeepLink(linkingParsedURL)

      if (!validation.isValid) {
        showValidationErrors(validation.errors)
        return '/'
      } else {
        // Return the current path
        return path
      }
    }

    return path
  } catch {
    // Do not crash inside this function! Instead you should redirect users
    // to a custom route to handle unexpected errors, where they are able to report the incident
    return '/unexpected-error'
  }
}
