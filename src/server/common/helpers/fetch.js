import fetch from 'node-fetch'
import { createLogger } from './logging/logger.js'

const logger = createLogger()

async function get(url, options) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: options.headers
    })

    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`)
    }

    const contentType = response.headers?.get('content-type')

    switch (contentType) {
      case 'application/json':
        return response.json()
      case 'text/plain':
        return response.text()
      default:
        return response.blob()
    }
  } catch (error) {
    logger.error(error)
    throw error
  }
}

async function post(url, body, options) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: options.headers,
      body: options.json ? JSON.stringify(body) : body
    })

    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`)
    }

    const contentType = response.headers?.get('content-type')

    if (contentType.includes('application/json')) {
      return response.json()
    }

    if (contentType.includes('text/plain')) {
      return response.text()
    }

    return response.blob()
  } catch (err) {
    logger.error(err)

    throw err
  }
}

export { get, post }
