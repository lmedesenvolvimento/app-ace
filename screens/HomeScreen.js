import React from 'react';
import { View } from 'react-native';

import {
  Header,
  Container,
  Content,
  Text,
  Title,
  Left,
  Right,
  Body,
  Button,
  List,
  ListItem,
  Icon
} from 'native-base';

import { MaterialIcons } from '@expo/vector-icons';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { Actions } from 'react-native-router-flux';

import ReduxActions from "../redux/actions";

import Theme from '../constants/Theme';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import Session from '../services/Session';

import LogoutButton from '../components/LogoutButton';

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount(){
    this.props.getFieldGroups()
  }

  render() {
    let { currentUser, fieldGroups } = this.props.state;

    let items = fieldGroups.data;

    return (
      <Container>
        <Header>
          <Left>
            <Title>Quadras</Title>
          </Left>
        </Header>
        <Content padder>
          <List dataArray={items} renderRow={this.renderItem} />
        </Content>
      </Container>
    );
  }

  renderItem(item, sectionID, rowID){
    return(
      <ListItem icon onPress={()=> Actions.fieldgroup({zone: item, zoneIndex: rowID, title: item.name, public_areas: item.public_areas})} style={Layout.listHeight}>
        <Left>
          <Icon name='map' size={36} />
        </Left>
        <Body style={Layout.listItemBody}>
          <Text>{item.name}</Text>
          <Text note>{ item.neighborhood.name }</Text>
        </Body>
        <View style={Layout.listItemChevron}>
          <MaterialIcons name="chevron-right" size={24} style={{ color: Theme.listBorderColor }} />
        </View>
      </ListItem>
    );
  }
}

function mapStateToProps(state) {
  return {
    state: {
      currentUser: state.currentUser,
      fieldGroups: state.fieldGroups
    }
  }
}

function mapDispatchToProps(dispatch, ownProps){
  return bindActionCreators(ReduxActions.fieldGroupsActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)
