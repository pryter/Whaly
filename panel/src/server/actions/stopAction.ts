import { restartContext, stopContext } from "@/server/init"
import pm2, { ProcessDescription } from "pm2"

export const stopAction = stopContext.helper.createAction(async (_) => {
  const promise = new Promise((resolve: (value: boolean) => void, reject) => {
    pm2.stop("whaly", (err, proc) => {
      if (err) {
        resolve(false)
      }
      resolve(true)
    })
  })

  const res = await promise

  return { status: res, report: "stop" }
})
