import { v4 } from "uuid"

export type BusEvent<E extends any> = (context: E) => void

export type Bus<E extends any> = {
  subscribe: (cb: BusEvent<E>, id?: string | undefined) => string
  unsubscribe: (id: string) => void
  postAll: (context: E) => void
  post: (target: string, context: E) => void
}

export const createBus = <E extends any>(): Bus<E> => {
  const busRecord: Record<string, BusEvent<E>> = {}

  const subscribe = (cb: BusEvent<E>, id?: string | undefined) => {
    let aid = id
    if (!aid) {
      aid = v4()
    }

    busRecord[aid] = cb
    return aid
  }

  const postAll = (context: E) => {
    const buses = Object.values(busRecord)
    buses.forEach((cb) => {
      setTimeout(() => {
        cb(context)
      }, 0)
    })
  }

  const post = (target: string, context: E) => {
    const buse = busRecord[target]
    if (buse) {
      buse(context)
    }
  }

  const unsubscribe = (id: string) => {
    delete busRecord[id]
  }

  return {
    subscribe,
    unsubscribe,
    postAll,
    post
  }
}
