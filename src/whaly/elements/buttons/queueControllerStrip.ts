import { ActionRowBuilder, ButtonBuilder } from "discord.js"
import { Player } from "erela.js"

export const queueControllerStrip = (player: Player): ActionRowBuilder => {
  const createId = (id: string): string => {
    return `queueStrip_${id}`
  }

  const maxPage: number = player.get("maxQueuePage") || 1
  const currentPage: number = player.get("queuePage") || 1

  const prevPageButton = new ButtonBuilder()
    .setStyle(1)
    .setCustomId(createId("prev"))
    .setEmoji("⏮️")
    .setDisabled(currentPage <= 1)
  const nextPageButton = new ButtonBuilder()
    .setStyle(1)
    .setCustomId(createId("next"))
    .setEmoji("⏭️")
    .setDisabled(currentPage >= maxPage)

  const strip = new ActionRowBuilder().setComponents(prevPageButton, nextPageButton)

  return strip
}
