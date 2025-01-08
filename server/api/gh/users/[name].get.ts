export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, 'name');

  if (!name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name is required',
    });
  }

  const user = await getUser(name);
  return {
    id: user.id,
    username: user.login,
    name: user.name,
    twitter: user.twitter_username,
    avatar: user.avatar_url,

  };
});

interface GithubUser {
  id: number;
  login: string;
  name: string;
  twitter_username: string;
  avatar_url: string;
}

const getUser = defineCachedFunction(async (name: string) => {
  const token = useRuntimeConfig().githubToken;
  return $fetch<GithubUser>(`https://api.github.com/users/${name}`, {
    method: 'GET',
    headers: {
      'User-Agent': 'fetch',
      'Authorization': `Bearer ${token}`,
    },
  });
}, {
  group: 'gh',
  swr: false,
  maxAge: 60 * 60 * 6, // 6 hours
  staleMaxAge: 60 * 60 * 12, // 12 hours
  validate(entry) {
    if (
      !entry.value
      || isEmptyArray(entry.value)
      || entry.value?.total_count === 0
      || isEmptyArray(entry.value?.items)
    ) {
      return false;
    }
    return true;
  },
});

function isEmptyArray(val: unknown) {
  return Array.isArray(val) && val.length === 0;
}
