export function flattenLandmarks(landmarks) {
  if (!landmarks || !landmarks[0]) return null;

  const hand = landmarks[0];
  const result = [];

  for (let i = 0; i < hand.length; i++) {
    result.push(hand[i].x);
    result.push(hand[i].y);
    result.push(hand[i].z);
  }

  return result; // 63 values
}