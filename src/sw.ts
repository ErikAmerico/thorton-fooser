import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { Route, registerRoute, NavigationRoute } from "workbox-routing";
import { CacheFirst, NetworkFirst, NetworkOnly } from "workbox-strategies";
import { BackgroundSyncPlugin } from "workbox-background-sync";
import { API } from "./data/constants";

declare let self: ServiceWorkerGlobalScope;

cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST);

self.skipWaiting();

//cache images
const imageRoute = new Route(
  ({ request, sameOrigin }) => {
    return sameOrigin && request.destination === "image";
  },

  new CacheFirst({
    cacheName: "images",
  })
);
registerRoute(imageRoute);

//cache api calls
const fetchPlayerRoute = new Route(
  ({ request }) => {
    return request.url === `${API}/players`;
  },

  new NetworkFirst({
    cacheName: "api/fetch-players",
  })
);
registerRoute(fetchPlayerRoute);

const fetchTourneyHistoryRoute = new Route(
  ({ request }) => {
    return request.url === `${API}/matches/history`;
  },

  new NetworkFirst({
    cacheName: "api/fetch-tourney-history",
  })
);
registerRoute(fetchTourneyHistoryRoute);

//cache navigations

const navigationRoute = new NavigationRoute(
  new NetworkFirst({
    cacheName: "navigation",
    networkTimeoutSeconds: 3,
  })
);
registerRoute(navigationRoute);

//background sync
const bgSyncPlugin = new BackgroundSyncPlugin("backgroundSyncqueue", {
  maxRetentionTime: 24 * 60,
});

const tournamentSubmit = new Route(
  ({ request }) => {
    return request.url === `${API}/matches/update`;
  },

  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),

  "POST"
);
registerRoute(tournamentSubmit);

const addPlayer = new Route(
  ({ request }) => {
    return request.url === `${API}/players`;
  },

  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),

  "POST"
);
registerRoute(addPlayer);
