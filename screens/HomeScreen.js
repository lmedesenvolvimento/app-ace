import React from 'react';
import { StyleSheet, Text, ScrollView, View } from 'react-native';
import { Actions } from 'react-native-router-flux';

import Theme from '../constants/Theme';
import Layout from '../constants/Layout';

import FireBaseApp from '../constants/FirebaseApp';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);
  }
  render() {
    let { user } = this.props
    return (
      <View style={styles.container}>
        <Text>Olá, Mundo</Text>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
};
