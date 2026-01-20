export interface ParsedCommand {
  pkgPath: string
  func: string
  args: string[]
  send: string
  chainId: string
  remote: string
  address: string
}

export function parseCommand(command: string): ParsedCommand | null {
  let pkgPath: string
  let func: string
  let allArgs: string
  let send: string
  let chainId: string
  let remote: string
  let address: string

  if (command.indexOf('gnokey maketx call') === -1) {
    return null
  }

  // Try the "Fast" format
  const commandRegex =
    /gnokey maketx call -pkgpath "([^"]+)" -func "([^"]+)" (.*)-gas-fee \w+ -gas-wanted \w+ -send "([^"]*)" -broadcast -chainid "([^"]+)" -remote "([^"]+)" (\w+)/g
  const commandMatch = commandRegex.exec(command)
  if (commandMatch) {
    pkgPath = commandMatch![1]
    func = commandMatch![2]
    allArgs = commandMatch![3]
    send = commandMatch![4]
    chainId = commandMatch![5]
    remote = commandMatch![6]
    address = commandMatch![7]
  } else {
    // Try the "Full Security" format
    const commandRegex1 =
      /gnokey maketx call -pkgpath "([^"]+)" -func "([^"]+)" (.*)-gas-fee \w+ -gas-wanted \w+ -send "([^"]*)" (\w+) > call.tx\ngnokey sign -tx-path call.tx -chainid "([^"]+)"/g
    const commandRegex2 = /gnokey broadcast -remote "([^"]+)"/g
    const commandMatch1 = commandRegex1.exec(command)
    const commandMatch2 = commandRegex2.exec(command)
    if (commandMatch1 && commandMatch2) {
      pkgPath = commandMatch1![1]
      func = commandMatch1![2]
      allArgs = commandMatch1![3]
      send = commandMatch1![4]
      address = commandMatch1![5]
      remote = commandMatch2![1]
      chainId = commandMatch1![6]
    } else {
      return null
    }
  }

  // Get the args list
  const argsRegex = /-args "([^"]*)" /g
  let args: string[] = []
  let match
  while ((match = argsRegex.exec(allArgs)) !== null) {
    args.push(match[1])
  }

  return { pkgPath, func, args, send, chainId, remote, address }
}
