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

import Layout from '../constants/Layout';

import { simpleToast } from '../services/Toast';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';

import ReduxActions from '../redux/actions';

import { PublicAreaTypes } from '../types/publicarea';

import _ from 'lodash';

export class NewStreetModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      address: undefined,
      type: PublicAreaTypes.street,
      neighborhood: {},
      addresses: []
    };
  }

  componentDidMount(){
    this.setState({ neighborhood: this.props.fieldgroup.neighborhood });
  }
  
  render() {
    const { state } = this;
    return (
      <Container>
        <Content padder>
          <H1 style={Layout.padding}>Novo Logradouro</H1>
          <Form>
            <Item stackedLabel>
              <Label>Logradouro</Label>
              <Input placeholder='Nome do Logradouro' value={state.address} onChangeText={(address)=> this.setState({ address })} />
            </Item>
            
            <View style={Layout.padding}>
              <Label>Bairro</Label>
              <Input placeholder='Nome do Bairro' value={state.neighborhood.name} disabled={true}/>
            </View>

            { this.renderType() }
          </Form>
        </Content>
        <Footer style={{backgroundColor: '#FFFFFF'}} padder>
          <Grid>
            <Row style={{ alignItems: 'center' }}>
              <Col style={styles.col}>
                <Button full transparent onPress={this.dismissModal}>
                  <Text>Cancelar</Text>
                </Button>
              </Col>
              <Col style={[styles.col, styles.colLeftBorder]}>
                <Button full transparent onPress={this.okModal}>
                  <Text>Novo Logradouro</Text>
                </Button>
              </Col>
            </Row>
          </Grid>          
        </Footer>
      </Container>
    );
  }

  renderSelectPublicArea = () => {
    const { fieldGroups } = this.props.state;
  }

  renderType = () => {
    const { state } = this;
    if (!state.id) {
      return (
        <View style={Layout.padding}>
          <Text note>Tipo de Imóvel</Text>
          <Picker
            selectedValue={state.type}
            onValueChange={(type) => this.setState({ type })}
            supportedOrientations={['portrait', 'landscape']}
            mode='dropdown'>
            <Item label='Rua' value={PublicAreaTypes.street} />
            <Item label='Avenida' value={PublicAreaTypes.avenue} />
            <Item label='Outros' value={PublicAreaTypes.others} />
          </Picker>
        </View>
      );
    }
    return null;
  }

  okModal = () => {
    const { props } = this;
    const {
      address,
      type,
      neighborhood,
      addresses
    } = this.state;

    if (!address) {
      return simpleToast('Logradouro vazio.');
    }

    if (this.isHasAddressInFieldgroup()){
      return Alert.alert('Falha no registro do Logradouro', 'O logradouro já foi cadastrada.');
    }

    const payload = {
      public_area: {
        address,
        type
      },
      neighborhood,
      addresses
    }

    props.addPublicArea(this.props.fieldgroup.$id, payload);
    
    this.dismissModal();
  }

  dismissModal = () => {
    Actions.pop();
  }

  isHasAddressInFieldgroup = () => {
    const { props, state } = this;
    const { publicarea, fieldgroup } = props;

    if (publicarea && publicarea.public_area.address == state.address){
      return false;
    }

    const { field_group_public_areas } = fieldgroup;

    const result = 
      _.chain(field_group_public_areas)
        .find(fpa => (fpa.public_area.address == state.address) && (fpa.public_area.type == state.type ))
        .value() 

    return result ? true : false
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


mapStateToProps = ({ currentUser, fieldGroups }) => {
  return {
    state: {
      currentUser,
      fieldGroups
    }
  };
}

mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ReduxActions.fieldGroupsActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NewStreetModal);

