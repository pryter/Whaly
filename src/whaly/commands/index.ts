import type { Command, Runtime } from "@itypes/command/Command"
import { clearCommand } from "@main/commands/clear"
import { playCommand } from "@main/commands/play"
import { playerCommand } from "@main/commands/player"
import { queueCommand } from "@main/commands/queue"
import { skipCommand } from "@main/commands/skip"

const allCommands: Command[] = [
  playCommand(),
  clearCommand(),
  skipCommand(),
  queueCommand(),
  playerCommand()
]

export const getAllCommandData = (): Command[] => {
  return allCommands.map((i) => i.data)
}

export const buildRuntimeIndex = (): { [name: string]: Runtime } => {
  const map: { [name: string]: any } = {}
  allCommands.forEach((c) => {
    map[c.name] = c.runtime
  })
  return map
}
