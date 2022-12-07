import { runningCat } from "@main/elements/icons/runningCat"
import { EmbedBuilder } from "discord.js"
import type { Track } from "erela.js"
import prettyMilliseconds from "pretty-ms"

export const nowPlayingEmbed = (track: Track) => {
  return new EmbedBuilder()
    .setAuthor({
      name: "Now playing",
      iconURL: runningCat
    })
    .setDescription(
      `[${track.title}](${track.uri})` || "No track's description"
    )
    .addFields(
      {
        name: "Requested by",
        value: `${track.requester}`,
        inline: true
      },
      {
        name: "Duration",
        value: track.isStream
          ? `\`LIVE\``
          : `\`${prettyMilliseconds(track.duration, {
              colonNotation: true
            })}\``,
        inline: true
      }
    )
    .setThumbnail(track.thumbnail)
}
