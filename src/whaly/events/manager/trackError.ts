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
    let retries: number | null | undefined = player.get("retries")

    if (typeof retries !== "number") {
      retries = 0
    }

    if (retries < config.maxRetries) {
      player.queue.unshift(track)
      await player.play(track)
      player.set("retries", retries + 1)
      player.set("retriedTrack", track.title)

      warn(`Track retries count: ${retries + 1}`)
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
