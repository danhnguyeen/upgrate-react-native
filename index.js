import React from 'react'; 
import { AppRegistry, View } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'

import './src/config/custom-props';
import { store, persistor } from './src/stores';
import App from './App';
import { name as appName } from './app.json';

class RootApp extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate
          loading={<View style={{ flex: 1 }}></View>}
          persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    );
  }
}

AppRegistry.registerComponent(appName, () => RootApp);
