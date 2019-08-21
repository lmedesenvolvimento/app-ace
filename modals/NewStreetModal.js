import React from 'react';
import { Alert, View, FlatList } from 'react-native';

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
  Body,
  Picker,
  ListItem,
  Left,
  Icon,
  Right
} from 'native-base';

import { Col, Row, Grid } from 'react-native-easy-grid';

import Layout from '../constants/Layout';

import { simpleToast } from '../services/Toast';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';

import { find, filter, chain } from 'lodash';

import ReduxActions from '../redux/actions';

import { PublicAreaTypes } from '../types/publicarea';
import { PublicAreaMapGettersToProps } from '../redux/actions/publicareas_actions';

import Colors from '../constants/Colors';

export const contains = ({ address }, query) => {
  if (address.toString().toLowerCase().includes(query)) {
    return true;
  }
  return false;
};

export class NewStreetModal extends React.Component {
  constructor(props) {
    super(props);
    this.inputs = {};
    this.state = {
      id: null,
      address: undefined,
      type: PublicAreaTypes.street,
      neighborhood: {},
      addresses: [],
      public_areas: [],
      selection: [],
      focus: false,
    };
  }

  componentDidMount(){
    const { props } = this;
    
    const neighborhoodId = props.fieldgroup.neighborhood.id;
    const public_areas = props.getPublicAreasByNeighborhoodId(neighborhoodId);

    this.setState({ 
      neighborhood: props.fieldgroup.neighborhood,
      selection: public_areas,
      public_areas
    });
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

  renderPublicAreaList = () => {
    const { state } = this;
    return (
      <FlatList
        style={{ flex: 1, marginTop: 8 }} 
        data={state.selection}
        extraData={state}
        renderItem={this.renderItem}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
      />
    )
  }

  renderItem = ({ item }) => {
    return (
      <ListItem
        icon
        onPress={() => this.onPressItem(item)}
        style={Layout.listHeight}
        noBorder
      >
        <Left>
          <Icon name='location-on' size={28} color={Colors.iconColor} type="MaterialIcons" />
        </Left>
        <Body>
          <Text>{item.address}</Text>
          <Text note>{this.getLabelType(item.type)}</Text>
        </Body>
        <Right />
      </ListItem>
    );
  }

  renderFields = () => {
    const { state } = this;
    if (!state.focus) {
      return (
        <View>
          <View style={Layout.padding}>
            <Label>Bairro</Label>
            <Input placeholder='Nome do Bairro' value={state.neighborhood.name} disabled={true}/>
          </View>
          <View style={Layout.padding}>
            <Text note>Tipo</Text>
            {this.renderTypePicker()}
          </View>
        </View>
      );
    }
    return null;
  }

  renderTypePicker = () => {
    const { state } = this;
    if (!state.id) {
      return (
        <Picker
          selectedValue={state.type}
          onValueChange={(type) => this.setState({ type })}
          supportedOrientations={['portrait', 'landscape']}
          mode='dropdown'>
          <Picker.Item 
            label='Rua' 
            value={PublicAreaTypes.street} 
          />
          <Picker.Item 
            label='Avenida' 
            value={PublicAreaTypes.avenue} 
          />
          <Picker.Item 
            label='Outros' 
            value={PublicAreaTypes.others} 
          />
        </Picker>
      );
    }
    return (
      <Text>{this.getLabelType(state.type)}</Text>
    );
  }

  getLabelType = (type) => {
    switch (type) {
    case PublicAreaTypes.street:        
      return 'Rua';
    case PublicAreaTypes.avenue:
      return 'Avenida';
    case PublicAreaTypes.others:
      return 'Outros';
    }
  }

  handleSearch = (address) => {
    const { props, state } = this;
    const selection = filter(state.public_areas, p => contains(p, address.toLowerCase()));
    this.setState({ address, selection });
  }

  onPressItem = (item) => {
    const { 
      id, 
      address, 
      type
    } = item;

    this.setState({
      id, 
      address, 
      type
    });

    this.inputs.address._root.blur();
  }
  
  onFocus = () => {
    this.setState({ focus: true })
  }
  
  onBlur = () => {
    if (this.isHasInNeighborhood()) {
      this.setState({ focus: false });
      return;
    }
    this.setState({ id: false, focus: false })
  }

  okModal = () => {
    const { props } = this;
    const {
      id,
      address,
      type,
      neighborhood,
      addresses
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
      },
      neighborhood,
      addresses
    };

    if (id) payload.public_area.id = id;

    props.addPublicArea(this.props.fieldgroup.$id, payload);
    
    this.dismissModal();
  }

  dismissModal = () => {
    Actions.pop();
  }

  isHasInNeighborhood = () => {
    const { props, state } = this;
    
    if (!state.address) return false
    
    const selection = filter(
      state.public_areas, 
      p => contains(p, state.address.toLowerCase())
    );

    return selection.length;
  }

  isHasAddressInFieldgroup = () => {
    const { props, state } = this;
    const { publicarea, fieldgroup } = props;

    if (publicarea && publicarea.public_area.address == state.address){
      return false;
    }

    const field_group_public_areas = this.getPublicAreasFieldgroupFromStore();

    const result = 
      chain(field_group_public_areas)
        .find(fpa => {
          const { public_area } = fpa;
          ( public_area.address == state.address ) && ( public_area.type == state.type )
        })          
        .value();

    return result ? true : false;
  }

  getPublicAreasFieldgroupFromStore = () => {
    const { state } = this.props;
    const { data } = state.fieldGroups;
    const result = find(data, { $id: this.props.fieldgroup.$id });

    if (result) {
      return result.field_group.field_group_public_areas;
    }

    return [];
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

export default connect(mapStateToProps, mapDispatchToProps)(NewStreetModal);

