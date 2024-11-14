import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
})

export async function openAiRequest(request: string): Promise<string> {
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: request }],
      model: 'gpt-3.5-turbo',
    })
    if(chatCompletion.choices[0].message.content){
      return chatCompletion.choices[0].message.content  
    }
    else{
        return 'ooops... error'
    }
}
