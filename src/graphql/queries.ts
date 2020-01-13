import { gql } from "apollo-boost";

export const FETCH_MEMOS = gql`
  query fetchMemos {
    memos(order_by: { created_at: asc }) {
      id
      content
      created_at
    }
  }
`;
