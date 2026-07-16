import * as tf from "@tensorflow/tfjs";
import { useEffect, useRef, useState } from "react";

export default function usePredictor() {
  const modelRef = useRef(null);
  const labelsRef = useRef([]);
  const [prediction, setPrediction] = useState("");

  useEffect(() => {
    async function loadModel() {
      try {
        const model = await tf.loadLayersModel(
          "localstorage://milo-sign-model"
        );

        const labels = JSON.parse(
          localStorage.getItem("milo_labels") || "[]"
        );

        modelRef.current = model;
        labelsRef.current = labels;

        console.log("✅ Model Loaded");
      } catch {
        console.log("⚠️ No model found. Train first.");
      }
    }

    loadModel();
  }, []);

  function flatten(landmarks) {
    const hand = landmarks?.[0] || [];

    const arr = [];

    for (let i = 0; i < hand.length; i++) {
      arr.push(hand[i].x);
      arr.push(hand[i].y);
      arr.push(hand[i].z);
    }

    return arr;
  }

  async function predict(landmarks) {
    if (!modelRef.current || !landmarks) return;

    const input = flatten(landmarks);

    const tensor = tf.tensor2d([input]);

    const output = modelRef.current.predict(tensor);

    const data = await output.data();

    const maxIndex = data.indexOf(Math.max(...data));

    const label = labelsRef.current[maxIndex] || "Unknown";

    setPrediction(label);

    return label;
  }

  return { prediction, predict };
}
