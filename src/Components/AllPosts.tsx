import * as React from "react";
import { Component } from "react";
import { ScrollView, View, Button, Text, TextInput, Alert, StyleSheet } from 'react-native';
import { Props as AllPostsProps } from "../Queries/AllPostsQuery";
import { Props as DeletePostProps } from "../Queries/DeletePostMutation";
import { Props as UpdatePostProps } from "../Queries/UpdatePostMutation";
import { Post } from "../Types";

export type Props = AllPostsProps & DeletePostProps & UpdatePostProps;

interface State {
    editing: { [id: number]: Post };
}

export default class AllPosts extends Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            editing: {}
        }
    }

    static defaultProps = {
        posts: [],
        onDelete: () => null,
        onEdit: () => null,
    }

    handleDelete = async (post: Post) => {

        const confirm = await new Promise((resolve, reject) => {
            Alert.alert('Confirm delete', 'Are you sure?', [
                { text: 'OK', onPress: () => resolve(true) },
                { text: 'Cancel', onPress: () => resolve(false) },
            ], { cancelable: false });
        });

        if (confirm) {
            this.props.onDelete(post);
        }
    }

    handleEdit = (post: Post) => {
        const { editing } = this.state;

        this.setState({ editing: { ...editing, [post.id]: { ...post } } });
    }

    handleEditCancel = (id: number) => {
        const { editing } = this.state;
        const { [id]: curr, ...others } = editing;

        this.setState({ editing: { ...others } });
    }

    handleFieldEdit = <K extends keyof Post, V extends Post[K]>(id: number, field: K, value: V) => {
        const { editing } = this.state;
        const editData = { ...editing[id] };

        editData[field] = value;

        this.setState({
            editing: { ...editing, ...{ [id]: editData } }
        });
    }

    handleEditSave = (id: number) => {
        const { editing } = this.state;
        const { [id]: editedPost, ...others } = editing;

        this.props.onEdit({ ...editedPost });
        this.setState({
            editing: { ...others }
        });
    }

    renderOrEditPost = (post: Post) => {
        const { editing } = this.state;

        const editData = editing[post.id];
        const isEditing = !!editData;

        return (
            !isEditing ?
                (
                    <View key={post.id} style={styles.item}>
                        <View style={styles.itemColumn}>
                            <Text>{post.id}</Text>
                            <Text>{post.title}</Text>
                            <Text>{post.author}</Text>
                        </View>
                        <View style={styles.itemColumn}>
                            <Button title="Edit" onPress={this.handleEdit.bind(this, post)} />
                            <Button title="Delete" onPress={this.handleDelete.bind(this, post)} />
                        </View>
                    </View>
                ) : (
                    <View key={post.id} style={styles.item}>
                        <View style={styles.itemColumn}>
                            <Text>
                                {post.id}
                            </Text>
                            <TextInput style={{ borderWidth: 1 }} value={editData.title} onChangeText={this.handleFieldEdit.bind(this, post.id, 'title')} />
                            <TextInput style={{ borderWidth: 1 }} value={editData.author} onChangeText={this.handleFieldEdit.bind(this, post.id, 'author')} />
                        </View>
                        <View style={styles.itemColumn}>
                            <Button title="Save" onPress={this.handleEditSave.bind(this, post.id)} />
                            <Button title="Cancel" onPress={this.handleEditCancel.bind(this, post.id)} />
                        </View>
                    </View>
                )
        );
    }

    render() {
        const { posts, error }: Props = this.props;

        if (error) {
            console.log(error);
            return <Text>{error.message}</Text>
        }

        return (
            <ScrollView contentContainerStyle={styles.scroller}>
                <View style={styles.container}>
                    {(posts || []).sort((a, b) => b.id - a.id).map(this.renderOrEditPost)}
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
        padding: 30,
        margin: 2,
    },
    item: {
        flexDirection: 'row',
        borderWidth: 1,
        paddingTop: 10,
    },
    itemColumn: {
        flexGrow: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    scroller: {
        flexGrow: 1,
        padding: 10
    }
});
