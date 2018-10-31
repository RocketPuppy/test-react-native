import React from "react";
import { Component } from "react";
import { ScrollView, View, Button, Text, TextInput, Alert, StyleSheet } from 'react-native';

export default class AddPost extends Component {

    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    static defaultProps = {
        onAdd: () => null
    }

    getInitialState = () => ({
        id: '',
        title: '',
        author: '',
    });

    handleChange = (field, value) => {

        this.setState({
            [field]: value
        });
    }

    handleAdd = () => {
        const { id, title, author } = this.state;

        this.setState(this.getInitialState(), () => {
            this.props.onAdd({ id, title, author });
        });
    }

    handleCancel = () => {
        this.setState(this.getInitialState());
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Add new Post</Text>
                <TextInput style={{ borderWidth: 1 }} value={this.state.id} onChangeText={this.handleChange.bind(this, 'id')} placeholder="id" />
                <TextInput style={{ borderWidth: 1 }} value={this.state.title} onChangeText={this.handleChange.bind(this, 'title')} placeholder="title" />
                <TextInput style={{ borderWidth: 1 }} value={this.state.author} onChangeText={this.handleChange.bind(this, 'author')} placeholder="author" />

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
