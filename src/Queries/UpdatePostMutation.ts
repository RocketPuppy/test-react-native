import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';
import { Post } from 'Types';
import { graphql, FetchResult } from 'react-apollo';
import AllPostsQuery, { Response as AllPostsResponse } from "./AllPostsQuery";
import { ApolloError } from 'apollo-client';

export interface Variables extends Post {
    expectedVersion: number;
};

export interface Response {
    updatePost: Post;
};

export interface Props {
    onEdit(post: Post): Promise<void | FetchResult<Response>> | undefined;
    error?: ApolloError;
};

const query: DocumentNode = gql`
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

export const UpdatePostHOC = graphql<{}, Response, Variables, Props>(query, {
    props: (props) => ({
        onEdit: (post) => props.mutate && props.mutate({
            variables: { ...post, expectedVersion: post.version },
            optimisticResponse: { updatePost: { ...post, __typename: 'Post', version: post.version + 1 } },
        })
    }),
    options: {
        refetchQueries: [{ query: AllPostsQuery }],
        update: (dataProxy, result) => {
            const updatedPost = result.data && result.data.updatePost;
            const query = AllPostsQuery;
            const data = dataProxy.readQuery<AllPostsResponse, {}>({ query });

            if(data) {
                data.allPost.posts = data.allPost.posts.map(post => {
                    if(updatedPost && post.id === updatedPost.id) {
                        return updatedPost;
                    }
                    return post;
                });
            }

            dataProxy.writeQuery({ query, data });
        }
    }
});

export default query;