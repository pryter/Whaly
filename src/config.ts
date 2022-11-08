import { IntentsBitField } from "discord.js"

export const config = {
  disconnectTime: 30000,
  selfDestroyMessageLifeSpan: 5000,
  reconnectEmbedLifeSpan: 60 * 1000,
  queueEmbedLifeSpan: 60 * 1000 * 5,
  longLivedSDMLifeSpan: 10000,
  requiredIntents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.GuildMessages,
  ],
}
