import type { Service } from '@cloudflare/workers-types';

function getUngh() {
  // @ts-expect-error globalThis is not defined
  return (process.env.UNGH || globalThis.__env__?.UNGH || globalThis.UNGH) as Service | undefined;
}

export default defineEventHandler(async (event) => {
  const { pathname } = getRequestURL(event);
  const ungh = getUngh();

  if (!ungh) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Ungh service not found',
    });
  }

  return ungh.fetch(pathname.replace(/^\/api\/ungh/, ''));
});
