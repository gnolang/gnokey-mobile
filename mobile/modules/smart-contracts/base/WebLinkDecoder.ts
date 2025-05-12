export class WebLinkDecoder {
  url: string
  hostname: string | undefined
  action: string | undefined
  path: string | undefined
  tab: string | undefined
  func: string | undefined
  send: string | undefined

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
    this.func = parsed.func
    this.send = parsed.send
  }

  /**
   * Parse the Gnoweb URL and return an object with the parsed data
   * @param url - The URL to parse, eg: land.gno.gnokey:tosign?/r/gnoland/users/v1$help&func=Register&.send=1000000ugnot
   * @returns An object with the parsed data, eg:
   * {
   *   base: land.gno.gnokey
   *   hostname: land.gno.gnokey
   *   action: tosign
   *   path: /r/gnoland/users/v1
   *   tab: help
   *   func: Register
   *   send: 1000000ugnot
   * }
   */
  parse = (url: string) => {
    if (!url) {
      return {}
    }

    const res = url.match(/^([^:]+):([^?]+)\?([^$]+)\$([^&]+)&[^=]+=(.*?)&\.send=(.*)/)

    if (!res) {
      return {}
    }

    const [base, hostname, action, path, tab, func, send] = res

    return {
      base,
      hostname,
      action,
      path,
      tab,
      func,
      send
    }
  }

  // TODO: remove the hardcode 'gno.land/r/gnoland/users/v1'
  packagePath = () => {
    return 'gno.land/r/berty/social'
  }

  static isValid(url: string) {
    return /^land\.gno\.gnokey.*toexecute\?\/r\/.+/.test(url)
  }
}
