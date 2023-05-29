import { createAuth0Client } from '@auth0/auth0-spa-js';
import { reactive } from 'vue';

export const AuthState = reactive({
    user: null,
    loading: false,
    isAuthenticated: false,
    auth0: null,
});

const config = {
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    client_id: import.meta.env.VITE_AUTH0_CLIENT_ID,
    audience: import.meta.env.VITE_APP_AUTH0_AUDIENCE
};

export const useAuth0 = (state) => {
    const handleStateChange = async () => {
        state.isAuthenticated = !!(await state.auth0.isAuthenticated());
        state.user = await state.auth0.getUser();
        state.loading = false;
    }

    const initAuth = async () => {
        state.loading = true;
        const auth0 = await createAuth0Client({
            domain: config.domain,
            clientId: config.client_id,
            cacheLocation: 'localstorage',
            redirect_uri: "window.location.origin",
        })  
        if(auth0) {
          state.auth0 = auth0;
          const token = await state.auth0.getTokenSilently()
          window.localStorage.setItem("token", token)
          console.log("this is token: ", token)
          await handleStateChange();
          
        }    
    }

    const login = async () => {
      
      try {
        await state.auth0.loginWithPopup();
        await handleStateChange();  
      } catch(error) {
        alert(`${error}`)
      }
    };

    const logout = async () => {
      await state.auth0.logout({
          returnTo: window.location.origin,
      });
      window.localStorage.setItem("token", "")
    }

    return {
        login,
        logout,
        initAuth,
    }

}