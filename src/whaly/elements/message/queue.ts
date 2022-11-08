import { Manager, Player } from "erela.js"
import { ButtonInteraction, Collector, InteractionCollector, Message, TextChannel } from "discord.js"
import { queueEmbed } from "@main/elements/embeds/queue"
import { queueControllerStrip } from "@main/elements/buttons/queueControllerStrip"
import { sendSelfDestroyMessage } from "@utils/message"
import { config } from "../../../config"
import { warn } from "@utils/logger"

const createCollector = (manager: Manager, channel: TextChannel) => {
  const collector: InteractionCollector<any> = channel.createMessageComponentCollector({
    time: config.queueEmbedLifeSpan,
    idle: 30e3,
  })
  collector.on("collect", async (button: ButtonInteraction) => {
    if (!button.guild?.id) return
    const player = manager.players.get(button.guild?.id)
    if (!player) return
    const maxPage: number = player.get("maxQueuePage") || 1
    const currentPage: number = player.get("queuePage") || 1
    switch (button.customId) {
      case "queueStrip_next":
        if (currentPage < maxPage) {
          player.set("queuePage", currentPage + 1)
        }
        break
      case "queueStrip_prev":
        if (currentPage > 1) {
          player.set("queuePage", currentPage - 1)
        }
    }
    await button.deferUpdate().catch(() => {})
    // regenerate message
    generateQueueMessage(player, channel, manager)
  })

  return collector
}
export const generateQueueMessage = async (player: Player, textChannel: TextChannel, manager: Manager) => {
  const prevQueueMessage: Message | null = player.get("queueMessage")

  if (prevQueueMessage) {
    const message = prevQueueMessage
    const page: number = player.get("queuePage") || 1
    await message
      .edit({
        embeds: [queueEmbed(player, page)], //@ts-ignore
        components: [queueControllerStrip(player)],
      })
      .catch((_) => {
        warn("whaly | Unable to update queue message; Queue embed is missing.")
        player.set("queueMessage", null)
        player.set("queuePage", 1)
        player.set("maxQueuePage", 1)
        return null
      })

    return
  }

  // create new message
  const message = await sendSelfDestroyMessage(
    textChannel,
    {
      embeds: [queueEmbed(player, 1)], //@ts-ignore
      components: [queueControllerStrip(player)],
    },
    config.queueEmbedLifeSpan,
    () => {
      player.set("queueMessage", null)
      player.set("queuePage", 1)
      player.set("maxQueuePage", 1)
    }
  )
  player.set("queuePage", 1)
  player.set("queueMessage", message)
  const oldCollector: Collector<any, any> | null = player.get("queueMessageCollector")
  if (oldCollector) {
    oldCollector.stop()
  }
  const collector = createCollector(manager, textChannel)
  player.set("queueMessageCollector", collector)
}

export const refreshQueueMessage = (player: Player, manager: Manager) => {
  const queueMessage: Message | null | undefined = player.get("queueMessage")
  if (queueMessage) {
    if (player.queue.size === 0) {
      queueMessage.delete().catch((e) => {
        warn("whaly | Unable to clear queue message")
        return null
      })
      player.set("queueMessage", null)
      player.set("queuePage", 1)
      player.set("maxQueuePage", 1)
      return
    }
    //refresh queue
    generateQueueMessage(player, <TextChannel>queueMessage.channel, manager)
  }
}
