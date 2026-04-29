import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Floatingbotbutton = () => {
  return (
    <View style={styles.container}>
      <Text>Floatingbotbutton</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Floatingbotbutton;
