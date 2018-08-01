import React from 'react';
import { View } from 'react-native';

import {
  Header,
  Container,
  Content,
  Text,
  Title,
  Left,
  Body,
  List,
  ListItem,
  Icon
} from 'native-base';

import { MaterialIcons } from '@expo/vector-icons';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';

import ReduxActions from '../redux/actions';

import Theme from '../constants/Theme';
import Layout from '../constants/Layout';

import { omit} from 'lodash';

import TimerMixin from 'react-timer-mixin';

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount(){
    this.props.getFieldGroups();
  }

  render() {
    let { fieldGroups } = this.props.state;
    let items = fieldGroups.data;
    
    return (
      <Container>
        <Header>
          <Left>
            <Title>Quadras</Title>
          </Left>
        </Header>
        <Content padder>
          <List dataArray={items} renderRow={this.renderItem.bind(this)} />
        </Content>
      </Container>
    );    
  }

  renderItem(item){
    let { field_group } = item;
    
    // Pass item id for field_group
    field_group.$id = item.$id;

    return(
      <ListItem icon onPress={this._handleOnPressItem.bind(this, field_group)} style={Layout.listHeight}>
        <Left>
          <Icon name='map' size={36} />
        </Left>
        <Body style={Layout.listItemBody}>
          <Text>{field_group.name}</Text>
          <Text note>{ field_group.neighborhood.name }</Text>
        </Body>
        <View style={Layout.listItemChevron}>
          <MaterialIcons name='chevron-right' size={24} style={{ color: Theme.listBorderColor }} />
        </View>
      </ListItem>
    );
  }
  _handleOnPressItem(field_group){
    TimerMixin.requestAnimationFrame(() => {
      Actions.fieldgroup({fieldgroup: omit(field_group, ['public_areas']), title: field_group.name});
    });
  }
}

function mapStateToProps(state) {
  return {
    state: {
      currentUser: state.currentUser,
      fieldGroups: state.fieldGroups
    }
  };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators(ReduxActions.fieldGroupsActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
