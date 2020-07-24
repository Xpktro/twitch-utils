import { config } from './deps.ts';
config({ export: true });

import { Application, Router } from './deps.ts';
import i18n from './i18n.ts';
import { users } from './twitch.ts';
import { dateDiff } from './utils.ts';

const router = new Router();
router
  .get('/follows/:from/:to', i18n, async ({ response, params: { from, to }, state: { lang } }) =>
    users.follows({ from, to })
      .then(followages =>
        (!followages || followages.length < 1)
          ? lang.notFollowing({ from })
          : lang.following({ from, to, ...dateDiff(followages[0].followed_at, new Date()) })
      )
      .then(body => {
        response.body = body;
      })
  );

const app = new Application();
app.use(async (ctx, next) => {
  await next();
  console.log(`${ctx.request.method} ${ctx.request.url}`);
});
app.addEventListener('error', (evt) => {
  // Will log the thrown error to the console.
  console.log(evt.error);
});
app.use(router.routes());
app.use(router.allowedMethods());
await app.listen({ port: parseInt(Deno.env.get('PORT') || '8000') });
