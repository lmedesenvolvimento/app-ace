import React from 'react';

import {
  Container,
  Content,
  H2,
  Text,
  Footer,
  Form,
  Label,
  Item,
  Input,
  Button,
} from 'native-base';

import { Col, Row, Grid } from 'react-native-easy-grid';

import Layout from '../../../constants/Layout';
import Store from '../../../constants/Store';

import { simpleToast } from '../../../services/Toast';

import { VisitType } from '../../../types/visit';
import UITypes from '../../../redux/types/ui_types';

import { StepBars, Step } from './StepBars';

import TimerMixin from 'react-timer-mixin';

import { omit } from 'lodash';

export class ObservationForm extends React.Component {  
  constructor(props){
    super(props);
    this.state = {
      observation: '',
      processing: false
    };
  }

  componentWillMount(){    
    let { payload } = this.props;
    if(payload && payload.visit){
      this.setState({observation: payload.visit.observation});
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
        <Footer style={{backgroundColor:'white'}} padder>
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
    if(this.state.processing) return;    
    if(this.props.payload.backTo){
      switch (this.props.payload.backTo) {
        case 'index':          
          this.props.scrollBy(-4);
          break;
        case 'inspections':
          this.props.scrollBy(-3);
          break;
      }
    } else {
      this.props.scrollBy(-1);
    }
  }

  onSubmit(){
    if(this.state.processing) return;

    if (!isVisitClosedOrRefused(this.props.payload.visit.type) && !this.props.payload.visit.inspect.total_item === undefined) {
      simpleToast("Error desconhecido ao tentar registrar visita, tente novamente");
      return false;
    }

    Store.instance.dispatch({ type: UITypes.OPEN_LOADING });
    
    this.setState({ processing: true });

    TimerMixin.requestAnimationFrame(this._onSubmit.bind(this));
  }
  
  _onSubmit(){
    const omitedAtributes = ['validation', 'busy'];    
    // Pass form value parent component
    let state = omit(this.state, omitedAtributes);    
    
    this.props.onSubmit(state, () => {
      this.setState({ processing: false });
    });
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
  textarea: {
    height: 200
  }
};

function isVisitClosedOrRefused(type){
  return [VisitType.closed, VisitType.refused].includes(type);
}