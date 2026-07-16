import { GestureEstimator } from "fingerpose";

const thumbsUpGesture = {
  name: "Thumbs Up",
  curls: [],
  directions: [],
};

const victoryGesture = {
  name: "Victory",
  curls: [],
  directions: [],
};

const estimator = new GestureEstimator([
  thumbsUpGesture,
  victoryGesture,
]);

export default class GestureRecognizer {
  constructor() {
    this.lastGesture = "";
    this.lastTime = 0;
    this.delay = 1200;
  }

  recognize(landmarks) {
    if (!landmarks || landmarks.length !== 21) {
      return null;
    }

    const result = estimator.estimate(
      landmarks,
      8
    );

    if (
      !result.gestures ||
      result.gestures.length === 0
    ) {
      return this.detectBasicSigns(
        landmarks
      );
    }

    const bestGesture =
      result.gestures.reduce((p, c) =>
        p.score > c.score ? p : c
      );

    const now = Date.now();

    if (
      this.lastGesture === bestGesture.name &&
      now - this.lastTime < this.delay
    ) {
      return null;
    }

    this.lastGesture = bestGesture.name;
    this.lastTime = now;

    return {
      type: "gesture",
      label: bestGesture.name,
      score: bestGesture.score,
    };
  }

  detectBasicSigns(points) {
    const thumb = points[4];
    const index = points[8];
    const middle = points[12];
    const ring = points[16];
    const pinky = points[20];

    const wrist = points[0];

    if (
      index.y < wrist.y &&
      middle.y < wrist.y &&
      ring.y < wrist.y &&
      pinky.y < wrist.y
    ) {
      return this.returnResult(
        "HELLO"
      );
    }

    if (
      thumb.x > index.x &&
      thumb.x > middle.x
    ) {
      return this.returnResult(
        "YES"
      );
    }

    if (
      thumb.y < wrist.y &&
      index.y > wrist.y &&
      middle.y > wrist.y &&
      ring.y > wrist.y &&
      pinky.y > wrist.y
    ) {
      return this.returnResult(
        "THUMBS UP"
      );
    }

    if (
      index.y < wrist.y &&
      middle.y < wrist.y &&
      ring.y > wrist.y &&
      pinky.y > wrist.y
    ) {
      return this.returnResult(
        "PEACE"
      );
    }

    return null;
  }

  returnResult(word) {
    const now = Date.now();

    if (
      this.lastGesture === word &&
      now - this.lastTime < this.delay
    ) {
      return null;
    }

    this.lastGesture = word;
    this.lastTime = now;

    return {
      type: "word",
      label: word,
      score: 100,
    };
  }

  reset() {
    this.lastGesture = "";
    this.lastTime = 0;
  }

  isFingerOpen(tip, pip) {
    return tip.y < pip.y;
  }

  isFingerClosed(tip, pip) {
    return tip.y > pip.y;
  }

  distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;

    return Math.sqrt(dx * dx + dy * dy);
  }

  detectPinch(landmarks) {
    const thumb = landmarks[4];
    const index = landmarks[8];

    return this.distance(thumb, index) < 0.05;
  }

  detectFist(landmarks) {
    const wrist = landmarks[0];

    return (
      this.isFingerClosed(landmarks[8], landmarks[6]) &&
      this.isFingerClosed(landmarks[12], landmarks[10]) &&
      this.isFingerClosed(landmarks[16], landmarks[14]) &&
      this.isFingerClosed(landmarks[20], landmarks[18]) &&
      landmarks[8].y > wrist.y &&
      landmarks[12].y > wrist.y
    );
  }

  detectOpenPalm(landmarks) {
    return (
      this.isFingerOpen(landmarks[8], landmarks[6]) &&
      this.isFingerOpen(landmarks[12], landmarks[10]) &&
      this.isFingerOpen(landmarks[16], landmarks[14]) &&
      this.isFingerOpen(landmarks[20], landmarks[18])
    );
  }

  detectVictory(landmarks) {
    return (
      this.isFingerOpen(landmarks[8], landmarks[6]) &&
      this.isFingerOpen(landmarks[12], landmarks[10]) &&
      this.isFingerClosed(landmarks[16], landmarks[14]) &&
      this.isFingerClosed(landmarks[20], landmarks[18])
    );
  }

  detectThumbsUp(landmarks) {
    const wrist = landmarks[0];

    return (
      landmarks[4].y < wrist.y &&
      this.isFingerClosed(landmarks[8], landmarks[6]) &&
      this.isFingerClosed(landmarks[12], landmarks[10]) &&
      this.isFingerClosed(landmarks[16], landmarks[14]) &&
      this.isFingerClosed(landmarks[20], landmarks[18])
    );
  }

  recognizeCustom(landmarks) {
    if (this.detectThumbsUp(landmarks)) {
      return this.returnResult("THUMBS UP");
    }

    if (this.detectVictory(landmarks)) {
      return this.returnResult("VICTORY");
    }

    if (this.detectOpenPalm(landmarks)) {
      return this.returnResult("HELLO");
    }

    if (this.detectFist(landmarks)) {
      return this.returnResult("STOP");
    }

    if (this.detectPinch(landmarks)) {
      return this.returnResult("PINCH");
    }

    return null;
  }
}