import React from 'react';
import { Share } from 'react-native';
import { Actions } from 'react-native-router-flux';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ReduxActions from '../../redux/actions';

import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

import {
  Container,
  Content,
  List,
  ListItem,
  Left,
  Body,
  Text,
  Title,
  Subtitle
} from 'native-base';

import { MaterialIcons } from '@expo/vector-icons';


class MainMenu extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    let { currentUser, network } = this.props.state;
    return (
      <Container>
        <Body style={styles.headerDrawer}>
          <Title>{currentUser.data.name}</Title>
          <Subtitle>{currentUser.data.role} - {network.isConnected ? 'Conectado' : 'Sem rede'}</Subtitle>
        </Body>
        <Content>
          <List>
            <ListItem style={[this._defineItemStyle('home'), Layout.firstListItem]} first onPress={() => Actions.home()} >
              <Body>
                <Text style={this._defineItemTextStyle('home')}>Início</Text>
              </Body>
            </ListItem>

            <ListItem style={this._defineItemStyle('profile')}  onPress={() => Actions.profile()} last>
              <Body>
                <Text style={this._defineItemTextStyle('profile')}>Perfil</Text>
              </Body>
            </ListItem>
            
            <ListItem itemHeader first>
              <Text note>Dados</Text>
            </ListItem>
            {this._renderForceSyncItem()}
            {this._renderSyncItem()}
            
            <ListItem itemHeader first>
              <Text note>Outros</Text>
            </ListItem>
            {this._renderReportCardItem()}
            <ListItem icon style={this._defineItemStyle('about')} onPress={() => Actions.about()} last>
              <Left>
                <MaterialIcons name="info" style={styles.iconSize} />
              </Left>
              <Body>
                <Text style={this._defineItemTextStyle('about')}>Sobre</Text>
              </Body>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }

  shareCurrentState(){
    Share.share({
      title: 'Estado da Aplicação',
      message: JSON.stringify(this.props.state.fieldGroups.data)
    });
  }

  _defineItemStyle(key){
    return this.props.activeItemKey == key ? styles.listItemActive : styles.listItem;
  }
  _defineItemTextStyle(key){
    return this.props.activeItemKey == key ? styles.listItemActiveText : styles.listItemText;
  }

  _renderReportCardItem(){
    if (this.props.state.network.isConnected){
      return(
        <ListItem icon style={this._defineItemStyle('reportcard')} last onPress={ () => Actions.reportcard()}>
          <Left>
            <MaterialIcons name="book" style={styles.iconSize} />
          </Left>
          <Body>
            <Text style={this._defineItemTextStyle('reportcard')}>Boletim Diário</Text>
          </Body>
        </ListItem>
      );
    }
  }
  
  _renderSyncItem(){
    if (this.props.state.network.isConnected){
      return(
        <ListItem icon style={this._defineItemStyle('syncDataModal')} onPress={ () => Actions.syncDataModal()} last>
          <Left>
            <MaterialIcons name="sync" style={styles.iconSize} />
          </Left>
          <Body>
            <Text style={this._defineItemTextStyle('syncDataModal')}>Sincronizar Dados</Text>
          </Body>
        </ListItem>
      );
    }
  }
  _renderForceSyncItem(){
    if (this.props.state.network.isConnected){
      return(
        <ListItem icon style={this._defineItemStyle('clearStorageModal')} last onPress={ () => Actions.clearStorageModal()}>
          <Left>
            <MaterialIcons name="restore" style={styles.iconSize} />
          </Left>
          <Body>
            <Text style={this._defineItemTextStyle('clearStorageModal')}>Recarregar Dados</Text>
          </Body>
        </ListItem>
      );
    }
  }
}

const styles = {
  headerDrawer: {
    flex: 1,
    maxHeight: 160,
    padding: 16,
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    backgroundColor: Colors.primaryColor,
  },
  listItem: {
    backgroundColor: 'rgba(153, 153, 153, 0)',
  },
  listItemActive:{
    backgroundColor: 'rgba(153, 153, 153, 0.1)',
  },
  listItemText:{
    fontWeight: '800',
  },
  listItemActiveText:{
    fontWeight: '800',
    color: Colors.accentColor
  },
  iconSize:{
    fontSize: 24
  }
};

function mapStateToProps(state) {
  return {
    state: {
      currentUser: state.currentUser,
      fieldGroups: state.fieldGroups,
      network: state.network
    }
  };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators(ReduxActions.userActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MainMenu);