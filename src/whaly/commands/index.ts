import { playCommand } from "@main/commands/play"
import { Command, Runtime } from "@itypes/command/Command"
import { clearCommand } from "@main/commands/clear"
import { skipCommand } from "@main/commands/skip"

const allCommands: Command[] = [playCommand(), clearCommand(), skipCommand()]

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
