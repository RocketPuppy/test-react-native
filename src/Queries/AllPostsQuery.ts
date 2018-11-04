import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';
import { Post } from "../Types";
import { graphql } from 'react-apollo';
import { ApolloError } from 'apollo-client';

export type Variables = {};

export type Response = {
    allPost: {
        posts: Array<Post>;
    }
};

const query: DocumentNode = gql`
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

export interface Props {
    posts: Array<Post> | undefined;
    error?: ApolloError;
};

export const AllPostsHOC = graphql<{}, Response, Variables, Props>(query, {
    options: {
        fetchPolicy: 'cache-and-network'
    },
    props: ({ data }) => ({
        posts: data && data.allPost && data.allPost.posts,
        error: data && data.error
    })
});

export default query;
