import { Text } from '../src'

/**
 * Utility component to display a check item with validation status.
 * example usage:
 * <CheckItem isValid={true}>Password meets requirements</CheckItem>
 */
export const CheckItem = ({ isValid, children }: { isValid: boolean; children: React.ReactNode }) => {
  return (
    <Text.Caption style={{ color: isValid ? 'green' : 'red' }}>
      {isValid ? '✓' : '✗'} {children}
    </Text.Caption>
  )
}
