import React from 'react';

import { ActivityIndicator, View, Platform } from 'react-native';

import {
  Container,
  H2,
  Text,
  Footer,
  Button
} from 'native-base';

import { Grid, Row, Col } from 'react-native-easy-grid';

import Colors from '../constants/Layout';
import Layout from '../constants/Layout';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';

import ReduxActions from '../redux/actions';

export class ClearStorageModal extends React.Component {  
  constructor(props) {
    super(props);
    
    this.state = {
      isReady: false
    }
  }  

  componentDidMount(){
    // remove preloading
    setTimeout( () => this.setState({ isReady: true }), 200 );
  }

  render() {
    if(this.state.isReady){
      return (
        <Container>
          <Grid>
            <Col style={styles.container}>
              <H2 style={Layout.padding}>Apagar todos os dados locais</H2>
              <Text note style={styles.textCenter}>Você deseja realmente apagar os dados locais essa ação é irreversível?</Text>
            </Col>
          </Grid>
          <Footer style={{backgroundColor:'white'}} padder>
            <Grid>
              <Row>
                <Col>
                  <Button full transparent onPress={this.dismissModal.bind(this)}>
                    <Text>Cancelar</Text>
                  </Button>
                </Col>                
              </Row>
            </Grid>
          </Footer>
        </Container>
      );
    } else{
      return (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size={Platform.OS == 'ios' ? 1 : 64} color={Colors.accentColor} />
        </View>
      );
    }
  }

  okModal(){    
    // close modal
    Actions.pop();
  }

  dismissModal(){
    Actions.pop();
  }
}

const styles = {
  container: {
    marginVertical: 24,
    marginHorizontal: 48,
    justifyContent: 'center',
    alignItems: 'center'
  },
  wrapper: {},
  textCenter: {
    textAlign: 'center'
  },
  spinnerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8
  },
  footerBorder:{
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  colLeftBorder: {
    borderLeftWidth: 1,
    borderLeftColor: '#eee'
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

function mapDispatchToProps(dispatch){
  return bindActionCreators(ReduxActions.fieldGroupsActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ClearStorageModal);
