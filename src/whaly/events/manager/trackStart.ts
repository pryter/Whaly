import type { Database } from "@itypes/database/Database"
import {
  controllerStrip,
  newControllerButtonStrip
} from "@main/elements/buttons/controllerStrip"
import { nowPlayingEmbed } from "@main/elements/embeds/nowPlaying"
import { refreshQueueMessage } from "@main/elements/message/queue"
import type { Bus } from "@main/events/eventbus"
import { getChannel } from "@utils/cache"
import { log } from "@utils/logger"
import type {
  Client,
  Message,
  MessageCreateOptions,
  MessageEditOptions,
  TextChannel
} from "discord.js"
import type { Manager, Player } from "erela.js"

export const registerTrackStartEvent = (
  manager: Manager,
  client: Client,
  database: Database,
  pBus: Bus<Player>
) => {
  manager.on("trackStart", async (player, track) => {
    const embed = nowPlayingEmbed(track)
    const textChannel = <TextChannel>getChannel(client, player.textChannel)

    const content = {
      embeds: [embed],
      // @ts-ignore
      components: [
        controllerStrip(player),
        newControllerButtonStrip(player.guild)
      ]
    }

    log(`player | Playing ${track.title} @ ${player.guild}`)

    if (textChannel.guild.id) {
      pBus.post(textChannel.guild.id, player)
    }

    database?.collection("records").add({
      title: track.title,
      source: track.uri
    })

    const nowPlaying: Message | null | undefined = player.get("nowPlaying")

    refreshQueueMessage(player, manager)

    const retriedTrack: string = player.get("retriedTrack")

    if (retriedTrack === track.title) {
      return
    }

    if (nowPlaying) {
      await nowPlaying.edit(<MessageEditOptions>content)
      return
    }

    const nowPlayingMessage = await textChannel.send(
      <MessageCreateOptions>content
    )

    player.set("nowPlaying", nowPlayingMessage)
  })
}
