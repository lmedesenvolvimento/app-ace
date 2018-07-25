import React from 'react';
import { Alert, View } from 'react-native';

import {
  Container,
  Content,
  H1,
  Text,
  Footer,
  Form,
  Label,
  Item,
  Input,
  Button,
  Picker
} from 'native-base';

import { Col, Row, Grid } from 'react-native-easy-grid';

import { NewStreetModal } from './NewStreetModal';

import Layout from '../constants/Layout';

import { simpleToast } from '../services/Toast';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';

import ReduxActions from '../redux/actions';

import { PublicAreaTypes } from '../types/publicarea';

import TimerMixin from 'react-timer-mixin';

class EditStreetModal extends NewStreetModal {
  
  constructor(props) {
    super(props);
    this.state = {
      address: undefined,
      type: PublicAreaTypes.street,
      neighborhood: {}
    };
  }

  componentDidMount(){
    this.setState({ neighborhood: this.props.fieldgroup.neighborhood, ...this.props.publicarea });
  }  

  render() {
    return (
      <Container>
        <Content padder>
          <H1 style={Layout.padding}>Atualizar Logradouro</H1>
          <Form>
            <View style={Layout.padding}>
              <Label>Bairro</Label>
              <Input placeholder='Nome do Bairro' value={this.state.neighborhood.name} disabled={true}/>
            </View>

            <View style={Layout.padding}>
              <Text note>Tipo de Imóvel</Text>
              <Picker
                selectedValue={this.state.type}
                onValueChange={(type) => this.setState({type}) }
                supportedOrientations={['portrait','landscape']}
                mode='dropdown'>
                <Item label='Rua' value={PublicAreaTypes.street} />
                <Item label='Avenida' value={PublicAreaTypes.avenue} />
                <Item label='Outros' value={PublicAreaTypes.others} />
              </Picker>
            </View>

            <Item stackedLabel>
              <Label>Logradouro</Label>
              <Input placeholder='Nome do Logradouro' value={this.state.address} onChangeText={(address)=> this.setState({address})} />
            </Item>
          </Form>
        </Content>
        <Footer style={{backgroundColor:'white'}} padder>
          <Grid>
            <Row style={{ alignItems: 'center' }}>
              <Col style={styles.col}>
                <Button full transparent onPress={this.dismissModal}>
                  <Text>Cancelar</Text>
                </Button>
              </Col>
              <Col style={[styles.col, styles.colLeftBorder]}>
                <Button full transparent onPress={ () => this.okModal() }>
                  <Text>Atualizar</Text>
                </Button>
              </Col>
            </Row>
          </Grid>          
        </Footer>
      </Container>
    );
  }

  dismissModalBeforeModal() {
    Actions.pop({
      publicarea: this.state
    });

    TimerMixin.setTimeout(() => {
      Actions.refresh({
        publicarea: this.state
      });
    });
  }

  okModal() {
    if (!this.state.address) {
      return simpleToast('Logradouro vazio.');
    }

    if (this.isHasAddressInFieldgroup()) {
      return Alert.alert('Falha no registro do Logradouro', 'O logradouro já foi cadastrada.');
    }

    this.props.editPublicArea(this.props.fieldgroup.$id, this.props.publicarea, this.state);

    this.dismissModalBeforeModal();
  }
}

const styles = {
  col:{
    alignItems: 'center',
    justifyContent: 'center'
  },
  colLeftBorder:{
    borderLeftWidth: 1,
    borderLeftColor: '#eee'
  },
  progressItem:{
    width: 32,
    height: 16,
    backgroundColor: 'grey'
  },
  progressItemActive: {
    ...this.progressItem,
    backgroundColor: 'orange'
  },
  progressItemComplete: {
    ...this.progressItem,
    backgroundColor: 'red'
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

export default connect(mapStateToProps, mapDispatchToProps)(EditStreetModal);
