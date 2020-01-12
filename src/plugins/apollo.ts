import ApolloClient from "apollo-boost";

const AUTH_TOKEN = "hasura-auth-token";

export const client = new ApolloClient({
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
export async function onLogin(client: ApolloClient<any>, token: string) {
  // 「Invariant Violation: Store reset while query was in flight (not completed in link chain)」
  // の解消
  if (localStorage.getItem(AUTH_TOKEN) === token) {
    return;
  }
  localStorage.setItem(AUTH_TOKEN, token);
  try {
    await client.resetStore();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
}

// ログアウト処理
export async function onLogout(client: ApolloClient<any>) {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(AUTH_TOKEN);
  }
  try {
    await client.resetStore();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
}
