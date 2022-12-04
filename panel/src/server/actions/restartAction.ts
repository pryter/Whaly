import { restartContext } from "@/server/init"
import pm2, { ProcessDescription } from "pm2"

export const restartAction = restartContext.helper.createAction(async (_) => {
  const promise = new Promise((resolve: (value: boolean) => void, reject) => {
    pm2.restart("whaly", (err, proc) => {
      if (err) {
        resolve(false)
      }
      resolve(true)
    })
  })

  const res = await promise

  return { status: res, report: "restart" }
})
