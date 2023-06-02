import { createApp, provide, h } from "vue"
import App from './App.vue'
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { DefaultApolloClient, provideApolloClient } from '@vue/apollo-composable'
import { createAuth0 } from '@auth0/auth0-vue';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import router from './router'
import './assets/main.css'

import eventBus from './plugins/event-bus';

// HTTP connection to the API

export function getHeaders() {
  const headers = { 
    'x-hasura-role' : 'user',
    'Content-Type': 'application/json',
  }
  const token = sessionStorage.getItem("token")
  if(token) {
    headers['Authorization'] = `Bearer ${token}`
  }
    return headers
}

function setHttpLink() {
    const httpLink = createHttpLink({
        uri: "https://padma.hasura.app/v1/graphql",
        fetch: (uri, options ) => {
          options.headers = getHeaders()
          return fetch(uri, options)
        },
    })
    return httpLink
}


// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
const apolloClient = new ApolloClient({
  link: setHttpLink(),
  cache,
})

provideApolloClient(apolloClient)
const app = createApp({
    setup() {
        provide(DefaultApolloClient, apolloClient)
    },
    render: () => h(App),
})
app.use(
    createAuth0({
      domain: "dev--zdifqkq.us.auth0.com",
      clientId: "292QPdez4MpeyqL5Vpz7xLGJasaOY6ON",
      authorizationParams: {
        redirect_uri: `${window.location.origin}/organization`,
        audience: "https://padma.hasura.app/v1/graphql"
      }
    })
  );
app.use(eventBus);
app.use(router);  
app.mount("#app")
