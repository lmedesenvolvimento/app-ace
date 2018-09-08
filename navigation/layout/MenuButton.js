import React from 'react';
import { Actions } from 'react-native-router-flux';
import { TouchableOpacity } from 'react-native';

import { Icon } from 'native-base';

export default class MenuButton extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return (
      <TouchableOpacity onPress={this._drawerOpen.bind(this)}>
        <Icon name="menu" size={18} style={{marginHorizontal: 16, color: 'white'}} />
      </TouchableOpacity>
    );
  }

  _drawerOpen(){
    Actions.drawerOpen();
  }
}
