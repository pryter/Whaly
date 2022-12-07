import type {
  ButtonInteraction,
  Guild,
  TextChannel,
  VoiceChannel
} from "discord.js"
import type { Manager, Player } from "erela.js"

export interface ButtonInteractionData {
  interaction: ButtonInteraction
  manager: Manager
  action: string
  guild: Guild
  guildId: string
  player: Player
  voiceChannel: VoiceChannel
  textChannel: TextChannel
}
