import { Manager } from "erela.js"
import { Client, MessageCreateOptions, TextChannel } from "discord.js"
import { disconnectWithReconnectEmbed } from "@main/elements/embeds/reconnect"
import { reconnectButton } from "@main/elements/buttons/reconnect"
import { sendSelfDestroyMessage } from "@utils/message"
import { disconnectEmbed } from "@main/elements/embeds/discconect"
import { config } from "../../../config"
import { getChannel } from "@utils/cache"
import { forcedDisconnectReason } from "@main/elements/texts"

export const registerPlayerDisconnectEvent = (manager: Manager, client: Client) => {
  manager.on("playerDisconnect", async (player) => {
    const textChannel = <TextChannel>getChannel(client, player.textChannel)

    if (player.queue.length > 0 || player.playing) {
      const content: MessageCreateOptions = {
        embeds: [disconnectWithReconnectEmbed()],
        //@ts-ignore
        components: [reconnectButton(player)],
      }
      const reconnectMessage = await sendSelfDestroyMessage(textChannel, content, config.reconnectEmbedLifeSpan)
      player.set("reconnectMessage", reconnectMessage)
      setTimeout(() => {
        player.set("reconnectMessage", null)
      }, config.reconnectEmbedLifeSpan)
    } else {
      await sendSelfDestroyMessage(
        textChannel,
        { embeds: [disconnectEmbed(forcedDisconnectReason)] },
        config.selfDestroyMessageLifeSpan
      )
      player.destroy()
    }
  })
}
