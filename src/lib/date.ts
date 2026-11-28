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

/** "Hoy, 09:41", "Ayer, 18:02", "18 oct, 11:34" (empty string for missing dates) */
export function relativeDateTimeLabel(iso: string | null | undefined, now = new Date()) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const startOfDay = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const days = Math.round((startOfDay(now) - startOfDay(d)) / 86_400_000);
  const day =
    days === 0 ? 'Hoy' : days === 1 ? 'Ayer' : `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3).toLowerCase()}`;
  return `${day}, ${timeLabel(d)}`;
}

/** Local calendar day, e.g. "2026-11-27", to group movements by day. */
export function dayKey(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** "Hoy", "Ayer", "Martes 18 de noviembre", adding the year when it isn't the current one. */
export function dayHeaderLabel(iso: string, now = new Date()) {
  const d = new Date(iso);
  const startOfDay = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const days = Math.round((startOfDay(now) - startOfDay(d)) / 86_400_000);
  if (days === 0) return 'Hoy';
  if (days === 1) return 'Ayer';
  const label = `${WEEKDAYS[d.getDay()]} ${d.getDate()} de ${MONTHS[d.getMonth()].toLowerCase()}`;
  return d.getFullYear() === now.getFullYear() ? label : `${label} de ${d.getFullYear()}`;
}

const WEEKDAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

/** "09:41" */
export function timeLabel(date = new Date()) {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}
