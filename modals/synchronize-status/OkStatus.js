import React from 'react';
import { View } from 'react-native';

import {
  Container,
  H1,
  Text,
  Icon,
  Button,
  ListItem,
  Body,
  Left,
  Right,
  List
} from 'native-base';

import Layout from '../../constants/Layout';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { Actions } from 'react-native-router-flux';

import ReduxActions from "../../redux/actions";

class OkStatus extends React.Component {
    constructor(props){
      super(props);
    }

    render(){
      const { props } = this;
      return(
        <Container>
          <View style={[styles.container, styles.centered]}>
            <View style={styles.statusContainer}>
              <H1 style={styles.textCenter}>Sucesso</H1>
            </View>
            <View>
              <Icon name={props.errorAfterSync ? 'done' : 'done-all'} style={styles.syncIcon} color="#00ff00" type="MaterialIcons" />              
            </View>
            <View style={styles.statusContainer}>
              <Text style={[
                  styles.textCenter, 
                  props.errorAfterSync ? styles.warning : {}
                ]} 
                note
              >
                {
                  props.errorAfterSync
                      ? 'Seus dados foram sincronizados com sucesso porem o seu aplicativo não foi atualizado!'
                      : 'Seus dados foram sincronizados com sucesso e o seu aplicativo foi atualizado.'
                }              
              </Text>
            </View>
          </View>
          <View style={styles.container}>
            <List>
              <ListItem icon noBorder>
                <Left>
                  <Icon name="done" type="MaterialIcons" />
                </Left>
                <Body>
                  <Text note>Sincronia enviada com sucesso.</Text>
                </Body>
                <Right/>
              </ListItem>
              <ListItem icon noBorder>
                <Left>
                  <Icon name={props.errorAfterSync ? 'error' : 'done'} type="MaterialIcons" style={props.errorAfterSync ? styles.warning : {}} />
                </Left>
                <Body>
                  <Text note style={props.errorAfterSync ? styles.warning : {}}>
                    {
                      props.errorAfterSync
                        ? 'Falha ao tentar receber novos dados.'
                        : 'Novos dados recebidos'
                    }                    
                  </Text>
                </Body>
                <Right />
              </ListItem>
            </List>
            <Button light full style={Layout.marginVertical} onPress={Actions.pop.bind(this)}>
              <Text>Voltar</Text>
            </Button>
          </View>            
      </Container>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16
  },
  centered: {    
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 48
  },
  statusContainer: {    
    paddingVertical: 16
  },
  progress: {
    width: 248
  },
  syncIcon: {
    fontSize: 98, 
    color: '#aaa',
    paddingVertical: 12
  },
  textCenter: {
    textAlign: 'center',
    marginVertical: 2
  },
  warning: {
    color: 'orange'
  }
}

export default connect(({network}) => ({network}))(OkStatus)