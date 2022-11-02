import { Manager, Player } from "erela.js"
import { TextChannel, VoiceChannel } from "discord.js"

export const createPlayer = (manager: Manager, textChannel: TextChannel, voiceChannel: VoiceChannel): Player => {
  return manager.create({
    guild: textChannel.guild.id,
    voiceChannel: voiceChannel.id,
    textChannel: textChannel.id,
    selfMute: false,
    volume: 100,
  })
}
