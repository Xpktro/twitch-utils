import { RouterMiddleware } from './deps.ts';

const strings: Record<string, Record<string, (vars?: any) => string>> = {
  en: {
    notFollowing: ({ from }) => `${from} is not following this channel`,
    following: ({ from, to, years, months, days, hours, minutes, seconds }) => {
      const units = [
        [years, 'years'],
        [months, 'months'],
        [days, 'days'],
        [hours, 'hours'],
        [minutes, 'minutes'],
        [seconds, 'seconds'],
      ].filter((item) => item[0] > 0);
      return `${from} follows the channel ` + (units.length > 1
        ? units.slice(0, units.length - 1).map(([unit, name]) => `${unit} ${name}`).join(', ') + ` and ${units[units.length - 1][0]} ${units[units.length - 1][1]} ago`
        : `${units[0][0]} ${units[0][1]} ago`);
    },
  },

  es: {
    notFollowing: ({ from }) => `${from} no está siguiendo el canal`,
    following: ({ from, to, years, months, days, hours, minutes, seconds }) => {
      const units = [
        [years, 'años'],
        [months, 'meses'],
        [days, 'días'],
        [hours, 'horas'],
        [minutes, 'minutos'],
        [seconds, 'segundos'],
      ].filter((item) => item[0] > 0);
      return `${from} sigue al canal hace ` + (units.length > 1
        ? units.slice(0, units.length - 1).map(([unit, name]) => `${unit} ${name}`).join(', ') + ` y ${units[units.length - 1][0]} ${units[units.length - 1][1]}`
        : `${units[0][0]} ${units[0][1]}`);
    },
  },
};

const i18n: RouterMiddleware = (context, next) => {
  context.state.lang = strings[context.request.url.searchParams.get('lang') || 'es'];
  return next();
};

export default i18n;
