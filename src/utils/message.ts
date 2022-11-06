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

export const sendSelfDestroyMessage = async (
  textChannel: TextChannel,
  content: string | MessagePayload | MessageCreateOptions,
  duration: number
): Promise<Message> => {
  const message = await textChannel.send(content)
  setTimeout(async () => {
    message.delete().catch(() => {
      warn(`whaly | can't delete self destroying message ${message.content}`)
      return null
    })
  }, duration)
  return message
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
