import gql from 'graphql-tag';

export default gql`
query AllPosts {
    allPost {
        posts {
            __typename
            id
            title
            author
            version
        }
    }
}`;
