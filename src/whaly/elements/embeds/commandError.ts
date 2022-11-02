import { EmbedBuilder } from "discord.js"

export const commandErrorEmbed = (context: string) => {
  return new EmbedBuilder().setColor("Red").setDescription(context)
}
