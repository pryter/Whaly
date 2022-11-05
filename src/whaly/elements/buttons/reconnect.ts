import { ActionRowBuilder, ButtonBuilder } from "discord.js"
import { Player } from "erela.js"

export const reconnectButton = (player: Player) => {
  const createId = (id: string): string => {
    return `reconnect_${player.guild}_${id}`
  }

  const button = new ButtonBuilder().setLabel("↻ Reconnect").setStyle(3).setCustomId(createId("reconnect"))
  return new ActionRowBuilder().setComponents(button)
}
