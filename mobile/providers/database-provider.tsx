import * as SQLite from 'expo-sqlite'
import { useEffect, useState } from 'react'
import { Text, View } from 'react-native'

interface Props {
  children: React.ReactNode
}

const db = SQLite.openDatabaseSync('gnokeymobile.db')

export const DatabaseProvider = ({ children }: Props) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        await executeMigrations(db)
        setLoading(false)
      } catch (error) {
        console.error('Error opening database:', error)
        setLoading(false)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  return <>{children}</>
}

const executeMigrations = async (db: SQLite.SQLiteDatabase) => {
  // await db.execAsync(`
  //   CREATE TABLE IF NOT EXISTS migrations (
  //     id INTEGER PRIMARY KEY AUTOINCREMENT,
  //     name TEXT NOT NULL UNIQUE,
  //     executedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  //   );
  // `)
  // await db.execAsync(`
  //   CREATE TABLE IF NOT EXISTS vaults (
  //     id INTEGER PRIMARY KEY AUTOINCREMENT,
  //     name TEXT NOT NULL UNIQUE,
  //     address TEXT NOT NULL UNIQUE,
  //     favorite BOOLEAN DEFAULT FALSE,
  //     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  //   );
  // `)
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS chains (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chainId TEXT NOT NULL,
      chainName TEXT NOT NULL,
      rpcUrl TEXT NOT NULL,
      faucetUrl TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `)
}

export const insertChain = async ({ chainId, chainName, rpcUrl, faucetUrl }: AddChainProp) => {
  const sql = 'INSERT INTO chains (chainId, chainName, rpcUrl, faucetUrl) VALUES (?, ?, ?, ?)'
  return await db.runAsync(sql, chainId, chainName, rpcUrl, faucetUrl)
}

interface AddChainProp {
  chainId: string
  chainName: string
  rpcUrl: string
  faucetUrl: string
}
