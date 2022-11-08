import { Command } from "@itypes/command/Command"
import { Message, MessageCreateOptions, SlashCommandBuilder, TextChannel } from "discord.js"
import { getChannel, getUserVoiceChannel } from "@utils/cache"
import { commandResponseEmbed } from "@main/elements/embeds/commandResponse"
import { sendSelfDestroyReply } from "@utils/message"
import { warn } from "@utils/logger"
import { nowPlayingEmbed } from "@main/elements/embeds/nowPlaying"
import { controllerStrip } from "@main/elements/buttons/controllerStrip"
import { Track } from "erela.js"
import { commandErrorEmbed } from "@main/elements/embeds/commandError"
import { noPlayingSongError } from "@main/elements/texts"
import { config } from "../../config"

export const playerCommand = (): Command => {
  return {
    name: "player",
    data: new SlashCommandBuilder()
      .setName("player")
      .setDescription("Re-spawn existed player. In case you might lost it :/"),
    runtime: async (manager, interaction) => {
      const textChannel = interaction.channel
      const voiceChannel = await getUserVoiceChannel(interaction.client, interaction)
      if (!voiceChannel || !textChannel || !interaction.guild) {
        return
      }

      const player = manager.players.get(interaction.guild.id)

      if (!player || !player.playing) {
        sendSelfDestroyReply(
          interaction,
          { embeds: [commandErrorEmbed(noPlayingSongError)] },
          config.selfDestroyMessageLifeSpan
        )
        return
      }
      if (!player.queue.current) return

      const embed = nowPlayingEmbed(<Track>player.queue.current)
      const content: MessageCreateOptions = {
        embeds: [embed],
        //@ts-ignore
        components: [controllerStrip(player)],
      }
      const nowPlaying: Message | null | undefined = player.get("nowPlaying")

      sendSelfDestroyReply(interaction, "There it is !")

      if (nowPlaying) {
        nowPlaying
          .delete()
          .then(async () => {
            const nowPlayingMessage = await textChannel.send(content).catch(warn)
            player.set("nowPlaying", nowPlayingMessage)
          })
          .catch(warn)
        return
      }
    },
  }
}
