import React from 'react';
import { View } from 'react-native';
import { Text } from 'native-base';
import styles from './styles';

const Error = (props) => {
  return (
    <View style={styles.errorContainer}>
      <Text style={{color: 'red'}}>
        Please fix the designated fields.
      </Text>
    </View>
  )
}

export default Error;
