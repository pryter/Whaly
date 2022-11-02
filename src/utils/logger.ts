import { LogTypes } from "@itypes/logger/LogTypes"

export const printLog = (text: string, type: LogTypes = "info") => {
  let colourLit = ""
  const resetLit = "\x1b[0m"

  switch (type) {
    case "info":
      colourLit = "\x1b[32m"
      break
    case "error":
      colourLit = "\x1b[31m"
      break
    case "log":
      colourLit = "\x1b[37m"
      break
    case "warn":
      colourLit = "\x1b[33m"
      break
  }

  console.log(`${colourLit}${text}${resetLit}`)
}

export const info = (context: string) => {
  return printLog(context, "info")
}
export const warn = (context: string) => {
  return printLog(context, "warn")
}
export const err = (context: string) => {
  return printLog(context, "error")
}
export const log = (context: string) => {
  return printLog(context, "log")
}
