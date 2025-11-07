import * as http from "node:http"

import type { Bus } from "@main/events/eventbus"
import { handleEndpoints } from "@main/events/rest/endpoints"
import type { Manager, Player } from "erela.js"
import express from "express"
import { WebSocketServer } from "ws"

export const startRest = (manager: Manager, pBus: Bus<Player>) => {
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

    const bid = pBus.subscribe((p) => {
      const data = {
        queue: p.queue,
        current: p.queue.current,
        disconnected: !!p?.get("reconnectMessage"),
        state: p.state,
        isPlaying: p.playing,
        position: p.position
      }

      client.send(JSON.stringify(data))
    }, gid)

    client.on("close", () => {
      pBus.unsubscribe(bid)
    })

    const p = manager.get(gid)
    if (!p) {
      client.close()
      return
    }

    const data = {
      queue: p.queue,
      current: p.queue.current,
      disconnected: !!p?.get("reconnectMessage"),
      state: p?.state,
      isPlaying: p?.playing,
      position: p?.position
    }
    client.send(JSON.stringify(data))
  })

  app.use(express.json())

  handleEndpoints(app, manager, pBus)
  // Start server
  const PORT = 3223
  server.listen(PORT, () => console.log(`Proxy listening on :${PORT}`))
}
