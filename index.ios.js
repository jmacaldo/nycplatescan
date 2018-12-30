import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Button,
  ScrollView
} from 'react-native';
import axios from 'axios'

import Icon from 'react-native-vector-icons/Ionicons';
import Camera from 'react-native-openalpr';

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    fontSize: 20,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start"
  },
  buttonSearch: {
    backgroundColor: "green",
    padding: 20,
    margin: 10
  },
  buttonReset: {
    backgroundColor: "red",
    padding: 20,
    margin: 10
  },
  buttonText: {
    color: "white",
    fontSize: 20
  },
  resultsScroll:{
    height: 400,
    //backgroundColor: "red"
  },
  found: {
    height: 75,
    //backgroundColor: "blue"
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
      state: 'NY',
      plate:  'SCAN A PLATE',
      found: false,
      data: []
    };
  }


  fetchRequest = () => {
    axios.get('https://data.cityofnewyork.us/resource/uvbq-3m68.json', {
      params: {
        $limit: 5000,
        $$app_token: '82HqD0isylvN2iMSeu6YMUOUU',
        plate: this.state.plate,
        state: this.state.state,
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

  reset = () => {
    console.log('reset pushed!');
    this.setState({
      found: false,
      plate: "SCAN A PLATE",
      data: []
    })
  }

  stateButton = (state) => {
    console.log(state);
    this.setState({state: state})
  }


  render() {
    const results = () => {
      if (this.state.data.length >= 0) {
        return "No records found"
      } else {
        return this.state.data.data.map((item, key)=>(
          <View key={key}>
            <Text style={{fontSize: 18}}>({item.issue_date})${item.fine_amount}{' '}{item.violation}</Text>
          </View>
        ) )
      }
    }

    const totalFines = () =>{
      if (this.state.data.data) {
        let arr = [0]
         this.state.data.data.map((item) => (
            arr.push(parseInt(item.fine_amount, 10))
         ))

        function cleanArray(arr) {
          var newArray = new Array();
          for (var i = 0; i < arr.length; i++) {
            if (arr[i]) {
              newArray.push(arr[i]);
            }
          }
          newArray.push(0)
          return newArray;
        }

        const add = (a, b) => a + b

        let total = cleanArray(arr).reduce(add)

        const numberWithCommas = (x) => {
          var parts = x.toString().split(".");
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          return parts.join(".");
        }
        let fines = numberWithCommas(total)
        return fines
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
          <Text style={styles.main}>{this.state.plate}({this.state.state})</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={()=>this.stateButton('NY')} style={styles.buttonSearch}><Text style={styles.buttonText}>NY</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>this.stateButton('NJ')} style={styles.buttonSearch}><Text style={styles.buttonText}>NJ</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>this.stateButton('CT')} style={styles.buttonSearch}><Text style={styles.buttonText}>CT</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>this.stateButton('DP')} style={styles.buttonSearch}><Text style={styles.buttonText}>DP</Text></TouchableOpacity>
          </View>

          {this.state.found &&
            <View style={styles.found}>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.buttonSearch} onPress={this.fetchRequest}>
                  <Text style={styles.buttonText}>Search</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonReset} onPress={this.reset}>
                  <Text style={styles.buttonText}>Reset</Text>
                </TouchableOpacity>
              </View>
            </View>
          }

          {this.state.data.data &&
            <ScrollView style={styles.resultsScroll}>
              <Text style={{fontWeight: 'bold', fontSize: 20}}>{this.state.data.data.length} violations found. Total fines: ${totalFines()}</Text>
              <View style={styles.resList}>
                  {results()}
              </View>
            </ScrollView>

          }

        </View>

      </View>

    );
  }
}

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);
