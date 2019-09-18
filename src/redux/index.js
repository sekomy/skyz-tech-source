import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { routerMiddleware } from 'react-router-redux';
import ReduxPromise from 'redux-promise';

import rootReducer from '../reducers';

const configureStore = (prelodedState, history) => {
  const middlewares = [thunk, ReduxPromise, routerMiddleware(history)];

  /* istanbul ignore if */
  if (process.env.NODE_ENV === 'development') {
    middlewares.push(createLogger());
  }

  const composed = [applyMiddleware(...middlewares)];

  /* istanbul ignore if */
  if (process.env.NODE_ENV === 'development') {
    /* eslint-disable */
    const devExtension =
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
    if (devExtension) {
      composed.push(devExtension);
    }
    /* eslint-enable */
  }

  const store = createStore(rootReducer, prelodedState, compose(...composed));

  /* istanbul ignore if */
  if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept('../reducers', () => {
      // eslint-disable-next-line
      const nextRootReducer = require('../reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
};

export default configureStore;
