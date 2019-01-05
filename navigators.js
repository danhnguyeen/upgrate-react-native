import { createBottomTabNavigator, createAppContainer, createStackNavigator } from 'react-navigation';

import { Home } from './src/containers/home';
import { Products } from './src/containers/products';

const AppNavigator = createBottomTabNavigator({
  Home: createStackNavigator({ Home }),
  Products: createStackNavigator({ Products })
});

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;



