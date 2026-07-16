function isFingerUp(points, tip, pip) {
  return points[tip].y < points[pip].y;
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function recognizeSign(points) {
  if (!points || points.length !== 21) return null;

  const index = isFingerUp(points, 8, 6);
  const middle = isFingerUp(points, 12, 10);
  const ring = isFingerUp(points, 16, 14);
  const pinky = isFingerUp(points, 20, 18);

  const thumbUp =
    points[4].y < points[3].y &&
    points[4].y < points[2].y;

  const openFingers = [index, middle, ring, pinky].filter(Boolean).length;

  // 👌 OK
  if (
    distance(points[4], points[8]) < 0.05 &&
    middle &&
    ring &&
    pinky
  ) {
    return "OK";
  }

  // 👋 HELLO
  if (openFingers === 4) {
    return "HELLO";
  }

  // ✌️ PEACE
  if (index && middle && !ring && !pinky) {
    return "PEACE";
  }

  // 👍 YES
  if (thumbUp && openFingers === 0) {
    return "YES";
  }

  // ✊ STOP
  if (!thumbUp && openFingers === 0) {
    return "STOP";
  }

  // ☝️ I
  if (index && !middle && !ring && !pinky) {
    return "I";
  }

  // 🤘 HELP
  if (index && !middle && !ring && pinky) {
    return "HELP";
  }

  return null;
}