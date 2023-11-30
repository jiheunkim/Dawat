export function getRandomColor() {
  // 랜덤 마스크 색상 설정하는 코드
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return [r, g, b];
}
