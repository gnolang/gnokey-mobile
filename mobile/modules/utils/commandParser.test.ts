import { describe, expect, it } from 'vitest'
import { parseCommand } from './commandParser'

describe('validateDeepLink', () => {
  describe('Board2 commands', () => {
    it('should validate a correct boards2 CreateBoard deep link', () => {
      const command =
        'gnokey maketx call -pkgpath "gno.land/r/gnoland/boards2/v1" -func "CreateBoard" -args "testboard" -args "true" -gas-fee 1000000ugnot -gas-wanted 5000000 -send "" -broadcast -chainid "staging" -remote "https://rpc.gno.land:443" jefft000'

      const parsed = parseCommand(command)
      expect(parsed).not.toBeNull()
      expect(parsed).toEqual({
        pkgPath: 'gno.land/r/gnoland/boards2/v1',
        func: 'CreateBoard',
        args: ['testboard', 'true'],
        send: '',
        chainId: 'staging',
        remote: 'https://rpc.gno.land:443',
        address: 'jefft000'
      })
    })
  })

  describe('GnoLand commands', () => {
    it('should validate a correct gno.land SendTokens deep link', () => {
      const command = `
gnokey query -remote "https://api.gno.berty.io:443" auth/accounts/iuri123
gnokey maketx call -pkgpath "gno.land/r/gnoland/users/v1" -func "NewSetPausedExecutor" -args "" -gas-fee 1000000ugnot -gas-wanted 5000000 -send "" iuri123 > call.tx
gnokey sign -tx-path call.tx -chainid "dev" -account-number ACCOUNTNUMBER -account-sequence SEQUENCENUMBER iuri123
gnokey broadcast -remote "https://api.gno.berty.io:443" call.tx
`

      const parsed = parseCommand(command)
      expect(parsed).not.toBeNull()
      expect(parsed).toEqual({
        pkgPath: 'gno.land/r/gnoland/users/v1',
        func: 'NewSetPausedExecutor',
        args: [''],
        send: '',
        chainId: 'dev',
        remote: 'https://api.gno.berty.io:443',
        address: 'iuri123'
      })
    })
  })

  describe('Invalid commands', () => {
    it('should return null for an invalid command', () => {
      const command = 'gnokey invalid command format'

      const parsed = parseCommand(command)
      expect(parsed).toBeNull()
    })
  })
})
