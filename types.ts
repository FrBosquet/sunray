export type Tokens = {
  access_token: string
  refresh_token: string
  expiry_date: number
}

export type Profile = {
  name: string
  picture: string
  email: string
}

export type AppSettings = {
  inputSheet: string
  baseFolder: string
  columnRange: string
}
