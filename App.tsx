import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableHighlight, TextInput } from 'react-native';
import React, { Component } from 'react';
import currentLanguage from "./Language"

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
  loggedCommands: Command[]
};

type Command = {
  key: string
  value: string
}

type ListeningStatus = {
  command: string
  paramCount: string
}

class VoiceTest extends Component<Props, State> {
  state = {
    error: '',
    status: 'Not Started',
    results: [],
    partialResults: [],
    loggedCommands: []
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
      status: 'Waiting',
      partialResults: [],
    });

    try {
      await Voice.start(currentLanguage.languageCode);
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

    const newCommands = this.textToCommands(this.state.partialResults[0])

    this.setState((prevState) => { // use function setState because we reference previous state

      let prevCommands = prevState.loggedCommands

      // handle "back" commands
      // each removes a previously recorded command
      while(newCommands.length > 0 && newCommands[0].key == currentLanguage.commandBack){
        prevCommands.pop()
        newCommands.shift()
      }

      return {
        partialResults: [],
        results: [...prevState.results],
        loggedCommands: [...prevCommands, ...newCommands]
      }
    });
  }

  // main logic: convert text to a list of commands
  textToCommands = (text: String) => {

    if (text == undefined)
      return []

    const words = text.toLowerCase().split(" ")

    let commands: Command[] = []
    let currentCommand: Command | undefined = undefined

    words.forEach(word => {
      // standards commands
      if (word == currentLanguage.commandCount || word == currentLanguage.commandCode){
        // starting a new command automatically ends the previous
        // if there is a previous, commit it to our list
        if (currentCommand != undefined){
          commands = [...commands, currentCommand]
        }
        // begin collecting their parameters
        currentCommand = {
          key: word,
          value: ""
        }
      } else if (currentLanguage.digitsFrom0.includes(word) && currentCommand != undefined) {
        // we found a number parameter in the form of a spelled-out digit
        const digit = currentLanguage.digitsFrom0.indexOf(word)
        currentCommand.value += digit.toString()
      
      } else if (["1", "2", "3", "4", "5", "6", "7", "8", "9", "0" ].includes(word) && currentCommand != undefined){
        // same as above except as a numeral rather than letters
        currentCommand.value += word
      } else if (word == currentLanguage.commandReset){
        // reset command cancels current command being recorded
        // but does nothing if it's the first in the recording batch
        // as opposed to back, which removes even a previously recorded command
        currentCommand = undefined
      } else if (word == currentLanguage.commandBack){
        // if we had a command being recorder, back removes that (acts as reset)
        if (currentCommand != undefined){
          currentCommand = undefined
        } else {
          // we create a back command - to be handled later
          // this relevant if back is the first command in the current recording batch
          // but we had commands recorded previously
          commands = [...commands, {key:currentLanguage.commandBack, value:""}]
        }
      }
    }
    )

    // the end of the recording implies the end of the current command
    // if there is one, commit it to the list
    if (currentCommand != undefined){
      commands = [...commands, currentCommand]
    }

    return commands

  }

  getStatus = () => {
    const arr = this.textToCommands(this.state.partialResults[0])

    if (arr.length < 1){
      const status: ListeningStatus = {
        command: "Waiting",
        paramCount: ""
      }

      return status
    }
    
    const latest = arr.slice(-1)[0]

    const status: ListeningStatus = {
      command: latest.key,
      paramCount: latest.value.length.toString()
    }

    return status
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.leftRight}>
          <TextInput
          onChangeText={this.updateDebugText} // Call this function when TextInput changes
          value={this.state.partialResults.at(0)}
          style = {styles.debugEdit}
          placeholder='Type to simulate voice'
          />

          <TouchableHighlight onPress={this.submitDebugText}>
            <Text style={styles.action}>Submit</Text>
          </TouchableHighlight>
        </View>

        <View style={styles.leftRight}>
          <TouchableHighlight onPress={this._startRecognizing}>
            <Text style={styles.action}>Start Recognizing</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this._stopRecognizing}>
            <Text style={styles.action}>Stop Recognizing</Text>
          </TouchableHighlight>
        </View>


        <View style={{...styles.box, backgroundColor: 'lightgreen'}}>
          <Text style={styles.boxTitle}>Current Status</Text>
          <Text>Status: {this.getStatus().command}</Text>
          <Text>Parameters: {this.getStatus().paramCount}</Text>
        </View>

        <View style={{...styles.box, backgroundColor: 'lightblue'}}>
          <Text style={styles.boxTitle}>Current Speech</Text>
          {/* change "tail" to "head"? */}
          <Text numberOfLines={1} ellipsizeMode="head">{this.state.partialResults[0]}</Text>
        </View>

        <Text>Values</Text>
        {this.state.loggedCommands.slice().reverse().map((command, index) => {
          return (
            <View style={{...styles.box, backgroundColor: 'lightgray'}}>
              <Text> Command: {command.key} </Text>
              <Text> Value: {command.value} </Text>
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
    padding: 4,
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
  },
  leftRight: {
    flexDirection: 'row',
  }

});

export default VoiceTest;
