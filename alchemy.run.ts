import * as Alchemy from 'alchemy';
import * as Cloudflare from 'alchemy/Cloudflare';
import { Build } from 'alchemy/Command';
import * as Effect from 'effect/Effect';

const dnsSetup = Effect.gen(function* () {
  const domain = 'grbn.dev';

  const zone = yield* Cloudflare.Zone.Zone('Zone', {
    name: domain,
  });

  const records = yield* Effect.all([
    // Cloudflare.DNS.Record('DNS/LocalTunnel', {
    //   zoneId: zone.zoneId,
    //   name: `local.${domain}`,
    //   type: 'CNAME',
    //   content: '945b2f4a-5152-43e4-8c69-95bdb8855808.cfargotunnel.com',
    //   ttl: 1,
    //   proxied: true,
    //   comment: 'tunnel to macbook',
    // }),
    // Cloudflare.DNS.Record('DNS/Atproto', {
    //   zoneId: zone.zoneId,
    //   name: `_atproto.${domain}`,
    //   type: 'TXT',
    //   content: '"did=did:plc:qcow2rwqmpspzb3vzpi2evjk"',
    //   ttl: 1,
    //   comment: 'Bluesky handle',
    // }),
    // Cloudflare.DNS.Record('DNS/Discord', {
    //   zoneId: zone.zoneId,
    //   name: `_discord.${domain}`,
    //   type: 'TXT',
    //   content: '"dh=e466eafdb1f55d3a966240ca9996d11249e3633c"',
    //   ttl: 1,
    //   comment: 'Discord',
    // }),
    // Cloudflare.DNS.Record('DNS/Spf', {
    //   zoneId: zone.zoneId,
    //   name: domain,
    //   type: 'TXT',
    //   content: '"v=spf1 -all"',
    //   ttl: 1,
    //   comment: 'Disable Email',
    // }),
  ]);

  return {
    records,
    zone,
    domain,
  };
});

export default Alchemy.Stack(
  'GrbnDev',
  {
    providers: Cloudflare.providers(),
    state: Cloudflare.state(),
  },
  Effect.gen(function* () {
    const { stage } = yield* Alchemy.Stack;
    const isProd = stage === 'production';

    const { domain } = yield* dnsSetup;

    const content = yield* Cloudflare.D1.Database('Content', {
      name: `grbn-dev-content-${stage}`,
      primaryLocationHint: 'weur',
    });

    const build = yield* Build('Build', {
      command: 'pnpm build',
      outdir: '.output/public',
    });

    const worker = yield* Cloudflare.Worker('Website', {
      name: `grbn-dev-${stage}`,
      main: '.output/server/index.mjs',
      assets: {
        directory: build.outdir,
      },
      compatibility: {
        date: '2026-07-08',
        flags: ['nodejs_compat'],
      },
      env: {
        DB: content,
      },
      domain: isProd ? [domain, `www.${domain}`] : [`${stage}.${domain}`],
      tags: ['grbn.dev', 'website'],
    });

    return {
      stage,
      url: worker.url,
      worker: worker.workerName,
      content: content.databaseName,
    };
  }),
);
