import { useState, useEffect } from 'react';
import {View, StyleSheet, Alert, FlatList, useWindowDimensions} from 'react-native'
import NumberContainer from '../components/game/NumberContainer';
import PrimaryButton from '../components/ui/PrimaryButton';
import Title from '../components/ui/Title';
import Card from '../components/ui/Card';
import InstructionText from '../components/ui/InstructionText';
import {Ionicons} from '@expo/vector-icons';
import GuessLogItem from '../components/game/GuessLogItem';


function generateRandomBetween(min, max, exclude) {
    const rndNum = Math.floor(Math.random() * (max - min)) + min;
  
    if (rndNum === exclude) {
      return generateRandomBetween(min, max, exclude);
    } else {
      return rndNum;
    }
  }

let minBoundary = 1;
let maxBoundary = 100;

function GameScreen({userNumber, onGameOver}) {
    const initialGuess = generateRandomBetween(1, 100, userNumber)
    const [currentGuess, setCurrentGuess] = useState(initialGuess)
    const [guessRounds, setGuessRounds] = useState([initialGuess])
    const {width, height} = useWindowDimensions(); 

    useEffect(() => {
      if (currentGuess === userNumber) {
        onGameOver(guessRounds.length)
      }
    }, [currentGuess, userNumber, onGameOver])

    useEffect(() => {
      minBoundary = 1;
      maxBoundary = 100;
    }, [])

    function nextGuessHandler(direction) {
      if (
        (direction === 'lower' && currentGuess < userNumber) || 
        (direction === 'greater' && currentGuess > userNumber)
      ) {
        Alert.alert("don't lie", "you know it's wrong", [
          {text: 'sorry', style: 'cancel'}
        ])
        return;
      }

      if (direction === 'lower') {
        maxBoundary = currentGuess;
      } else {
        minBoundary = currentGuess + 1;
      }
      const newRndNumber = generateRandomBetween(minBoundary, maxBoundary, currentGuess);
      setCurrentGuess(newRndNumber);
      setGuessRounds(prevGuessRounds => [newRndNumber, ...prevGuessRounds]);
    }

    const guessRoundsListLength = guessRounds.length;

    let content = (
      <>
      <NumberContainer>{currentGuess}</NumberContainer>
        <Card>
            <InstructionText style={styles.instructionText}>higher or lower</InstructionText>
            <View style={styles.buttonsContainer}>
              <View style={styles.buttonContainer}>
              <PrimaryButton onPress={nextGuessHandler.bind(this, 'lower')}>
                <Ionicons name="md-remove" size={24} color='white' />
              </PrimaryButton>
              </View>
              <View style={styles.buttonContainer}>
              <PrimaryButton onPress={nextGuessHandler.bind(this,'greater')}>
              <Ionicons name="md-add" size={24} color='white' />
              </PrimaryButton>
              </View>
            </View>
        </Card>
      </>
    );


    if (width > 500) {
      content = 
      <>
       
        <View style={styles.buttonsContainerWide}>
          <View style={styles.buttonContainer}>
            <PrimaryButton onPress={nextGuessHandler.bind(this, 'lower')}>
              <Ionicons name="md-remove" size={24} color='white' />
            </PrimaryButton>
          </View>

          <NumberContainer>{currentGuess}</NumberContainer>
          <View style={styles.buttonContainer}>
            <PrimaryButton onPress={nextGuessHandler.bind(this,'greater')}>
            <Ionicons name="md-add" size={24} color='white' />
          </PrimaryButton>
          </View>
        </View>
      </>
    }

    return (
        <View style={styles.screen}>
        <Title>opponets guess</Title>
        {content}
        <View style={styles.listContainer}>
          {/* {guessRounds.map(guessRound => <Text key={guessRound}>{guessRound}</Text>)} */}
          <FlatList 
            data={guessRounds}
            renderItem={(itemData) => (
              <GuessLogItem 
                roundNumber={guessRoundsListLength - itemData.index} 
                guess={itemData.item} 
              />
            )}
            keyExtractor={(item) => item}
          />
        </View>
        </View>
    )
}

export default GameScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 24,
    alignItems: 'center'
  },
  buttonsContainer: {
    flexDirection: 'row'
  },
  buttonsContainerWide: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  buttonContainer: {
      flex: 1,
  },
  instructionText: {
    marginBottom: 12
  },
  listContainer: {
    flex: 1,
    padding: 16,
  }
})