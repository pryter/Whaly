import { EmbedBuilder } from "discord.js"

export const commandResponseEmbed = (context: string) => {
  return new EmbedBuilder().setDescription(context)
}
