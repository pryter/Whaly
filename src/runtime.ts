import { info, printLog } from "@utils/logger"
import { Client, IntentsBitField } from "discord.js"
import { createManager } from "@main/manager"
import { registerTrackStartEvent } from "@main/events/trackStart"
import { registerQueueEndEvent } from "@main/events/queueEnd"
import { registerTrackErrorEvent } from "@main/events/trackError"
import { registerPlayerMoveEvent } from "@main/events/playerMove"

import dotenv from "dotenv"
import { buildRuntimeIndex } from "@main/commands"

dotenv.config()
const runtime = () => {
  printLog("client | Starting bot client")

  const client = new Client({
    intents: [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildVoiceStates,
      IntentsBitField.Flags.GuildMessages,
    ],
  })

  const manager = createManager(client)
  registerTrackStartEvent(manager, client)
  registerQueueEndEvent(manager, client)
  registerTrackErrorEvent(manager, client)
  registerPlayerMoveEvent(manager, client)

  const runtimeIndex = buildRuntimeIndex()

  client.on("ready", () => {
    manager.init(process.env.CLIENT_ID)
    info("client | Successfully logged in")
  })

  client.on("raw", (d) => manager.updateVoiceState(d))

  client.on("interactionCreate", (interaction) => {
    if (interaction.isCommand()) {
      const commandName = interaction.commandName
      if (commandName in runtimeIndex) {
        runtimeIndex[commandName](manager, interaction)
      }
    }
  })

  client.login(process.env.TOKEN)
}

runtime()
