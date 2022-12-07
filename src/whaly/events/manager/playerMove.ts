import { disconnectEmbed } from "@main/elements/embeds/discconect"
import { unexpectedDisconnectReason } from "@main/elements/texts"
import { getChannel } from "@utils/cache"
import { sendSelfDestroyMessage } from "@utils/message"
import type { Client, TextChannel } from "discord.js"
import type { Manager } from "erela.js"

import { config } from "../../../config"

export const registerPlayerMoveEvent = (manager: Manager, client: Client) => {
  manager.on("playerMove", async (player, initChannel, newChannel) => {
    const textChannel = <TextChannel>getChannel(client, player.textChannel)
    if (!newChannel) {
      await sendSelfDestroyMessage(
        textChannel,
        { embeds: [disconnectEmbed(unexpectedDisconnectReason)] },
        config.selfDestroyMessageLifeSpan
      )
      return player.destroy()
    }
    player.setVoiceChannel(newChannel)
    setTimeout(() => player.pause(false), 1000)
    return null
  })
}
