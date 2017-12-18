import React, { Component } from 'react';
import { Actions } from "react-native-router-flux";
import { connect } from 'react-redux';

import Colors from "../../constants/Colors";

import {
  Container,
  Header,
  Content,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Text,
  Title,
  Subtitle,
} from 'native-base';

class MainMenu extends Component {
  constructor(props){
    super(props);
  }

  render(){
    let { currentUser, network } = this.props;
    return (
      <Container>
        <Body style={styles.headerDrawer}>
          <Title>{currentUser.data.name}</Title>
          <Subtitle>{currentUser.data.role} - {network.isConnected ? 'Conectado' : 'Sem rede'}</Subtitle>
        </Body>
        <Content>
          <List>
            <ListItem button={true} first  onPress={_=> Actions.home()}>
              <Body>
                <Text>Início</Text>
              </Body>
            </ListItem>
            <ListItem button={true} last onPress={_=> Actions.about()}>
              <Body>
                <Text>Sobre</Text>
              </Body>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}

const styles = {
  headerDrawer: {
    flex: 1,
    maxHeight: 160,
    padding: 16,
    alignSelf:"stretch",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    backgroundColor: Colors.primaryColor,
  }
}

export default connect(({network, currentUser}) => ({network, currentUser}))(MainMenu)
