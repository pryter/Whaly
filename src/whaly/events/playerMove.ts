import { Manager } from "erela.js"
import { Client, TextChannel } from "discord.js"
import { getChannel } from "@utils/cache"
import { sendSelfDestroyMessage } from "@utils/message"
import { disconnectEmbed } from "@main/elements/embeds/discconect"
import { unexpectedDisconnectReason } from "@main/elements/texts"
import { config } from "../../config"

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
    } else {
      player.setVoiceChannel(newChannel)
      setTimeout(() => player.pause(false), 1000)
    }
  })
}
