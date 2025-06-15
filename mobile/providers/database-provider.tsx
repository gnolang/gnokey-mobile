import * as SQLite from 'expo-sqlite'
import { createContext, useContext, useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { NetworkMetainfo } from '@/types'
import defaultChains from '@/assets/chains.json'

interface Props {
  children: React.ReactNode
}

const db = SQLite.openDatabaseSync('gnokeymobile.db')

const DatabaseContext = createContext<DatabaseContextProps | null>(null)

export const DatabaseProvider = ({ children }: Props) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        await executeMigrations(db)
        const initialized = await isDataLoaded(db)
        if (initialized) {
          console.log('Database already initialized')
        } else {
          await initialDataLoad(db)
        }
        setLoading(false)
      } catch (error) {
        console.error('Error opening database:', error)
        setLoading(false)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const listChains = async (): Promise<ListChainsResult> => {
    const chains = await db.getAllAsync<NetworkMetainfo>('SELECT * FROM app_chains ORDER BY createdAt DESC')
    return {
      chains,
      currentChain: chains.find((chain) => chain.active) || chains[0] // Fallback to the first chain if no active chain is found
    }
  }

  if (loading) {
    return (
      <View>
        <Text>Loading Database...</Text>
      </View>
    )
  }

  if (!db) {
    console.error('Failed to open database')
    return null
  }

  return <DatabaseContext.Provider value={{ listChains }}>{children}</DatabaseContext.Provider>
}

export function useDatabaseContext() {
  const context = useContext(DatabaseContext) as DatabaseContextProps
  if (!context) {
    throw new Error('useDatabaseContext must be used within a DatabaseProvider')
  }
  return context
}

const executeMigrations = async (db: SQLite.SQLiteDatabase) => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS app_chains (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chainType TEXT NOT NULL DEFAULT 'gno',
      chainId TEXT NOT NULL,
      chainName TEXT NOT NULL,
      rpcUrl TEXT NOT NULL,
      faucetUrl TEXT,
      active BOOLEAN NOT NULL DEFAULT 0,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `)
}

/**
 * Load initial data from chains.json into the database
 * @param db SQLite database instance
 */
const initialDataLoad = async (db: SQLite.SQLiteDatabase) => {
  // Load initial chain data into the database
  for (let i = 0; i < defaultChains.length; i++) {
    const chain = defaultChains[i]
    const result = await db.getFirstAsync<{ total: number }>(
      'SELECT COUNT(*) as total FROM app_chains WHERE chainId = ?',
      chain.chainId
    )
    console.log('Checking chain:', chain.chainId, 'Result:', result)
    if (result && result.total > 0) {
      continue
    }
    // the first chain in the list is the default chain
    await insertChain({
      chainId: chain.chainId,
      chainName: chain.chainName,
      rpcUrl: chain.rpcUrl,
      faucetUrl: chain.faucetUrl || '',
      active: i === 0 ? true : false
    })
  }
}

const isDataLoaded = async (db: SQLite.SQLiteDatabase) => {
  const result = await db.getFirstAsync<{ total: number }>('SELECT COUNT(*) as total FROM app_chains')
  return result && result.total > 0
}

export const insertChain = async ({ chainId, chainName, rpcUrl, faucetUrl, active }: AddChainProp) => {
  const sql = 'INSERT INTO app_chains (chainId, chainName, rpcUrl, faucetUrl, active) VALUES (?, ?, ?, ?, ?)'
  return await db.runAsync(sql, chainId, chainName, rpcUrl, faucetUrl, active)
}

export const updateActiveChain = async (id: string) => {
  await db.runAsync('UPDATE app_chains SET active = 0')
  return await db.runAsync('UPDATE app_chains SET active = 1 WHERE id = ?', id)
}

export const nukeDatabase = async () => {
  // Only drop tables with the app_ prefix for safety
  const tables = await db.getAllAsync<{ name: string }>(
    `SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'app_%';`
  )
  for (const { name } of tables) {
    await db.execAsync(`DROP TABLE IF EXISTS ${name}`)
  }
  console.log('All tables dropped successfully')
}

interface AddChainProp {
  chainId: string
  chainName: string
  rpcUrl: string
  faucetUrl: string
  active: boolean
}

interface ListChainsResult {
  chains: NetworkMetainfo[]
  currentChain: NetworkMetainfo
}

interface DatabaseContextProps {
  listChains: () => Promise<ListChainsResult>
}
