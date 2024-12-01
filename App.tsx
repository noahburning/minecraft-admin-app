import React, { useState } from 'react';
import { StyleSheet, Button, View, SafeAreaView, Text, Alert, FlatList, Pressable, TextInput, ScrollView, Modal } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Calendar } from 'react-native-calendars';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.customTitle}>
          CSUSM Minecraft Club Admin App
        </Text>
        <Button
          title="Proceed to Console"
          onPress={() => navigation.navigate('Console')}
        />
      </View>
      <Separator />
      <View>
        <Text style={styles.title}>
          Quick Admin™:
        </Text>
        <Button
          title="Open Quick Admin"
          onPress={() => navigation.navigate('Quick Admin')}
        />
      </View>
      <Separator />
      <View>
        <Text style={styles.title}>
          © California State University San Marcos Minecraft Club
        </Text>
      </View>
    </SafeAreaView>
  );
}



function ConsoleScreen({ navigation }) {
  const [command, setCommand] = useState('');
  const [logs, setLogs] = useState([]);

  const sendCommand = async () => {
    if (!command) return;

    try {
      const response = await fetch('http://10.0.2.2:3000/send-command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setLogs(prevLogs => [...prevLogs, `> ${command}\n${data.response}`]);
      setCommand('');
    } catch (error) {
      console.error('Error sending command:', error);
      setLogs(prevLogs => [...prevLogs, `> ${command}\nError: ${error.message}`]);
    }
  };

  const handleKeyPress = ({ nativeEvent }) => {
    if (nativeEvent.key === 'Enter') {
      sendCommand();
    }
  };

  return (
    <View style={styles.detailsContainer}>
      <Text style={styles.detailsTitle}>Console</Text>
      <ScrollView style={styles.logContainer}>
        {logs.map((log, index) => (
          <Text key={index} style={styles.logText}>{log}</Text>
        ))}
      </ScrollView>
      <Text style={styles.disclaimer}>
        The Android CSUSM Minecraft Club server console works exactly as a normal server console would. Any commands that you can use normally will work here.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter command"
        value={command}
        onChangeText={setCommand}
        onKeyPress={handleKeyPress}
      />
      <Button title="Send Command" onPress={sendCommand} />
      <Button title="Back to Home" onPress={() => navigation.goBack()} />
    </View>
  );
}


function MoreScreen({ navigation }) {
  const [isKickModalVisible, setKickModalVisible] = useState(false);
  const [isBanModalVisible, setBanModalVisible] = useState(false);
  const [isPardonModalVisible, setPardonModalVisible] = useState(false);
  const [isTitleModalVisible, setTitleModalVisible] = useState(false);
  const [isChatModalVisible, setChatModalVisible] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [titleContent, setTitleContent] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [isSetTimeModalVisible, setSetTimeModalVisible] = useState(false);
  const [timeValue, setTimeValue] = useState('');


  const sendKickCommand = async () => {
    if (!playerName.trim()) {
      Alert.alert('Error', 'Please enter a valid player name.');
      return;
    }

    try {
      const response = await fetch('http://10.0.2.2:3000/send-command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command: `kick ${playerName.trim()}` }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      Alert.alert('Server Response', data.response);
    } catch (error) {
      console.error('Error sending kick command:', error);
      Alert.alert('Error', `Failed to send command: ${error.message}`);
    } finally {
      setKickModalVisible(false);
      setPlayerName('');
    }
  };

  const sendBanCommand = async () => {
    if (!playerName.trim()) {
      Alert.alert('Error', 'Please enter a valid player name.');
      return;
    }

    try {
      const response = await fetch('http://10.0.2.2:3000/send-command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command: `ban ${playerName.trim()}` }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      Alert.alert('Server Response', data.response);
    } catch (error) {
      console.error('Error sending ban command:', error);
      Alert.alert('Error', `Failed to send command: ${error.message}`);
    } finally {
      setBanModalVisible(false);
      setPlayerName('');
    }
  };

  const sendPardonCommand = async () => {
    if (!playerName.trim()) {
      Alert.alert('Error', 'Please enter a valid player name.');
      return;
    }

    try {
      const response = await fetch('http://10.0.2.2:3000/send-command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command: `pardon ${playerName.trim()}` }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      Alert.alert('Server Response', data.response);
    } catch (error) {
      console.error('Error sending pardon command:', error);
      Alert.alert('Error', `Failed to send command: ${error.message}`);
    } finally {
      setPardonModalVisible(false);
      setPlayerName('');
    }
  };

  const sendTitleCommand = async () => {
    if (!titleContent.trim()) {
      Alert.alert('Error', 'Please enter a valid title content.');
      return;
    }

    try {
      const response = await fetch('http://10.0.2.2:3000/send-command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command: `title @a title {"text":"${titleContent.trim()}"}`
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      Alert.alert('Server Response', data.response);
    } catch (error) {
      console.error('Error sending title command:', error);
      Alert.alert('Error', `Failed to send command: ${error.message}`);
    } finally {
      setTitleModalVisible(false);
      setTitleContent('');
    }
  };

  const sendChatCommand = async () => {
    if (!chatMessage.trim()) {
      Alert.alert('Error', 'Please enter a valid chat message.');
      return;
    }

    try {
      const response = await fetch('http://10.0.2.2:3000/send-command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command: `say ${chatMessage.trim()}`
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      Alert.alert('Chat Sent', data.response);
    } catch (error) {
      console.error('Error sending chat command:', error);
      Alert.alert('Error', `Failed to send command: ${error.message}`);
    } finally {
      setChatModalVisible(false);
      setChatMessage('');
    }
  };

  const sendListCommand = async () => {
    try {
      const response = await fetch('http://10.0.2.2:3000/send-command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command: 'list' }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      Alert.alert('Server Response', data.response);
    } catch (error) {
      console.error('Error fetching list command:', error);
      Alert.alert('Error', `Failed to fetch: ${error.message}`);
    }
  };

  const sendSetTimeCommand = async () => {
    const time = parseInt(timeValue, 10);
    if (isNaN(time) || time < 0 || time > 24000) {
      Alert.alert('Error', 'Please enter a valid time between 0 and 24000.');
      return;
    }

    try {
      const response = await fetch('http://10.0.2.2:3000/send-command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command: `time set ${time}` }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      Alert.alert('Server Response', data.response);
    } catch (error) {
      console.error('Error sending set time command:', error);
      Alert.alert('Error', `Failed to send command: ${error.message}`);
    } finally {
      setSetTimeModalVisible(false);
      setTimeValue('');
    }
  };


  return (
    <View style={styles.quickAdminContainer}>
      <Text style={styles.quickAdminTitle}>Quick Admin™</Text>
      <View style={styles.gridContainer}>
        {/* Online Players */}
        <Pressable
          style={styles.gridButton}
          onPress={sendListCommand}
        >
          <Text style={styles.gridButtonText}>Online Players</Text>
        </Pressable>

        {/* Kick Player */}
        <Pressable
          style={styles.gridButton}
          onPress={() => setKickModalVisible(true)}
        >
          <Text style={styles.gridButtonText}>Kick Player</Text>
        </Pressable>

        {/* Ban Player */}
        <Pressable
          style={styles.gridButton}
          onPress={() => setBanModalVisible(true)}
        >
          <Text style={styles.gridButtonText}>Ban Player</Text>
        </Pressable>

        {/* Pardon Player */}
        <Pressable
          style={styles.gridButton}
          onPress={() => setPardonModalVisible(true)}
        >
          <Text style={styles.gridButtonText}>Pardon Player</Text>
        </Pressable>

        {/* Send Title */}
        <Pressable
          style={styles.gridButton}
          onPress={() => setTitleModalVisible(true)}
        >
          <Text style={styles.gridButtonText}>Send Title</Text>
        </Pressable>

        {/* Send Chat */}
        <Pressable
          style={styles.gridButton}
          onPress={() => setChatModalVisible(true)}
        >
          <Text style={styles.gridButtonText}>Send Chat</Text>
        </Pressable>

        {/* Set Time */}
        <Pressable
          style={styles.gridButton}
          onPress={() => setSetTimeModalVisible(true)}
        >
          <Text style={styles.gridButtonText}>Set Time</Text>
        </Pressable>
      </View>

      {/* Modal Kick Player */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isKickModalVisible}
        onRequestClose={() => setKickModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Kick Player</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter player name"
              value={playerName}
              onChangeText={setPlayerName}
            />
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setKickModalVisible(false)} />
              <Button title="Kick" onPress={sendKickCommand} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Ban Player */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isBanModalVisible}
        onRequestClose={() => setBanModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ban Player</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter player name"
              value={playerName}
              onChangeText={setPlayerName}
            />
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setBanModalVisible(false)} />
              <Button title="Ban" onPress={sendBanCommand} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Pardon Player */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isPardonModalVisible}
        onRequestClose={() => setPardonModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pardon Player</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter player name"
              value={playerName}
              onChangeText={setPlayerName}
            />
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setPardonModalVisible(false)} />
              <Button title="Pardon" onPress={sendPardonCommand} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Send Title */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isTitleModalVisible}
        onRequestClose={() => setTitleModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Send Title</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Type Title Content"
              value={titleContent}
              onChangeText={setTitleContent}
            />
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setTitleModalVisible(false)} />
              <Button title="Send Title" onPress={sendTitleCommand} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Send Chat */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isChatModalVisible}
        onRequestClose={() => setChatModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Send Chat</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Type your chat message"
              value={chatMessage}
              onChangeText={setChatMessage}
            />
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setChatModalVisible(false)} />
              <Button title="Send Chat" onPress={sendChatCommand} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Set Time */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isSetTimeModalVisible}
        onRequestClose={() => setSetTimeModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Time</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter time (0-24000)"
              keyboardType="numeric"
              value={timeValue}
              onChangeText={setTimeValue}
            />
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setSetTimeModalVisible(false)} />
              <Button title="Set Time" onPress={sendSetTimeCommand} />
            </View>
          </View>
        </View>
      </Modal>


      <Button title="Back to Home" onPress={() => navigation.goBack()} />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTitleStyle: {
            fontFamily: 'MinecraftRegular-Bmg3',
            fontSize: 30,
            color: 'black',
          },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Console" component={ConsoleScreen} />
        <Stack.Screen name="Quick Admin" component={MoreScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const Separator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16,
    backgroundColor: '#F2F2F2',
  },
  detailsContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F2F2F2',
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: 'black',
  },
  moreContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F2F2F2',
  },
  moreTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: 'black',
  },
  moreText: {
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 24,
    color: 'black',
  },
  title: {
    textAlign: 'center',
    marginVertical: 8,
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  customTitle: {
    textAlign: 'center',
    marginVertical: 8,
    fontSize: 50,
    color: 'black',
    fontFamily: 'MinecraftRegular-Bmg3',
  },
  logContainer: {
    flex: 1,
    marginBottom: 20,
    marginBottom: 20,
  },
  logText: {
    color: 'black',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    color: 'black',
  },
  jokeContainer: {
    padding: 10,
    backgroundColor: '#6CC417',
    borderRadius: 5,
    marginVertical: 5,
  },
  jokeText: {
    fontSize: 16,
    color: 'black',
  },
  jokeList: {
    marginBottom: 20,
  },
  pressableButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginVertical: 20,
    alignItems: 'center',
  },
  pressableButtonPressed: {
    backgroundColor: 'green',
  },
  pressableButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  disclaimer: {
    fontSize: 12,
    color: 'gray',
    marginTop: 8,
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 16,
  },
  quickAdminContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickAdminTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: 'black',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  gridButton: {
    width: 100,
    height: 100,
    backgroundColor: '#555555',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 10,
  },
  gridButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
 timeMessage: {
    fontSize: 12,
    color: 'red',
    marginTop: 5,
  },
});
