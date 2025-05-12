import { expect, test } from 'vitest'
import { WebLinkDecoder } from './WebLinkDecoder'

test('WebLinkDecoder.parse', () => {
  const input = 'land.gno.gnokey:toexecute?/r/gnoland/users/v1$help&func=Register&.send=1000000ugnot'

  const msg = new WebLinkDecoder(input)

  expect(msg.hostname).toBe('land.gno.gnokey')
  expect(msg.func).toBe('Register')
  expect(msg.send).toBe('1000000ugnot')
  expect(msg.path).toBe('/r/gnoland/users/v1')
  expect(msg.tab).toBe('help')
})

test('WebLinkDecoder.isValid', () => {
  const validInput = 'land.gno.gnokey:toexecute?/r/gnoland/users/v1$help&func=Register&.send=1000000ugnot'
  const invalidInput = 'invalid.url:tosign?/r/gnoland/users/v1$help&func=Register&.send=1000000ugnot'

  expect(WebLinkDecoder.isValid(validInput)).toBe(true)
  expect(WebLinkDecoder.isValid(invalidInput)).toBe(false)
})
