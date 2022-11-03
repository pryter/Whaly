import { IntentsBitField } from "discord.js"

export const config = {
  disconnectTime: 10000,
  selfDestroyMessageLifeSpan: 5000,
  longLivedSDMLifeSpan: 10000,
  requiredIntents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.GuildMessages,
  ],
}
