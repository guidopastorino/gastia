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

/** "27 nov 2026, 16:32" (empty string for missing dates) */
export function dateTimeLabel(iso: string | null | undefined) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const month = MONTHS[d.getMonth()].slice(0, 3).toLowerCase();
  return `${d.getDate()} ${month} ${d.getFullYear()}, ${timeLabel(d)}`;
}

/** "09:41" */
export function timeLabel(date = new Date()) {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}
