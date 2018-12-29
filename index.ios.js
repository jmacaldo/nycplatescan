import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Button
} from 'react-native';
import axios from 'axios'

import Icon from 'react-native-vector-icons/Ionicons';
import Camera from 'react-native-openalpr';

const styles = StyleSheet.create({
  textContainer: {
    position: 'absolute',
    top: 100,
    right: 50,
    bottom: 0,
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    padding: 16,
    alignItems: 'center',
  },
  topOverlay: {
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 255, 0, 0.4)',
    alignItems: 'center',
  },
  found: {
    height: 300,
    justifyContent: "center"
  },
  camera: {
    height: 250
  },
  results: {
    height: 500
  },
  main: {
    fontSize: 30,
    margin: 10,
    textAlign: "center"
  },
  mainPlate: {
    fontSize: 35
  },
  touchableSearch: {
    flexDirection: "row"
  },
  resList: {
    flexGrow: 1
  }
});

export default class AwesomeProject extends React.Component {
  constructor(props) {
    super(props);

    this.camera = null;

    this.state = {
      camera: {
        aspect: Camera.constants.Aspect.fill,
      },
      plate: 'SCAN A PLATE',
      found: false,
      data: []
    };
  }


  fetchRequest = () => {
    console.log('fetch fired!', this.state.plate);
    axios.get('https://data.cityofnewyork.us/resource/uvbq-3m68.json', {
      params: {
        $limit: 5000,
        $$app_token: '82HqD0isylvN2iMSeu6YMUOUU',
        plate: this.state.plate,
        state: 'NY',
        $order: ':id DESC',
        $order: 'summons_number DESC',

      }
    })
    .then(response => this.setState({data:response}))
    .then(console.log(this.state.data))
    .catch(function (error) {
      console.log(error);
    })
  }

  onPlateRecognized = ({ plate, confidence }) => {
    if (confidence > 90) {
      this.setState({
        plate,
      })
      this.setState({found: true})
    }
  }

  searchHandler = () => {
    console.log('search button pressed!');
    this.fetchRequest()
  }

  render() {
    const results = () => {
      if (this.state.data.length >= 0) {
        return "No records found"
      } else {
        return "Records Found"
      }
    }
    return (
      <View style={styles.container}>
        <View style={styles.camera}>
          <StatusBar
            animated
            hidden
          />
          <Camera
            ref={(cam) => {
              this.camera = cam;
            }}
            style={styles.preview}
            aspect={this.state.camera.aspect}
            captureQuality={Camera.constants.CaptureQuality.medium}
            country="us"
            onPlateRecognized={this.onPlateRecognized}
            plateOutlineColor="#ff0000"
            showPlateOutline
            torchMode={Camera.constants.TorchMode.off}
            touchToFocus
          />
        </View>
        <View style={styles.results}>
          {!this.state.found &&
            <Text style={styles.main}>SCAN A PLATE</Text>
          }
          {this.state.found &&
            <Text style={styles.main}>PLATE FOUND!</Text>
          }

          {this.state.found &&
            <View style={styles.found}>
              <Text style={styles.mainPlate}>{this.state.plate}</Text>
              <Button color="#841584" onPress={this.searchHandler} title="Search traffic records"/>
            </View>
          }

          {this.state.data.length == 0 &&
            <View style={styles.resList}>
              <Text>
                Tickets found!
              </Text>
            </View>
          }

        </View>

      </View>

    );
  }
}

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);
