import { disconnectEmbed } from "@main/elements/embeds/discconect"
import { queueEndEmbed } from "@main/elements/embeds/queueEnd"
import { inactivityDisconnectReason } from "@main/elements/texts"
import { getChannel } from "@utils/cache"
import { sendSelfDestroyMessage } from "@utils/message"
import type { Client, TextChannel } from "discord.js"
import type { Manager } from "erela.js"

import { config } from "../../../config"

export const registerQueueEndEvent = (manager: Manager, client: Client) => {
  manager.on("queueEnd", async (player) => {
    const textChannel = <TextChannel>getChannel(client, player.textChannel)

    // If got forced disconnected
    if (!player.queue.previous) {
      return
    }

    await sendSelfDestroyMessage(
      textChannel,
      { embeds: [queueEndEmbed()] },
      config.selfDestroyMessageLifeSpan
    )

    setTimeout(async () => {
      if (player.state === "DESTROYING") {
        return
      }

      if (!player.playing && player.state !== "DISCONNECTED") {
        await sendSelfDestroyMessage(
          textChannel,
          { embeds: [disconnectEmbed(inactivityDisconnectReason)] },
          config.selfDestroyMessageLifeSpan
        )
        player.destroy()
      }
    }, config.disconnectTime)
  })
}
