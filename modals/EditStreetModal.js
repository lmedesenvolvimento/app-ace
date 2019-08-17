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
    this.setState({ neighborhood: this.props.fieldgroup.neighborhood, ...this.props.publicarea.public_area });
  }  

  render() {
    const { state } = this;
    return (
      <Container>
        <Content padder>
          <H1 style={Layout.padding}>Atualizar Logradouro</H1>
          <Form>
            <View style={Layout.padding}>
              <Label>Bairro</Label>
              <Input placeholder='Nome do Bairro' value={state.neighborhood.name} disabled={true}/>
            </View>

            <View style={Layout.padding}>
              <Text note>Tipo de Imóvel</Text>
              <Picker
                selectedValue={state.type}
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
              <Input placeholder='Nome do Logradouro' value={state.address} onChangeText={(address)=> this.setState({address})} />
            </Item>
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
                  <Text>Atualizar</Text>
                </Button>
              </Col>
            </Row>
          </Grid>          
        </Footer>
      </Container>
    );
  }

  dismissModalBeforeModal = () => {
    const { 
      address,
      type
     } = this.state;

    const publicarea = {
       public_area: {
         address,
         type
       }
     }

    Actions.pop({ publicarea });

    TimerMixin.setTimeout(() => {
      Actions.refresh({ publicarea });
    });
  }

  okModal = () => {
    const { props } = this;
    const {
      address,
      type
    } = this.state;

    if (!address) {
      return simpleToast('Logradouro vazio.');
    }

    if (this.isHasAddressInFieldgroup()) {
      return Alert.alert('Falha no registro do Logradouro', 'O logradouro já foi cadastrada.');
    }

    const payload = {
      public_area: {
        address,
        type
      }
    }

    props.editPublicArea(props.fieldgroup.$id, props.publicarea, payload);

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

mapStateToProps = ({ currentUser, fieldGroups }) => {
  return {
    state: {
      currentUser,
      fieldGroups
    }
  };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators(ReduxActions.fieldGroupsActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EditStreetModal);
