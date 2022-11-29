import firebaseAdmin from 'firebase-admin'
import { AppSettings } from '../types'

const creds = {
  type: 'service_account',
  project_id: 'sunray-369217',
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY,
  client_email: 'firebase-adminsdk-jk598@sunray-369217.iam.gserviceaccount.com',
  client_id: '112496286976379822085',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-jk598%40sunray-369217.iam.gserviceaccount.com',
}

try {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(creds as any),
  })
  console.log('Initialized.')
} catch (error) {
  if (error instanceof Error && !/already exists/u.test(error.message)) {
    console.error('Firebase firebaseAdmin initialization error', error.stack)
  }
}

export default firebaseAdmin

export async function getUserSettings(email: string): Promise<AppSettings> {
  const db = firebaseAdmin.firestore()

  const settingsDb = db.collection('settings')
  const document = await settingsDb.doc(email).get()

  return document.data() as AppSettings
}

export async function setUserSettings(
  email: string,
  settings: Partial<AppSettings>
): Promise<AppSettings> {
  const db = firebaseAdmin.firestore()

  const settingsDb = db.collection('settings')
  const document = await settingsDb.doc(email).update(settings)

  const updatedSettings = getUserSettings(email)

  return updatedSettings
}
