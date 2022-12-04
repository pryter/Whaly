import { getDetailContext, restartContext, stopContext } from "@/server/init"
import { useEffect, useState } from "react"
import { ProcessDescription } from "pm2"
import classNames from "classnames"
import Head from "next/head"

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes"

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

function msToTime(ms: number) {
  let seconds = parseFloat((ms / 1000).toFixed(1))
  let minutes = parseFloat((ms / (1000 * 60)).toFixed(1))
  let hours = parseFloat((ms / (1000 * 60 * 60)).toFixed(1))
  let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1)
  if (seconds < 60) return seconds.toString() + " Sec"
  else if (minutes < 60) return minutes.toString() + " Min"
  else if (hours < 24) return hours.toString() + " Hrs"
  else return days.toString() + " Days"
}

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
    <div className="px-6 py-6 text-gray-800 flex items-center justify-center">
      <Head>
        <title>Whaly Internal Control Panel</title>
      </Head>
      <div className="border border-gray-500 border-opacity-40 rounded-md py-4 px-6">
        <h1 className="text-xl font-medium -mb-1">Process Dashboard</h1>
        <p className="text-gray-600">Whaly process description panel</p>
        <div>
          <div className="flex items-center space-x-1 mt-3">
            {procData?.pm2_env?.status === "online" && (
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            )}
            {procData?.pm2_env?.status === "stopped" && (
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            )}
            {!procData && (
              <span className="text-red-400">No whaly process found :(</span>
            )}
            {procData && (
              <span>
                Status:{" "}
                <span className="text-gray-600 font-medium">
                  {procData?.pm2_env?.status?.toUpperCase()}
                </span>
              </span>
            )}
          </div>
          {procData && (
            <div className="flex flex-wrap items-center space-x-1">
              <div className="flex flex-col items-center border border-gray-500 rounded-md px-2 border-opacity-40 mt-1">
                <h1 className="text-sm">CPU</h1>
                <span className="text-center text-xs font-medium -mt-0.5">
                  {procData?.monit?.cpu}%
                </span>
              </div>
              <div className="flex flex-col items-center border border-gray-500 rounded-md px-2 border-opacity-40 mt-1">
                <h1 className="text-sm">MEM</h1>
                <span className="text-center text-xs font-medium -mt-0.5">
                  {formatBytes(procData?.monit?.memory || 0)}
                </span>
              </div>
              <div className="flex flex-col items-center border border-gray-500 rounded-md px-2 border-opacity-40 mt-1">
                <h1 className="text-sm">Up time</h1>
                <span className="text-center text-xs font-medium -mt-0.5">
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
            <div className="flex flex-wrap items-center space-x-1 mt-4">
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
