import React from 'react';
import { View, Alert } from 'react-native';

import * as _ from 'lodash';

import {
  Header,
  Container,
  Content,
  H2,
  Text,
  Title,
  Left,
  Right,
  Footer,
  Form,
  Label,
  Item,
  Input,
  Body,
  Button,
  Picker,
} from 'native-base';

import { Col, Row, Grid } from "react-native-easy-grid";

import StringMask from 'string-mask';
import moment from 'moment';

import Theme from '../../../constants/Theme';
import Layout from '../../../constants/Layout';

import { simpleToast } from '../../../services/Toast';

import { StepBars, Step } from './StepBars';

export class LocationForm extends React.Component {
  state = {
    check_in: moment().format('HH:mm'),
    type: 'normal',
    type_location: 'residential',
    validation: {
      number: false,
      check_in: false
    }
  }

  componentDidMount(){
    this.setState({ address: this.props.street.address})
  }

  constructor(props){
    super(props);
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
            </StepBars>

            <H2 style={Layout.padding}>Localização</H2>

            <Grid>
              <Col size={66}>
                <Item floatingLabel>
                  <Label>Logradouro</Label>
                  <Input value={this.state.address}  disabled={true}/>
                </Item>
              </Col>
              <Col size={33}>
                <Item floatingLabel error={this.state.validation.number}>
                  <Label>Número</Label>
                  <Input value={this.state.number} onChangeText={(number) => this.setState({number})} keyboardType='numeric' />
                </Item>
              </Col>
            </Grid>

            <Grid>
              <Col size={66} style={{ justifyContent: 'flex-end' }}>
                <Item floatingLabel>
                  <Label>Complemento</Label>
                  <Input value={this.state.complement} onChangeText={(complement) => this.setState({complement})} />
                </Item>
              </Col>
              <Col size={33}>
                <Item floatingLabel error={this.state.validation.check_in}>
                  <Label>Entrada</Label>
                  <Input
                    value={this.state.check_in}
                    keyboardType='numeric'
                    onChangeText={ (check_in) => this.applyStartDateMask(check_in) } />
                </Item>
              </Col>
            </Grid>

            <Grid style={{ marginHorizontal: 12, marginTop: 24 }}>
              <Col>
                <Text note>Tipo de Imóvel</Text>
                <Picker
                  selectedValue={this.state.type_location}
                  onValueChange={(type_location) => this.setState({type_location}) }
                  supportedOrientations={['portrait','landscape']}
                  iosHeader="Selecione um"
                  mode="dropdown">
                  <Item label="Residencial" value='residential' />
                  <Item label="Comércio" value='commerce' />
                  <Item label="Terreno baldio" value='wasteland' />
                  <Item label="Ponto Estratégico" value='strategic_point' />
                  <Item label="Outros" value='others' />
                </Picker>
              </Col>
            </Grid>

            <Grid style={Layout.padding}>
              <Col>
                <Text note>Pendência</Text>
                <Picker
                  selectedValue={this.state.type}
                  onValueChange={(type) => this.setState({type}) }
                  supportedOrientations={['portrait','landscape']}
                  iosHeader="Selecione um"
                  mode="dropdown">
                  <Item label="Normal" value='normal' />
                  <Item label="Recuperada" value='recovered' />
                  <Item label="Fechada" value='closed' />
                  <Item label="Recusada" value='refused' />
                </Picker>
              </Col>
            </Grid>
          </Form>
        </Content>
        <Footer style={{backgroundColor:"white"}} padder>
          <Grid>
            <Row style={{ alignItems: 'center' }}>
              <Col>
                <Button full transparent onPress={ () => this.props.onCancel() }>
                  <Text>Cancelar</Text>
                </Button>
              </Col>
              <Col style={[styles.col, styles.colLeftBorder]}>
                <Button full transparent onPress={ () => this.onSubmit() }>
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
    if(this.isInvalid()){
      Alert.alert('Falha na Validação', 'Por favor cheque se todos os campos estão preenchidos.')
    } else{
      this.props.scrollBy(1)
    }
  }

  applyStartDateMask(check_in){
    check_in = check_in.replace(':','')
    let result = new StringMask("00:00").apply(check_in)
    // Is nesscessary for clean field
    this.setState({ check_in: result });
  }

  isInvalid(){
    const { number, check_in } = this.state;

    this.state.validation = {
      number: _.isEmpty(number),
      check_in: _.isEmpty(check_in),
    }

    // Update view
    this.setState({
      validation: this.state.validation
    });

    // Verify if all states has present
    return _.values(this.state.validation).includes(true)
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
    borderLeftColor: "#eee"
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
}
