import { runningCat } from "@main/elements/icons/runningCat"
import { EmbedBuilder } from "discord.js"

export const disconnectWithReconnectEmbed = () => {
  return new EmbedBuilder()
    .setAuthor({
      name: "Disconnected",
      iconURL: runningCat
    })
    .setDescription("Someone disconnected Whaly from the channel :/")
    .setFooter({ text: "You have 60 seconds to reload the queue." })
}
