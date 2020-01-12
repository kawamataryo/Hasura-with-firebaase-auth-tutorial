import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { client, onLogin, onLogout } from "@/plugins/apollo";
import VueApollo from "vue-apollo";
import firebase from "firebase";
import { db } from "@/plugins/firebase";

const HASURA_TOKEN_KEY = "https://hasura.io/jwt/claims";
const apolloProvider = new VueApollo({
  defaultClient: client
});

Vue.use(VueApollo);

Vue.config.productionTip = false;

let vue: Vue;
// firebaseの初期化が終わったあとにVueを初期化するようにする
firebase.auth().onAuthStateChanged(async user => {
  if (!vue) {
    new Vue({
      vuetify,
      apolloProvider,
      router,
      render: h => h(App)
    }).$mount("#app");
  }
  if (user) {
    const token = await user.getIdToken(true);
    const idTokenResult = await user.getIdTokenResult();
    const hasuraClaims = idTokenResult.claims[HASURA_TOKEN_KEY];

    if (hasuraClaims) {
      await onLogin(client, token);
    } else {
      // Tokenのリフレッシュを検知するためにコールバックを設定する
      const userRef = db.collection("user_meta").doc(user.uid);
      userRef.onSnapshot(async () => {
        await onLogin(client, token);
      });
    }
  } else {
    await onLogout(client);
  }
});
