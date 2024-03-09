import type { TextChannel, VoiceChannel } from "discord.js"
import type { Manager, Player } from "erela.js"

export const createPlayer = (
  manager: Manager,
  textChannel: TextChannel,
  voiceChannel: VoiceChannel
): Player => {
  return manager.create({
    guild: textChannel.guild.id,
    voiceChannel: voiceChannel.id,
    textChannel: textChannel.id,
    selfMute: false,
    volume: 100,
    instaUpdateFiltersFix: false
  })
}
