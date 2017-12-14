import React from 'react';
import { ScrollView, View } from 'react-native';
import { Text, Button } from 'react-native-elements';

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import Theme from '../constants/Theme';
import Layout from '../constants/Layout';
import Session from '../services/Session';

import LogoutButton from '../components/LogoutButton';

class HomeScreen extends React.Component {
  state = {
    currentUser: null
  }

  constructor(props) {
    super(props);
  }

  componentDidMount(){
    this.setState({ currentUser: Session.currentUser })
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={Layout.grid}>
          <View style={Layout.padding}>
            <Text> Is Connected: {this.props.network.isConnected}</Text>
          </View>
          <LogoutButton />
        </ScrollView>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    paddingTop: 24
  }
}

export default connect(({network}) => ({network}))(HomeScreen)
