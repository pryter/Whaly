import { Message, MessageCreateOptions, MessagePayload, TextChannel } from "discord.js"

export const sendSelfDestroyMessage = async (
  textChannel: TextChannel,
  content: string | MessagePayload | MessageCreateOptions,
  duration: number
): Promise<Message> => {
  const message = await textChannel.send(content)
  setTimeout(() => message.delete(), duration)
  return message
}
