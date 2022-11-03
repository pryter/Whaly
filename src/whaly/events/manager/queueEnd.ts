import { Manager } from "erela.js"
import { Client, TextChannel } from "discord.js"
import { sendSelfDestroyMessage } from "@utils/message"
import { getChannel } from "@utils/cache"
import { queueEndEmbed } from "@main/elements/embeds/queueEnd"
import { disconnectEmbed } from "@main/elements/embeds/discconect"
import { config } from "../../../config"
import { inactivityDisconnectReason } from "@main/elements/texts"

export const registerQueueEndEvent = (manager: Manager, client: Client) => {
  manager.on("queueEnd", async (player, track) => {
    const textChannel = <TextChannel>getChannel(client, player.textChannel)
    await sendSelfDestroyMessage(textChannel, { embeds: [queueEndEmbed()] }, config.selfDestroyMessageLifeSpan)

    setTimeout(async () => {
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
