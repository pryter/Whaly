import { EmbedBuilder } from "discord.js"
import type { Track, UnresolvedTrack } from "erela.js"

export const trackError = (track: Track | UnresolvedTrack) => {
  const embed = new EmbedBuilder()
    .setColor("Red")
    .setTitle("Track error")
    .setDescription(
      `Unable to play reported track: [${track.title}](${track.uri})`
    )
    .addFields({
      name: "Requested by",
      value: `${track.requester}`,
      inline: true
    })
    .setFooter({
      text: "Meeow~~ There is something wrong here T.T"
    })
  if (track.thumbnail) embed.setThumbnail(track.thumbnail)
  return embed
}
