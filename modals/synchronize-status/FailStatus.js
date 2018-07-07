import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';

import {
  Container,
  H1,
  Text,
  Button
} from 'native-base';

import Layout from '../../constants/Layout';

import { connect } from 'react-redux';

class FailStatus extends React.Component {
    constructor(props){
      super(props);
    }

    render(){
      return(
        <Container>
          <View style={styles.container}>
            <View style={styles.statusContainer}>
              <H1 style={styles.textCenter}>Falha Sincronização</H1>
            </View>
            <View>
              <MaterialIcons name="cloud-off" style={styles.syncIcon} />
            </View>
            <View style={styles.statusContainer}>
              <Text style={styles.textCenter} note>Não foi possível terminar sua sincronização por favor tente novamente.</Text>
              <Button light full style={Layout.marginVertical} onPress={this.props.onBackButton.bind(this)}>
                <Text>Tentar novamente</Text>
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

export default connect(({network}) => ({network}))(FailStatus)