import { StyleSheet } from 'react-native';
import { colors } from '../../config/styles';

export default StyleSheet.create({
  contentContainer: {
    backgroundColor: colors.background,
  },
  errorContainer: {
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  TopBuffer: {
    backgroundColor: colors.background,
    paddingBottom: 100,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.headerText,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: colors.secondaryBackground,
    marginBottom: 12,
  },
  buttonText: {
    color: colors.headerText,
  }
})
