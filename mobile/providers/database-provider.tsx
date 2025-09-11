import * as SQLite from 'expo-sqlite'
import { createContext, useContext, useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { NetworkMetainfo, Vault } from '@/types'
import defaultChains from '@/assets/chains.json'
import { KeyInfo } from '@gnolang/gnonative'

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
        await initDatabase()
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
      currentChain: chains.find((chain) => chain.active) || undefined
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
      faucetPortalUrl TEXT,
      active BOOLEAN NOT NULL DEFAULT 0,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `)
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS app_vaults (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      keyName TEXT NOT NULL,
      description TEXT,
      appChainId INTEGER,
      bookmarked BOOLEAN DEFAULT 0,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(keyName)
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
      chain.chainId as string
    )
    console.log('Checking chain:', chain.chainId, 'Result:', result)
    if (result && result.total > 0) {
      continue
    }
    // the first chain in the list is the default chain
    await insertChain({
      chainId: chain.chainId as string,
      chainName: chain.chainName,
      rpcUrl: chain.rpcUrl,
      faucetUrl: chain.faucetUrl || '',
      faucetPortalUrl: chain.faucetPortalUrl || '',
      active: i === 0 ? true : false
    })
  }
}

const isDataLoaded = async (db: SQLite.SQLiteDatabase) => {
  const result = await db.getFirstAsync<{ total: number }>('SELECT COUNT(*) as total FROM app_chains')
  return result && result.total > 0
}

export const initDatabase = async () => {
  await executeMigrations(db)
  const initialized = await isDataLoaded(db)
  if (!initialized) {
    await initialDataLoad(db)
  }
  console.log(initialized ? 'Database already initialized' : 'Database initialized with default chains')
}

export const insertChain = async ({ chainId, chainName, rpcUrl, faucetUrl, faucetPortalUrl, active }: AddChainProp) => {
  const sql = 'INSERT INTO app_chains (chainId, chainName, rpcUrl, faucetUrl, faucetPortalUrl, active) VALUES (?, ?, ?, ?, ?, ?)'
  return await db.runAsync(sql, chainId, chainName, rpcUrl, faucetUrl || '', faucetPortalUrl || '', active)
}

export const deleteChain = async (id: number) => {
  const sql = 'DELETE FROM app_chains WHERE id = ?'
  return await db.runAsync(sql, id)
}

export const listChains = async (): Promise<NetworkMetainfo[]> => {
  return await db.getAllAsync<NetworkMetainfo>('SELECT * FROM app_chains ORDER BY createdAt DESC')
}

export const insertVault = async (keyInfo: KeyInfo, description?: string, appChainId?: number) => {
  const sql = 'INSERT INTO app_vaults (keyName, description, appChainId) VALUES (?, ?, ?)'
  return await db.runAsync(sql, keyInfo.name, description || '', appChainId || null)
}

export const getChainById = async (id: number): Promise<NetworkMetainfo | null> => {
  const result = await db.getFirstAsync<NetworkMetainfo>('SELECT * FROM app_chains WHERE id = ?', id)
  return result || null
}

export const deleteVault = async (id: string) => {
  const sql = 'DELETE FROM app_vaults WHERE id = ?'
  return await db.runAsync(sql, id)
}

export const listVaults = async (): Promise<Vault[]> => {
  return await db.getAllAsync<Vault>('SELECT * FROM app_vaults ORDER BY createdAt DESC')
}

export const listVaultsByChain = async (chainId?: number): Promise<Vault[]> => {
  if (!chainId) {
    return await db.getAllAsync<Vault>("SELECT * FROM app_vaults WHERE appChainId IS NULL OR appChainId = ''")
  }
  const data = await db.getAllAsync<any>(
    `SELECT 
      app_vaults.*,
      app_chains.id as chainId,
      app_chains.chainName as chainName
    FROM app_vaults INNER JOIN app_chains ON app_vaults.appChainId = app_chains.id WHERE appChainId = ?`,
    chainId
  )
  return data.map((vault) => ({
    ...vault,
    chain: {
      id: vault.chainId,
      chainName: vault.chainName
    }
  }))
}

export const updateVault = async (vault: Vault, keyName: string, description?: string) => {
  const sql = 'UPDATE app_vaults SET keyName = ?, description = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?'
  return await db.runAsync(sql, keyName, description || '', vault.id)
}

export const updateActiveChain = async (id?: number) => {
  await db.runAsync('UPDATE app_chains SET active = 0')
  if (!id) {
    console.warn('No chain ID provided to updateActiveChain, skipping update')
    return
  }
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

type AddChainProp = Omit<NetworkMetainfo, 'id' | 'createdAt'>

interface ListChainsResult {
  chains: NetworkMetainfo[]
  currentChain?: NetworkMetainfo
}

interface DatabaseContextProps {
  listChains: () => Promise<ListChainsResult>
}
