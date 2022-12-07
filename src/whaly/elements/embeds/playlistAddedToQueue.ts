import { runningCat } from "@main/elements/icons/runningCat"
import { EmbedBuilder } from "discord.js"
import type { PlaylistInfo, Track } from "erela.js"
import prettyMilliseconds from "pretty-ms"

export const playlistAddedToQueueEmbed = (
  query: string,
  tracks: Track[],
  playlist?: PlaylistInfo
) => {
  return new EmbedBuilder()
    .setAuthor({
      name: "Playlist added to queue",
      iconURL: runningCat
    })
    .setThumbnail(tracks[0]?.thumbnail || "Unable to get thumbnail")
    .setDescription(`[${playlist?.name}](${query})`)
    .addFields(
      {
        name: "Enqueued",
        value: `\`${tracks.length}\` songs`,
        inline: true
      },
      {
        name: "Playlist duration",
        value: `\`${prettyMilliseconds(playlist?.duration || 0, {
          colonNotation: true,
          secondsDecimalDigits: 0
        })}\``,
        inline: true
      }
    )
}
