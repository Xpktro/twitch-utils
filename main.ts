import { config, intervalToDuration } from './deps.ts'
config({ export: true })

import { Application, Router, parseJSON } from './deps.ts'
import i18n from './i18n.ts'
import { users, channel } from './twitch.ts'
import { getChannelEmotes } from './bttv.ts'
import { paginateWords } from './utils.ts'

const router = new Router()
router
  .get(
    '/follows/:from/:to',
    i18n,
    ({ response, params: { from, to }, state: { lang } }) =>
      users
        .follows({ from, to })
        .then(followages =>
          !followages || followages.length < 1
            ? lang.notFollowing({ from })
            : lang.following({
                from,
                to,
                ...intervalToDuration({
                  start: parseJSON(followages[0].followed_at),
                  end: new Date(),
                }),
              })
        )
        .then(body => {
          response.body = body
        })
  )
  .get(
    '/channels/:channelId/chatters/random',
    ({ response, params: { channelId } }) =>
      channel
        .chatters(channelId!)
        .then(chatters =>
          chatters.length
            ? chatters[Math.floor(Math.random() * chatters.length)]
            : ''
        )
        .then(chatter => (response.body = chatter))
  )
  .get(
    '/channels/:channel/emotes',
    ({
      response,
      params: { channel },
      request: {
        url: { searchParams },
      },
    }) =>
      getChannelEmotes(channel!)
        .then(emotes => emotes.map((emote: { code: string }) => emote.code))
        .then(
          paginateWords(
            parseInt(searchParams.get('page') || '1'),
            parseInt(searchParams.get('size') || '500')
          )
        )
        .then(({ pages, page, size }) => {
          response.headers.set('X-Pages', `${pages}`)
          response.headers.set('X-Page-Size', `${size}`)
          response.body = page.join(' ')
        })
  )

const app = new Application()
app.use(async (ctx, next) => {
  await next()
  console.log(`${ctx.request.method} ${ctx.request.url}`)
})
app.addEventListener('error', evt => {
  // Will log the thrown error to the console.
  console.log(evt.error)
})
app.use(router.routes())
app.use(router.allowedMethods())
await app.listen({ port: parseInt(Deno.env.get('PORT') || '8000') })
