import { ActionRowBuilder, ButtonBuilder } from "discord.js"
import type { Player } from "erela.js"

const getLoopButtonAttribute = (
  queueRepeat: boolean,
  trackRepeat: boolean
): [number, string] => {
  if (!trackRepeat) {
    return queueRepeat ? [3, "🔁"] : [2, "🔁"]
  }
  return [3, "🔂"]
}

export const controllerStrip = (player: Player): ActionRowBuilder => {
  const createId = (id: string): string => {
    return `controllerStrip_${player.guild}_${id}`
  }

  // Create all buttons for the strip
  const stopButton = new ButtonBuilder()
    .setStyle(2)
    .setCustomId(createId("stop"))
    .setEmoji("⏹️")
  const prevButton = new ButtonBuilder()
    .setStyle(1)
    .setCustomId(createId("prev"))
    .setEmoji("⏮️")
  const playPauseButton = new ButtonBuilder()
    .setStyle(player.playing ? 1 : 2)
    .setCustomId(createId("playPause"))
    .setEmoji(player.playing ? "⏸️" : "▶️")
  const nextButton = new ButtonBuilder()
    .setStyle(1)
    .setCustomId(createId("next"))
    .setEmoji("⏭️")
  const loopButtonAttributes = getLoopButtonAttribute(
    player.queueRepeat,
    player.trackRepeat
  )
  const loopButton = new ButtonBuilder()
    .setStyle(loopButtonAttributes[0])
    .setCustomId(createId("loop"))
    .setEmoji(loopButtonAttributes[1])

  return new ActionRowBuilder().setComponents(
    stopButton,
    prevButton,
    playPauseButton,
    nextButton,
    loopButton
  )
}

export const controllerStripDisabled = (): ActionRowBuilder => {
  const createId = (id: string): string => {
    return `dummy_strip_${id}`
  }

  // Create all buttons for the strip
  const stopButton = new ButtonBuilder()
    .setStyle(2)
    .setCustomId(createId("stop_dummy"))
    .setEmoji("⏹️")
    .setDisabled(true)
  const prevButton = new ButtonBuilder()
    .setStyle(2)
    .setCustomId(createId("prev_dummy"))
    .setEmoji("⏮️")
    .setDisabled(true)
  const playPauseButton = new ButtonBuilder()
    .setStyle(2)
    .setCustomId(createId("playPause_dummy"))
    .setEmoji("⏸️")
    .setDisabled(true)
  const nextButton = new ButtonBuilder()
    .setStyle(2)
    .setCustomId(createId("next_dummy"))
    .setEmoji("⏭️")
    .setDisabled(true)

  return new ActionRowBuilder().setComponents(
    stopButton,
    prevButton,
    playPauseButton,
    nextButton
  )
}
