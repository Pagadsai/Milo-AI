function flattenLandmarks(landmarks) {
  return landmarks.flatMap(p => [p.x, p.y, p.z]);
}

export function predictGesture(landmarks) {
  if (!landmarks) return null;

  const features = flattenLandmarks(landmarks);

  const thumbUp = features[4 * 3 + 1] < features[8 * 3 + 1];
  const indexUp = features[8 * 3 + 1] < features[6 * 3 + 1];

  if (thumbUp && indexUp) return "HELLO";
  if (indexUp) return "YES";
  if (!indexUp) return "NO";
  if (thumbUp) return "THANK YOU";

  return "UNKNOWN";
}
