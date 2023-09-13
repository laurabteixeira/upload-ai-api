import fastify from "fastify";
import { fastifyCors } from "@fastify/cors"
import { GetPromptsRoute } from "./routes/PromptRoutes/GetPrompts";
import { UploadVideoRoute } from "./routes/VideoRoutes/UploadVideo";
import { CreateTranscriptionRoute } from "./routes/VideoRoutes/CreateTranscription";
import { GenerateAICompletionRoute } from "./routes/VideoRoutes/GenerateAICompletion";

const app = fastify()

app.register(fastifyCors, {
  origin: '*'
})

app.register(GetPromptsRoute)
app.register(UploadVideoRoute)
app.register(CreateTranscriptionRoute)
app.register(GenerateAICompletionRoute)

app.listen({port: 3333}).then(()=>{
  console.log('HTTP Server Running on http://localhost:3333 💗')
})