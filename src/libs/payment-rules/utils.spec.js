import { computePerformance, computeBonus } from './utils';

const defaultRate = {
  base_price: 10,
  rules: [
    {
      threshold: 3,
      variable_bonus: 2,
    },
    {
      threshold: 6,
      variable_bonus: 2.5,
    },
  ],
};
describe('computeBonus', () => {
  it('compute bonus', () => {
    const bonus = computeBonus({ nb_bookings: 10 }, defaultRate);
    expect(bonus).toBe(17.5);
  });
});

describe('compute performance', () => {
  const sessions = [{ nb_bookings: 10 }];
  const result = computePerformance(sessions, [], defaultRate);

  it('compute the number of sessions', () => {
    expect(result.nbSessions).toEqual(1);
  });

  it('compute the number of bookings', () => {
    expect(result.nbBookings).toEqual(10);
  });

  it('compute the proper total', () => {
    expect(result.total).toEqual(27.5);
  });

  it('annotate the session properly', () => {
    expect(result.sessions[0].base).toBe(10);
    expect(result.sessions[0].bonus).toBe(17.5);
  });
});
