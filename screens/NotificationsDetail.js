import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,

} from 'react-native';

export default class NotificationsDetail extends Component {

    render() {
        return (
            <ScrollView style={styles.container}>
                <Text>Screen</Text>
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    }
})
