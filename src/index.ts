import WebSocket from 'ws'
import Discord, {Channel, Message, MessageEmbed, TextChannel} from "discord.js"
import dotenv from "dotenv"

dotenv.config()

const client = new Discord.Client()

const conn = new WebSocket("wss://stream.binance.com:9443/ws");
let listening: {[key: string]: {symbol: string, contextUpdate: Message}} = {}
let stored: {[symbol: string]: string} = {}
let delay: {[key: string]: number} = {}
const interval = 5

function randInt(max: number) {
  return Math.floor(Math.random() * max) + 1;
}

const addStatus = (symbol:string, val: string) => {
  const current = parseFloat(val)
  const past = parseFloat(stored[symbol])

  if (current >= past) {
    return '```yaml\n' +
      `+▲ ${current}\n` +
      '```'
  }else{

    return '```diff\n' +
      `-▼ ${current}\n` +
      '```'
  }
}

const colorPercent = (percent: string) => {
  const parsed = parseFloat(percent)

  if (parsed >= 0 ){
    return '```yaml\n' +
      `${percent}%\n` +
      '```'
  }else{

    return '```diff\n' +
      `${percent}%\n` +
      '```'
  }
}

conn.onmessage = function(evt) {
  const data = evt.data.toString()
  const obj = JSON.parse(data)

  for (const k in listening) {
    const data = listening[k]
    if (data.symbol.toUpperCase() === obj.s) {
      if (data.contextUpdate.deleted){
        delete listening[k]
      }else{

        if (delay[k] === 0) {
          data.contextUpdate.edit(new MessageEmbed({title: "Basic Ticker", description: `Watching ${data.symbol.toUpperCase()}`}).addFields({name:"Current", value: addStatus(obj.s, obj.c), inline: true}, {name: "%Chg", value: colorPercent(obj.P), inline: true}).setFooter(`Ticker id: ${k}`))
          stored[obj.s] = obj.c
        }

        delay[k] += 1

        if(delay[k] >= interval) {
          delay[k] = 0
        }
      }
    }
  }
};

client.on("message", async (mess) => {
  if (mess.author.id !== '880000846828535818') {
    const message = mess.content
    if (message.includes("-ticker")) {
      const args = message.split(" ")
      const symbol = args[1]

      if (symbol === "clear") {
        conn.send(JSON.stringify({ method: "UNSUBSCRIBE", params: Object.values(listening).map((val) => `${val.symbol}@ticker`), id: 1 }));
        for (const k in listening) {
          const data = listening[k]
          data.contextUpdate.delete()
        }
        await mess.channel.send("Cleared")
        listening = {}
        return
      }

      mess.delete()

      const initMess = await mess.channel.send(new MessageEmbed({title: "Basic Ticker", description: `Loading...`}).setFooter(`Ticker id: ${symbol.toUpperCase()}@${mess.channel.id}`))
      await initMess.react("🗑️")
      listening[`${symbol.toUpperCase()}@${mess.channel.id}`] = {
        symbol: symbol,
        contextUpdate: initMess
      }
      delay[`${symbol.toUpperCase()}@${mess.channel.id}`] = 0
      Object.keys(listening).length > 0 && conn.send(JSON.stringify({ method: "SUBSCRIBE", params: Object.values(listening).map((val) => `${val.symbol}@ticker`), id:1}));
    }
  }
})

client.on("messageReactionAdd", async (mess) => {
  const id = mess.message.embeds[0].footer?.text?.replace("Ticker id: ", "")
  if (!mess.me && id !== "" && mess.emoji.name === "🗑️") {
    id && delete listening[id]
    mess.message.delete()
  }

})

client.login(process.env.DISCORD_TOKEN)


