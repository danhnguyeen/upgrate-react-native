import { REHYDRATE } from 'redux-persist';

const initialState = {
  token: null,
  user: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    default: return state;
  }
};

export default reducer;
