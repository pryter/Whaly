import { Manager } from "erela.js"
import { nowPlayingEmbed } from "@main/elements/embeds/nowPlaying"
import { getChannel } from "@utils/cache"
import { Client, Message, MessageCreateOptions, TextChannel } from "discord.js"
import { controllerStrip } from "@main/elements/buttons/controllerStrip"
import { log, warn } from "@utils/logger"
import { generateQueueMessage, refreshQueueMessage } from "@main/elements/message/queue"

export const registerTrackStartEvent = (manager: Manager, client: Client) => {
  manager.on("trackStart", async (player, track) => {
    const embed = nowPlayingEmbed(track)
    const textChannel = <TextChannel>getChannel(client, player.textChannel)
    const content: MessageCreateOptions = {
      embeds: [embed],
      //@ts-ignore
      components: [controllerStrip(player)],
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
