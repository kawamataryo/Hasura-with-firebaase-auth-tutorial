import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import ApolloClient from "apollo-boost";
import fetch from "node-fetch";
import gql from "graphql-tag";

admin.initializeApp();

const client = new ApolloClient({
  uri: functions.config().hasura.url,
  fetch: fetch as any,
  request: (operation): void => {
    operation.setContext({
      headers: {
        "x-hasura-admin-secret": functions.config().hasura.admin_secret
      }
    });
  }
});

export const setCustomClaims = functions.auth.user().onCreate(async user => {
  const customClaims = {
    "https://hasura.io/jwt/claims": {
      "x-hasura-default-role": "user",
      "x-hasura-allowed-roles": ["user"],
      "x-hasura-user-id": user.uid
    }
  };
  try {
    // カスタムクレームの設定
    await admin.auth().setCustomUserClaims(user.uid, customClaims);

    // ユーザーデータのHasuraへの挿入
    await client.mutate({
      variables: { id: user.uid, name: user.displayName || "unknown" },
      mutation: gql`
        mutation InsertUsers($id: String, $name: String) {
          insert_users(objects: { id: $id, name: $name }) {
            returning {
              id
              name
              created_at
            }
          }
        }
      `
    });

    // TokenリフレッシュのFirestoreデータ追加（クライアントでのトークン再読み込みに使う）
    await admin
      .firestore()
      .collection("user_meta")
      .doc(user.uid)
      .create({
        refreshTime: admin.firestore.FieldValue.serverTimestamp()
      });
  } catch (e) {
    console.log(e);
  }
});
