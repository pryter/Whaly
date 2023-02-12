import { indexRanking } from "@main/events/scheduled/indexRecords"
import { createDatabase } from "@main/firebase/init"
import { info, log } from "@utils/logger"
import dotenv from "dotenv"

dotenv.config()

const runtime = async () => {
  log("script | Indexing collected records...")
  const database = createDatabase()
  await indexRanking(database)
  info("script | Ranking created (https://pryter.me/whaly/ranking)")
}

runtime()
