import { gql } from "apollo-boost";

export const FETCH_TASKS = gql`
  query fetchTasks {
    todos(order_by: { created_at: asc }) {
      id
      name
      completed
    }
  }
`;
