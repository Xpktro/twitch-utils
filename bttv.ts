import { getUsers } from './twitch.ts'

export const getBttvEmotes = (userId: string) =>
  fetch(`https://api.betterttv.net/3/cached/users/twitch/${userId}`)
    .then(response => response.json())
    .then(({ channelEmotes, sharedEmotes }) =>
      channelEmotes.concat(sharedEmotes)
    )

export const getFFEmotes = (userId: string) =>
  fetch(
    `https://api.betterttv.net/3/cached/frankerfacez/users/twitch/${userId}`
  ).then(response => response.json())

export const getChannelEmotes = (channel: string) =>
  getUsers({ login: [channel] })
    .then(([{ id }]) => Promise.all([getBttvEmotes(id), getFFEmotes(id)]))
    .then(([bttvEmotes, ffEmotes]) => bttvEmotes.concat(ffEmotes))
