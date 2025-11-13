import * as Linking from 'expo-linking'
import { ValidationError, ValidationResult } from './types'
import { Alert } from 'react-native'

export const validateDeepLink = (parsedURL: Linking.ParsedURL): ValidationResult => {
  const errors: ValidationError[] = []
  const queryParams = parsedURL.queryParams

  // Validate hostname/path
  if (!parsedURL.hostname) {
    errors.push({
      field: 'hostname',
      message: 'Invalid deep link: missing hostname'
    })
  }

  // Valid hostnames for Gnokey Mobile
  const validHostnames = ['tosign', 'tosignin', 'session']
  if (parsedURL.hostname && !validHostnames.includes(parsedURL.hostname)) {
    errors.push({
      field: 'hostname',
      message: `Invalid action: ${parsedURL.hostname}. Valid actions are: ${validHostnames.join(', ')}`
    })
  }

  // Validate based on action type
  switch (parsedURL.hostname) {
    case 'tosign':
      validateSignTransaction(queryParams, errors)
      break
    case 'tosignin':
      validateSignIn(queryParams, errors)
      break
    case 'session':
      validateSession(queryParams, errors)
      break
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

const validateSignTransaction = (queryParams: any, errors: ValidationError[]) => {
  // Required fields for signing transactions
  if (!queryParams?.tx) {
    errors.push({
      field: 'tx',
      message: 'Transaction data is required'
    })
  } else {
    // Validate transaction JSON structure
    try {
      const tx = JSON.parse(decodeURIComponent(queryParams.tx as string))

      if (!tx.msg || !Array.isArray(tx.msg)) {
        errors.push({
          field: 'tx.msg',
          message: 'Transaction must contain a valid msg array'
        })
      }

      if (!tx.fee) {
        errors.push({
          field: 'tx.fee',
          message: 'Transaction must contain fee information'
        })
      }
    } catch {
      errors.push({
        field: 'tx',
        message: 'Invalid transaction JSON format'
      })
    }
  }

  if (!queryParams?.address || queryParams.address === '') {
    errors.push({
      field: 'address',
      message: 'Bech32 address is required'
    })
  } else {
    validateBech32Address(queryParams.address as string, errors)
  }

  if (!queryParams?.remote) {
    errors.push({
      field: 'remote',
      message: 'Remote URL is required'
    })
  } else {
    validateRemoteURL(queryParams.remote as string, errors)
  }

  if (!queryParams?.chain_id) {
    errors.push({
      field: 'chain_id',
      message: 'Chain ID is required'
    })
  }

  if (!queryParams?.callback) {
    errors.push({
      field: 'callback',
      message: 'Callback URL is required'
    })
  } else {
    validateCallbackURL(queryParams.callback as string, errors)
  }
}

const validateSignIn = (queryParams: any, errors: ValidationError[]) => {
  if (!queryParams?.client_name) {
    errors.push({
      field: 'client_name',
      message: 'Client name is required for sign in'
    })
  }

  if (!queryParams?.callback) {
    errors.push({
      field: 'callback',
      message: 'Callback URL is required for sign in'
    })
  } else {
    validateCallbackURL(queryParams.callback as string, errors)
  }
}

const validateSession = (queryParams: any, errors: ValidationError[]) => {
  if (!queryParams?.session) {
    errors.push({
      field: 'session',
      message: 'Session ID is required'
    })
  }

  if (!queryParams?.address) {
    errors.push({
      field: 'address',
      message: 'Bech32 address is required for session'
    })
  } else {
    validateBech32Address(queryParams.address as string, errors)
  }
}

const validateBech32Address = (address: string, errors: ValidationError[]) => {
  const trimmedAddress = address.trim()

  // Basic bech32 format validation (starts with g1 for gno addresses)
  if (!trimmedAddress.startsWith('g1')) {
    errors.push({
      field: 'address',
      message: 'Invalid bech32 address format: must start with "g1"'
    })
  }

  // Check length (typical bech32 addresses are around 42 characters)
  if (trimmedAddress.length < 38 || trimmedAddress.length > 90) {
    errors.push({
      field: 'address',
      message: 'Invalid bech32 address length'
    })
  }

  // Check for invalid characters (bech32 uses specific charset)
  const bech32Regex = /^[a-z0-9]+$/
  const addressBody = trimmedAddress.slice(2) // Remove 'g1' prefix
  if (!bech32Regex.test(addressBody)) {
    errors.push({
      field: 'address',
      message: 'Invalid bech32 address: contains invalid characters'
    })
  }
}

const validateRemoteURL = (remote: string, errors: ValidationError[]) => {
  try {
    const allowedProtocols = ['http:', 'https:', 'tcp:']
    const url = new URL(decodeURIComponent(remote))
    if (!allowedProtocols.includes(url.protocol)) {
      errors.push({
        field: 'remote',
        message: `Remote URL must use one of the following protocols: ${allowedProtocols.join(', ')}`
      })
    }
  } catch {
    errors.push({
      field: 'remote',
      message: 'Invalid remote URL format'
    })
  }
}

const validateCallbackURL = (callback: string, errors: ValidationError[]) => {
  try {
    const decodedCallback = decodeURIComponent(callback)
    // Basic URL validation
    if (!decodedCallback.includes('://')) {
      errors.push({
        field: 'callback',
        message: 'Invalid callback URL format'
      })
    }
  } catch {
    errors.push({
      field: 'callback',
      message: 'Invalid callback URL encoding'
    })
  }
}

export const showValidationErrors = (errors: ValidationError[]) => {
  const errorMessage = errors.map((err) => `• ${err.message}`).join('\n')

  Alert.alert('Invalid Deep Link', `The link you opened is invalid:\n\n${errorMessage}`, [
    {
      text: 'OK',
      style: 'default'
    }
  ])
}
