import type { CommandInteraction } from "discord.js"
import type { Manager } from "erela.js"
import type { Firestore } from "firebase-admin/firestore"

export type Runtime = (
  manager: Manager,
  interaction: CommandInteraction,
  database?: Firestore | null
) => Promise<any>
export interface Command {
  name: string
  data: any
  runtime: Runtime
}
