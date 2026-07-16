// src/sign/sentenceBuilder.js

let sentence = [];

export function addWord(word) {
  if (!word || word === "UNKNOWN") return;

  sentence.push(word);

  if (sentence.length > 10) {
    sentence.shift();
  }

  return sentence.join(" ");
}

export function clearSentence() {
  sentence = [];
}