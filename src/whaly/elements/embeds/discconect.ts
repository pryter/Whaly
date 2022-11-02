import { EmbedBuilder } from "discord.js"
import { runningCat } from "@main/elements/icons/runningCat"

export const disconnectEmbed = (reason: string) => {
  return new EmbedBuilder()
    .setAuthor({
      name: "Disconnected",
      iconURL: runningCat,
    })
    .setDescription(reason)
}
