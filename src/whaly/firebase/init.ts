import { err, info } from "@utils/logger"
import * as admin from "firebase-admin"
import type { Firestore } from "firebase-admin/firestore"
import { getFirestore } from "firebase-admin/firestore"

const createDatabase = (): Firestore | null => {
  try {
    const app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FB_PROJECT_ID,
        privateKey: process.env.FB_PRIVATE_KEY,
        clientEmail: process.env.FB_CLIENT_EMAIL
      })
    })

    info("database | successfully initialise database instance.")
    return getFirestore(app)
  } catch (e) {
    err(`database | unable to initialise database instance. ${e}`)
    return null
  }
}

export { createDatabase }
