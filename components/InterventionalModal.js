import React from 'react';

import {
  Container,
  Text,
  Button,
} from 'native-base';

import { Col, Grid } from 'react-native-easy-grid';

import { View } from 'react-native';

import Modal from 'react-native-modal';

export default class InterventionalModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal isVisible={this.props.isVisible} style={styles.interventional}>
        <View style={styles.container}>
          <Container style={styles.modalContainer}>            
            <View style={{ flex: 1 }}>
              { this.props.children }
            </View>            
          </Container>
        </View>
      </Modal>
    );
  }
}

const styles = {
  interventional: {
    margin: 0
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 0
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  modalFooter: {
    maxHeight: 48,
    alignItems: 'flex-end',
    justifyContent: 'center',
    borderTopColor: '#cccccc',
  }
}
