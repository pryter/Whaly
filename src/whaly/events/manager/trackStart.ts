import { controllerStrip } from "@main/elements/buttons/controllerStrip"
import { nowPlayingEmbed } from "@main/elements/embeds/nowPlaying"
import { refreshQueueMessage } from "@main/elements/message/queue"
import { getChannel } from "@utils/cache"
import { log, warn } from "@utils/logger"
import type {
  Client,
  Message,
  MessageCreateOptions,
  TextChannel
} from "discord.js"
import type { Manager } from "erela.js"

export const registerTrackStartEvent = (manager: Manager, client: Client) => {
  manager.on("trackStart", async (player, track) => {
    const embed = nowPlayingEmbed(track)
    const textChannel = <TextChannel>getChannel(client, player.textChannel)
    const content: MessageCreateOptions = {
      embeds: [embed],
      // @ts-ignore
      components: [controllerStrip(player)]
    }

    log(`player | Playing ${track.title} @ ${player.guild}`)

    const nowPlaying: Message | null | undefined = player.get("nowPlaying")

    refreshQueueMessage(player, manager)

    if (nowPlaying) {
      nowPlaying.edit(content)
      return
    }

    const nowPlayingMessage = await textChannel.send(content).catch(warn)
    player.set("nowPlaying", nowPlayingMessage)
  })
}
