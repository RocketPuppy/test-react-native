import gql from 'graphql-tag';
import { Post } from 'Types';
import { DocumentNode } from 'graphql';
import { graphql, FetchResult } from 'react-apollo';
import AllPostsQuery, { Response as AllPostsResponse } from "./AllPostsQuery";

export interface Props {
    onAdd(post: Post): Promise<void | FetchResult<Response>> | undefined;
};

export interface Variables extends Post {};

export interface Response {
    addPost: Post;
};

const query: DocumentNode =  gql`
mutation AddPostMutation($id: ID!, $author: String!, $title: String!) {
    addPost(
        id: $id
        author: $author
        title: $title
        content: " "
        url: " "
    ) {
        __typename
        id
        author
        title
        version
    }
}`;

export const NewPostHOC = graphql<{}, Response, Variables, Props>(query, {
    props: (props) => ({
        onAdd: post => props.mutate && props.mutate({
            variables: post,
            optimisticResponse: { addPost: { ...post, __typename: 'Post', version: 1 } },
        })
	}),
    options: {
        refetchQueries: [{ query: AllPostsQuery }],
        update: (dataProxy, result) => {
            const addPost = result.data && result.data.addPost;
            const data = dataProxy.readQuery<AllPostsResponse>({ query: AllPostsQuery });

            if(data && addPost) {
                data.allPost.posts.push(addPost);
            }
            dataProxy.writeQuery({ query: AllPostsQuery, data });
        }
    }
});

export default query;