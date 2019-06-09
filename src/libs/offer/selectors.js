const getState = (state) => state.offer;

const get = (state, id) => getState(state).offers.find((o) => o.id === id);

export default { get };
