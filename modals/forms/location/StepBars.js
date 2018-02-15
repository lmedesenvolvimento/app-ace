import React from 'react';
import { Text, View } from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";

import Colors from '../../../constants/Colors';

export class StepBars extends React.Component {
  constructor(props){
    super(props)
    this.renderChildren = this.renderChildren.bind(this)
  }

  componentDidMount(){

  }

  renderChildren(){
    return this.props.children ? this.props.children : <View/>
  }

  render(){
    const children = this.props.children;
    return(
      <Grid>
        <Row style={styles.row}>
          {this.props.children}
        </Row>
      </Grid>
    );
  }
}


export class Step extends React.Component {
  constructor(props){
    super(props)
  }
  render(){
    if(this.props.active){
      return(
        <Col style={styles.colActive}></Col>
      );
    }
    if(this.props.complete){
      return(
        <Col style={styles.colComplete}></Col>
      );
    }
    else{
      return(
        <Col style={styles.col}></Col>
      );
    }
  }
}

const styles = {
  row:{
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 14
  },
  col: {
    backgroundColor: '#eee',
    marginHorizontal: 2,
    borderRadius: 4,
    height: 8,
    width: 52
  },
  colActive: {
    backgroundColor: Colors.accentColor,
    marginHorizontal: 2,
    borderRadius: 4,
    height: 8,
    width: 52
  },
  colComplete: {
    backgroundColor: Colors.accentColor,
    marginHorizontal: 2,
    borderRadius: 4,
    height: 8,
    width: 52,
    opacity: 0.3
  }
}
