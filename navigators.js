import { createBottomTabNavigator, createAppContainer, createStackNavigator } from 'react-navigation';

import { Welcome } from './src/containers/welcome';
import { News } from './src/containers/news';
import { Buildings } from './src/containers/buildings';
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

const BuildingStack = createStackNavigator({
  Buildings: {
    screen: Buildings,
    navigationOptions: {
      ...headerOptions,
      title: i18n.t('tabs.buildings')
    }
  }
}, {
  initialRouteName: 'Buildings',
  navigationOptions: {
    ...headerOptions
  }
});

const AppNavigator = createBottomTabNavigator({
  Home: HomeStack,
  Buildings: BuildingStack
},
{
  initialRouteName: 'Home'
});

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;
