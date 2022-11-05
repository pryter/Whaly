import { err } from "@utils/logger"
import { controllerStrip } from "@main/elements/buttons/controllerStrip"
import { sendSelfDestroyMessage } from "@utils/message"
import { commandResponseEmbed } from "@main/elements/embeds/commandResponse"
import { noPlayingSongError, stoppedPlayer } from "@main/elements/texts"
import { config } from "../../../../config"
import { commandErrorEmbed } from "@main/elements/embeds/commandError"
import { queueEndEmbed } from "@main/elements/embeds/queueEnd"
import { ButtonInteractionData } from "@itypes/interaction/ButtonInteractionData"

export const handleControllerStripEvent = (buttonInteractionData: ButtonInteractionData) => {
  const { player, textChannel, voiceChannel, action, interaction } = buttonInteractionData
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
