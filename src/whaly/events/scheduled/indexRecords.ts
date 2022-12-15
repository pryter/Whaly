import type { Database, IndexedData } from "@itypes/database/Database"
import { err, info } from "@utils/logger"
import type { Client } from "discord.js"
import { ActivityType } from "discord.js"
import { firestore } from "firebase-admin"
import schedule from "node-schedule"
import DocumentData = firestore.DocumentData
import QuerySnapshot = firestore.QuerySnapshot

import { config } from "../../../config"

const indexData = (
  indexedData: IndexedData,
  records: QuerySnapshot<DocumentData>
) => {
  const indexedRecord = indexedData || {}

  records.forEach((doc) => {
    const title: string = doc.get("title")
    const url: string = doc.get("source")
    doc.ref.delete()
    if (url in indexedRecord) {
      // @ts-ignore
      indexedRecord[url].playCount += 1
      return
    }

    if (Object.keys(indexedRecord).length >= config.rankingSize) return
    // @ts-ignore
    indexedRecord[url] = {
      title,
      playCount: 1
    }
  })

  return indexedRecord
}
export const registerScheduledIndexRecordsEvent = (
  database: Database,
  client: Client
) => {
  try {
    schedule.scheduleJob("28 00/4 * * *", () => {
      client.user?.setPresence({
        status: "online",
        activities: [
          {
            name: "Indexing TOP-50 🙀",
            type: ActivityType.Playing
          }
        ]
      })
    })
    schedule.scheduleJob("30 00/4 * * *", async () => {
      const indexedData = await database
        ?.collection("indexed")
        .doc("main")
        .get()
      const records = await database?.collection("records").get()

      const objectIndexedData = <IndexedData>indexedData?.get("ranking")

      if (!records) return

      database
        ?.collection("indexed")
        .doc("main")
        .set({
          time: new Date().getTime(),
          ranking: indexData(objectIndexedData, records)
        })

      client.user?.setPresence({
        status: "online",
        activities: [
          {
            name: "With Your 💖🫶🏻 💞",
            type: ActivityType.Playing
          }
        ]
      })

      info("scheduled events | successfully indexed latest records")
    })

    info(`scheduled events | successfully registered index record event`)
  } catch (e) {
    err(`scheduled events | unable to register index record event ${e}`)
  }
}
