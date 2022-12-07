import { getAllCommandData } from "@main/commands"
import { err, info } from "@utils/logger"
import { REST, Routes } from "discord.js"
import dotenv from "dotenv"

dotenv.config()

export const commandDeploy = async () => {
  try {
    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN || "")
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID || ""), {
      body: getAllCommandData()
    })
    info("service | Successfully deploy slash commands")
  } catch (e) {
    err("service | Unable to deploy slash commands")
  }
}
