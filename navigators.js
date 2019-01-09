import { createBottomTabNavigator, createAppContainer, createStackNavigator } from 'react-navigation';

import { Home } from './src/containers/home';
import { Products } from './src/containers/products';
import { Welcome } from './src/containers/welcome';
import { News } from './src/containers/news';
import i18n from './src/i18n';

const headerOptions = {
  headerTintColor: '#fff',
  headerBackTitle: null,
  headerTitleStyle: {
    color: '#fff'
  },
  headerStyle: {
    backgroundColor: '#2997d8'
  }
};

const HomeStack = createStackNavigator({
  Welcome: {
    screen: Welcome,
    navigationOptions: {
      ...headerOptions,
      header: null
    }
  },
  News: {
    screen: News,
    navigationOptions: {
      ...headerOptions,
      title: i18n.t('tabs.news')
    }
  }
}, {
  initialRouteName: 'Welcome',
  navigationOptions: {
    ...headerOptions,
    tabBarVisible: false
  }
});

const AppNavigator = createBottomTabNavigator({
  Home: HomeStack,
  Products: createStackNavigator({
    Products: {
      screen: Products,
      navigationOptions: ({ navigation }) => ({
        ...headerOptions
      })
    }
  })
},
{
  initialRouteName: 'Home'
});

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;
