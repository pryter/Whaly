import { trackError } from "@main/elements/embeds/trackError"
import { getChannel } from "@utils/cache"
import { err, warn } from "@utils/logger"
import { sendSelfDestroyMessage } from "@utils/message"
import type { Client, TextChannel } from "discord.js"
import type { Manager } from "erela.js"

import { config } from "../../../config"

export const registerTrackErrorEvent = (manager: Manager, client: Client) => {
  manager.on("trackError", async (player, track, error) => {
    err(`Track error @ ${error.guildId}: ${error.error}`)
    let retires: number | null | undefined = player.get("retries")
    if (!retires) {
      retires = 0
    }

    if (retires < 3) {
      player.queue.add(track)
      player.play(track)
      player.set("retries", retires + 1)
      warn(`Track retries count: ${retires + 1}`)
      return
    }

    const textChannel = <TextChannel>getChannel(client, player.textChannel)
    await sendSelfDestroyMessage(
      textChannel,
      { embeds: [trackError(track)] },
      config.longLivedSDMLifeSpan
    )
  })

  manager.on("trackStuck", async (player, track, error) => {
    err(`Track stuck @ ${error.guildId}`)
    const textChannel = <TextChannel>getChannel(client, player.textChannel)
    await sendSelfDestroyMessage(
      textChannel,
      { embeds: [trackError(track)] },
      config.longLivedSDMLifeSpan
    )
  })
}
