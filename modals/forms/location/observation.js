import React from 'react';
import { View } from 'react-native';

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

import Colors from '../../../constants/Colors';
import Theme from '../../../constants/Theme';
import Layout from '../../../constants/Layout';

import { simpleToast } from '../../../services/Toast';
import { VisitType } from '../../../types/visit';

import { StepBars, Step } from './StepBars';

export class ObservationForm extends React.Component {
  state = {
    observation: ''
  }

  constructor(props){
    super(props);
  }

  componentWillMount(){    
    let { address } = this.props;
    if(address && address.visit){
      this.setState({observation: address.visit.observation})
    }
  }

  render(){
    return (
      <Container>
        <Content padder>
          <Form>

            <StepBars>
              <Step complete={true}></Step>
              <Step complete={true}></Step>
              <Step complete={true}></Step>
              <Step complete={true}></Step>
              <Step active={true}></Step>
            </StepBars>

            <H2 style={Layout.padding}>Observação</H2>
            <Grid>
              <Col>
                <Item floatingLabel>
                  <Label>Descrição</Label>
                  <Input value={this.state.observation} onChangeText={(observation) => this.setState({observation})} style={styles.textarea} multiline={true} maxHeight={120}/>
                </Item>
              </Col>
            </Grid>
          </Form>
        </Content>
        <Footer style={{backgroundColor:"white"}} padder>
          <Grid>
            <Row style={{ alignItems: 'center' }}>
              <Col>
                <Button full transparent onPress={this.onBack.bind(this)}>
                  <Text>Voltar</Text>
                </Button>
              </Col>
              <Col style={styles.colLeftBorder}>
                <Button full transparent onPress={this.onSubmit.bind(this)}>
                  <Text>Concluir</Text>
                </Button>
              </Col>
            </Row>
          </Grid>
        </Footer>
      </Container>
    );
  }

  onBack(){
    let { visit } = this.props
    isVisitClosedOrRefused(visit.type)
    ? this.props.scrollBy(-4)
    : this.props.scrollBy(-1)
  }

  onSubmit(){
    // Pass form value parent component
    let state = _.omit(this.state,['validation'])
    this.props.onSubmit(state)
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
  textarea: {
    height: 200
  }
}

function isVisitClosedOrRefused(type){
  return [VisitType.closed, VisitType.refused].includes(type)
}