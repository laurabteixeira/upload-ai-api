import fastify from "fastify";
import { prisma } from "./lib/prisma";
import { GetPromptsRoute } from "./routes/PromptRoutes/GetPrompts";
import { UploadVideoRoute } from "./routes/VideoRoutes/UploadVideo";

const app = fastify()

app.register(GetPromptsRoute)
app.register(UploadVideoRoute)

app.listen({port: 3333}).then(()=>{
  console.log('HTTP Server Running on http://localhost:3333 💗')
})