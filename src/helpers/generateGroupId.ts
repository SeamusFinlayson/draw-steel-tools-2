export function generateGroupId() {
  return `${Date.now().toString()}-${Math.trunc(Math.random() * 10000)}`;
}
