---
title: Multi-tenancy with Nuxt and Cloudflare
description: My journey implementing multi-tenancy in my Nuxt project deployed to cloudflare workers.
date: 2025-01-04
readingTime: 12
tags:
  - Cloudflare
  # - DNS
  # - Multi-tenancy
  - Nuxt
  # - Vue
references:
  - label: 2024 Multi-Tenancy blog
    to: https://egoist.dev/multi-tenant-web-app-2024
    icon: i-lucide-letter-text
  - label: Why Keypress blog
    to: https://zernonia.keypress.blog/why-keypress
    icon: i-lucide-letter-text
  - label: Keypress github repo
    to: https://github.com/zernonia/keypress
    icon: i-simple-icons-github
  - label: Cloudflare DNS Wildcard
    to: https://developers.cloudflare.com/dns/manage-dns-records/reference/wildcard-dns-records/
    icon: i-simple-icons-cloudflare
  - label: Cloudflare Worker Routes
    to: https://developers.cloudflare.com/workers/configuration/routing/
    icon: i-simple-icons-cloudflare
  - label: NuxtHub
    to: https://hub.nuxt.com/
    icon: i-simple-icons-nuxtdotjs
  - label: Nuxt Custom Routing
    to: https://nuxt.com/docs/guide/recipes/custom-routing
    icon: i-simple-icons-nuxtdotjs
  - label: Vue Router Options
    to: https://router.vuejs.org/api/interfaces/RouterOptions.html
    icon: i-simple-icons-vuedotjs
  - label: Example project
    to: https://github.com/gerbuuun/nuxt-cloudflare-multi-tenancy
    icon: i-simple-icons-github
---

_NOTE: for now, any mention of the actual domain and project name is redacted. I'll update this post once I've finished the migration._

## Introduction

Last year, I was asked to create a ticket sale platform — à la ticketmaster — for a local event. The solution they were using no longer met the requirements and as such were looking for alternatives. I agreed to do it for dirt cheap, with the idea to sell the service to possible future customers as well. They agreed. So with that in mind, I architected the application in such a way to support multiple clients and events — aka multi-tenancy.

::Tree
---
title: Nuxt project structure
items:
  - title: app
    icon: i-lucide-folder
    children:
    - title: pages
      children:
        - title: org
          icon: i-lucide-folder
          children:
            - title: '[id].vue'
              icon: i-vscode-icons-file-type-vue
        - title: shop
          icon: i-lucide-folder
          children:
            - title: '[id].vue'
              icon: i-vscode-icons-file-type-vue
        - title: user
          icon: i-lucide-folder
          children:
            - title: '[id].vue'
              icon: i-vscode-icons-file-type-vue
        - title: 'index.vue'
          icon: i-vscode-icons-file-type-vue
    - title: 'app.vue'
      icon: i-vscode-icons-file-type-vue
  - title: 'nuxt.config.ts'
    icon: i-vscode-icons-file-type-nuxt
  - title: 'package.json'
    icon: i-vscode-icons-file-type-json
defaultExpanded:
  - app
  - pages
  - org
---

#left
The straight forward implementation might look something like this:

- Every user can access their account at `my-company.com/user/{user_id}`
- Organization dashboards can be found at `my-company.com/org/{org_id}`
- Ticket shops can be found at `my-company.com/shop/{shop_id}`

This is very easy to implement in Nuxt — just create a page with brackets and any value at that location in the URL will route to that page. In the directory structure, you can see each of the dynamic pages are called `[id].vue`. Based on both the value of `id` in the URL and the user's login status, you can fetch the right data.
::

This is exactly how I implemented it. The client created an organization, added ~5 users to it and then created a ticket shop. The ticket sale went flawlessly and the client was happy. So happy in fact that they told me they would like to use the service for other events as well. There was one small pain point though: the URLs. I was using my own domain which was a `.io` domain. They never heard of it and were not entirely sure if their customers would trust it. The same happened when I registered my company — under which I am selling the service. The person helping me at the chamber of commerce questioned why I wouldn't just use my country's TLD. Both of them had a point. Nothing about the domain lets customers know what event they were buying tickets for. It was also impossible to just type in the search bar of their browser. Which is very important for word-of-mouth marketing.

## Implementing subdomains

I've read about subdomain based routing before and thought it would be a good solution for this problem. If you compare a domain like `{some_event}.my-company.com` to the current implementation `my-company.com/shop/{shop_id}`, there is immediate feedback that the site you are visiting is the one you want to be on. Instead of a random string of characters in the URL, you now have a recognizable name.

### Subdomains in Nuxt

The [2024 multi-tenancy blog post](https://egoist.dev/multi-tenant-web-app-2024) by :user{username="egoist"} and :user{username="zernonia"}'s [Why Keypress blog post](https://zernonia.keypress.blog/why-keypress) with the [Keypress github repo](https://github.com/zernonia/keypress) helped me understand how to implement the routing. Nuxt has a special file — `router.options.ts` — located in the `app` folder, where you can configure the [vue-router options](https://router.vuejs.org/api/interfaces/RouterOptions.html). You can add a simple function to filter the routes based on the domain. In my case, I want to map any subdomain to a specific folder in the `pages` directory — let's say `pages/tenant`.

- `my-company.com` should access all pages _except_ the ones in `pages/tenant`
- `client-1.my-company.com` should _only_ access pages in `pages/tenant`
- `client-2.my-company.com` should _only_ access pages in `pages/tenant`

Adding the following function to the router options will filter the routes based on the subdomain.

```ts [app/router.options.ts]
import type { RouterOptions } from '@nuxt/schema';
import type { RouteRecordRaw } from 'vue-router';

const DOMAIN = 'my-company.com';
const routeRegex = new RegExp(`^\/tenant\/?`);
const isTenantRoute = (route: RouteRecordRaw) => route.path.match(routeRegex);

export default <RouterOptions>{
  routes: (routes) => {
    const { hostname } = useRequestURL();
    const subdomain = hostname.replace(`.${DOMAIN}`, '');

    return routes
      .filter(route => subdomain ? isTenantRoute(route) : !isTenantRoute(route))
      .map(route => ({
        ...route,
        path: route.path.replace(routeRegex, '/'),
      }));
  },
}
```

_In this example, we get the subdomain by removing the domain from the hostname. Then we filter which routes should be accessible based on if there is a subdomain. So, all pages in the `pages/tenant` folder will be accessible from `*.my-company.com`, and all other pages will be accessible from `my-company.com`. Lastly, we remove the folder from the path so that the pages in the `pages/tenant` folder are accessible from `*.my-company.com/some-page` instead of `*.my-company.com/tenant/some-page`._


::Tree
---
title: Nuxt project structure
items:
  - title: app
    children:
      - title: pages
        children:
          - title: tenant
            children:
              - title: 'dashboard.vue'
                icon: i-vscode-icons-file-type-vue
              - title: 'index.vue'
                icon: i-vscode-icons-file-type-vue
              - title: 'tickets.vue'
                icon: i-vscode-icons-file-type-vue
          - title: other
            children:
              - title: 'page.vue'
                icon: i-vscode-icons-file-type-vue
          - title: index.vue
            icon: i-vscode-icons-file-type-vue
          - title: 'pricing.vue'
            icon: i-vscode-icons-file-type-vue
      - title: 'app.vue'
        icon: i-vscode-icons-file-type-vue
      - title: 'router.options.ts'
        icon: i-vscode-icons-file-type-typescript
  - title: 'nuxt.config.ts'
    icon: i-vscode-icons-file-type-nuxt
  - title: 'package.json'
    icon: i-vscode-icons-file-type-json
defaultExpanded:
  - app
  - pages
---

#left
With the custom routing in place, we can now split the application into each part:

- Any page in `pages/tenant` will be accessible at `*.my-company.com`
- Any page in `pages/other` will be accessible at `my-company.com/other`
- `pages/index.vue` will be accessible at `my-company.com`
- `pages/pricing.vue` will be accessible at `my-company.com/pricing`
- etc.

Now when a user visits `some-event.my-company.com`, all pages in `pages/tenant` will be accessible. Based on the subdomain, we can fetch all the cool tickets that are available for purchase from the database and display them on the page.
::

### Fetching the correct data
When visiting `some-event.my-company.com`, we don't want to fetch all the tickets from the database. We want to fetch the tickets for that specific event. A very simple way to do this is to create a composable that just stores the current tenant ID, or in my case the event ID.

```ts [app/composables/useEvent.ts]
export function useEvent() {
  return useStorage<string>('eventID', () => '');
}
```

In the router options, we can now fetch the event ID from the subdomain and store it for easy access throughout the application.

```ts [app/router.options.ts]{11,14,17}
import type { RouterOptions } from '@nuxt/schema';
import type { RouteRecordRaw } from 'vue-router';

const DOMAIN = 'my-company.com';
const routeRegex = new RegExp(`^\/tenant\/?`);
const isTenantRoute = (route: RouteRecordRaw) => route.path.match(routeRegex);

export default <RouterOptions>{
  routes: (routes) => {
    const { hostname } = useRequestURL();
    const eventID = useEvent();

    const subdomain = hostname.replace(`.${DOMAIN}`, '');
    eventID.value = await $fetch('/api/tenant', { query: { subdomain } });

    return routes
      .filter(route => eventID.value ? isTenantRoute(route) : !isTenantRoute(route))
      .map(route => ({
        ...route,
        path: route.path.replace(routeRegex, '/'),
      }));
  },
}
```

_The highlighted lines show the changes. Before filtering the routes, we fetch the event ID based on the subdomain from a database, KV, or whatever you prefer. If the subdomain is not related to an event, we can show the normal pages instead. This is the behaviour we want for `www.my-company.com` for example._

Now we can fetch the data for the event and display it on the page.

```vue [pages/tenant/index.vue]
<script setup lang="ts">
const eventID = useEvent();
const { data } = await useFetch(`/api/event/${eventID}`);
</script>

<template>
  <div>
    <pre>{{ data }}</pre>
  </div>
</template>
```

### Adding DNS Records

The last step before the everything works, we need to add the subdomain records to the DNS. In this case we want to allow for any subdomain so we need to add a wildcard DNS record. I'm deploying to Cloudflare Pages so the actual location of the application is at `<project-name>.<org-name>.pages.dev`. First I need to point to that domain with the following DNS records:

| Type | Name | Value | Notes |
| --- | --- | --- | --- |
| CNAME | `@` | `<project-name>.<org-name>.pages.dev` | root domain |
| CNAME | `*` | `<project-name>.<org-name>.pages.dev` | wildcard subdomain |

And then also add the domains directly to the Cloudflare Pages project as a "Pages Domain". The root domain works just as expected. All pages are accessible except the ones in `pages/tenant`. The wildcard subdomain however...

## The limits of Cloudflare Pages

Here is where all the problems start. Wildcard domains are not supported in Cloudflare Pages. If you add a the `*.my-company.com` domain it will read it as the actual character `*` instead of a wildcard. Oh no... As an alternative, I could add a DNS record and Pages Domain for each event, but there is a limit to that. Free plans only allow for 100 Pages Domains per project. Enough for the single client I am working with, but not for the future.

A few things to make clear about my Cloudflare setup:
- I'm using NuxtHub to deploy this project to Cloudflare Pages
- My domain is registered at the Cloudflare Registrar and is using the Free plan
- I have a Cloudflare Workers Paid subscription

With NuxtHub, each project can claim a free `nuxt.dev` domain at which your site is accessible. I asked :user{username="atinux"} how he achieved this. It turns out that for each `nuxt.dev` domain, a DNS record is created and the Pages Domain is added to the user's own account. The only limitation in this case is the DNS record limit and keeping it up-to-date. I knew he is working on re-writing NuxtHub to support Cloudflare Workers because of the limitations with Pages. During our conversation he gave me info about some of the changes coming to NuxtHub and in the process I learned about Cloudflare's 'Workers for SaaS' offering (important for later). I concluded that I had to deploy to Cloudflare Workers instead of Pages. Workers supports domains just like Pages, but also has something called 'Workers Routes'.

## Moving to Cloudflare Workers

First things first, I somehow need to make the application compatible with Cloudflare Workers. Luckily with Nuxt, it is as simple as changing the preset in the `nuxt.config.ts` to `cloudflare-module` and I'm good to go! Not so fast. Normally this would be the case, but I'm deploying with NuxtHub which is only compatible with Pages. Besides some changes to the code, I need to create a `wrangler.toml` file in the root of the project. This would normally be generated by :package{name="@nuxthub/core"}, but now I need to create it manually.

### Wrangler configuration

```toml [wrangler.toml]
name = "my-project"
compatibility_date = "2025-01-01"
compatibility_flags = ["nodejs_compat"]

main = "./.output/server/index.mjs"
assets = { directory = "./.output/public/", binding = "ASSETS" }

routes = [{ pattern = "*.my-company.com/*", zone_name = "my-company.com" }]
```

The `routes` array is where the magic happens. You can define URL patterns which will trigger the execution of a specific worker. Not only for the domain, but also for the route. In hindsight, this is super obvious — it's called a _route_ after all — but at the time I didn't think of it. I added the route pattern `*.my-company.com` to the `routes` array and consequentially banged my head against the wall for far too long because it just didn't work. The subdomain loaded fine, but the routes were not accessible. So make sure to add the wildcard on the route as well!

### Updating DNS records

We need to update the DNS records to point to the workers project instead of the Pages project. First, remove any records related to the Pages project. Then, add your domain as a Workers Domain in the specific worker's settings. Lastly, in the DNS settings you can add a wildcard subdomain to the domain and it will look something like this:

| Type | Name | Value | Notes |
| --- | --- | --- | --- |
| `Worker` | `my-company.com` | `my-project` | root domain (worker domain) |
| `CNAME` | `*` | `my-company.com` | wildcard subdomain |

### Turning off specific subdomains

In my case, I want some subdomains to point to a server outside of Cloudflare. This is a websocket server that I run on a VPS. Say I want to use `ws.my-company.com` to point to the external server, adding the specific subdomain to the DNS does not work immediately. 

| Type | Name | Value | Notes |
| --- | --- | --- | --- |
| `Worker` | `my-company.com` | `my-project` | root domain (worker domain) |
| `CNAME` | `*` | `my-company.com` | wildcard subdomain |
| `A` | `ws` | `192.168.1.1` | VPS |

This will not work. The subdomain will trigger the worker and not route to the VPS. To make it work, you need to go to the `my-company.com` '__website__ settings' in the Cloudflare dashboard — not the worker settings. Then, under the 'Workers Routes' tab, you need to add a new route `ws.my-company.com/*` and set the Worker to _None_. Now, the subdomain will point to the external server instead of the worker.

## Conclusion

Adding subdomains to your application is a nice way to make your application feel more professional and trustworthy. It gives a sense of separation between different users. The support for subdomains in Cloudflare is certainly not perfect. And navigating the Cloudflare documentation and dashboards is not intuitive. The documentation is minimal and I only was able to solve the issues by going back and forth between AI and the documentation. I hope this blog post will save you some of the time and frustration I went through. An example project is available on [Github](https://github.com/gerbuuun/nuxt-cloudflare-multi-tenancy).

### What's next?

As I mentioned briefly earlier, during the migration I stumbled upon Cloudflare's 'Workers for SaaS' offering. This allows your clients to use their own domains to point to your worker project. Instead of using `{my_event}.my-company.com`, they can use for example `{my_event}.client-1.com` or even just `client-1.com`. This is an even better solution than subdomains. After validating the subdomain routing, I will be looking into this and see if I can implement it within the free tier. And if it works, I will write a blog post about it as well.

_This is my very first blog post about my development journey. Lots of people I follow in this space said to just publish your work and share it with the world. Well, here it is. I hope you enjoyed reading it and learned something from it._
