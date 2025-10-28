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
import { startRest } from "@main/events/rest/rest"
import { registerScheduledIndexRecordsEvent } from "@main/events/scheduled/indexRecords"
import { createDatabase } from "@main/firebase/init"
import { createManager } from "@main/manager"
import { info } from "@utils/logger"
import { Client } from "discord.js"
import dotenv from "dotenv"
import type { Player } from "erela.js"

import { config } from "./config"

dotenv.config()

const tracksub: Record<string, (player: Player) => void> = {}

const runtime = () => {
  info("client | Starting bot client")

  const client = new Client({
    intents: config.requiredIntents
  })

  const manager = createManager(client)
  const database = createDatabase()

  // Register scheduled events
  registerScheduledIndexRecordsEvent(database, client)

  // Register manager events
  registerTrackStartEvent(manager, client, database, tracksub)
  registerQueueEndEvent(manager, client)
  registerTrackErrorEvent(manager, client)
  registerPlayerMoveEvent(manager, client)
  registerPlayerDestroyEvent(manager)
  registerPlayerDisconnectEvent(manager, client)

  // Register client events
  registerReadyEvent(client, manager)
  registerRawEvent(client, manager)

  registerInteractionCreateEvent(client, manager, database, tracksub)
  registerVoiceStateUpdateEvent(client, manager)

  registerDebugEvent(client)

  startRest(manager, tracksub)
  client.login(process.env.TOKEN)
}

runtime()
