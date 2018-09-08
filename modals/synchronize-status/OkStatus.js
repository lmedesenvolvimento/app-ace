import React from 'react';
import { View } from 'react-native';

import {
  Container,
  H1,
  Text,
  Icon,
  Button
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
      return(
        <Container>
          <View style={styles.container}>
            <View style={styles.statusContainer}>
              <H1 style={styles.textCenter}>Sucesso</H1>
            </View>
            <View>
              <Icon android="md-done-all" ios="ios-done-all" style={styles.syncIcon} />
            </View>
            <View style={styles.statusContainer}>
              <Text style={styles.textCenter} note>Seus dados foram sincronizados com sucesso e o seu aplicativo foi atualizado.</Text>
              <Button light full style={Layout.marginVertical} onPress={Actions.pop.bind(this)}>
                <Text>Voltar</Text>
              </Button>
            </View>            
          </View>
      </Container>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
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
  }
}

export default connect(({network}) => ({network}))(OkStatus)