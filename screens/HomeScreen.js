import React from 'react';
import { ScrollView, View } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

import Theme from '../constants/Theme';
import Layout from '../constants/Layout';
import Session from '../services/Session';

import LogoutButton from '../components/LogoutButton';

export default class HomeScreen extends React.Component {
  state = {
    currentUser: null
  }
  constructor(props) {
    super(props);
  }
  componentDidMount(){
    console.log(Session.currentUser)
    this.setState({ currentUser: Session.currentUser })
  }
  render() {
    return (
      <ScrollView style={Layout.grid}>
        <View style={Layout.padding}>
          <Text>{JSON.stringify(this.state.currentUser)}</Text>
        </View>
        <LogoutButton />
      </ScrollView>
    );
  }
}
