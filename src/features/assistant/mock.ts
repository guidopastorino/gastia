import type { ChatMessage, Suggestion } from './types';

// Placeholder conversation until the assistant is connected to a model.

export function initialMessages(firstName: string): ChatMessage[] {
  return [
    {
      id: 'm1',
      role: 'assistant',
      text: `Hola ${firstName}, he analizado tus gastos de los últimos 30 días. ¿En qué puedo ayudarte hoy?`,
      time: '09:41',
      note: 'Cuentas sincronizadas',
    },
    {
      id: 'm2',
      role: 'user',
      text: '¿Cuánto gasté en restaurantes este mes y cómo afecta mi meta de vacaciones?',
      time: '09:42',
    },
    {
      id: 'm3',
      role: 'assistant',
      text: 'Llevas gastados **$385.00** en restaurantes (un **↑ 15%** más que el mes pasado).\n\nSi reduces **$60.00** en salidas durante las próximas dos semanas, alcanzarás tu objetivo de ahorro de **$1,200.00** para el viaje sin retrasos.',
      time: '09:42',
      note: 'Cálculo predictivo',
      goal: {
        title: 'Vacaciones 2027',
        status: 'Objetivo en curso',
        saved: 940,
        target: 1200,
        icon: 'airplane-outline',
      },
    },
  ];
}

export const suggestions: Suggestion[] = [
  { id: 's1', label: '¿Puedo comprar un boleto de avión hoy?', icon: 'card-outline' },
  { id: 's2', label: 'Resume mis suscripciones', icon: 'albums-outline' },
  { id: 's3', label: '¿Dónde puedo ahorrar más?', icon: 'leaf-outline' },
];

export const demoReply =
  'Estoy en **modo demo**: todavía no estoy conectado a tus cuentas, así que no puedo responder con tus datos reales. ¡Pronto podré ayudarte con esto!';
