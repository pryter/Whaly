import { ButtonInteractionData } from "@itypes/interaction/ButtonInteractionData"
import { createPlayer } from "@main/player/createPlayer"
import { Message, VoiceChannel } from "discord.js"
import { info } from "@utils/logger"

export const handleReconnectEvent = (buttonInteractionData: ButtonInteractionData) => {
  const { player, textChannel, voiceChannel, manager, guildId } = buttonInteractionData
  if (!player) {
    return
  }

  const voiceChannelId: string | undefined = voiceChannel?.id
  if (!voiceChannelId) {
    return
  }
  const oldQueue = player.queue

  player.destroy(true)
  if (!voiceChannel) {
    return
  }
  const newPlayer = createPlayer(manager, textChannel, <VoiceChannel>voiceChannel)

  if (oldQueue.current) {
    newPlayer.queue.add(oldQueue.current)
    newPlayer.queue.add(oldQueue.current)
  }
  oldQueue.forEach((track) => {
    newPlayer.queue.add(track)
  })
  newPlayer.connect()
  info(`Successfully swapped a player @ ${guildId}`)

  const reconMess: Message | null | undefined = player.get("reconnectMessage")

  reconMess?.delete()
  player.set("reconnectMessage", null)
}
