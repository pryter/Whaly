import * as http from "node:http"

import { addedToQueueEmbed } from "@main/elements/embeds/addedToQueue"
import { refreshQueueMessage } from "@main/elements/message/queue"
import { err } from "@utils/logger"
import type { Manager, Player, Track } from "erela.js"
import express from "express"
import { WebSocketServer } from "ws"

export const startRest = (
  manager: Manager,
  tracksub: Record<string, (player: Player) => void>
) => {
  const app = express()
  const server = http.createServer(app)
  const wss = new WebSocketServer({ server })

  wss.on("connection", (client, req) => {
    const url = new URL(req.url ?? "", `http://${req.headers.host}`)
    const gid = url.searchParams.get("gid")
    if (!gid) {
      client.close()
      return
    }
    // eslint-disable-next-line no-param-reassign
    tracksub[gid] = (player) => {
      const data = {
        queue: player.queue,
        current: player.queue.current
      }

      client.send(JSON.stringify(data))
    }

    client.on("close", () => {
      if (tracksub[gid]) {
        // eslint-disable-next-line no-param-reassign
        delete tracksub[gid]
      }
    })

    const player = manager.get(gid)
    const data = {
      queue: player?.queue,
      current: player?.queue.current
    }
    client.send(JSON.stringify(data))
  })

  server.listen(3001, () => console.log("Proxy listening on :3001"))

  app.use(express.json())

  app.post("/player/:gid/track", async (req, res) => {
    const { gid } = req.params
    if (!gid) return res.status(400).json({ error: "guild id missing" })
    const player = manager.players.get(gid)
    if (!player) return res.status(400).json({ error: "no player found" })
    const data = req.body as { type: string }
    const { type } = data
    switch (type) {
      case "skip": {
        player.queue.previous = player.queue.current
        player.stop()
        break
      }
      default:
        break
    }
    return res.status(400).json({ error: "guild id missing" })
  })

  app.post("/play/:gid/:query", async (req, res) => {
    const { gid, query } = req.params
    if (!gid || !query)
      return res.status(400).json({ error: "guild id missing" })
    const player = manager.players.get(gid)
    if (!player) return res.status(400).json({ error: "no player found" })
    const response = await player.search(query).catch((e) => {
      err(`Command Play Remote| ${e}`)
    })

    if (!response) return res.status(400).json({ error: "no player found" })

    switch (response.loadType) {
      case "empty":
        if (!player.queue.current) {
          player.destroy()
        }
        return res.status(200).json({ status: "empty" })
      case "search":
      case "track": {
        const track = <Track>response.tracks[0]

        player.queue.add(track)
        refreshQueueMessage(player, manager)

        if (!player.playing && !player.paused && !player.queue.size) {
          player.play()
        }

        const addToQueueEmbed = addedToQueueEmbed(track)

        if (player.queue.totalSize > 1) {
          addToQueueEmbed.addFields({
            name: "Position in the queue",
            value: `${player.queue.size}`,
            inline: true
          })
        } else {
          player.queue.previous = player.queue.current
        }
        break
      }
      case "playlist": {
        player.queue.add(response.tracks)
        refreshQueueMessage(player, manager)

        if (
          !player.playing &&
          !player.paused &&
          player.queue.totalSize === response.tracks.length
        ) {
          player.play()
        }
        break
      }
      default:
        err("Invalid status")
    }

    const sub = tracksub[gid]
    if (sub) {
      sub(player)
    }

    return res.status(200).json({ status: "success" })
  })
  // Start server
  const PORT = 3223
  app.listen(PORT, () => console.log(`REST Service on ${PORT}`))
}
