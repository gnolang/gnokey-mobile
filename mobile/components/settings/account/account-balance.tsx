import React, { useEffect, useState } from 'react'
import { KeyInfo, useGnoNativeContext } from '@gnolang/gnonative'
import * as Application from 'expo-application'
import { Text } from '@berty/gnonative-ui'

interface Props {
  activeAccount: KeyInfo | undefined
}

export function AccountBalance({ activeAccount }: Props) {
  const [address, setAddress] = useState<string | undefined>(undefined)
  const [balance, setBalance] = useState<string | undefined>(undefined)

  const { gnonative } = useGnoNativeContext()

  useEffect(() => {
    ;(async () => {
      if (!activeAccount) {
        return
      }

      gnonative.addressToBech32(activeAccount.address).then((address) => {
        setAddress(address)
      })
      gnonative
        .queryAccount(activeAccount.address)
        .then((balance) => {
          setBalance(balance.accountInfo?.coins.reduce((acc, coin) => acc + coin.amount.toString() + coin.denom + ' ', ''))
        })
        .catch((error) => {
          console.log('Error on fetching balance', JSON.stringify(error))
          setBalance('Error on fetching balance. Please check the logs.')
        })
    })()
  }, [activeAccount, gnonative])

  if (!activeAccount) {
    return (
      <>
        <Text.H3>Active Account:</Text.H3>
        <Text.Body style={{ fontSize: 14 }}>No active account.</Text.Body>
      </>
    )
  }

  return (
    <>
      <Text.Body>Version:</Text.Body>
      <Text.Body>{Application.nativeApplicationVersion}</Text.Body>
      <Text.Body>Active Account:</Text.Body>
      <Text.Body>{activeAccount.name}</Text.Body>
      <Text.Body>Address:</Text.Body>
      <Text.Body>{address}</Text.Body>
      <Text.Body>Balance:</Text.Body>
      <Text.Body>{balance}</Text.Body>
    </>
  )
}
