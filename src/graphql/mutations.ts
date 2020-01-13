import { gql } from "apollo-boost";

export const ADD_MEMO = gql`
  mutation($content: String!, $userId: String!) {
    insert_memos(objects: { content: $content, user_id: $userId }) {
      returning {
        id
        content
        created_at
      }
    }
  }
`;

export const DELETE_MEMO = gql`
  mutation($id: Int!) {
    delete_memos(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`;
