import { runningCat } from "@main/elements/icons/runningCat"
import { EmbedBuilder } from "discord.js"

export const queueEndEmbed = () => {
  return new EmbedBuilder()
    .setAuthor({
      name: "The queue has ended",
      iconURL: runningCat
    })
    .setFooter({ text: "Queue ended" })
}
