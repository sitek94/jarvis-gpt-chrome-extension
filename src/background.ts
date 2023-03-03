import { TextToSpeech, getTextToSpeechVoice } from '@lib/text-to-speech'

init()

async function init() {
  const voice = await getTextToSpeechVoice()
  const textToSpeech = new TextToSpeech(voice)

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'speak') {
      textToSpeech.speak(message.text)
    }
  })
}
