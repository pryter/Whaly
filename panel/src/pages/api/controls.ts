import { establishNextApi } from "next-bridge"
import { getDetailContext, restartContext, stopContext } from "@/server/init"
import { getDetailAction } from "@/server/actions/getDetailAction"
import { restartAction } from "@/server/actions/restartAction"
import { stopAction } from "@/server/actions/stopAction"

const api: any = establishNextApi("POST", [
  getDetailContext.init(getDetailAction),
  restartContext.init(restartAction),
  stopContext.init(stopAction)
])

export default api
