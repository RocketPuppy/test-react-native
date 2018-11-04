import gql from 'graphql-tag';

export default gql`
mutation UpdatePostMutation($id: ID!, $author: String, $title: String, $expectedVersion: Int!) {
    updatePost(
        id: $id
        author: $author
        title: $title
        expectedVersion: $expectedVersion
    ) {
        __typename
        id
        author
        title
        version
    }
}`;
