import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableHighlight, TextInput } from 'react-native';
import React, { Component } from 'react';
import languages from './languages.json'

import Voice, {
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@react-native-voice/voice';

type Props = {};
type State = {
  error: string;
  status: string;
  results: string[];
  partialResults: string[];
};

class VoiceTest extends Component<Props, State> {
  state = {
    error: '',
    status: '',
    results: [],
    partialResults: [],
  };

  constructor(props: Props) {
    super(props);
    Voice.onSpeechResults = this.onSpeechResults;
    Voice.onSpeechPartialResults = this.onSpeechPartialResults;

  }

  onSpeechResults = (e: SpeechResultsEvent) => {
    console.log('onSpeechResults: ', e);
    if (e.value !== undefined)
      this.setState({
        results: e.value,
      });
  };

  onSpeechPartialResults = (e: SpeechResultsEvent) => {
    console.log('onSpeechPartialResults: ', e);
    if (e.value !== undefined)
      this.setState({
        partialResults: e.value,
      });
  };


  _startRecognizing = async () => {
    this.setState({
      error: '',
      status: '',
      results: [],
      partialResults: [],
    });

    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  };

  _stopRecognizing = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  updateDebugText = (text: string) => {
    this.setState({
      partialResults: [text]
    });
  }

  submitDebugText = () => {
    this.setState((prevState) => {
      return {
        partialResults: [],
        results: [...prevState.results, prevState.partialResults[0]]
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
        onChangeText={this.updateDebugText} // Call this function when TextInput changes
        value={this.state.partialResults.at(0)}
        style = {styles.debugEdit}
        />

        <TouchableHighlight onPress={this.submitDebugText}>
          <Text style={styles.action}>Submit</Text>
        </TouchableHighlight>

<TouchableHighlight onPress={this._startRecognizing}>
          <Text style={styles.action}>Start Recognizing</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this._stopRecognizing}>
          <Text style={styles.action}>Stop Recognizing</Text>
        </TouchableHighlight>


        <View style={{...styles.box, backgroundColor: 'lightgreen'}}>
          <Text style={styles.boxTitle}>Current Status</Text>
          <Text>Status: </Text>
          <Text>Parameters: </Text>
        </View>

        <View style={{...styles.box, backgroundColor: 'lightblue'}}>
          <Text style={styles.boxTitle}>Current Speech</Text>
          {/* change "tail" to "head"? */}
          <Text numberOfLines={1} ellipsizeMode="head">{this.state.partialResults[0]}</Text>
        </View>

        <Text>Values</Text>
        {this.state.results.reverse().map((result, index) => {
          return (
            <View style={{...styles.box, backgroundColor: 'lightgray'}}>
              <Text key={`result-${index}`}>
                {result}
              </Text>
            </View>
            
          );
        })}

        <StatusBar style="auto" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  action: {
    textAlign: 'center',
    color: '#0000FF',
    marginVertical: 5,
    fontWeight: 'bold',
  },
  debugEdit: {
    borderWidth: 1,  // Border width
    borderColor: 'red',  // Border color
  },
  box: {
    width: '40%',
    padding: 10,
    backgroundColor: "lightgreen",
    margin: 8,
    aspectRatio: 2
  },
  boxTitle: {
    fontWeight: 'bold',
    textAlign: 'center'
  }

});

export default VoiceTest;
