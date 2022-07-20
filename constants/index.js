import { config } from 'dotenv'

config()

export const PORT = process.env.PORT
export const BASE_URL = process.env.BASE_URL
export const API_KEY = process.env.API_KEY
export const SECRET = process.env.SECRET
export const EMAIL = process.env.EMAIL
export const PASSWORD = process.env.PASSWORD
export const DEFAULT_PROFILE_IMAGE_PATH = process.env.DEFAULT_PROFILE_IMAGE_PATH;
export const MONGODB_URI = process.env.MONGODB_URI
export const VIDEO_FILE_UPLOAD_PATH = process.env.VIDEO_FILE_UPLOAD_PATH
export const THUMBNAIL_FILE_UPLOAD_PATH = process.env.THUMBNAIL_FILE_UPLOAD_PATH