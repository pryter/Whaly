import { Client, Message, TextChannel } from "discord.js"
import { Manager } from "erela.js"
import { sendSelfDestroyMessage } from "@utils/message"
import { resumeEmbed } from "@main/elements/embeds/resume"
import { config } from "../../../config"
import { pauseEmbed } from "@main/elements/embeds/pause"
import { warn } from "@utils/logger"
import { disconnectEmbed } from "@main/elements/embeds/discconect"
import { pauseTimeout } from "@main/elements/texts"

export const registerVoiceStateUpdateEvent = (client: Client, manager: Manager) => {
  client.on("voiceStateUpdate", async (oldState, newState) => {
    let action = null
    if (oldState.channel === null && newState.channel !== null) {
      action = "join"
    } else {
      if (oldState.channel !== newState.channel) {
        action = "leave"
      }
    }

    let guildId = newState.guild.id
    const player = manager.get(guildId)

    if (!player || player.state !== "CONNECTED" || !player.textChannel) {
      return
    }

    if (oldState.id === process.env.CLIENT_ID) {
      return
    }

    const textChannel = <TextChannel>await client.channels.cache.get(player.textChannel)
    switch (action) {
      case "join":
        {
          const voiceChannel = newState.channel
          if (!voiceChannel) break
          const members = voiceChannel.members.filter((e) => e.id !== process.env.CLIENT_ID).size
          if (members > 0 && player.paused) {
            player.pause(false)
            const pauseMessage: Message | null = player.get("pausedMessage")
            if (pauseMessage) {
              pauseMessage.delete().catch((e) => {
                warn("whaly | Unable to delete paused message.")
                return null
              })
              player.set("pausedMessage", null)
            }
            player.queue.current &&
              sendSelfDestroyMessage(
                textChannel,
                { embeds: [resumeEmbed(client, player.queue.current)] },
                config.selfDestroyMessageLifeSpan
              )
          }
        }
        break
      case "leave":
        {
          const voiceChannel = oldState.channel
          if (!voiceChannel) break
          const members = voiceChannel.members.filter((e) => e.id !== process.env.CLIENT_ID).size
          if (members <= 0) {
            player.pause(true)
            const message = await textChannel.send({ embeds: [pauseEmbed()] })
            player.set("pausedMessage", message)
            setTimeout(() => {
              const pauseMessage: Message | null = player.get("pausedMessage")
              if (pauseMessage) {
                pauseMessage.delete().catch((e) => {
                  warn("whaly | Unable to delete paused message.")
                  return null
                })
                player.set("pausedMessage", null)
              }
              sendSelfDestroyMessage(textChannel, { embeds: [disconnectEmbed(pauseTimeout)] }, config.maxPauseTime)
              player.destroy()
            }, config.maxPauseTime)
          }
        }
        break
    }
  })
}
