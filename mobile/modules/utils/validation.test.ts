import { expect, test } from 'vitest'

import { isEmpty, isInvalidURL } from './validation'

test('is URL invalid', () => {
  expect(isInvalidURL('')).toBe(true)
  expect(isInvalidURL('http://')).toBe(true)
  expect(isInvalidURL('https://')).toBe(true)
  expect(isInvalidURL('https://??')).toBe(true)
})

test('is URL valid', () => {
  expect(isInvalidURL('http://localhost')).toBe(false)
  expect(isInvalidURL('http://localhost:200')).toBe(false)
  expect(isInvalidURL('https://localhost:200')).toBe(false)
})

test('is isEmpty string', () => {
  expect(isEmpty('')).toBe(true)
  expect(isEmpty(' ')).toBe(true)
  expect(isEmpty('  ')).toBe(true)
})

test('is not isEmpty string', () => {
  expect(isEmpty('a')).toBe(false)
  expect(isEmpty(' a ')).toBe(false)
  expect(isEmpty('  a  ')).toBe(false)
})
