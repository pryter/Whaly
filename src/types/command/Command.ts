import type { CommandInteraction } from "discord.js"
import type { Manager } from "erela.js"

export type Runtime = (
  manager: Manager,
  interaction: CommandInteraction
) => Promise<any>
export interface Command {
  name: string
  data: any
  runtime: Runtime
}
