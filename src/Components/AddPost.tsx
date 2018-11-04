import * as React from "react";
import { Component } from "react";
import { View, Button, Text, TextInput, StyleSheet } from 'react-native';
import { Props as NewPostProps } from "../Queries/NewPostMutation";

type Props = NewPostProps;

interface StateFields {
  id: number;
  title: string;
  author: string;
};

interface State {
  fields: StateFields;
}

export default class AddPost extends Component<Props, State> {

    constructor(props: Props)  {
        super(props);

        this.state = this.getInitialState();
    }

    getInitialState = () => ({
      fields: {
        id: 0,
        title: '',
        author: '',
      }
    });

    handleChange = <K extends keyof StateFields, V extends StateFields[K]>(field: K, value: V) => {
        this.setState({
            fields: { ...this.state.fields, [field]: value }
        });
    }

    handleAdd = () => {
        const { id, title, author } = this.state.fields;

        this.setState(this.getInitialState(), () => {
            this.props.onAdd({ id, title, author, __typename: "Post", version: 0 });
        });
    }

    handleCancel = () => {
        this.setState(this.getInitialState());
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Add new Post</Text>
                <TextInput style={{ borderWidth: 1 }} value={this.state.fields.id.toString()} onChangeText={(v) => this.handleChange('id', parseInt(v, 10))} placeholder="id" />
                <TextInput style={{ borderWidth: 1 }} value={this.state.fields.title} onChangeText={(v) => this.handleChange('title', v)} placeholder="title" />
                <TextInput style={{ borderWidth: 1 }} value={this.state.fields.author} onChangeText={(v) => this.handleChange('author', v)} placeholder="author" />

                <View>
                    <Button title="Add" onPress={this.handleAdd} />
                    <Button title="Cancel" onPress={this.handleCancel} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        marginTop: 40,
        marginBottom: 20,
        borderWidth: 1,
        padding: 10
    }
});
