export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes"

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`
}

export function msToTime(ms: number) {
  const seconds = parseFloat((ms / 1000).toFixed(1))
  const minutes = parseFloat((ms / (1000 * 60)).toFixed(1))
  const hours = parseFloat((ms / (1000 * 60 * 60)).toFixed(1))
  const days = (ms / (1000 * 60 * 60 * 24)).toFixed(1)
  if (seconds < 60) return `${seconds.toString()} Sec`
  if (minutes < 60) return `${minutes.toString()} Min`
  if (hours < 24) return `${hours.toString()} Hrs`
  return `${days.toString()} Days`
}
