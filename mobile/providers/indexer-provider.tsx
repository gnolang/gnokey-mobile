import { createContext, useContext } from 'react'
import { DEFAULT_CHAIN } from './gnonative-provider'

export interface GasPriceResponse {
  low: bigint
  average: bigint
  high: bigint
  denom: string
}

export interface IndexerContextProps {
  getGasPrice: () => Promise<GasPriceResponse>
}

interface IndexerProviderProps {
  children: React.ReactNode
}

const IndexerContext = createContext<IndexerContextProps | null>(null)

const IndexerProvider: React.FC<IndexerProviderProps> = ({ children }) => {
  const config = {
    // @ts-ignore
    remote: DEFAULT_CHAIN.faucetUrl!
  }

  const getGasPrice = async (): Promise<GasPriceResponse> => {
    const response = await fetch(config.remote, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'getGasPrice'
      })
    })

    const text = await response.text()
    // convert number to bigint that is not automatically converted by JSON.parse
    const jsonData = JSON.parse(text, (_, value) => {
      if (typeof value === 'number') {
        return BigInt(value)
      }
      return value
    })

    const data: GasPriceResponse[] = jsonData.result

    for (const item of data) {
      if (item.denom === 'ugnot') {
        console.log('getGasPrice found: ', item)
        return item
      }
    }

    throw new Error('No gas price found')
  }

  const value = {
    getGasPrice
  }

  return <IndexerContext.Provider value={value}>{children}</IndexerContext.Provider>
}

function useIndexerContext() {
  const context = useContext(IndexerContext) as IndexerContextProps

  if (context === undefined) {
    throw new Error('useIndexerContext must be used within a IndexerProvider')
  }
  return context
}

export { IndexerProvider, useIndexerContext }
