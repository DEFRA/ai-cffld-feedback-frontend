import { BedrockChat } from '@langchain/community/chat_models/bedrock'
import { config } from '~/src/config/index.js'

const haiku = new BedrockChat({
  model: 'anthropic.claude-3-haiku-20240307-v1:0',
  region: config.get('aws.region')
})

const sonnet = new BedrockChat({
  model: 'anthropic.claude-3-sonnet-20240229-v1:0',
  region: config.get('aws.region'),
  credentials: {
    accessKeyId: config.get('aws.accessKeyId'),
    secretAccessKey: config.get('aws.secretAccessKey')
  }
})

export { haiku, sonnet }
