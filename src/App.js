import React from 'react';

import userStore from './store/user';
import todosStore from './store/todos';

import Todos from './views/Todos';
import Login from './views/Login';

// for playin in browser console
window.userStore = userStore;
window.todosStore = todosStore;

class BaseComponent extends React.PureComponent {
  rerender = () => {
    this.setState({
      _rerender: new Date(),
    });
  }
}

class App extends BaseComponent {
  state = {
    isInitialized: false,
  }

  render() {
    if (!this.state.isInitialized) {
      return null;
    }

    return (
      userStore.data.email ? (
        <Todos />
      ) : (
        <Login />
      )
    );
  }

  async componentDidMount() {
    await userStore.initialize();
    this.setState({
      isInitialized: true,
    });

    this.unsubUser = userStore.subscribe(this.rerender);
  }

  async componentDidUpdate() {
    if (userStore.data.email && !todosStore.isInitialized) {
      console.log('popup initialize all offline data...');
      todosStore.setName(userStore.data.id);
      await todosStore.initialize();
      console.log('popup done');
    }
  }

  componentWillUnmount() {
    this.unsubUser();
  }
}


export default App;