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

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';

import TimerMixin from 'react-timer-mixin';

import ReduxActions from '../redux/actions';
import { PublicAreaMapGettersToProps } from '../redux/actions/publicareas_actions';

import { PublicAreaTypes } from '../types/publicarea';

import { NewStreetModal } from './NewStreetModal';

import Layout from '../constants/Layout';

import { simpleToast } from '../services/Toast';

class EditStreetModal extends NewStreetModal {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      address: undefined,
      type: PublicAreaTypes.street,
      neighborhood: {},
      public_areas: [],
      selection: [],
      focus: false,
    };
  }

  componentDidMount(){
    this.setState({ neighborhood: this.props.fieldgroup.neighborhood, ...this.props.publicarea.public_area });
  }
  
  componentDidMount() {
    const { props } = this;

    const neighborhoodId = props.fieldgroup.neighborhood.id;
    const public_areas = props.getPublicAreasByNeighborhoodId(neighborhoodId);
    
    this.setState({ 
      public_areas,
      selection: public_areas,
      neighborhood: this.props.fieldgroup.neighborhood, 
      ...this.props.publicarea.public_area 
    });
  }
  
  render() {
    const { state } = this;
    return (
      <Container>
        <Content padder>
          <H1 style={Layout.padding}>Atualizar Logradouro</H1>
          <Form>
            <Item stackedLabel>
              <Label>Logradouro</Label>
              <Input
                ref={ref => this.inputs.address = ref}
                placeholder='Nome do Logradouro'
                autoCompleteType="off"
                value={state.address}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                onChangeText={(address) => this.handleSearch(address)}
              />
            </Item>
            {
              state.focus
                ? this.renderPublicAreaList()
                : this.renderFields()
            }
          </Form>
        </Content>
        <Footer style={{ backgroundColor: '#FFFFFF' }} padder>
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
      id,
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

    if (id) payload.public_area.id = id;

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

mapDispatchToProps = (dispatch) => {
  const publicAreaMap = PublicAreaMapGettersToProps(dispatch);
  const fieldGroupsMap = bindActionCreators(ReduxActions.fieldGroupsActions, dispatch);
  return Object.assign({}, publicAreaMap, fieldGroupsMap);
}

export default connect(mapStateToProps, mapDispatchToProps)(EditStreetModal);
