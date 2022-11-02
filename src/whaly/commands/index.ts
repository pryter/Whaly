import { playCommand } from "@main/commands/play"
import { Command, Runtime } from "@itypes/command/Command"

const allCommands: Command[] = [playCommand()]

export const getAllCommandData = (): Command[] => {
  return allCommands.map((i) => i.data)
}

export const buildRuntimeIndex = (): { [name: string]: Runtime } => {
  let map: { [name: string]: any } = {}
  allCommands.forEach((c) => {
    map[c.name] = c.runtime
  })
  return map
}
