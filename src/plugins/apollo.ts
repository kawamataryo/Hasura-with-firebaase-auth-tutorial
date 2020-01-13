import ApolloClient from "apollo-boost";
import VueApollo from "vue-apollo";

const AUTH_TOKEN = "hasura-auth-token";

const client = new ApolloClient({
  uri: process.env.VUE_APP_GRPHQL_HTTP,
  request: operation => {
    operation.setContext({
      headers: {
        Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`
      }
    });
  }
});

// ログイン処理
export async function onLogin(token: string) {
  if (localStorage.getItem(AUTH_TOKEN) !== token) {
    localStorage.setItem(AUTH_TOKEN, token);
  }
  try {
    await client.resetStore();
  } catch (e) {
    // eslint-disable-next-line
    console.error(`Login Failed. ${e}`);
  }
}

// ログアウト処理
export async function onLogout() {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(AUTH_TOKEN);
  }
  try {
    await client.resetStore();
  } catch (e) {
    // eslint-disable-next-line
    console.error(`Logout Failed. ${e}`);
  }
}

export const apolloProvider = new VueApollo({
  defaultClient: client
});
