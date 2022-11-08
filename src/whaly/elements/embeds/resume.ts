import { Client, EmbedBuilder } from "discord.js"
import { runningCat } from "@main/elements/icons/runningCat"
import { Track, UnresolvedTrack } from "erela.js"

export const resumeEmbed = (client: Client, resumedTrack: Track | UnresolvedTrack) => {
  return new EmbedBuilder()
    .setAuthor({ name: "Resumed!", iconURL: runningCat })
    .setDescription(`Playing  [${resumedTrack.title}](${resumedTrack.uri}) by ${resumedTrack.requester}`)
    .setFooter({ text: `The current song has been resumed.` })
}
