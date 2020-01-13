import { gql } from "apollo-boost";

export const ADD_TODO = gql`
  mutation($name: String!, $userId: String!) {
    insert_todos(objects: { name: $name, user_id: $userId }) {
      returning {
        id
        name
      }
    }
  }
`;
