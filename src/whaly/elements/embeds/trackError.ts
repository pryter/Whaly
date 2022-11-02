import { Track, UnresolvedTrack } from "erela.js"
import { EmbedBuilder } from "discord.js"
import { runningCat } from "@main/elements/icons/runningCat"
import prettyMilliseconds from "pretty-ms"

export const trackError = (track: Track | UnresolvedTrack) => {
  const embed = new EmbedBuilder()
    .setColor("Red")
    .setTitle("Track error")
    .setDescription(`Unable to play reported track: [${track.title}](${track.uri})`)
    .addFields({
      name: "Requested by",
      value: `${track.requester}`,
      inline: true,
    })
  track.thumbnail && embed.setThumbnail(track.thumbnail)
  return embed
}
