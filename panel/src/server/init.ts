import { BridgeContext, createBridgeContext } from "next-bridge"

export const getDetailContext: BridgeContext<{}> = createBridgeContext(
  "getDetail",
  "controls"
)

export const restartContext: BridgeContext<{}> = createBridgeContext(
  "restart",
  "controls"
)

export const stopContext: BridgeContext<{}> = createBridgeContext(
  "stop",
  "controls"
)
