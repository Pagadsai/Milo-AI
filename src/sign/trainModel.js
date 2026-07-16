import * as tf from "@tensorflow/tfjs";
import { flattenLandmarks } from "./utils";

export async function trainModel(dataset, labels) {
  const xs = [];
  const ys = [];

  const labelMap = {};

  labels.forEach((l, i) => {
    labelMap[l] = i;
  });

  dataset.forEach(item => {
    const input = flattenLandmarks(item.data);

    xs.push(input);

    const oneHot = Array(labels.length).fill(0);
    oneHot[labelMap[item.label]] = 1;

    ys.push(oneHot);
  });

  const xsTensor = tf.tensor2d(xs);
  const ysTensor = tf.tensor2d(ys);

  const model = tf.sequential();

  model.add(tf.layers.dense({
    inputShape: [63],
    units: 128,
    activation: "relu"
  }));

  model.add(tf.layers.dense({
    units: 64,
    activation: "relu"
  }));

  model.add(tf.layers.dense({
    units: labels.length,
    activation: "softmax"
  }));

  model.compile({
    optimizer: "adam",
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"]
  });

  await model.fit(xsTensor, ysTensor, {
    epochs: 30,
    batchSize: 8
  });

  await model.save("localstorage://milo-model");

  return model;
}