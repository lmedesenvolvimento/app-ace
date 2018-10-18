import React from 'react';

import { ActivityIndicator, View, Platform } from 'react-native';

import {
  Container,
  H1,
  H3,
  Text,
  Footer,
  Button,
  Body,
  Form,
  Item,
  Input
} from 'native-base';

import { Grid, Row, Col } from 'react-native-easy-grid';

import Colors from '../constants/Layout';
import Layout from '../constants/Layout';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';

import ReduxActions from '../redux/actions';

import Session from '../services/Session';
import { genSecureHex } from '../services/SecureRandom';
import { simpleToast } from '../services/Toast';

import { clone } from 'lodash';

export class ClearStorageModal extends React.Component {  
  constructor(props) {
    super(props);
    
    this.state = {
      busy: false,
      inputConfirmCode: '',
      confirmCode: '',
      isReady: false
    };
  }  

  componentDidMount(){
    this.setState({ confirmCode: genSecureHex(4).toUpperCase() });
    // remove preloading
    setTimeout( () => this.setState({ isReady: true }), 200 );
  }

  render() {
    if(this.state.isReady){
      if(this.state.busy){
        return(
          <Container>
            {/* <Row>
              <Col style={{ justifyContent: 'center' }}>
                <Text note style={[Layout.marginVertical16, styles.textCenter]}>Sincronizando</Text>
                <ActivityIndicator size={Platform.OS == 'ios' ? 1 : 64} color={Colors.accentColor} />
              </Col>
            </Row> */}
          </Container>
        );
      } else {
        return (
          <Container>
            <Grid>
              <Row>
                <Col>
                  <Body style={styles.container}>
                    <H3 style={styles.textCenter}>Você deseja realmente recarregar os dados? Seus dados locais serão apagados e essa ação é irreversível.</H3>
                  </Body>
                  <Form style={{ alignItems: 'center', flex: 3 }}>
                    <Text note style={styles.textCenter}>Código de Confirmação</Text>
                    <H1 style={[Layout.padding, styles.textCenter]}>{this.state.confirmCode}</H1>
                    <Item fixedLabel>
                      <Input 
                        value={this.state.inputConfirmCode}
                        onChangeText={(inputConfirmCode) => {
                          this.setState({inputConfirmCode});
                        }} 
                        style={styles.textCenter} 
                        placeholder="Informe o código de confirmação." />
                    </Item>
                    <Button onPress={this.onSubmitConfirmCode.bind(this)} full primary style={Layout.padding}>
                      <Text>Recarregar dados agora</Text>
                    </Button>                  
                  </Form>
                </Col>
              </Row>
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
      }
    } else{
      return (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size={Platform.OS == 'ios' ? 1 : 64} color={Colors.accentColor} />
        </View>
      );
    }
  }

  onSubmitConfirmCode(){
    if(this.state.busy){
      return true;
    }

    let { confirmCode, inputConfirmCode } = this.state;
    let { fieldGroups } = this.props.state;
    
    let fieldGroupsBackup = clone(fieldGroups);

    if (confirmCode.toUpperCase() === inputConfirmCode.toUpperCase()) {
      let { currentUser } = this.props.state;
      let emptyArray = [];
      
      this.setState({busy: true});

      // Limpando Storage
      Session.Storage.destroy(currentUser.data.email);
      // Limpando States
      this.props.setFieldGroups(emptyArray);
      // Carregando novo estado da Aplicação
      this.props.getFieldGroups(
        this.getFieldGroupsSuccess.bind(this), 
        this.getFieldGroupsFail.bind(this, fieldGroupsBackup)
      );
    } else{
      simpleToast('Código está errado ou vazio.');
    }
  }

  dismissModal(){
    Actions.pop();    
  }

  getFieldGroupsSuccess(){
    simpleToast('Novos dados carregados');
    this.setState({busy: false});
    this.dismissModal();
  }

  getFieldGroupsFail(fieldGroupsBackup){
    // Recovery State
    this.props.setFieldGroups(fieldGroupsBackup.data);
    this.setState({busy: false});
  }
}

const styles = {
  container: {
    flex: 1,
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
};

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

export default connect(mapStateToProps, mapDispatchToProps)(ClearStorageModal);
