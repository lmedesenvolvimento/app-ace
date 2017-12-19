import React, { Component } from "react";
import { TouchableOpacity } from "react-native";
import { Actions } from "react-native-router-flux";

import { Icon } from "native-base";
import { MaterialIcons } from '@expo/vector-icons';

export default class MenuButton extends Component{
  constructor(props){
    super(props);
  }

  render(){
    return (
      <TouchableOpacity onPress={this._drawerOpen.bind(this)}>
        <Icon name="menu" size={18} style={{marginHorizontal: 16, color: "white"}} />
      </TouchableOpacity>
    );
  }

  _drawerOpen(){
    Actions.drawerOpen();
  }
}
