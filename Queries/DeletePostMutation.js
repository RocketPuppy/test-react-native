import gql from 'graphql-tag';

export default gql`
mutation DeletePostMutation($id: ID!, $expectedVersion: Int!) {
    deletePost(id: $id, expectedVersion: $expectedVersion) {
        __typename
        id
        author
        title
        version
    }
}`;
