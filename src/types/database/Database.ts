import type { Firestore } from "firebase-admin/firestore"

export type Database = Firestore | null

export interface IndexedData {
  [url: string]: {
    title: string
    playCount: number
  }
}
