import { runningCat } from "@main/elements/icons/runningCat"
import { EmbedBuilder } from "discord.js"

export const disconnectEmbed = (reason: string) => {
  return new EmbedBuilder()
    .setAuthor({
      name: "Disconnected",
      iconURL: runningCat
    })
    .setDescription(reason)
}
