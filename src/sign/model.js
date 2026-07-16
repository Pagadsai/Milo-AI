import * as tf from "@tensorflow/tfjs";

let model;

// CREATE MODEL
export async function createModel(numClasses = 5) {
  model = tf.sequential();

  model.add(tf.layers.dense({
    inputShape: [63], // 21 landmarks × 3
    units: 128,
    activation: "relu"
  }));

  model.add(tf.layers.dense({
    units: 64,
    activation: "relu"
  }));

  model.add(tf.layers.dense({
    units: numClasses,
    activation: "softmax"
  }));

  model.compile({
    optimizer: "adam",
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"]
  });

  return model;
}

// GET MODEL
export function getModel() {
  return model;
}