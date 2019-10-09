import React from 'react';

import { ActivityIndicator, View, Platform } from 'react-native';

import {
  Container,
  Content,
  H2,
  Text,
  Header,
  Left,
  Footer,
  Body,
  Item,
  Label,
  Title,
  Input,
  Picker,
  Button,
} from 'native-base';

import { Grid, Row, Col } from 'react-native-easy-grid';

import Colors from '../constants/Layout';
import Layout from '../constants/Layout';

import { simpleToast } from '../services/Toast';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { Actions } from 'react-native-router-flux';

import ReduxActions from "../redux/actions";

import { CensoType } from '../types/censo';

import _ from 'lodash';
import numeral from 'numeral';

export class CensoModal extends React.Component {
  
  constructor(props) {
    super(props);
    this.inputs = {};
    this.state = {
      inhabitants: 0,
      tank: 0,
      drum: 0,
      tina: 0,
      filter: 0,
      pot: 0,
      pool: 0,
      plant_pot: 0,
      cistern: 0,
      waterhole: 0,
      water_box: 0,
      water_box_status: undefined
    };
  }  

  componentDidMount(){
    this.setCensus();
    // remove preloading
    setTimeout( () => this.setState({ isReady: true }), 200 );
  }

  render() {
    if(this.state.isReady){
      return (
        <Container>
          <H2 style={Layout.padding}>Registrar Censo</H2>
          <Content padder>
            <View style={{paddingBottom: 48}}>
              <Grid style={styles.row}>
                <Col style={styles.item}>
                  <Item stackedLabel>
                    <Label>{CensoType.inhabitants}</Label>
                    <Input 
                      keyboardType='numeric' 
                      onChangeText={inhabitants => this.setState({inhabitants})}
                      onBlur={() => this.onBlurNumeralState('inhabitants')} 
                      onSubmitEditing={this.onBlurNumeralState.bind(this, 'inhabitants', 'tank')}
                    >
                      {this.state.inhabitants.toString()}
                    </Input>
                  </Item>
                </Col>
                <Col style={styles.item}>
                  <Item stackedLabel>
                    <Label>{CensoType.tank}</Label>
                    <Input
                      ref={ref => this.inputs.tank = ref}
                      keyboardType='numeric'                     
                      onChangeText={tank => this.setState({tank})}
                      onBlur={() => this.onBlurNumeralState('tank')}
                      onSubmitEditing={this.onBlurNumeralState.bind(this, 'tank', 'filter')}
                    >
                      {this.state.tank.toString()}
                    </Input>
                  </Item>
                </Col>
              </Grid>

              <Grid style={styles.row}>
                <Col style={styles.item}>
                  <Item stackedLabel>
                    <Label>{CensoType.filter}</Label>
                    <Input
                      ref={ref => this.inputs.filter = ref}
                      keyboardType='numeric' 
                      onChangeText={filter => this.setState({filter})}
                      onBlur={() => this.onBlurNumeralState('filter')}
                      onSubmitEditing={this.onBlurNumeralState.bind(this, 'filter', 'tina')}
                    >
                      {this.state.filter.toString()}
                    </Input>
                  </Item>
                </Col>
                <Col style={styles.item}>
                  <Item stackedLabel>
                    <Label>{CensoType.tina}</Label>
                    <Input
                      ref={ref => this.inputs.tina = ref}
                      keyboardType='numeric' 
                      onChangeText={tina => this.setState({tina})}
                      onBlur={() => this.onBlurNumeralState('tina')}
                      onSubmitEditing={this.onBlurNumeralState.bind(this, 'tina', 'drum')}
                    >
                      {this.state.tina.toString()}
                    </Input>
                  </Item>
                </Col>
              </Grid>

              <Grid style={styles.row}>
                <Col style={styles.item}>
                  <Item stackedLabel>
                    <Label>{CensoType.drum}</Label>
                    <Input
                      ref={ref => this.inputs.drum= ref}
                      keyboardType='numeric' 
                      onChangeText={drum => this.setState({drum})}
                      onBlur={() => this.onBlurNumeralState('drum')}
                      onSubmitEditing={this.onBlurNumeralState.bind(this, 'drum', 'pot')}
                    >
                      {this.state.drum.toString()}
                    </Input>
                  </Item>
                </Col>
                <Col style={styles.item}>
                  <Item stackedLabel>
                    <Label>{CensoType.pot}</Label>
                    <Input
                      ref={ref => this.inputs.pot = ref}
                      keyboardType='numeric' 
                      onChangeText={pot => this.setState({pot})}
                      onBlur={() => this.onBlurNumeralState('pot')}
                      onSubmitEditing={this.onBlurNumeralState.bind(this, 'pot', 'plant_pot')}
                    >
                      {this.state.pot.toString()}
                    </Input>
                  </Item>
                </Col>
              </Grid>

              <Grid style={styles.row}>
                <Col style={styles.item}>
                  <Item stackedLabel>
                    <Label>{CensoType.plant_pot}</Label>
                    <Input
                      ref={ref => this.inputs.plant_pot = ref}
                      keyboardType='numeric' 
                      onChangeText={plant_pot => this.setState({plant_pot})}
                      onBlur={() => this.onBlurNumeralState('plant_pot')}
                      onSubmitEditing={this.onBlurNumeralState.bind(this, 'plant_pot', 'cistern')}
                    >
                      {this.state.plant_pot.toString()}
                    </Input>
                  </Item>
                </Col>
                <Col style={styles.item}>
                <Item stackedLabel>
                  <Label>{CensoType.cistern}</Label>
                  <Input
                    ref={ref => this.inputs.cistern = ref}
                    keyboardType='numeric' 
                    onChangeText={cistern => this.setState({cistern})}
                    onBlur={() => this.onBlurNumeralState('cistern')}
                    onSubmitEditing={this.onBlurNumeralState.bind(this, 'cistern', 'waterhole')}
                  >
                    {this.state.cistern.toString()}
                  </Input>
                </Item>
                </Col>
              </Grid>

              <Grid style={styles.row}>
                <Col style={styles.item}>
                  <Item stackedLabel>
                    <Label>{CensoType.waterhole}</Label>
                    <Input
                      ref={ref => this.inputs.waterhole = ref}
                      keyboardType='numeric' 
                      onChangeText={waterhole => this.setState({waterhole})}
                      onBlur={() => this.onBlurNumeralState('waterhole')}
                      onSubmitEditing={this.onBlurNumeralState.bind(this, 'waterhole', 'pool')}
                    >
                      {this.state.waterhole.toString()}
                    </Input>
                  </Item>
                </Col>
                <Col style={styles.item}>
                  <Item stackedLabel>
                    <Label>{CensoType.pool}</Label>
                    <Input
                      ref={ref => this.inputs.pool = ref}
                      keyboardType='numeric' 
                      onChangeText={pool => this.setState({pool})}
                      onBlur={() => this.onBlurNumeralState('pool')}
                      onSubmitEditing={this.onBlurNumeralState.bind(this, 'pool', 'water_box')}
                    >
                      {this.state.pool.toString()}
                    </Input>
                  </Item>
                </Col>
              </Grid>
              <Grid>
                <Col style={styles.item}>
                  <Item stackedLabel>
                    <Label>{CensoType.water_box}</Label>
                    <Input
                      ref={ref => this.inputs.water_box = ref}
                      keyboardType='numeric' 
                      onChangeText={water_box => this.setState({water_box}) }
                      onBlur={() => this.onBlurNumeralState('water_box')}
                    >
                      {this.state.water_box.toString()}
                    </Input>
                  </Item>
                </Col>
              </Grid>
                  {
                    this.state.water_box ?
                      <Grid style={styles.row}>
                        <Col style={styles.item}>
                          <Text note>{CensoType.water_box_status}</Text>
                          <Picker
                            selectedValue={this.state.water_box_status}
                            onValueChange={(water_box_status) => this.setState({ water_box_status })}
                            supportedOrientations={['portrait', 'landscape']}
                            renderHeader={this._renderPickerHeader.bind(this)}
                            mode='dropdown'>
                            <Item label='Selecione um' value={undefined} />
                            <Item label='Fechado' value={CensoType.water_box_statuses.closed} />
                            <Item label='Aberto' value={CensoType.water_box_statuses.opened} />
                          </Picker>
                        </Col>
                      </Grid>
                    : false
                  }
            </View>
          </Content>
          <Footer style={{backgroundColor:"white"}} padder>
            <Grid style={styles.row}>
              <Row style={{alignItems: 'center'}}>
                <Col style={styles.item}>
                  <Button full transparent onPress={this.dismissModal.bind(this)}>
                    <Text>Voltar</Text>
                  </Button>
                </Col>
                <Col style={styles.item} style={styles.colLeftBorder}>
                  <Button full transparent onPress={this.okModal.bind(this)}>
                    <Text>Atualizar</Text>
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
      )
    }
  }

  _renderPickerHeader(backAction) {
    return (
      <Header>
        <Left style={styles.container}>
          <Button transparent onPress={backAction}>
            <Text>Voltar</Text>
          </Button>
        </Left>
        <Body style={{ flex: 2 }}>
          <Title style={{ textAlign: 'center' }}>Selecione um</Title>
        </Body>
      </Header>
    );
  }

  onBlurNumeralState = (key, nextInput) => {
    let number = numeral(this.state[key]).value();
    let updates = {};

    updates[key] = Math.abs(number);

    this.setState(updates);

    if (nextInput) this.inputs[nextInput]._root.focus();
  }

  okModal(){
    const { props } = this;
    const { fieldgroup, publicarea, address } = props;
    
    let updates = _.clone(this.props.address);
    let data = _.chain(this.state).omit(['isReady']).value();
    
    // set census to updates
    if (_.isEmpty(updates.census)) {
      updates.census[0] = data;
    } else{
      if(updates.census[0].id) data.updated = true;
      updates.census[0] = data;
    }
    // dispath action
    props.updateCensus(
      fieldgroup.$id, 
      publicarea.$id, 
      address, updates
    );
    
    // feedback user
    simpleToast('Censo atualizado com successo!');
    // close modal
    Actions.pop();
  }

  dismissModal(){
    Actions.pop();
  }

  scrollBy = (index) => {
    this.swiper.scrollBy(index)
  }

  setCensus(){
    let census = _.first(this.props.address.census);

    if (_.isEmpty(census)) {
      return false;
    }

    // update component state
    let updates = { ...census };
    this.setState(updates)
  }

  onCancel = () => {
    this.dismissModal()
  }
}

const styles = {
  wrapper: {},
  slide: {
    flex: 1
  },
  spinnerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8
  },
  footerBorder:{
    borderTopWidth: 1,
    borderTopColor: "#eee"
  },
  colLeftBorder: {
    borderLeftWidth: 1,
    borderLeftColor: "#eee"
  },
  row: {
    marginVertical: 4
  },
  item: {
    paddingHorizontal: 4
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

export default connect(mapStateToProps, mapDispatchToProps)(CensoModal);
