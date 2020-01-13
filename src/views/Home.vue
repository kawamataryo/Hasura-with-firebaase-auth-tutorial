<template>
  <div class="home">
    <v-card class="mb-5">
      <v-card-text>
        <v-text-field label="Regular" single-line v-model="todoName" />
        <v-btn @click="addTodo">add</v-btn>
      </v-card-text>
    </v-card>
    <v-card>
      <v-list subheader two-line flat v-if="todos.length > 0">
        <v-list-item v-for="(todo, i) in todos" :key="i">
          <v-list-item-content>
            <v-list-item-title>{{ todo.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { FETCH_TASKS } from "../graphql/queries";
import { ADD_TODO } from "@/graphql/mutations";
import { auth } from "@/plugins/firebase";

type Todo = {
  name: string;
  completed: boolean;
};

export default Vue.extend({
  name: "home",
  data(): { todoName: string; todos: Todo[] } {
    return {
      todoName: "",
      todos: []
    };
  },
  methods: {
    async addTodo() {
      this.todos.push({
        name: this.todoName,
        completed: false
      });
      await this.$apollo.mutate({
        mutation: ADD_TODO,
        variables: {
          name: this.todoName,
          userId: (auth.currentUser as firebase.User).uid
        }
      });
      this.todoName = "";
    }
  },
  apollo: {
    todos: {
      query: FETCH_TASKS
    }
  }
});
</script>
