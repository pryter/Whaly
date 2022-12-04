import { getDetailContext } from "@/server/init"
import pm2, { ProcessDescription } from "pm2"

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
