import { expect, test } from 'vitest'
import { WebLinkDecoder } from './WebLinkDecoder'

test('WebLinkDecoder.parse social', () => {
  const input =
    'land.gno.gnokey:toexecute?/r/berty/social$help&func=RepostThread&postid=1&threadid=1&userPostsAddr=g1rck0vsjgm2nefcmgzg627lpjx3u0wtvajtarz9'

  const msg = new WebLinkDecoder(input)

  expect(msg.hostname).toBe('land.gno.gnokey')
  expect(msg.params).toBe('func=RepostThread&postid=1&threadid=1&userPostsAddr=g1rck0vsjgm2nefcmgzg627lpjx3u0wtvajtarz9')
  expect(msg.path).toBe('/r/berty/social')
  expect(msg.tab).toBe('help')
  expect(msg.func).toBe('RepostThread')
})

test('WebLinkDecoder.parse users/v1', () => {
  const input = 'land.gno.gnokey:toexecute?/r/gnoland/users/v1$help&func=Register&.send=1000000ugnot'

  const msg = new WebLinkDecoder(input)

  expect(msg.hostname).toBe('land.gno.gnokey')
  expect(msg.params).toBe('func=Register&.send=1000000ugnot')
  expect(msg.path).toBe('/r/gnoland/users/v1')
  expect(msg.tab).toBe('help')
  expect(msg.func).toBe('Register')
})

test('WebLinkDecoder.isValid', () => {
  const validInput = 'land.gno.gnokey:toexecute?/r/gnoland/users/v1$help&func=Register&.send=1000000ugnot'
  const invalidInput = 'invalid.url:tosign?/r/gnoland/users/v1$help&func=Register&.send=1000000ugnot'

  expect(WebLinkDecoder.isValid(validInput)).toBe(true)
  expect(WebLinkDecoder.isValid(invalidInput)).toBe(false)
})
