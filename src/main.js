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
        uri: import.meta.env.VITE_APP_AUTH0_AUDIENCE,
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
      domain: import.meta.env.VITE_AUTH0_DOMAIN,
      clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
      authorizationParams: {
        redirect_uri: "http://localhost:5173/organization",
        audience: import.meta.env.VITE_APP_AUTH0_AUDIENCE
      }
    })
  );
app.use(eventBus);
app.use(router);  
app.mount("#app")
