/**
 * Indian Standard Time (IST - UTC+05:30) Formatter
 * Prevents UTC midnight date-shift discrepancies in Indian financial records and cash counter closure.
 */
export function getIndianDateString(date: Date = new Date()): string {
  // Returns YYYYMMDD in Asia/Kolkata (e.g. 20261114)
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(date).replace(/-/g, '');
}

export function getIndianIsoDate(date: Date = new Date()): string {
  // Returns YYYY-MM-DD in Asia/Kolkata (e.g. 2026-11-14)
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(date);
}

export function getIndianTimestamp(date: Date = new Date()): string {
  // Returns readable IST timestamp: YYYY-MM-DD HH:mm:ss IST
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  return `${formatter.format(date)} IST`;
}
