import React from 'react';

import { Alert, TouchableOpacity } from 'react-native';

import _ from 'lodash';

import { connect } from 'react-redux';

import { getLocationAsync } from '../../../services/Permissions';

import {
  Header,
  Container,
  Content,
  H2,
  H3,
  Text,
  Title,
  Left,
  Footer,
  Form,
  Label,
  Item,
  Input,
  Body,
  Button,
  Picker,
  DatePicker
} from 'native-base';

import { Col, Row, Grid } from 'react-native-easy-grid';

import DateTimePicker from 'react-native-modal-datetime-picker';

import StringMask from 'string-mask';
import moment from '../../../services/Timestamp';

import Layout from '../../../constants/Layout';
import Colors from '../../../constants/Colors';

import { StepBars, Step } from './StepBars';

import { VisitType, VisitTypeLocation } from '../../../types/visit';

import TimerMixin from 'react-timer-mixin';

export class LocationForm extends React.Component {
  constructor(props){
    super(props);

    this.inputs = {};
    this.state = {
      number: '',
      complement: null,
      check_in: moment(),
      check_in_translate: moment().format('HH:mm'),
      type: VisitType.normal,
      type_location: VisitTypeLocation.residential,
      latitude: null,
      longitude: null,
      isDateTimePickerVisible: false,
      processing: false,
      validation: {
        number: false,
        check_in_translate: false
      }
    };
  }

  componentWillMount(){
    let updates = {};

    if(this.props.payload){
      let { payload } = this.props;

      if (payload.number){
        updates.id = payload.id;
        updates.number = payload.number;
        updates.complement = payload.complement;
  
        if(this.props.payload.visit){
          updates.type = payload.visit.type || VisitType.normal;
          updates.type_location = (payload.visit.type_location || payload.type || VisitTypeLocation.residential);
          updates.latitude = payload.visit.latitude;
          updates.longitude = payload.visit.longitude;
          updates.check_in = isVisitClosedOrRefused(payload.visit.type) ? moment() : moment(payload.visit.check_in);
          updates.check_in_translate = updates.check_in.format('HH:mm');
        } else { 
          getLocationAsync().then((data) => {
            if (data) {
              let { latitude, longitude } = data.coords;
              this.setState({ latitude, longitude });
            }
          });
        }
        this.setState(updates);
      } else {
        getLocationAsync().then((data) => {
          if (data) {
            let { latitude, longitude } = data.coords;
            this.setState({ latitude, longitude });
          }
        });
      }
    }
  }

  render(){    
    return (
      <Container>
        <Content padder>
          <Form>
            <StepBars>
              <Step active={true}></Step>
              <Step></Step>
              <Step></Step>
              <Step></Step>
              <Step></Step>
            </StepBars>

            <H2 style={Layout.padding}>Localização</H2>

            <Grid>
              <Row>
                <Col>
                  <H3 note style={Layout.padding}>{ this.props.publicarea.address }</H3>
                </Col>
              </Row>
              <Row>
                <Col size={33}>
                  <Item stackedLabel error={this.state.validation.number}>
                    <Label>Número</Label>
                    <Input 
                      disabled={this.state.id}
                      onChangeText={(number) => this.setState({number})}
                    >
                      { this.state.number.toString() }
                    </Input>
                  </Item>
                </Col>
                <Col size={66} style={{ justifyContent: 'flex-end' }}>
                  <Item stackedLabel>
                    <Label>Complemento</Label>
                    <Input 
                      disabled={this.state.id} 
                      onChangeText={(complement) => this.setState({complement})}
                    >
                      {this.state.complement}
                    </Input>
                  </Item>
                </Col>
              </Row>
            </Grid>

            <Grid style={Layout.padding}>
              <Row style={{ alignItems: 'flex-end' }}>
                <Col size={66}>
                  <Text note>Data</Text>
                  <DatePicker
                    defaultDate={ this.state.check_in._d ? this.state.check_in.toDate() : new Date() }
                    minimumDate={new Date(2018, 1, 1)}
                    locale={'pt-br'}
                    timeZoneOffsetInMinutes={undefined}
                    modalTransparent={false}
                    animationType={'fade'}
                    androidMode={'default'}
                    placeHolderText={ this.state.check_in._d ? this.state.check_in.format('DD/MM/YYYY') : 'Selecione uma data' }
                    textStyle={{ color: Colors.iconColor, paddingHorizontal: 0, paddingBottom: 0 }}
                    placeHolderTextStyle={{ color: Colors.iconColor, paddingHorizontal: 0, paddingBottom: 0 }}
                    onDateChange={ (check_in) => this.setState({ check_in: moment(check_in) }) }
                  />
                </Col>
                <Col size={33}>
                  <Text note>Entrada</Text>
                  
                  <TouchableOpacity onPress={this.toggleDateTimePicker.bind(this)}>
                    <Text>{this.state.check_in_translate}</Text>
                  </TouchableOpacity>

                  <DateTimePicker
                    mode={'time'}
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this.handleDatePicked.bind(this)}
                    onCancel={this.toggleDateTimePicker.bind(this)}
                  />                  
                </Col>
              </Row>
            </Grid>

            <Grid style={Layout.padding}>
              <Col>
                <Text note>Tipo de Imóvel</Text>
                <Picker
                  selectedValue={this.state.type_location}
                  onValueChange={(type_location) => this.setState({type_location}) }
                  supportedOrientations={['portrait','landscape']}
                  renderHeader={this._renderPickerHeader.bind(this)}
                  mode='dropdown'>
                  <Item label='Residencial' value={VisitTypeLocation.residential} />
                  <Item label='Comércio' value={VisitTypeLocation.commerce} />
                  <Item label='Terreno baldio' value={VisitTypeLocation.wasteland} />
                  <Item label='Ponto Estratégico' value={VisitTypeLocation.strategic_point} />
                  <Item label='Outros' value={VisitTypeLocation.others} />
                </Picker>
              </Col>
              <Col>
                <Text note>Pendência</Text>
                <Picker
                  selectedValue={this.state.type}
                  onValueChange={(type) => this.setState({type}) }
                  supportedOrientations={['portrait','landscape']}
                  renderHeader={this._renderPickerHeader.bind(this)}
                  mode='dropdown'>
                  <Picker.Item label='Normal' value={VisitType.normal} />
                  <Picker.Item label='Recuperada' value={VisitType.recovered} />
                  <Picker.Item label='Fechada' value={VisitType.closed} />
                  <Picker.Item label='Recusada' value={VisitType.refused} />
                </Picker>
              </Col>
            </Grid>
          </Form>
        </Content>
        <Footer style={{backgroundColor: '#FFFFFF'}} padder>
          <Grid>
            <Row style={{ alignItems: 'center' }}>
              <Col>
                <Button full transparent disabled={this.state.busy} onPress={this.onCancel.bind(this)}>
                  <Text>Cancelar</Text>
                </Button>
              </Col>
              <Col style={[styles.col, styles.colLeftBorder]}>
                <Button full transparent disabled={this.state.busy} onPress={this.onSubmit.bind(this)}>
                  <Text>Avançar</Text>
                </Button>
              </Col>
            </Row>
          </Grid>
        </Footer>        
      </Container>
    );
  }

  onSubmit(){
    if(this.state.processing) return;
    
    this.setState({ processing: true });
    
    TimerMixin.requestAnimationFrame(this._onSubmit.bind(this));
  }

  _onSubmit() {
    const omitedAtributes = ['validation', 'check_in_translate', 'processing'];    

    if(this.isInvalid()){
      if(this.isHasNumberInPublicArea()){
        Alert.alert('Falha no registro da residência', 'A residência já foi cadastrada.');
      } else {
        Alert.alert('Falha na Validação', 'Por favor cheque se todos os campos estão preenchidos.');
      }
      this.setState({ processing: false });
    } else {
      let state = _.clone(this.state);
      
      // Set if skip steps form
      isVisitClosedOrRefused(state.type)
        ? state.backTo = 'index'
        : false;

      // Force instance momment
      state.check_in = moment(state.check_in);
      
      // Covert check_in string to Timestamp
      let time = state.check_in_translate.split(':');
    
      // set for translate check_i date
      state.check_in.set({
        h: time[0],
        m: time[1]
      });

      state.check_in = moment(state.check_in).format();

      // Pass form value parent component
      this.props.onSubmit( _.omit(state, omitedAtributes), () => {
        this.setState({ processing: false });    
        // Next step
        isVisitClosedOrRefused(state.type)
          ? this.toObservation()
          : this.props.scrollBy(1);
      });
      
    }
  }

  onCancel(){
    if(this.state.processing) return;
    this.props.onCancel();
  }

  applyStartDateMask(check_in_translate){
    check_in_translate = check_in_translate.replace(':','');
    let result = new StringMask('00:00').apply(check_in_translate);
    // Is nesscessary for clean field
    this.setState({ check_in_translate: result });
  }

  isInvalid(){
    const { number, check_in_translate } = this.state;

    this.state.validation = {
      number: _.isEmpty(number.toString()) || this.isHasNumberInPublicArea(),
      check_in_translate: _.isEmpty(check_in_translate),
    };

    // Update view
    this.setState({
      validation: this.state.validation
    });

    // Verify if all states has present
    return _.values(this.state.validation).includes(true);
  }

  isHasNumberInPublicArea(){
    // if registred address has same state number
    if(this.props.payload && this.props.payload.number == this.state.number){
      return false;
    }

    if (this.state.id ) return true

    return _.chain(this._getPublicAreas()).find(
      (a) => {
        return ( a.number == this.state.number ) && ( a.complement == this.state.complement );
      } 
    ).value()
      ? true 
      : false;
  }  

  toObservation(){
    return this.props.scrollBy(4);
  }

  _renderProgress(){
    return (
      <Grid>
        <Row>
          <Col style={styles.progressItemActive}></Col>
          <Col style={styles.progressItem}></Col>
          <Col style={styles.progressItem}></Col>
          <Col style={styles.progressItem}></Col>
        </Row>
      </Grid>
    );
  }

  toggleDateTimePicker(){
    this.setState({ isDateTimePickerVisible: !this.state.isDateTimePickerVisible });
  }

  handleDatePicked(date){    
    let time = moment(date).format('HH:mm');
    this.applyStartDateMask(time);
    this.toggleDateTimePicker();
  }

  _renderPickerHeader(backAction){
    return(
      <Header>
        <Left style={styles.container}>
          <Button transparent onPress={backAction}>
            <Text>Voltar</Text>
          </Button>
        </Left>
        <Body style={{flex: 2}}>
          <Title style={{textAlign: 'center'}}>Selecione um</Title>
        </Body>
      </Header>
    );
  }

  _getPublicAreas(){
    let { fieldgroup, fieldGroups, publicarea } = this.props;
    
    let result = _.chain(fieldGroups.data)
      .find(['$id', fieldgroup.$id])
      .get('field_group.public_areas')
      .find(['$id', publicarea.$id])
      .get('addresses')
      .value();

    return result;
  }
}

const styles = {
  container: {
    flex: 1
  },
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

// Checks
function isVisitClosedOrRefused(type){
  return [VisitType.closed, VisitType.refused].includes(type);
}

export default connect(({ fieldGroups }) => ({ fieldGroups}))(LocationForm);