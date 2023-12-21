export function verifyJSON(content: string): boolean {
  const jsonContent = JSON.parse(content);
  return true;
}
