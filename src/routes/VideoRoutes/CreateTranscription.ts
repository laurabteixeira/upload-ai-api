import { FastifyInstance } from "fastify";
import { createReadStream } from 'node:fs'
import { z } from 'zod';
import { prisma } from "../../lib/prisma";
import { openai } from "../../lib/openai";

const logs:Record<string,{count:number}> = {

}
export async function CreateTranscriptionRoute(app: FastifyInstance){
  try{
    app.post('/videos/:videoId/transcription', async (req) => {
    const paramsSchema = z.object({
      videoId: z.string().uuid(),
    })
    
    logs[req.ip]={
      count:logs[req.ip] ? logs[req.ip].count + 1 : 1
    }
    const requestsDone = logs[req.ip].count
    if(requestsDone>5) return "Request limit exceeded!"

    const { videoId } = paramsSchema.parse(req.params)

    const bodySchema = z.object({
      prompt: z.string(),
    })

    const { prompt } = bodySchema.parse(req.body)

    const video = await prisma.video.findUniqueOrThrow({
      where: {
        id: videoId,
      }
    })

    const videoPath = video.path

    const audioReadStream = createReadStream(videoPath)
    
    const response = await openai.audio.transcriptions.create({
      file: audioReadStream,
      model: 'whisper-1',
      language: 'pt',      
      response_format: 'json',
      temperature: 0,
      prompt,
    })

    const transcription = response.text

    await prisma.video.update({
      where: {
        id: videoId,
      },
      data: {
        transcription
      }
    })

    return { transcription }
  })
  
} catch(error){
    console.error(error)
  }
}