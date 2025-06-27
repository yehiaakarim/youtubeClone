export const startVoiceRecognition = (onResult, onError, lang = 'en-US') => {
  const SpeechRecognition = 
    window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    onError('Speech recognition not supported in this browser');
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = lang;

  let timeout = setTimeout(() => {
    recognition.stop();
    onError('timeout');
  }, 9000);

  recognition.onresult = (event) => {
    clearTimeout(timeout);
    const transcript = event.results[0][0].transcript;
    if (transcript.trim()) {
      onResult(transcript);
    }
  };

  recognition.onerror = (event) => {
    clearTimeout(timeout);
    if (event.error !== 'no-speech') {
      onError(event.error);
    }
  };

  recognition.start();
  return recognition;
};