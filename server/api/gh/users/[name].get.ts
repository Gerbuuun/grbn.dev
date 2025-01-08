export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, 'name');

  if (!name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name is required',
    });
  }

  const user = users[name as keyof typeof users];

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found',
    });
  }

  return {
    id: user.id,
    username: user.username,
    name: user.name,
    twitter: user.twitter,
    avatar: user.avatar,

  };
});

// interface GithubUser {
//   id: number;
//   login: string;
//   name: string;
//   twitter_username: string;
//   avatar_url: string;
// }

// const getUser = defineCachedFunction(async (name: string) => {
//   const token = useRuntimeConfig().githubToken;
//   return $fetch<GithubUser>(`https://api.github.com/users/${name}`, {
//     method: 'GET',
//     headers: {
//       'User-Agent': 'fetch',
//       'Authorization': `Bearer ${token}`,
//     },
//   });
// }, {
//   group: 'gh',
//   swr: false,
//   maxAge: 60 * 60 * 6, // 6 hours
//   staleMaxAge: 60 * 60 * 12, // 12 hours
//   validate(entry) {
//     if (
//       !entry.value
//       || isEmptyArray(entry.value)
//       || entry.value?.total_count === 0
//       || isEmptyArray(entry.value?.items)
//     ) {
//       return false;
//     }
//     return true;
//   },
// });

// function isEmptyArray(val: unknown) {
//   return Array.isArray(val) && val.length === 0;
// }

// Fuck this shit. Nuxt/Nitro is not loading the runtime config in cloudflare. So here is a hardcoded list of users.
// TODO: Fix this shit.
const users = {
  atinux: {
    id: 904724,
    username: 'atinux',
    name: 'Sébastien Chopin',
    twitter: 'Atinux',
    avatar: 'https://avatars.githubusercontent.com/u/904724?v=4',
  },
  egoist: {
    id: 8784712,
    username: 'egoist',
    name: 'EGOIST',
    twitter: 'localhost_5173',
    avatar: 'https://avatars.githubusercontent.com/u/8784712?v=4',
  },
  zernonia: {
    id: 59365435,
    username: 'zernonia',
    name: 'zernonia',
    twitter: 'zernonia',
    avatar: 'https://avatars.githubusercontent.com/u/59365435?v=4',
  },
  danielroe: {
    id: 28706372,
    username: 'danielroe',
    name: 'Daniel Roe',
    twitter: null,
    avatar: 'https://avatars.githubusercontent.com/u/28706372?v=4',
  },
};
