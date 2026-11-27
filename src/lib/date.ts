export function greetingForHour(hour = new Date().getHours()) {
  if (hour < 12) return 'Buenos días';
  if (hour < 20) return 'Buenas tardes';
  return 'Buenas noches';
}

const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

/** "Noviembre 2026" */
export function monthLabel(date = new Date()) {
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

/** "09:41" */
export function timeLabel(date = new Date()) {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}
