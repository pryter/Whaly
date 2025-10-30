import {
  controllerStripDisabled,
  newControllerButtonStrip
} from "@main/elements/buttons/controllerStrip"
import { disconnectEmbed } from "@main/elements/embeds/discconect"
import { playerInterrupted } from "@main/elements/embeds/playerInterrupted"
import { queueEndEmbed } from "@main/elements/embeds/queueEnd"
import { inactivityDisconnectReason } from "@main/elements/texts"
import type { Bus } from "@main/events/eventbus"
import { getChannel } from "@utils/cache"
import { sendSelfDestroyMessage } from "@utils/message"
import type {
  Client,
  Message,
  MessageEditOptions,
  TextChannel
} from "discord.js"
import type { Manager, Player } from "erela.js"

import { config } from "../../../config"

export const registerQueueEndEvent = (
  manager: Manager,
  client: Client,
  pbus: Bus<Player>
) => {
  manager.on("queueEnd", async (player) => {
    const textChannel = <TextChannel>getChannel(client, player.textChannel)

    pbus.post(textChannel.guild.id, player)
    // If got forced disconnected
    if (!player.queue.previous) {
      return
    }

    await sendSelfDestroyMessage(
      textChannel,
      { embeds: [queueEndEmbed()] },
      config.selfDestroyMessageLifeSpan
    )

    const nowPlaying: Message | null | undefined = player.get("nowPlaying")

    const contente = {
      embeds: [playerInterrupted(null)],
      components: [
        controllerStripDisabled(),
        newControllerButtonStrip(player.guild)
      ]
    }

    nowPlaying?.edit(<MessageEditOptions>contente)

    setTimeout(
      async () => {
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
      },
      config.reconnectEmbedLifeSpan > config.disconnectTime
        ? config.reconnectEmbedLifeSpan + config.disconnectTime
        : config.disconnectTime
    )
  })
}
