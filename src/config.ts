import { IntentsBitField } from "discord.js"

export const config = {
  disconnectTime: 30 * 1000,
  selfDestroyMessageLifeSpan: 5 * 1000,
  reconnectEmbedLifeSpan: 60 * 1000,
  queueEmbedLifeSpan: 5 * 60 * 1000,
  maxPauseTime: 4 * 60 * 60 * 1000,
  longLivedSDMLifeSpan: 10 * 1000,
  requiredIntents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.GuildMessages
  ]
}
