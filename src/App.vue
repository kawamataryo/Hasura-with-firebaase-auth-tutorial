<template>
  <v-app>
    <v-app-bar color="black" dark app>
      <v-toolbar-title>TODO App</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn outlined v-if="isLogin" @click="logout">Logout</v-btn>
    </v-app-bar>
    <v-content>
      <v-container id="container">
        <router-view />
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { auth } from "@/plugins/firebase";
import { onLogout } from "@/plugins/apollo";

export default Vue.extend({
  name: "App",
  methods: {
    async logout() {
      await auth.signOut();
      await onLogout();
      await this.$router.push("login");
    }
  },
  computed: {
    isLogin() {
      return !!auth.currentUser;
    }
  }
});
</script>

<style>
#container {
  max-width: 550px;
}
</style>
