import { registerDebugEvent } from "@main/events/client/debugEvent"
import { registerInteractionCreateEvent } from "@main/events/client/interactionCreateEvent"
import { registerRawEvent } from "@main/events/client/rawEvent"
import { registerReadyEvent } from "@main/events/client/readyEvent"
import { registerVoiceStateUpdateEvent } from "@main/events/client/voiceStateUpdateEvent"
import { registerPlayerDestroyEvent } from "@main/events/manager/playerDestroy"
import { registerPlayerDisconnectEvent } from "@main/events/manager/playerDisconnect"
import { registerPlayerMoveEvent } from "@main/events/manager/playerMove"
import { registerQueueEndEvent } from "@main/events/manager/queueEnd"
import { registerTrackErrorEvent } from "@main/events/manager/trackError"
import { registerTrackStartEvent } from "@main/events/manager/trackStart"
import { createManager } from "@main/manager"
import { info } from "@utils/logger"
import { Client } from "discord.js"
import dotenv from "dotenv"

import { config } from "./config"

dotenv.config()

const runtime = () => {
  info("client | Starting bot client")

  const client = new Client({
    intents: config.requiredIntents
  })

  const manager = createManager(client)

  // Register manager events
  registerTrackStartEvent(manager, client)
  registerQueueEndEvent(manager, client)
  registerTrackErrorEvent(manager, client)
  registerPlayerMoveEvent(manager, client)
  registerPlayerDestroyEvent(manager)
  registerPlayerDisconnectEvent(manager, client)

  // Register client events
  registerReadyEvent(client, manager)
  registerRawEvent(client, manager)
  registerInteractionCreateEvent(client, manager)
  registerVoiceStateUpdateEvent(client, manager)

  registerDebugEvent(client)

  client.login(process.env.TOKEN)
}

runtime()
