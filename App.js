import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import AWSAppSyncClient from "aws-appsync";
import { Rehydrated } from 'aws-appsync-react';
import { AUTH_TYPE } from "aws-appsync/lib/link/auth-link";
import { graphql, ApolloProvider, compose } from 'react-apollo';
import * as AWS from 'aws-sdk';
import AppSync from './aws-exports.js';
import AllPostsQuery from './Queries/AllPostsQuery';
import NewPostMutation from './Queries/NewPostMutation';
import DeletePostMutation from './Queries/DeletePostMutation';
import UpdatePostMutation from './Queries/UpdatePostMutation';
import AllPosts from './Components/AllPosts';
import AddPost from './Components/AddPost';

const client = new AWSAppSyncClient({
    url: AppSync.aws_appsync_graphqlEndpoint,
    region: AppSync.aws_appsync_region,
    auth: {
        type: AppSync.aws_appsync_authenticationType,
        apiKey: AppSync.aws_appsync_apiKey
    },
});

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

class App extends Component {
    state = { posts: [] };

    render() {
        return (
        <View style={styles.container}>
            <AddPostWithData />
            <AllPostsWithData />
        </View>
        );
    }
}

const AllPostsWithData = compose(
    graphql(AllPostsQuery, {
        options: {
            fetchPolicy: 'cache-and-network'
        },
        props: (props) => ({
            posts: props.data.allPost && props.data.allPost.posts,
        })
    }),
    graphql(DeletePostMutation, {
        props: (props) => ({
            onDelete: (post) => props.mutate({
                variables: { id: post.id, expectedVersion: post.version },
                optimisticResponse: () => ({ deletePost: { ...post, __typename: 'Post' } }),
            })
        }),
        options: {
            refetchQueries: [{ query: AllPostsQuery }],
            update: (proxy, { data: { deletePost: { id } } }) => {
                const query = AllPostsQuery;
                const data = proxy.readQuery({ query });

                data.allPost.posts = data.allPost.posts.filter(post => post.id !== id);

                proxy.writeQuery({ query, data });
            }
        }
    }),
    graphql(UpdatePostMutation, {
        props: (props) => ({
          onEdit: (post) => {
              props.mutate({
                  variables: { ...post, expectedVersion: post.version },
                  optimisticResponse: () => ({ updatePost: { ...post, __typename: 'Post', version: post.version + 1 } }),
              })
          }
        }),
        options: {
            refetchQueries: [{ query: AllPostsQuery }],
            update: (dataProxy, { data: { updatePost } }) => {
                const query = AllPostsQuery;
                const data = dataProxy.readQuery({ query });

                data.allPost.posts = data.allPost.posts.map(post => post.id !== updatePost.id ? post : { ...updatePost });

                dataProxy.writeQuery({ query, data });
            }
        }
    })
)(AllPosts);

const AddPostWithData = graphql(NewPostMutation, {
    props: (props) => ({
        onAdd: post => props.mutate({
            variables: post,
            optimisticResponse: () => ({ addPost: { ...post, __typename: 'Post', version: 1 } }),
        })
	})
    ,
    options: {
        refetchQueries: [{ query: AllPostsQuery }],
        update: (dataProxy, dataData) => {
	  const addPost = dataData.data.addPost;
          const query = AllPostsQuery;
          const data = dataProxy.readQuery({ query });

          data.allPost.posts.push(addPost);
          dataProxy.writeQuery({ query, data });
        }
    }
})(AddPost);

const WithProvider = () => (
    <ApolloProvider client={client}>
        <Rehydrated>
            <App />
        </Rehydrated>
    </ApolloProvider>
);

export default WithProvider;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
