import classNames from "classnames"
import Head from "next/head"
import type { ProcessDescription } from "pm2"
import { useEffect, useState } from "react"

import { getDetailContext, restartContext, stopContext } from "@/server/init"
import { formatBytes, msToTime } from "@/utils/dataFormatter"

const Index = () => {
  const [procData, setProcData] = useState<null | ProcessDescription>(null)
  const [doingTask, setDoingTask] = useState(false)

  const loadData = async () => {
    const data = await getDetailContext.call({})
    setProcData(data.data[0])
    console.log(data.data)
  }

  useEffect(() => {
    loadData()
  }, [])

  const restart = async () => {
    setDoingTask(true)
    const res = await restartContext.call({})
    if (res) {
      loadData()
    }
    setDoingTask(false)
  }

  const stop = async () => {
    setDoingTask(true)
    const res = await stopContext.call({})
    if (res) {
      loadData()
    }
    setDoingTask(false)
  }
  return (
    <div className="flex items-center justify-center p-6 text-gray-800">
      <Head>
        <title>Whaly Internal Control Panel</title>
      </Head>
      <div className="rounded-md border border-gray-500 border-opacity-40 py-4 px-6">
        <h1 className="-mb-1 text-xl font-medium">Process Dashboard</h1>
        <p className="text-gray-600">Whaly process description panel</p>
        <div>
          <div className="mt-3 flex items-center space-x-1">
            {procData?.pm2_env?.status === "online" && (
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            )}
            {procData?.pm2_env?.status === "stopped" && (
              <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            )}
            {!procData && (
              <span className="text-red-400">No whaly process found :(</span>
            )}
            {procData && (
              <span>
                Status:{" "}
                <span className="font-medium text-gray-600">
                  {procData?.pm2_env?.status?.toUpperCase()}
                </span>
              </span>
            )}
          </div>
          {procData && (
            <div className="flex flex-wrap items-center space-x-1">
              <div className="mt-1 flex flex-col items-center rounded-md border border-gray-500 border-opacity-40 px-2">
                <h1 className="text-sm">CPU</h1>
                <span className="-mt-0.5 text-center text-xs font-medium">
                  {procData?.monit?.cpu}%
                </span>
              </div>
              <div className="mt-1 flex flex-col items-center rounded-md border border-gray-500 border-opacity-40 px-2">
                <h1 className="text-sm">MEM</h1>
                <span className="-mt-0.5 text-center text-xs font-medium">
                  {formatBytes(procData?.monit?.memory || 0)}
                </span>
              </div>
              <div className="mt-1 flex flex-col items-center rounded-md border border-gray-500 border-opacity-40 px-2">
                <h1 className="text-sm">Up time</h1>
                <span className="-mt-0.5 text-center text-xs font-medium">
                  {procData?.pm2_env?.status === "online"
                    ? msToTime(
                        new Date().getTime() -
                          (procData?.pm2_env?.pm_uptime || 0)
                      )
                    : "--"}
                </span>
              </div>
            </div>
          )}
          {procData && (
            <div className="mt-4 flex flex-wrap items-center space-x-1">
              <button
                onClick={restart}
                className={classNames(
                  "border border-gray-500 border-opacity-40 rounded-md px-3 py-0.5 w-20",
                  doingTask
                    ? "cursor-not-allowed text-gray-500"
                    : "cursor-pointer"
                )}
              >
                {doingTask ? (
                  <span className="animate-ping">---</span>
                ) : (
                  "Restart"
                )}
              </button>
              <button
                onClick={stop}
                className={classNames(
                  "border border-gray-500 border-opacity-40 rounded-md px-3 py-0.5 w-16",
                  doingTask
                    ? "cursor-not-allowed text-gray-500"
                    : "cursor-pointer"
                )}
              >
                {doingTask ? <span className="animate-ping">---</span> : "Stop"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Index
