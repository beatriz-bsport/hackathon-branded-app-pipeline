const getState = (state) => state.consumerPaymentPack;

const getAll = (state) => getState(state).items;
const getActive = (state) => getAll(state).filter((cpp) => !cpp.reverted);

const get = (state, id) => getAll(state).find((cpp) => cpp.id === id);

export default { get, getAll, getActive };
