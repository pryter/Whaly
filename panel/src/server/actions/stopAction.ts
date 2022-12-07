import pm2 from "pm2"

import { stopContext } from "@/server/init"

export const stopAction = stopContext.helper.createAction(async (_) => {
  const promise = new Promise((resolve: (value: boolean) => void) => {
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
