const TWITCH_ROOT = 'https://api.twitch.tv/helix';

// {
//   access_token: '4ve0hakha8n919zere8l6w6dy8e2jh',
//   expires_in: 5227917,
//   token_type: 'bearer'
// }

const credentials = {
  expiresIn: 0, //(new Date()).getTime() + expires_in
  accessToken: ''
};

const now = () => (new Date()).getTime();

export const getAccessToken = () =>
  fetch(
    'https://id.twitch.tv/oauth2/token',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: Deno.env.get('TWITCH_CLIENT_ID'),
        client_secret: Deno.env.get('TWITCH_CLIENT_SECRET')
      })
    }
  )
  .then(r => r.json())
  .then(({ access_token, expires_in }) => {
    credentials.expiresIn = now() + expires_in;
    credentials.accessToken = access_token;
    return access_token;
  });

const request = (endpoint: string, params = {}) =>
  Promise.resolve(
    credentials.expiresIn <= now()
      ? getAccessToken()
      : credentials.accessToken
  )
  .then(accessToken =>
    fetch(
      `${TWITCH_ROOT}/${endpoint}`,
      {
        method: 'GET',
        headers: {
          'Client-ID': Deno.env.get('TWITCH_CLIENT_ID')!,
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        ...params
      }
    )
    .then(r => r.json())
  );

const getUsers = ({ id = [], login = [] }: { id?: string[], login?: string[] }) =>
  Promise.resolve(
    new URLSearchParams(
      id.map(id_ => ['id', id_])
      .concat(login.map(l => ['login', l]))
    )
  )
  .then(params => request(`users?${params}`))
  .then(response => response.data);

const usersFollows = ({ fromId = '', toId = '', from = '', to = '' }) =>
  Promise.resolve(
    from || to // FIXME: How about an id and a login?
      ? getUsers({ login: [from, to] })
        .then(users => users.map((user: { id: string }) => user.id))
      : [fromId, toId]
  )
  .then(([from_id, to_id]: any) =>
    request(`users/follows?${new URLSearchParams({ from_id, to_id })}`)
  )
  .then(response => response.data);

export const users = {
  get: getUsers,
  follows: usersFollows
};
