import * as Linking from 'expo-linking'
import { describe, expect, it, vi } from 'vitest'
import { validateDeepLink } from '../validator'

// Mock React Native modules
vi.mock('react-native', () => ({
  Alert: {
    alert: vi.fn()
  },
  Platform: {
    OS: 'ios'
  }
}))

const VALID_TRANSACTION_ENCODED = encodeURIComponent(
  JSON.stringify({
    msg: [
      {
        '@type': '/vm.m_call',
        caller: 'g19h0el2p7z8thtqy4rze0n6en94xux9fazf0rp3',
        send: '',
        pkg_path: 'gno.land/r/berty/social',
        func: 'PostMessage',
        args: ['Hello']
      }
    ],
    fee: {
      gas_wanted: '10000000',
      gas_fee: '1000000ugnot'
    },
    signatures: null,
    memo: ''
  })
)

describe('validateDeepLink', () => {
  describe('tosign action', () => {
    it('should validate a correct sign transaction deep link', () => {
      const parsedURL: Linking.ParsedURL = {
        hostname: 'tosign',
        path: null,
        queryParams: {
          tx: VALID_TRANSACTION_ENCODED,
          address: 'g19h0el2p7z8thtqy4rze0n6en94xux9fazf0rp3',
          remote: 'https://api.gno.berty.io:443',
          chain_id: 'dev',
          client_name: 'dSocial',
          reason: 'Post a message',
          callback: 'tech.berty.dsocial://post'
        },
        scheme: 'land.gno.gnokey'
      }

      const result = validateDeepLink(parsedURL)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should fail when tx is missing', () => {
      const parsedURL: Linking.ParsedURL = {
        hostname: 'tosign',
        path: null,
        queryParams: {
          address: 'g19h0el2p7z8thtqy4rze0n6en94xux9fazf0rp3',
          remote: 'https://api.gno.berty.io:443',
          chain_id: 'dev',
          callback: 'tech.berty.dsocial://post'
        },
        scheme: 'land.gno.gnokey'
      }

      const result = validateDeepLink(parsedURL)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContainEqual({
        field: 'tx',
        message: 'Transaction data is required'
      })
    })

    it('should fail when tx has invalid JSON', () => {
      const parsedURL: Linking.ParsedURL = {
        hostname: 'tosign',
        path: null,
        queryParams: {
          tx: 'invalid-json',
          address: 'g19h0el2p7z8thtqy4rze0n6en94xux9fazf0rp3',
          remote: 'https://api.gno.berty.io:443',
          chain_id: 'dev',
          callback: 'tech.berty.dsocial://post'
        },
        scheme: 'land.gno.gnokey'
      }

      const result = validateDeepLink(parsedURL)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContainEqual({
        field: 'tx',
        message: 'Invalid transaction JSON format'
      })
    })

    it('should fail when tx has no address', () => {
      const parsedURL: Linking.ParsedURL = {
        hostname: 'tosign',
        path: null,
        queryParams: {
          tx: encodeURIComponent(
            JSON.stringify({
              msg: [
                {
                  '@type': '/vm.m_call',
                  caller: 'g19h0el2p7z8thtqy4rze0n6en94xux9fazf0rp3',
                  send: '',
                  pkg_path: 'gno.land/r/berty/social',
                  func: 'PostMessage',
                  args: ['Hello']
                }
              ],
              fee: {
                gas_wanted: '10000000',
                gas_fee: '1000000ugnot'
              },
              signatures: null,
              memo: ''
            })
          ),
          address: '',
          remote: 'https://api.gno.berty.io:443',
          chain_id: 'dev',
          client_name: 'dSocial',
          reason: 'Post a message',
          callback: 'tech.berty.dsocial://post'
        },
        scheme: 'land.gno.gnokey'
      }

      const result = validateDeepLink(parsedURL)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContainEqual({
        field: 'address',
        message: 'Bech32 address is required'
      })
    })

    it('should fail when address is missing', () => {
      const parsedURL: Linking.ParsedURL = {
        hostname: 'tosign',
        path: null,
        queryParams: {
          tx: encodeURIComponent(
            JSON.stringify({
              msg: [{}],
              fee: { gas_wanted: '10000000', gas_fee: '1000000ugnot' }
            })
          ),
          remote: 'https://api.gno.berty.io:443',
          chain_id: 'dev',
          callback: 'tech.berty.dsocial://post'
        },
        scheme: 'land.gno.gnokey'
      }

      const result = validateDeepLink(parsedURL)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContainEqual({
        field: 'address',
        message: 'Bech32 address is required'
      })
    })

    it('should fail when address format is invalid', () => {
      const parsedURL: Linking.ParsedURL = {
        hostname: 'tosign',
        path: null,
        queryParams: {
          tx: encodeURIComponent(
            JSON.stringify({
              msg: [{}],
              fee: { gas_wanted: '10000000', gas_fee: '1000000ugnot' }
            })
          ),
          address: 'invalid-address',
          remote: 'https://api.gno.berty.io:443',
          chain_id: 'dev',
          callback: 'tech.berty.dsocial://post'
        },
        scheme: 'land.gno.gnokey'
      }

      const result = validateDeepLink(parsedURL)

      expect(result.isValid).toBe(false)
      expect(result.errors.some((e) => e.field === 'address')).toBe(true)
    })

    it('should fail when remote URL is missing', () => {
      const parsedURL: Linking.ParsedURL = {
        hostname: 'tosign',
        path: null,
        queryParams: {
          tx: encodeURIComponent(
            JSON.stringify({
              msg: [{}],
              fee: { gas_wanted: '10000000', gas_fee: '1000000ugnot' }
            })
          ),
          address: 'g19h0el2p7z8thtqy4rze0n6en94xux9fazf0rp3',
          chain_id: 'dev',
          callback: 'tech.berty.dsocial://post'
        },
        scheme: 'land.gno.gnokey'
      }

      const result = validateDeepLink(parsedURL)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContainEqual({
        field: 'remote',
        message: 'Remote URL is required'
      })
    })

    it('should fail when chain_id is missing', () => {
      const parsedURL: Linking.ParsedURL = {
        hostname: 'tosign',
        path: null,
        queryParams: {
          tx: encodeURIComponent(
            JSON.stringify({
              msg: [{}],
              fee: { gas_wanted: '10000000', gas_fee: '1000000ugnot' }
            })
          ),
          address: 'g19h0el2p7z8thtqy4rze0n6en94xux9fazf0rp3',
          remote: 'https://api.gno.berty.io:443',
          callback: 'tech.berty.dsocial://post'
        },
        scheme: 'land.gno.gnokey'
      }

      const result = validateDeepLink(parsedURL)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContainEqual({
        field: 'chain_id',
        message: 'Chain ID is required'
      })
    })

    it('should fail when callback is missing', () => {
      const parsedURL: Linking.ParsedURL = {
        hostname: 'tosign',
        path: null,
        queryParams: {
          tx: encodeURIComponent(
            JSON.stringify({
              msg: [{}],
              fee: { gas_wanted: '10000000', gas_fee: '1000000ugnot' }
            })
          ),
          address: 'g19h0el2p7z8thtqy4rze0n6en94xux9fazf0rp3',
          remote: 'https://api.gno.berty.io:443',
          chain_id: 'dev'
        },
        scheme: 'land.gno.gnokey'
      }

      const result = validateDeepLink(parsedURL)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContainEqual({
        field: 'callback',
        message: 'Callback URL is required'
      })
    })
  })

  describe('tosignin action', () => {
    it('should validate a correct sign-in deep link', () => {
      const parsedURL: Linking.ParsedURL = {
        hostname: 'tosignin',
        path: null,
        queryParams: {
          client_name: 'dSocial',
          callback: 'tech.berty.dsocial://signin-callback'
        },
        scheme: 'land.gno.gnokey'
      }

      const result = validateDeepLink(parsedURL)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should fail when client_name is missing', () => {
      const parsedURL: Linking.ParsedURL = {
        hostname: 'tosignin',
        path: null,
        queryParams: {
          callback: 'tech.berty.dsocial://signin-callback'
        },
        scheme: 'land.gno.gnokey'
      }

      const result = validateDeepLink(parsedURL)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContainEqual({
        field: 'client_name',
        message: 'Client name is required for sign in'
      })
    })

    it('should fail when callback is missing', () => {
      const parsedURL: Linking.ParsedURL = {
        hostname: 'tosignin',
        path: null,
        queryParams: {
          client_name: 'dSocial'
        },
        scheme: 'land.gno.gnokey'
      }

      const result = validateDeepLink(parsedURL)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContainEqual({
        field: 'callback',
        message: 'Callback URL is required for sign in'
      })
    })
  })

  describe('session action', () => {
    it('should validate a correct session deep link', () => {
      const parsedURL: Linking.ParsedURL = {
        hostname: 'session',
        path: null,
        queryParams: {
          session: 'abc123xyz',
          address: 'g19h0el2p7z8thtqy4rze0n6en94xux9fazf0rp3'
        },
        scheme: 'land.gno.gnokey'
      }

      const result = validateDeepLink(parsedURL)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should fail when session is missing', () => {
      const parsedURL: Linking.ParsedURL = {
        hostname: 'session',
        path: null,
        queryParams: {
          address: 'g19h0el2p7z8thtqy4rze0n6en94xux9fazf0rp3'
        },
        scheme: 'land.gno.gnokey'
      }

      const result = validateDeepLink(parsedURL)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContainEqual({
        field: 'session',
        message: 'Session ID is required'
      })
    })
  })

  describe('invalid hostname', () => {
    it('should fail with invalid action hostname', () => {
      const parsedURL: Linking.ParsedURL = {
        hostname: 'invalid-action',
        path: null,
        queryParams: {},
        scheme: 'land.gno.gnokey'
      }

      const result = validateDeepLink(parsedURL)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContainEqual({
        field: 'hostname',
        message: 'Invalid action: invalid-action. Valid actions are: tosign, tosignin, session'
      })
    })

    it('should fail when hostname is missing', () => {
      const parsedURL: Linking.ParsedURL = {
        hostname: null,
        path: null,
        queryParams: {},
        scheme: 'land.gno.gnokey'
      }

      const result = validateDeepLink(parsedURL)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContainEqual({
        field: 'hostname',
        message: 'Invalid deep link: missing hostname'
      })
    })
  })

  describe('bech32 address validation', () => {
    it('should accept valid bech32 addresses starting with g1', () => {
      const parsedURL: Linking.ParsedURL = {
        hostname: 'session',
        path: null,
        queryParams: {
          session: 'test',
          address: 'g19h0el2p7z8thtqy4rze0n6en94xux9fazf0rp3'
        },
        scheme: 'land.gno.gnokey'
      }

      const result = validateDeepLink(parsedURL)

      expect(result.isValid).toBe(true)
    })

    it('should fail for addresses not starting with g1', () => {
      const parsedURL: Linking.ParsedURL = {
        hostname: 'session',
        path: null,
        queryParams: {
          session: 'test',
          address: 'cosmos1abc123xyz'
        },
        scheme: 'land.gno.gnokey'
      }

      const result = validateDeepLink(parsedURL)

      expect(result.isValid).toBe(false)
      expect(result.errors.some((e) => e.message.includes('must start with "g1"'))).toBe(true)
    })

    it('should fail for addresses that are too short', () => {
      const parsedURL: Linking.ParsedURL = {
        hostname: 'session',
        path: null,
        queryParams: {
          session: 'test',
          address: 'g1abc'
        },
        scheme: 'land.gno.gnokey'
      }

      const result = validateDeepLink(parsedURL)

      expect(result.isValid).toBe(false)
      expect(result.errors.some((e) => e.message.includes('Invalid bech32 address length'))).toBe(true)
    })

    it('should succeed when remote is tcp', () => {
      const parsedURL: Linking.ParsedURL = {
        hostname: 'tosign',
        path: null,
        queryParams: {
          tx: VALID_TRANSACTION_ENCODED,
          address: 'g19h0el2p7z8thtqy4rze0n6en94xux9fazf0rp3',
          remote: 'tcp://127.0.0.1:26657',
          chain_id: 'test-chain',
          callback: 'https://valid.callback.url'
        },
        scheme: 'land.gno.gnokey'
      }

      const result = validateDeepLink(parsedURL)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should fail when remote is not https, http or tcp', () => {
      const parsedURL: Linking.ParsedURL = {
        hostname: 'tosign',
        path: null,
        queryParams: {
          tx: VALID_TRANSACTION_ENCODED,
          address: 'g19h0el2p7z8thtqy4rze0n6en94xux9fazf0rp3',
          remote: 'ftp://invalid.url',
          chain_id: 'test-chain',
          callback: 'https://valid.callback.url'
        },
        scheme: 'land.gno.gnokey'
      }

      const result = validateDeepLink(parsedURL)

      expect(result.isValid).toBe(false)
      expect(result.errors.some((e) => e.message.includes('must use one of the following protocols'))).toBe(true)
    })

    it('should fail when remote URL is malformed', () => {
      const parsedURL: Linking.ParsedURL = {
        hostname: 'tosign',
        path: null,
        queryParams: {
          tx: VALID_TRANSACTION_ENCODED,
          address: 'g19h0el2p7z8thtqy4rze0n6en94xux9fazf0rp3',
          remote: 'ht!tp://malformed-url',
          chain_id: 'test-chain',
          callback: 'https://valid.callback.url'
        },
        scheme: 'land.gno.gnokey'
      }

      const result = validateDeepLink(parsedURL)

      expect(result.isValid).toBe(false)
      expect(result.errors.some((e) => e.message.includes('Invalid remote URL format'))).toBe(true)
    })
  })
})
