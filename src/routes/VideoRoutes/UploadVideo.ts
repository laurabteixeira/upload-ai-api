import { FastifyInstance } from "fastify";
import { fastifyMultipart } from '@fastify/multipart';
import { randomUUID } from 'node:crypto'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'
import fs from 'node:fs'
import path from 'node:path';
import { prisma } from "../../lib/prisma";

const streamStage = promisify(pipeline)

export async function UploadVideoRoute(app: FastifyInstance){
  try {
    app.register(fastifyMultipart, {
      limits: {
        fileSize: 1_048_576 * 25, //25mb
      }
    })
    
    app.post('/videos', async (request, reply) => {
      const data = await request.file()
  
      if (!data) {
        return reply.status(400).send({error: 'Missing file input.'})
      }
  
      const extension = path.extname(data.filename)
  
      if (extension !== '.mp3') {
        return reply.status(400).send({error: 'Invalid input type: it is not a .mp3 extension.'})
      }
      // example.mp3
  
      const fileBaseName = path.basename(data.filename, extension)
      // example
  
      const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`
      // example-1a726600-e52c-4067-8a5d-1a7522b36f2a-mp3
  
      const uploadDestination = path.resolve(__dirname, '../../../tmp', fileUploadName)
  
      await streamStage(data.file, fs.createWriteStream(uploadDestination))
  
      const video = await prisma.video.create({
        data: {
          name: data.filename,
          path: uploadDestination
        }
      })
  
      return {video}
    })
    
  } catch (error) {
    console.error(error)
  }
}