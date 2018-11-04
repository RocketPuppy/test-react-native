import gql from 'graphql-tag';
import { Post } from "../Types";
import { graphql, FetchResult } from 'react-apollo';
import { DocumentNode } from 'graphql';
import AllPostsQuery, { Response as AllPostsResponse } from "./AllPostsQuery";
import { ApolloError } from 'apollo-client';

export type Variables = {
    id: Number;
    expectedVersion: Number;
}

export type Response = {
    deletePost: Post;
}

const query: DocumentNode = gql`
mutation DeletePostMutation($id: ID!, $expectedVersion: Int!) {
    deletePost(id: $id, expectedVersion: $expectedVersion) {
        __typename
        id
        author
        title
        version
    }
}`;

export interface Props {
    onDelete(post: Post): Promise<void | FetchResult<Response>> | undefined;
    error?: ApolloError;
};

export const DeletePostHOC = graphql<{}, Response, Variables, Props>(query, {
    options: {
        refetchQueries: [{ query: AllPostsQuery }],
        update: (proxy, result) => {
            const id = result.data && result.data.deletePost.id;
            const query = AllPostsQuery;
            const data = proxy.readQuery<AllPostsResponse, {}>({ query });

            if(data) {
                data.allPost.posts = data.allPost.posts.filter(post => post.id !== id);
            }

            proxy.writeQuery({ query, data });
        }
    },
    props: (props) => ({
        onDelete: (post) => props.mutate && props.mutate({
            variables: { id: post.id, expectedVersion: post.version },
            optimisticResponse: { deletePost: { ...post, __typename: 'Post' } },
        })
    }),
});

export default query;