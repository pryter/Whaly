import {
  ButtonInteraction,
  CommandInteraction,
  InteractionReplyOptions,
  Message,
  MessageCreateOptions,
  MessagePayload,
  TextChannel,
} from "discord.js"
import { warn } from "@utils/logger"
import { config } from "../config"
import prettyMilliseconds from "pretty-ms"
import { Track, UnresolvedTrack } from "erela.js"

export const sendSelfDestroyMessage = async (
  textChannel: TextChannel,
  content: string | MessagePayload | MessageCreateOptions,
  duration: number
): Promise<Message | null> => {
  try {
    const message = await textChannel.send(content)
    setTimeout(async () => {
      message.delete().catch(() => {
        warn(`whaly | can't delete self destroying message ${message.content}`)
        return null
      })
    }, duration)
    return message
  } catch (_) {
    warn(`whaly | can't send self destroying message`)
    return null
  }
}

export const sendSelfDestroyReply = async (
  interaction: CommandInteraction | ButtonInteraction,
  content: string | InteractionReplyOptions,
  duration: number = config.selfDestroyMessageLifeSpan
): Promise<Message | null> => {
  let replyBody: InteractionReplyOptions = typeof content === "string" ? { content: content } : content

  if (!replyBody) return null
  const reply = await interaction.reply({ ...replyBody, fetchReply: true })

  setTimeout(() => {
    reply.delete().catch((e) => {
      warn("whaly | Unable to delete command reply.")
    })
  }, duration)

  return reply
}

export const formatTrack = (track: Track | UnresolvedTrack | null) => {
  if (!track) return "undefined"
  return `[${track.title}](${track.uri}) by ${track.requester} \`${
    track.duration
      ? prettyMilliseconds(track.duration, {
          colonNotation: true,
        })
      : "**null**"
  }\``
}
