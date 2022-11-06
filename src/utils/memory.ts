import { log, warn } from "@utils/logger"
const memWatch = require("@airbnb/node-memwatch")
const cliProgress = require("cli-progress")

export const memoryDetector = () => {
  function formatBar(progress: any, options: any) {
    // calculate barsize
    const completeSize = Math.round(progress * options.barsize)
    const incompleteSize = options.barsize - completeSize

    // generate bar string by stripping the pre-rendered strings
    return (
      options.barCompleteString.substr(0, completeSize) +
      options.barGlue +
      options.barIncompleteString.substr(0, incompleteSize)
    )
  }

  function formatBytes(a: number, b = 2) {
    if (!+a) return "0 Bytes"
    const c = 0 > b ? 0 : b,
      d = Math.floor(Math.log(a) / Math.log(1024))
    return `${parseFloat((a / Math.pow(1024, d)).toFixed(c))} ${
      ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d]
    }`
  }

  function formatter(options: any, params: any, payload: any) {
    // bar grows dynamically by current progress - no whitespaces are added
    const bar = formatBar(params.progress, options)
    const percent = Math.round((params.value / params.total) * 100)
    return `\x1b[37m${bar} ${percent}% | ${payload.task} | ${formatBytes(params.value)} / ${formatBytes(
      params.total
    )}\x1b[0m`
  }

  memWatch.on("stats", (d: any) => {
    log("Memory report")
    const multibar = new cliProgress.MultiBar(
      {
        clearOnComplete: false,
        hideCursor: true,
        format: formatter,
      },
      cliProgress.Presets.shades_grey
    )

    multibar.create(d.heap_size_limit, d.used_heap_size, { task: "Heap size" })
    multibar.create(d.peak_malloced_memory, d.malloced_memory, { task: "Malloced-peak" })
    multibar.stop()
  })

  memWatch.on("leak", (d: any) => {
    warn("Memory leak detected")
  })
}
