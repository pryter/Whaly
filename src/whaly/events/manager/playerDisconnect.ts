import { controllerStripDisabled } from "@main/elements/buttons/controllerStrip"
import { reconnectButton } from "@main/elements/buttons/reconnect"
import { disconnectEmbed } from "@main/elements/embeds/discconect"
import { playerInterrupted } from "@main/elements/embeds/playerInterrupted"
import { disconnectWithReconnectEmbed } from "@main/elements/embeds/reconnect"
import { forcedDisconnectReason } from "@main/elements/texts"
import { getChannel } from "@utils/cache"
import { sendSelfDestroyMessage } from "@utils/message"
import type {
  Client,
  Message,
  MessageCreateOptions,
  MessageEditOptions,
  TextChannel
} from "discord.js"
import type { Manager, Track } from "erela.js"

import { config } from "../../../config"

export const registerPlayerDisconnectEvent = (
  manager: Manager,
  client: Client
) => {
  manager.on("playerDisconnect", async (player) => {
    const textChannel = <TextChannel>getChannel(client, player.textChannel)

    if (player.queue.length > 0 || player.playing) {
      const content: MessageCreateOptions = {
        embeds: [disconnectWithReconnectEmbed()],
        // @ts-ignore
        components: [reconnectButton(player)]
      }
      const reconnectMessage = await sendSelfDestroyMessage(
        textChannel,
        content,
        config.reconnectEmbedLifeSpan
      )
      player.set("reconnectMessage", reconnectMessage)

      if (player.queue.current) {
        const nowPlaying: Message | null | undefined = player.get("nowPlaying")

        const contente = {
          embeds: [playerInterrupted(<Track>player.queue.current)],
          // @ts-ignore
          components: [controllerStripDisabled(player)]
        }

        nowPlaying?.edit(<MessageEditOptions>contente)
      }

      setTimeout(() => {
        const latestPlayer = manager.get(textChannel.guild.id)
        const recon: Message | null | undefined =
          latestPlayer?.get("reconnectMessage")
        if (recon) {
          // no new player created
          player.destroy() // clean up
        }
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
