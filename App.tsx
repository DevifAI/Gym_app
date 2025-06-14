import React from 'react';
import Routes from './src/routes';
import 'react-native-reanimated';

import { Platform } from 'react-native';
import { Text, TextInput } from 'react-native-gesture-handler';

export const fontFamily = 'FontBueno'; // 👈 Use your custom font name here

(Text as any).defaultProps = {
  ...(Text as any).defaultProps,
  style: [{ fontFamily }],
};

(TextInput as any).defaultProps = {
  ...(TextInput as any).defaultProps,
  style: [{ fontFamily }],
};

const App = () => {
  return <Routes />;
};

export default App;
