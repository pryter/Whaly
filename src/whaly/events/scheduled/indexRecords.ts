import type { Database, IndexedData } from "@itypes/database/Database"
import { err, info } from "@utils/logger"
import type { Client } from "discord.js"
import { ActivityType } from "discord.js"
import { firestore } from "firebase-admin"
import schedule from "node-schedule"
import DocumentData = firestore.DocumentData
import QuerySnapshot = firestore.QuerySnapshot

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
    // @ts-ignore
    indexedRecord[url] = {
      title,
      playCount: 1
    }
  })

  return indexedRecord
}

const convertIndexedDataToArray = (indexedData: IndexedData) => {
  const arr: { url: string; title: string; playCount: number }[] = []

  Object.keys(indexedData).forEach((k) => {
    // @ts-ignore
    arr.push({ url: k, ...indexedData[k] })
  })

  return arr
}

const convertArraytoIndexedData = (
  arr: { url: string; title: string; playCount: number }[]
): IndexedData => {
  const obj: IndexedData = {}
  arr.forEach((v) => {
    obj[v.url] = {
      title: v.title,
      playCount: v.playCount
    }
  })

  return obj
}

export const indexRanking = async (database: Database) => {
  const indexedData = await database?.collection("indexed").doc("main").get()
  const records = await database?.collection("records").get()

  const objectIndexedData = <IndexedData>indexedData?.get("ranking")

  if (!records) return

  const ranking = indexData(objectIndexedData, records)
  const rankingArr = convertIndexedDataToArray(ranking)
  const sorted = rankingArr.sort((a, b) => b.playCount - a.playCount)
  const top50 = sorted.slice(0, 50)
  const top100 = sorted.slice(0, 100)

  database?.collection("indexed").doc("main").set({
    time: new Date().getTime(),
    ranking
  })

  database?.collection("indexed").doc("top50").set({
    time: new Date().getTime(),
    ranking: top50
  })

  database?.collection("indexed").doc("top100").set({
    time: new Date().getTime(),
    ranking: top100
  })
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
      await indexRanking(database)

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
