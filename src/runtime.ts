import { err, info, log, warn } from "@utils/logger"
import { Client } from "discord.js"
import { createManager } from "@main/manager"
import { registerTrackStartEvent } from "@main/events/manager/trackStart"
import { registerQueueEndEvent } from "@main/events/manager/queueEnd"
import { registerTrackErrorEvent } from "@main/events/manager/trackError"
import { registerPlayerMoveEvent } from "@main/events/manager/playerMove"
import dotenv from "dotenv"
import { registerReadyEvent } from "@main/events/client/readyEvent"
import { registerRawEvent } from "@main/events/client/rawEvent"
import { registerInteractionCreateEvent } from "@main/events/client/interactionCreateEvent"
import { config } from "./config"
import { registerPlayerDestroyEvent } from "@main/events/manager/playerDestroy"
import { registerPlayerDisconnectEvent } from "@main/events/manager/playerDisconnect"
import { registerDebugEvent } from "@main/events/client/debugEvent"
import { registerVoiceStateUpdateEvent } from "@main/events/client/voiceStateUpdateEvent"

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
