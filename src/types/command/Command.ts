import { CommandInteraction, Interaction } from "discord.js"
import { Manager } from "erela.js"

export type Runtime = (manager: Manager, interaction: CommandInteraction) => Promise<any>
export interface Command {
  name: string
  data: any
  runtime: Runtime
}
