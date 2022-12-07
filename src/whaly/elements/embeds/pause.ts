import { runningCat } from "@main/elements/icons/runningCat"
import { EmbedBuilder } from "discord.js"

export const pauseEmbed = () => {
  return new EmbedBuilder()
    .setAuthor({ name: "Paused!", iconURL: runningCat })
    .setFooter({
      text: `The current song has been paused because there is too quiet here.`
    })
}
