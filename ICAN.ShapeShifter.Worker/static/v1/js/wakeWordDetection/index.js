let recognizer;

function predictWord(callback) {
 // Array of words that the recognizer is trained to recognize.
 const words = recognizer.wordLabels();
 recognizer.listen(({scores}) => {
   // Turn scores into a list of (score,word) pairs.
   scores = Array.from(scores).map((s, i) => ({score: s, word: words[i]}));
   // Find the most probable word.
   scores.sort((s1, s2) => s2.score - s1.score);
   
   console.log("\t[INFO] wakeWordDetection, predicted word " + 
            scores[0].word + ", score " + scores[0].score);

   if (callback != null) callback(scores[0].word);
 }, {probabilityThreshold: 0.85});
}

async function wakeWordApp(callback) {
 recognizer = speechCommands.create('BROWSER_FFT');
 await recognizer.ensureModelLoaded();
 predictWord(callback);
}
