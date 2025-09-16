import { KeyInfo } from '@gnolang/gnonative'

type PostInterface = {
  user: User
  post: string
  date: string
  id: string
  n_replies: number
  n_gnods: number
  n_replies_all: number
  parent_id: number
}
export type ParentPost = PostInterface

export type Post = {
  repost_parent?: ParentPost
} & PostInterface

export interface User {
  address: string
  name: string
  image?: string
  followers?: number
  url?: string
  bio?: string
}

export interface Following {
  address: string
  started_following_at: string
  user?: User
}

export interface GetJsonFollowersResult {
  followers: Following[]
  n_followers: number
}
export interface GetJsonFollowingResult {
  following: Following[]
  n_following: number
}

export type NetworkMetainfo = {
  id: number
  chainId: string
  chainName: string
  rpcUrl: string
  faucetUrl?: string
  faucetPortalUrl?: string
  active: boolean
  createdAt?: string
}

export type Vault = {
  id: number
  keyName: string
  description?: string
  bookmarked?: boolean
  // chainIds: string // This is a JSON stringified array of chain IDs
  // chains?: string[]
  chain: NetworkMetainfo | null
  /**
   * SQLite date format is 'YYYY-MM-DD HH:mm:ss'
   */
  createdAt?: string
  /**
   * SQLite date format is 'YYYY-MM-DD HH:mm:ss'
   */
  updatedAt?: string
  /**
   * KeyInfo is a type from GnoNative that contains information about the key
   */
  keyInfo: KeyInfo
  /**
   * Vault balance, loaded from the blockchain kept in memory
   */
  balance?: bigint
  /**
   * Bech32 address of the vault, stored in database
   */
  address: string
}
