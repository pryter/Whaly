import { splitArray } from "@utils/array"
import { formatTrack } from "@utils/message"
import { EmbedBuilder } from "discord.js"
import { runningCat } from "@main/elements/icons/runningCat"
import { Player, Queue } from "erela.js"

export const queueEmbed = (player: Player, page: number) => {
  const queue = player.queue
  const size = 6
  const queueChunks = splitArray(queue, size)

  const nowPlayingText = formatTrack(queue.current)

  const list = queueChunks[page - 1].map((track, index) => {
    return `\n${(page - 1) * size + index + 1}: ${formatTrack(track)}`
  })

  const queueEmbed = new EmbedBuilder()
    .setTitle("📖  Current queue")
    .setDescription(`**Playing:** ${nowPlayingText}\n${list}`)
    .setFooter({ text: `Page ${page} of ${queueChunks.length}\nThis message will be automatically destroy in 5 mins.` })

  player.set("maxQueuePage", queueChunks.length)
  return queueEmbed
}
