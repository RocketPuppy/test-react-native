import * as React from 'react';
import {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import AWSAppSyncClient from "aws-appsync";
import { Rehydrated } from 'aws-appsync-react';
import { ApolloProvider, compose } from 'react-apollo';
import AppSync from './aws-exports';
import { AllPostsHOC } from './Queries/AllPostsQuery';
import { NewPostHOC } from './Queries/NewPostMutation';
import { DeletePostHOC }  from './Queries/DeletePostMutation';
import { UpdatePostHOC } from './Queries/UpdatePostMutation';
import AllPosts from './Components/AllPosts';
import AddPost from './Components/AddPost';
import { Post } from "./Types";
import Bluetooth from "./Bluetooth";

const client = new AWSAppSyncClient({
    url: AppSync.aws_appsync_graphqlEndpoint,
    region: AppSync.aws_appsync_region,
    auth: {
        type: AppSync.aws_appsync_authenticationType,
        apiKey: AppSync.aws_appsync_apiKey
    },
});

interface State {
    posts: Array<Post>;
}

class App extends Component<{}, State> {
    state = { posts: [] };

    render() {
        return (
        <View style={styles.container}>
            <Bluetooth />
            <AddPostWithData />
            <AllPostsWithData />
        </View>
        );
    }
}

const AllPostsWithData = compose(
    AllPostsHOC,
    DeletePostHOC,
    UpdatePostHOC
)(AllPosts);

const AddPostWithData = NewPostHOC(AddPost);

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
