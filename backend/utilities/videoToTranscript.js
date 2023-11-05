// npm i openai fs
//npm i youtube-transcript
const { YoutubeTranscript } = require('youtube-transcript')
const OpenAI=require("openai")
const fs=require("fs")

const openai= new OpenAI({
apiKey:""
}) 

async function transcribeYoutube(url) {
    const transcript = await YoutubeTranscript.fetchTranscript("https://www.youtube.com/watch?v=OYrR0mLe4Pg");
    const cleanTranscript = transcript.map(entry => {
        const time = Math.floor(entry.offset / 1000);
        const minute = Math.floor(time / 60)
        const second = time % 60
        const timestamp = minute.toString() + ":" + second.toString() 

        return { text: entry.text, timestamp: timestamp};
    })
    return cleanTranscript;
}

//(async () => {
 //   const result = await transcribeYoutube("https://www.youtube.com/watch?v=OYrR0mLe4Pg");
  //  console.log(result);
//})();

const transcribeVideo=async(url)=>{
    const transcription=await openai.audio.transcriptions.create({
        file:fs.createReadStream(url),
       model:"whisper-1"
    })
    console.log(transcription) // Do something wiht the transcript
}

transcribeVideo(__dirname + "/video/a2demo.mp4")