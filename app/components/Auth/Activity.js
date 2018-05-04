import React from 'react';
import { Content, Spinner } from 'native-base'
import styles from './styles';

const Activity = (props) => {
  return (
    <Content padder style={styles.contentContainer} >
      <Spinner color='white' />
    </Content>
  )
}

export default Activity;
