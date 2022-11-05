import { Message, MessageCreateOptions, MessagePayload, TextChannel } from "discord.js"
import { warn } from "@utils/logger"

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
