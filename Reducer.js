const Reducer = (state, action) => {
  switch (action.type) {
    case "SET_POSTS":
      return {
        ...state,
        flyto: action.payload,
      };
    default:
      return state;
  }
};

export default Reducer;
