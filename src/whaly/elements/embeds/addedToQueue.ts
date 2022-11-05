import { EmbedBuilder } from "discord.js"
import { runningCat } from "@main/elements/icons/runningCat"
import { Track } from "erela.js"
import prettyMilliseconds from "pretty-ms"

export const addedToQueueEmbed = (track: Track) => {
  const embed = new EmbedBuilder()
    .setAuthor({
      name: "Added to queue",
      iconURL: runningCat,
    })
    .setDescription(`[${track.title}](${track.uri})` || "No track's description")
    .addFields(
      {
        name: "Requested by",
        value: `${track.requester}`,
        inline: true,
      },
      {
        name: "Duration",
        value: track.isStream
          ? `\`LIVE\``
          : `\`${prettyMilliseconds(track.duration, {
              colonNotation: true,
            })}\``,
        inline: true,
      }
    )
    .setThumbnail(track.thumbnail)

  return embed
}
