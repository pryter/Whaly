import { ActionRowBuilder, ButtonBuilder } from "discord.js"
import { Player } from "erela.js"

export const controllerStrip = (player: Player): ActionRowBuilder => {
  const createId = (id: string): string => {
    return `controllerStrip_${player.guild}_${id}`
  }

  // Create all buttons for the strip
  const stopButton = new ButtonBuilder().setStyle(2).setCustomId(createId("stop")).setEmoji("⏹️")
  const prevButton = new ButtonBuilder().setStyle(1).setCustomId(createId("prev")).setEmoji("⏮️")
  const playPauseButton = new ButtonBuilder()
    .setStyle(player.playing ? 1 : 2)
    .setCustomId(createId("playPause"))
    .setEmoji(player.playing ? "⏸️" : "▶️")
  const nextButton = new ButtonBuilder().setStyle(1).setCustomId(createId("next")).setEmoji("⏭️")
  const loopButton = new ButtonBuilder()
    .setStyle(player.trackRepeat ? 3 : player.queueRepeat ? 3 : 2)
    .setCustomId(createId("loop"))
    .setEmoji(player.trackRepeat ? "🔂" : player.queueRepeat ? "🔁" : "🔁")

  const strip = new ActionRowBuilder().setComponents(stopButton, prevButton, playPauseButton, nextButton, loopButton)

  return strip
}
