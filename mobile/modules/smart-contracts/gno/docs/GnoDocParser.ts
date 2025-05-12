import { ContractDoc, ContractDocParser, MethodDoc } from '../../base'

/**
 * Parser for GnoDoc documents.
 */
export class GnoDocParser implements ContractDocParser {
  parseDoc(gnodocJson: any): ContractDoc {
    const name = gnodocJson.package_path || 'Unknown Gno Package'
    const description = gnodocJson.package_doc || ''

    const methods: MethodDoc[] = gnodocJson.funcs.map((fn: any) => ({
      name: fn.name,
      doc: fn.doc,
      inputs: fn.params.map((p: any) => ({
        name: p.name,
        type: p.type
      })),
      outputs: fn.results.map((r: any) => ({
        name: r.name || '',
        type: r.type
      }))
    }))

    return {
      name,
      description,
      methods
    }
  }
}
