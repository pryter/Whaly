import { Client, TextChannel } from "discord.js"
import { Manager } from "erela.js"
import { buildRuntimeIndex } from "@main/commands"
import { getUserVoiceChannel } from "@utils/cache"
import { err } from "@utils/logger"
import { sendSelfDestroyMessage } from "@utils/message"
import { commandResponseEmbed } from "@main/elements/embeds/commandResponse"
import { noPlayingSongError, stoppedPlayer } from "@main/elements/texts"
import { config } from "../../../config"
import { controllerStrip } from "@main/elements/buttons/controllerStrip"
import { commandErrorEmbed } from "@main/elements/embeds/commandError"
import { queueEndEmbed } from "@main/elements/embeds/queueEnd"

export const registerInteractionCreateEvent = (client: Client, manager: Manager) => {
  const runtimeIndex = buildRuntimeIndex()

  client.on("interactionCreate", (interaction) => {
    if (interaction.isCommand()) {
      const commandName = interaction.commandName

      // Call runtime
      if (commandName in runtimeIndex) {
        runtimeIndex[commandName](manager, interaction)
      }
    }

    if (interaction.isButton()) {
      const buttonId = interaction.customId

      // Controller strip button
      if (buttonId.startsWith("controllerStrip")) {
        const actionData = buttonId.split("_")
        const action = actionData[2]
        const guildId = actionData[1]
        const player = manager.get(guildId)

        const guild = client.guilds.cache.get(guildId)

        const voiceChannel = getUserVoiceChannel(client, interaction)
        const textChannel = <TextChannel>interaction.channel

        if (!player) {
          err("controllerStrip | Interaction with no player")
          return
        }

        if (!voiceChannel) {
          return
        }

        const queue = player.queue

        const reloadStrip = () => {
          interaction.update({
            //@ts-ignore
            components: [controllerStrip(player)],
          })
        }

        switch (action) {
          case "stop":
            queue.clear()
            player.stop()
            sendSelfDestroyMessage(
              textChannel,
              { embeds: [commandResponseEmbed(stoppedPlayer)] },
              config.selfDestroyMessageLifeSpan
            )
            reloadStrip()
            break
          case "prev":
            const prevTrack = queue.previous
            const nextTrack = queue[0]
            const currentTrack = queue.current
            if (!prevTrack || !currentTrack) {
              return
            }
            if (prevTrack !== currentTrack && prevTrack !== nextTrack) {
              queue.splice(0, 0, currentTrack)
              player.play(prevTrack)
              interaction.deferUpdate()
            }
            break
          case "playPause":
            if (!player.playing && player.queue.totalSize === 0) {
              sendSelfDestroyMessage(
                textChannel,
                { embeds: [commandErrorEmbed(noPlayingSongError)] },
                config.selfDestroyMessageLifeSpan
              )
              interaction.deferUpdate()
              return
            }

            player.pause(!player.paused)
            reloadStrip()
            break
          case "next":
            if (player.queue.totalSize === 0 || player.trackRepeat || player.queueRepeat) {
              sendSelfDestroyMessage(textChannel, { embeds: [queueEndEmbed()] }, config.selfDestroyMessageLifeSpan)
              player.destroy()
              player.set("nowPlaying", null)
              interaction.deferUpdate()
              return
            }

            player.stop()
            interaction.deferUpdate()
            break
          case "loop":
            if (player.trackRepeat) {
              player.setTrackRepeat(false)
              player.setQueueRepeat(true)
            } else if (player.queueRepeat) {
              player.setQueueRepeat(false)
            } else {
              player.setTrackRepeat(true)
            }
            reloadStrip()
            break
          default:
            err("controllerStrip | Unknown button action " + action)
            break
        }
      }
    }
  })
}
