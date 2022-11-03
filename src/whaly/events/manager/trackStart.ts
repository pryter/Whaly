import { Manager } from "erela.js"
import { nowPlayingEmbed } from "@main/elements/embeds/nowPlaying"
import { getChannel } from "@utils/cache"
import { Client, TextChannel } from "discord.js"
import { controllerStrip } from "@main/elements/buttons/controllerStrip"
import { log, warn } from "@utils/logger"

export const registerTrackStartEvent = (manager: Manager, client: Client) => {
  manager.on("trackStart", async (player, track, payload) => {
    const embed = nowPlayingEmbed(track)
    const textChannel = <TextChannel>getChannel(client, player.textChannel)

    log(`player | Playing ${track.title} @ ${player.guild}`)

    const nowPlayingMessage = await textChannel
      .send({
        embeds: [embed],
        //@ts-ignore
        components: [controllerStrip(player)],
      })
      .catch(warn)
    player.set("nowPlaying", nowPlayingMessage)
  })
}
