import { runningCat } from "@main/elements/icons/runningCat"
import { EmbedBuilder } from "discord.js"
import type { Track } from "erela.js"
import prettyMilliseconds from "pretty-ms"

export const playerInterrupted = (track: Track | null) => {
  return new EmbedBuilder()
    .setAuthor({
      name: "Player interrupted",
      iconURL: runningCat
    })
    .setDescription(
      track
        ? `[${track.title}](${track.uri})`
        : "There is no track playing currently. Play something!"
    )
    .addFields(
      {
        name: "Requested by",
        value: track ? `${track.requester}` : "none",
        inline: true
      },
      {
        name: "Duration",
        // eslint-disable-next-line no-nested-ternary
        value: track
          ? track.isStream
            ? `\`LIVE\``
            : `\`${prettyMilliseconds(track.duration, {
                colonNotation: true
              })}\``
          : "0.00",
        inline: true
      }
    )
    .setThumbnail(
      track ? track.thumbnail : "https://pryter.me/assets/images/whaly.jpeg"
    )
}
