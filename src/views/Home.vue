<template>
  <div class="home">
    <v-card class="mb-5">
      <v-card-text>
        <v-textarea outlined label="Memo" single-line v-model="content" />
        <v-btn block @click="addMemo" color="primary">add Memo</v-btn>
      </v-card-text>
    </v-card>
    <template v-if="memos && memos.length > 0">
      <v-card v-for="memo in memos" :key="memo.id" class="mb-1">
        <v-card-text>
          {{ memo.content }}
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn @click="deleteMemo(memo.id)">delete</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { FETCH_MEMOS } from "@/graphql/queries";
import { ADD_MEMO, DELETE_MEMO } from "@/graphql/mutations";
import { auth } from "@/plugins/firebase";

type Memo = {
  id: number;
  content: string;
  created_at: string;
};

type Data = {
  content: string;
  memos: Memo[];
};

export default Vue.extend({
  name: "home",
  data(): Data {
    return {
      content: "",
      memos: []
    };
  },
  methods: {
    async addMemo() {
      const res = await this.$apollo.mutate({
        mutation: ADD_MEMO,
        variables: {
          content: this.content,
          userId: (auth.currentUser as firebase.User).uid
        }
      });

      const insertResult = res.data.insert_memos.returning[0];
      this.memos.push({
        id: insertResult.id,
        content: insertResult.content,
        created_at: insertResult.created_at
      });

      this.clearField();
    },
    async deleteMemo(id: Number) {
      await this.$apollo.mutate({
        mutation: DELETE_MEMO,
        variables: {
          id
        }
      });

      this.memos = this.memos.filter(memo => memo.id !== id);
    },
    clearField() {
      this.content = "";
    }
  },
  apollo: {
    memos: {
      query: FETCH_MEMOS
    }
  }
});
</script>
