import type { ProcessDescription } from "pm2"
import pm2 from "pm2"

import { getDetailContext } from "@/server/init"

export const getDetailAction = getDetailContext.helper.createAction(
  async (prams) => {
    const promise = new Promise(
      (resolve: (value: ProcessDescription[]) => void) => {
        pm2.describe("whaly", (err, processDescriptionList) => {
          resolve(processDescriptionList)
        })
      }
    )

    const result = await promise

    return { status: true, report: "success", data: result }
  }
)
