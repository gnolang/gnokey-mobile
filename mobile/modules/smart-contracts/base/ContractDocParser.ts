import { ContractDoc } from './types'

/**
 * Base interface for contract parsers
 */
export interface ContractDocParser {
  /**
   * Parse the contract doc from a JSON object
   * @param doc - the doc to parse
   * @returns - the parsed contract doc
   */
  parseDoc(doc: any): ContractDoc
}
