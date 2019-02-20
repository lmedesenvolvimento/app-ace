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
    
    this.state = {
      inhabitants: 0,
      tank: 0,
      drum: 0,
      tina: 0,
      filter: 0,
      pot: 0,
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
                      value={this.state.inhabitants.toString()}
                      onChangeText={inhabitants => this.setState({inhabitants})}
                      onBlur={this.onBlurNumeralState.bind(this, 'inhabitants')} 
                    />
                  </Item>
                </Col>
                <Col style={styles.item}>
                  <Item stackedLabel>
                    <Label>{CensoType.tank}</Label>
                    <Input 
                      keyboardType='numeric' 
                      value={this.state.tank.toString()}
                      onChangeText={tank => this.setState({tank})}
                      onBlur={this.onBlurNumeralState.bind(this, 'tank')}
                    />
                  </Item>
                </Col>
              </Grid>

              <Grid style={styles.row}>
                <Col style={styles.item}>
                  <Item stackedLabel>
                    <Label>{CensoType.filter}</Label>
                    <Input
                      keyboardType='numeric' 
                      value={this.state.filter.toString()}
                      onChangeText={filter => this.setState({filter})}
                      onBlur={this.onBlurNumeralState.bind(this, 'filter')}
                    />
                  </Item>
                </Col>
                <Col style={styles.item}>
                  <Item stackedLabel>
                    <Label>{CensoType.tina}</Label>
                    <Input
                      keyboardType='numeric' 
                      value={this.state.tina.toString()}
                      onChangeText={tina => this.setState({tina})}
                      onBlur={this.onBlurNumeralState.bind(this, 'tina')}
                    />
                  </Item>
                </Col>
              </Grid>

              <Grid style={styles.row}>
                <Col style={styles.item}>
                  <Item stackedLabel>
                    <Label>{CensoType.drum}</Label>
                    <Input
                      keyboardType='numeric' 
                      value={this.state.drum.toString()}
                      onChangeText={drum => this.setState({drum})}
                      onBlur={this.onBlurNumeralState.bind(this, 'drum')}
                    />
                  </Item>
                </Col>
                <Col style={styles.item}>
                  <Item stackedLabel>
                    <Label>{CensoType.pot}</Label>
                    <Input
                      keyboardType='numeric' 
                      value={this.state.pot.toString()}
                      onChangeText={pot => this.setState({pot})}
                      onBlur={this.onBlurNumeralState.bind(this, 'pot')}
                    />
                  </Item>
                </Col>
              </Grid>

              <Grid style={styles.row}>
                <Col style={styles.item}>
                  <Item stackedLabel>
                    <Label>{CensoType.plant_pot}</Label>
                    <Input
                      keyboardType='numeric' 
                      value={this.state.plant_pot.toString()} 
                      onChangeText={plant_pot => this.setState({plant_pot})}
                      onBlur={this.onBlurNumeralState.bind(this, 'plant_pot')}
                    />
                  </Item>
                </Col>
                <Col style={styles.item}>
                <Item stackedLabel>
                  <Label>{CensoType.cistern}</Label>
                  <Input
                    keyboardType='numeric' 
                    value={this.state.cistern.toString()}
                    onChangeText={cistern => this.setState({cistern})}
                    onBlur={this.onBlurNumeralState.bind(this, 'cistern')}
                  />
                </Item>
                </Col>
              </Grid>

              <Grid style={styles.row}>
                <Col style={styles.item}>
                  <Item stackedLabel>
                    <Label>{CensoType.waterhole}</Label>
                    <Input
                      keyboardType='numeric' 
                      value={this.state.waterhole.toString()}
                      onChangeText={waterhole => this.setState({waterhole})}
                      onBlur={this.onBlurNumeralState.bind(this, 'waterhole')}
                    />
                  </Item>
                </Col>
                <Col style={styles.item}>
                  <Item stackedLabel>
                    <Label>{CensoType.water_box}</Label>
                    <Input
                      keyboardType='numeric' 
                      value={this.state.water_box.toString()}
                      onChangeText={water_box => this.setState({water_box}) }
                      onBlur={this.onBlurNumeralState.bind(this, 'water_box')}
                    />
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

  onBlurNumeralState(key) {
    let number = numeral(this.state[key]).value()
    let updates = {}

    updates[key] = Math.abs(number)

    this.setState(updates)
  }

  okModal(){
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
    this.props.updateCensus(this.props.fieldgroup.$id, this.props.publicarea.$id, this.props.address, updates);
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
