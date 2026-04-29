import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Logger = () => {
  return (
    <View style={styles.container}>
      <Text>Logger</Text>
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

export default Logger;
