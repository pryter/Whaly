import { Manager } from "erela.js"
import { Client, Message } from "discord.js"

export const registerPlayerDestroyEvent = (manager: Manager, client: Client) => {
  manager.on("playerDestroy", (player) => {
    const nowPlaying: Message | null | undefined = player.get("nowPlaying")
    if (nowPlaying) {
      nowPlaying.delete()
    }
  })
}
