import { refreshQueueMessage } from "@main/elements/message/queue"
import type { Bus } from "@main/events/eventbus"
import { err } from "@utils/logger"
import type { Manager, Player, Track } from "erela.js"
import type { Express } from "express"
import { v4 } from "uuid"

export const handleEndpoints = (
  app: Express,
  manager: Manager,
  pBus: Bus<Player>
) => {
  const trackMempool = new Map<
    string,
    { track: Record<string, Track>; gid: string }
  >()

  // track action
  app.post("/player/:gid/track", async (req, res) => {
    const { gid } = req.params
    if (!gid) return res.status(400).json({ error: "guild id missing" })
    const player = manager.players.get(gid)
    if (!player) return res.status(400).json({ error: "no player found" })
    const data = req.body as { type: string }
    const { type } = data
    const { queue } = player
    switch (type) {
      case "stop":
        queue.clear()
        player.stop()
        break
      case "prev": {
        const prevTrack = queue.previous
        const nextTrack = queue[0]
        const currentTrack = queue.current
        if (!prevTrack || !currentTrack) {
          break
        }
        if (prevTrack !== currentTrack && prevTrack !== nextTrack) {
          queue.splice(0, 0, currentTrack)
          player.play(prevTrack)
        }
        break
      }
      case "playPause":
        if (!player.playing && player.queue.totalSize === 0) {
          break
        }

        player.pause(!player.paused)
        break
      case "next":
        if (
          player.queue.totalSize === 0 ||
          player.trackRepeat ||
          player.queueRepeat
        ) {
          player.destroy()
          player.set("nowPlaying", null)
          break
        }

        player.stop()
        break
      default:
        break
    }

    pBus.post(gid, player)
    return res.status(200).json({ status: "success" })
  })

  app.post("/search-result/:sessionId/select", async (req, res) => {
    const { sessionId } = req.params
    const trackRecord = trackMempool.get(sessionId)
    if (!trackRecord) return res.status(400).json({ error: "no history found" })
    const player = manager.players.get(trackRecord.gid)
    if (!player) return res.status(400).json({ error: "no player found" })
    const data = req.body as { option: string }
    const { option } = data
    if (!option) return res.status(400).json({ error: "no option selected" })

    const track = trackRecord.track[option]
    if (!track) return res.status(400).json({ error: "no track found" })

    player.queue.add(track)
    refreshQueueMessage(player, manager)

    if (!player.playing && !player.paused && !player.queue.size) {
      player.play()
    }

    if (player.queue.totalSize > 1) {
      // n
    } else {
      player.queue.previous = player.queue.current
    }

    pBus.post(trackRecord.gid, player)

    return res.status(200).json({ status: "success" })
  })
  // query
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
        const trackRecord: Record<string, Track> = {}
        response.tracks.forEach((track, index) => {
          trackRecord[track.identifier] = track
        })

        const sessionId = v4()

        trackMempool.set(sessionId, { track: trackRecord, gid })

        return res.status(200).json({
          status: "success",
          data: { options: response.tracks, sessionId }
        })
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

    return res.status(200).json({ status: "success" })
  })
}
