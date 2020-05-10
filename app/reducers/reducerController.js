export const ctlGet = (state, action) => type => {
  switch (action.type) {
    case type:
      return action.payload;
    default:
      return state;
  }
};
