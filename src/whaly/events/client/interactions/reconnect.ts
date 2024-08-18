import type { ButtonInteractionData } from "@itypes/interaction/ButtonInteractionData"
import { controllerStrip } from "@main/elements/buttons/controllerStrip"
import { nowPlayingEmbed } from "@main/elements/embeds/nowPlaying"
import { info } from "@utils/logger"
import type { Message, MessageEditOptions } from "discord.js"
import type { Track } from "erela.js"

export const handleReconnectEvent = async (
  buttonInteractionData: ButtonInteractionData
) => {
  const { player, textChannel, voiceChannel, manager, guildId } =
    buttonInteractionData
  if (!player) {
    return
  }

  const voiceChannelId: string | undefined = voiceChannel?.id
  if (!voiceChannelId) {
    return
  }

  player.setVoiceChannel(voiceChannelId)
  player.connect()
  await player.pause(false)

  if (player.queue.current) {
    const embed = nowPlayingEmbed(<Track>player.queue.current)
    const content = {
      embeds: [embed],
      // @ts-ignore
      components: [controllerStrip(player)]
    }

    const nowPlaying: Message | null | undefined = player.get("nowPlaying")

    nowPlaying?.edit(<MessageEditOptions>content)
  }

  info(`Successfully swapped a player @ ${guildId}`)

  const reconMess: Message | null | undefined = player.get("reconnectMessage")

  reconMess?.delete()
  player.set("reconnectMessage", null)
}
