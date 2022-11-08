import { Client, EmbedBuilder } from "discord.js"
import { runningCat } from "@main/elements/icons/runningCat"
import { Track, UnresolvedTrack } from "erela.js"

export const pauseEmbed = () => {
  return new EmbedBuilder().setAuthor({ name: "Paused!", iconURL: runningCat }).setFooter({
    text: `The current song has been paused because there is too quiet here.`,
  })
}
