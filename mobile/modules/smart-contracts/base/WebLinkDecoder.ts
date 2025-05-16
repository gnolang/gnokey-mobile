export class WebLinkDecoder {
  url: string

  hostname: string | undefined
  action: string | undefined
  path: string | undefined
  tab: string | undefined
  params: string | undefined
  func: string | undefined

  // TODO: make generic
  chainType: 'gno' | undefined

  constructor(url: string) {
    this.url = url
    // pase the url
    const parsed = this.parse(url)
    this.chainType = 'gno'
    this.hostname = parsed.hostname
    this.action = parsed.action
    this.path = parsed.path
    this.tab = parsed.tab
    this.params = parsed.params
    this.func = parsed.func
  }

  /**
   * Parse the Gnoweb URL and return an object with the parsed data
   * @param url - The URL to parse, eg: land.gno.gnokey:tosign?/r/gnoland/users/v1$help&func=Register&.send=1000000ugnot
   * @returns An object with the parsed data, eg:
   * {
   *   base: land.gno.gnokey
   *   action: tosign
   *   path: /r/gnoland/users/v1
   *   tab: help
   *   params: func=Register&.send=1000000ugnot
   * }
   */
  parse = (url: string) => {
    if (!url) {
      return {}
    }

    const res = url.match(/([^:]+):([^?]+)\?([^$]+)\$([^&]+)&(.+)/)

    if (!res) {
      return {}
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, hostname, action, path, tab, params] = res

    const func = params.match(/func=([^&]+)/)?.[1]

    return {
      hostname,
      action,
      path,
      tab,
      params,
      func
    }
  }

  /** returns all parameters values, ordered, excepted by func */
  funcArg = () => {
    if (!this.params) {
      return undefined
    }

    // remove func and its value:
    const args = this.params.replace(/func=[^&]+&/, '').split('&')
    const values = args.map((arg) => {
      const [, value] = arg.split('=')
      return value
    })
    // TODO: use the original order of the args
    return values.reverse()
  }

  // TODO: remove the hardcode 'gno.land/r/gnoland/users/v1'
  packagePath = () => {
    return 'gno.land/r/berty/social'
  }

  static isValid(url: string) {
    return /^land\.gno\.gnokey.*toexecute\?\/r\/.+/.test(url)
  }
}
