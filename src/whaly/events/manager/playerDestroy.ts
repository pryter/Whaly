import { Manager } from "erela.js"
import { Client, Message } from "discord.js"
import { err } from "@utils/logger"

export const registerPlayerDestroyEvent = (manager: Manager) => {
  manager.on("playerDestroy", (player) => {
    const nowPlaying: Message | null | undefined = player.get("nowPlaying")
    if (nowPlaying) {
      nowPlaying.delete().catch(() => {
        err("whaly | can't delete now playing message")
        return null
      })
    }
  })
}
