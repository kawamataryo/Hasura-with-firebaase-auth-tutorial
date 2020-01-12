import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { client } from "@/plugins/apollo";
import VueApollo from "vue-apollo";

const apolloProvider = new VueApollo({
  defaultClient: client
});

Vue.use(VueApollo);
Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  apolloProvider,
  render: h => h(App)
}).$mount("#app");
