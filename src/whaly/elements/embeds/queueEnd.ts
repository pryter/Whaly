import { EmbedBuilder } from "discord.js"
import { runningCat } from "@main/elements/icons/runningCat"

export const queueEndEmbed = () => {
  return new EmbedBuilder()
    .setAuthor({
      name: "The queue has ended",
      iconURL: runningCat,
    })
    .setFooter({ text: "Queue ended" })
}
