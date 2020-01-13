<template>
  <div class="about">
    <h1>This is login page</h1>
    <div id="firebaseui-auth-container"></div>
  </div>
</template>

<script>
import { auth } from "@/plugins/firebase";
import firebase from "firebase";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

export default {
  name: "login",
  beforeRouteEnter(to, from, next) {
    next(() => {
      const uiConfig = {
        signInSuccessUrl: "/",
        signInFlow: "popup",
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID
        ]
      };
      const ui =
        firebaseui.auth.AuthUI.getInstance() ||
        new firebaseui.auth.AuthUI(auth);
      ui.start("#firebaseui-auth-container", uiConfig);
    });
  }
};
</script>
