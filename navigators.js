import { createBottomTabNavigator, createAppContainer, createStackNavigator } from 'react-navigation';

import { Home } from './src/containers/home';
import { Products } from './src/containers/products';

const headerOptions = {
  headerStyle: {
    backgroundColor: '#2997d8'
  }
};

const AppNavigator = createBottomTabNavigator({
  Home: createStackNavigator({
    Home: {
      screen: Home,
      navigationOptions: ({ navigation }) => ({
        ...headerOptions
      })
    }
  }),
  Products: createStackNavigator({
    Products: {
      screen: Products,
      navigationOptions: ({ navigation }) => ({
        ...headerOptions
      })
    }
  })
});

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;



