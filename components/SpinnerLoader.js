import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';

import Colors from "../constants/Colors";

export default class SpinnerLoader extends Component{
  render(){
    return(
      <View style={styles.spinnerWrap}>
        <ActivityIndicator size="large" color={Colors.accentColor} />
      </View>
    );
  }
}

const styles = {
  spinnerWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
}
