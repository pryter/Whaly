import pm2 from "pm2"

import { restartContext } from "@/server/init"

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
