export function redactForLogs(value: unknown): unknown {
  try {
    const str = JSON.stringify(value);
    return str
      .replace(/\b[\w.-]+@[\w.-]+\.[A-Za-z]{2,}\b/g, '[redacted-email]')
      .replace(/\b\+?\d[\d\s().-]{7,}\b/g, '[redacted-phone]');
  } catch {
    return '[unserializable]';
  }
}


