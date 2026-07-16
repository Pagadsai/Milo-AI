export function recognizeGesture(landmarks) {
    if (!landmarks || landmarks.length === 0) return null;
  
    const hand = landmarks[0];
  
    const thumbTip = hand[4];
    const indexTip = hand[8];
    const middleTip = hand[12];
    const ringTip = hand[16];
    const pinkyTip = hand[20];
  
    const indexMcp = hand[5];
    const middleMcp = hand[9];
  
    const isThumbUp = thumbTip.y < indexMcp.y;
    const isIndexUp = indexTip.y < indexMcp.y;
    const isMiddleUp = middleTip.y < middleMcp.y;
    const isRingUp = ringTip.y < middleMcp.y;
    const isPinkyUp = pinkyTip.y < middleMcp.y;
  
    if (isThumbUp && !isIndexUp && !isMiddleUp) {
      return "YES 👍";
    }
  
    if (isIndexUp && isMiddleUp && isRingUp && isPinkyUp) {
      return "HELLO 👋";
    }
  
    if (isIndexUp && isMiddleUp && !isRingUp && !isPinkyUp) {
      return "PEACE ✌️";
    }
  
    if (!isIndexUp && !isMiddleUp && !isRingUp && !isPinkyUp) {
      return "OK 👌";
    }
  
    return null;
  }