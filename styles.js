import { StyleSheet, Platform } from 'react-native';

const lightColors = {
  background: '#F8F8F8',
  navbarBackground: '#FFFFFF',
  navbarBorder: '#E0E0E0',
  textPrimary: '#333333',
  buttonPrimary: '#007BFF',
  buttonText: '#FFFFFF',
  userBubbleBackground: '#DCF8C6',
  botBubbleBackground: '#FFFFFF',
  inputBackground: '#F0F0F0',
  inputPlaceholder: '#999999',
  micButtonBackground: '#E9E9E9',
  shadowColor: '#000',
  thinkingText: '#666666',
};

const darkColors = {
  background: '#121212',
  navbarBackground: '#1E1E1E',
  navbarBorder: '#333333',
  textPrimary: '#FFFFFF',
  buttonPrimary: '#8A2BE2',
  buttonText: '#FFFFFF',
  userBubbleBackground: '#005C4B',
  botBubbleBackground: '#2C2C2C',
  inputBackground: '#333333',
  inputPlaceholder: '#AAAAAA',
  micButtonBackground: '#3A3A3A',
  shadowColor: '#000',
  thinkingText: '#BBBBBB',
};

export { lightColors, darkColors };

export default (isDarkMode) => {
  const colors = isDarkMode ? darkColors : lightColors;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 16,
      paddingTop: Platform.OS === 'ios' ? 40 : 10,
    },
    navbar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.navbarBorder,
    },
    navTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    navButton: {
      backgroundColor: colors.buttonPrimary,
      paddingVertical: 8,
      paddingHorizontal: 15,
      borderRadius: 20,
    },
    navButtonText: {
      color: colors.buttonText,
      fontWeight: '600',
      fontSize: 14,
    },
    chat: {
      flex: 1,
      marginBottom: 10,
    },
    userBubble: {
      backgroundColor: colors.userBubbleBackground,
      padding: 12,
      borderRadius: 15,
      marginBottom: 8,
      alignSelf: 'flex-end',
      maxWidth: '80%',
    },
    botBubble: {
      backgroundColor: colors.botBubbleBackground,
      padding: 12,
      borderRadius: 15,
      marginBottom: 8,
      alignSelf: 'flex-start',
      maxWidth: '80%',
    },
    bubbleText: {
      fontSize: 15,
      color: colors.textPrimary,
      lineHeight: 20,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 10,
      backgroundColor: colors.navbarBackground,
      borderRadius: 25,
      marginBottom: Platform.OS === 'ios' ? 0 : 10,
    },
    input: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 20,
      backgroundColor: colors.inputBackground,
      fontSize: 16,
      color: colors.textPrimary,
      marginRight: 8,
    },
    micButton: {
      padding: 10,
      marginLeft: 5,
      borderRadius: 25,
      backgroundColor: colors.micButtonBackground,
      justifyContent: 'center',
      alignItems: 'center',
      width: 45,
      height: 45,
    },
    micButtonText: {
      fontSize: 20,
    },
    thinkingText: {
      padding: 10,
      color: colors.thinkingText,
      alignSelf: 'center',
    }
  });
};