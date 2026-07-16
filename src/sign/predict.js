import * as tf from "@tensorflow/tfjs";
import { flattenLandmarks } from "./utils";

let model;

export async function loadModel() {
  model = await tf.loadLayersModel("localstorage://milo-model");
  return model;
}

export async function predictGesture(landmarks, labels) {
  if (!model) return "NO MODEL";

  const input = flattenLandmarks(landmarks);

  const tensor = tf.tensor2d([input]);

  const output = model.predict(tensor);

  const data = await output.data();

  const index = data.indexOf(Math.max(...data));

  return labels[index];
}