import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { MonoText } from '../components/StyledText';
export default class ListCategories extends React.Component {
  static navigationOptions = {
    title: 'Links',
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text>hellllllo</Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
