import { config } from 'dotenv'

config()

export const PORT = process.env.PORT
export const BASE_URL = process.env.BASE_URL
export const API_KEY = process.env.API_KEY
export const SECRET = process.env.SECRET
export const EMAIL = process.env.EMAIL
export const DEFAULT_PROFILE_IMAGE_PATH = process.env.DEFAULT_PROFILE_IMAGE_PATH;