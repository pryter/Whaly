import { runningCat } from "@main/elements/icons/runningCat"
import { EmbedBuilder } from "discord.js"
import type { PlaylistInfo } from "erela.js"
import prettyMilliseconds from "pretty-ms"

export const top50PlaylistAddedToQueueEmbed = (
  query: string,
  playlist?: PlaylistInfo
) => {
  return new EmbedBuilder()
    .setAuthor({
      name: "Playlist added to queue",
      iconURL: runningCat
    })
    .setThumbnail("https://pryter.me/assets/images/whaly.jpeg")
    .setDescription(`[${playlist?.name}](${query})`)
    .addFields(
      {
        name: "Enqueued",
        value: `50 songs`,
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
