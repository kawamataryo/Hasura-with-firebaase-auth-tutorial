import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { apolloProvider, onLogin, onLogout } from "@/plugins/apollo";
import VueApollo from "vue-apollo";
import { auth, db } from "@/plugins/firebase";

const HASURA_TOKEN_KEY = "https://hasura.io/jwt/claims";

Vue.use(VueApollo);

Vue.config.productionTip = false;

let vue: Vue;
// firebaseの初期化が終わったあとにVueを初期化するようにする
auth.onAuthStateChanged(async user => {
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
      await onLogin(token);
    } else {
      // Tokenのリフレッシュを検知するためにコールバックを設定する
      const userRef = db.collection("user_meta").doc(user.uid);
      userRef.onSnapshot(async () => {
        await onLogin(token);
      });
    }
  } else {
    await onLogout();
  }
});
