import { TextToSpeech, getTextToSpeechVoice } from './text-to-speech'

init()

async function init() {
  const voice = await getTextToSpeechVoice()
  const textToSpeech = new TextToSpeech(voice)

  textToSpeech.speak('Hello world')

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'speak') {
      textToSpeech.speak(message.text)
    }
  })
}
