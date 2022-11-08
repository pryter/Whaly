import { ActivityType, Client } from "discord.js"
import { info } from "@utils/logger"
import { Manager } from "erela.js"

export const registerReadyEvent = (client: Client, manager: Manager) => {
  client.on("ready", () => {
    manager.init(process.env.CLIENT_ID)
    setInterval(() => {
      client.user?.setPresence({
        status: "online",
        activities: [
          {
            name: "With Your 💖🫶🏻 💞",
            type: ActivityType.Playing,
          },
        ],
      })
    }, 60 * 60 * 1000)

    info("client | Successfully logged in")
  })
}
