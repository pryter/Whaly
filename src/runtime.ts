import { info, printLog } from "@utils/logger"
import { Client, IntentsBitField } from "discord.js"
import { createManager } from "@main/manager"
import { registerTrackStartEvent } from "@main/events/manager/trackStart"
import { registerQueueEndEvent } from "@main/events/manager/queueEnd"
import { registerTrackErrorEvent } from "@main/events/manager/trackError"
import { registerPlayerMoveEvent } from "@main/events/manager/playerMove"
import dotenv from "dotenv"
import { buildRuntimeIndex } from "@main/commands"
import { registerReadyEvent } from "@main/events/client/readyEvent"
import { registerRawEvent } from "@main/events/client/rawEvent"
import { registerInteractionCreateEvent } from "@main/events/client/interactionCreateEvent"
import { config } from "./config"

dotenv.config()

const runtime = () => {
  info("client | Starting bot client")

  const client = new Client({
    intents: config.requiredIntents,
  })

  const manager = createManager(client)

  // Register manager events
  registerTrackStartEvent(manager, client)
  registerQueueEndEvent(manager, client)
  registerTrackErrorEvent(manager, client)
  registerPlayerMoveEvent(manager, client)

  // Register client events
  registerReadyEvent(client, manager)
  registerRawEvent(client, manager)
  registerInteractionCreateEvent(client, manager)

  client.login(process.env.TOKEN)
}

runtime()
