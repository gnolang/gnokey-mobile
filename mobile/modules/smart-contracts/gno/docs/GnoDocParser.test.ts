import { expect, test } from 'vitest'
import gnoDocJsonSample from './__mocks__/qdoc_result.json'
import { GnoDocParser } from './GnoDocParser'

test('GnoDocParser', () => {
  const parser = new GnoDocParser()
  const r = parser.parseDoc(gnoDocJsonSample.data)

  console.log('gnoDocJsonSample', r.methods[0].doc)
  expect(r.name).toBe('gno.land/r/berty/social')
  expect(r.description).toBe('')
  expect(r.methods).toHaveLength(69)
  expect(r.methods[0].name).toBe('AddReaction')
  expect(r.methods[0].doc.substring(0, 50)).toBe('Add the reaction by the caller to the post of user')

  expect(r.methods[0].inputs).toHaveLength(4)
  expect(r.methods[0].inputs[0].name).toBe('userPostsAddr')
  expect(r.methods[0].inputs[0].type).toBe('std.Address')

  expect(r.methods[0].outputs).toHaveLength(1)
  expect(r.methods[0].outputs[0].name).toBe('')
  expect(r.methods[0].outputs[0].type).toBe('bool')
})
