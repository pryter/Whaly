import { err } from "@utils/logger"
import type { Message } from "discord.js"
import type { Manager } from "erela.js"

export const registerPlayerDestroyEvent = (manager: Manager) => {
  manager.on("playerDestroy", (player) => {
    const nowPlaying: Message | null | undefined = player.get("nowPlaying")
    if (nowPlaying) {
      nowPlaying.delete().catch(() => {
        err("whaly | can't delete now playing message")
        return null
      })
    }
    const queueMessage: Message | null | undefined = player.get("queueMessage")
    if (queueMessage) {
      queueMessage.delete().catch(() => {
        err("whaly | can't delete queue message")
        return null
      })
    }
  })
}
