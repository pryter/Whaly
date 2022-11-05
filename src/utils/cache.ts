import { ButtonInteraction, Channel, Client, CommandInteraction, VoiceBasedChannel } from "discord.js"
import { commandErrorEmbed } from "@main/elements/embeds/commandError"
import { differentChannelError, notInVoiceChannelError, notJoinableError } from "@main/elements/texts"

export const getChannel = (client: Client, textChannel: string | null): Channel | undefined => {
  if (!textChannel) return undefined
  return client.channels.cache.get(textChannel)
}

export const getUserVoiceChannel = (
  client: Client,
  interaction: CommandInteraction | ButtonInteraction
): VoiceBasedChannel | null => {
  const userId = interaction.user.id
  const guild = client.guilds.cache.get(interaction?.guild?.id || "")
  const member = guild?.members.cache.get(userId)
  const me = guild?.members.me
  if (!member || !guild || !me) {
    return null
  }
  if (!member.voice.channel) {
    interaction.reply({
      embeds: [commandErrorEmbed(notInVoiceChannelError)],
    })
    return null
  }
  if (me.voice.channel && member.voice.channel.id !== me.voice.channel.id) {
    interaction.reply({
      embeds: [commandErrorEmbed(differentChannelError)],
    })
    return null
  }
  if (!member.voice.channel.joinable) {
    interaction.reply({
      embeds: [commandErrorEmbed(notJoinableError)],
    })
    return null
  }

  return member.voice.channel
}
