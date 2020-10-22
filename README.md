# Twitch Utils Server

A collection of Twitch related utilites for using them with your favorite bot. Written in deno.

## Install

You require [Deno](https://deno.land/) (as of now using 1.2.0).
You also need to get a [Twitch App ID and Secret](https://dev.twitch.tv/console/apps) (put them in `.env`)

## Usage

`./run.sh`.

## Endpoints

### `/follows/:from/:to`

Returns a string with the time a user is following a channel

#### URL Parameters

- `:from`: user following a channel/another user
- `:to`: channel/user to be queried against

#### Query Parameters

- `lang`: Language code to return the response into (defaults to `es`)

#### Example:

```
> GET /follows/thespectralmachine/danielapirata?lang=en
< thespectralmachine follows the channel 8 months, 1 days, 20 hours, 16 minutes and 34 seconds ago
```

#### Command Example

Nightbot:

```
!addcom !followage $(urlfetch https://example.com/follows/$(querystring $(touser))/$(querystring $(channel)))
```

### `/channels/:channel/chatters/random`

Returns a string with the name of a random chatter in a given channel

#### URL Parameters

- `:channel`: channel to obtain a random chatter name from

#### Example:

```
> GET /channels/macheenhs/chatters/random
< thespectralmachine
```

#### Command Example

Nightbot:

```
!addcom !slap $(user) slaps $(urlfetch https://example.com/channels/macheenhs/chatters/random) in the face with a fish
```

### `/channels/:channel/emotes`

Returns a (paginated) string with a list of BTTV and FF emotes available in a channel

#### URL Parameters

- `:channel`: channel to obtain the emotes list from

#### Query Parameters

- `page`: Page number. Defaults to `1`
- `size`: Max character size per page. Defaults to `500`

#### Response Headers

- `X-Pages`: Number of available pages
- `X-Page-Size`: Max character size for each page

#### Example:

```
> GET /channels/topopablo11hs/emotes?page=1
< pepoS gachiBASS EZ FeelsRareMan pepeClap monkaShoot PepeHands ...
```

#### Command Example

Nightbot:

```
!addcom !emotes $(urlfetch https://example.com/channels/$(querystring $(channel))/emotes?page=$(query))
```

Phantombot:

```
!addcom !emotes (customapi https://example.com/channels/(channelname)/emotes?page=(echo))
```
