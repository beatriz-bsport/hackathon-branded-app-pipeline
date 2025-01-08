import aerobic from '../../assets/images/sports/aerobic.png';
import africanDanse from '../../assets/images/sports/danse_africaine.png';
import yoga from '../../assets/images/sports/yoga.png';
import racket from '../../assets/images/sports/raquettes.png';
import ballroomDanse from '../../assets/images/sports/danse_salon.png';
import coaching from '../../assets/images/sports/coaching.png';
import handSports from '../../assets/images/sports/hand_sports.png';
import misc from '../../assets/images/sports/misc.png';
import orientalDanse from '../../assets/images/sports/danse_orientale.png';
import footSports from '../../assets/images/sports/foot_sports.png';
import martialArts from '../../assets/images/sports/martial_arts.png';
import latinDanse from '../../assets/images/sports/danse_latine.png';
import seaSports from '../../assets/images/sports/sea_sports.png';
import boxe from '../../assets/images/sports/boxe.png';
import aquaticAerobic from '../../assets/images/sports/aerobic_aquatic.png';
import modernDanse from '../../assets/images/sports/danse_moderne.png';
import other from '../../assets/images/sports/other.png';

export type SportOptions = { id: number, text: string, icon: string };
const SPORTS: SportOptions[] = [
  { id: 7, text: 'Aérobic', icon: aerobic },
  { id: 2, text: 'Danse africaine', icon: africanDanse },
  { id: 9, text: 'Yoga', icon: yoga },
  { id: 20, text: 'Sport de raquettes', icon: racket },
  { id: 3, text: 'Danse de salon', icon: ballroomDanse },
  { id: 8, text: 'Coaching', icon: coaching },
  { id: 14, text: 'Balle à main collectif', icon: handSports },
  { id: 21, text: 'Insolite', icon: misc },
  { id: 6, text: 'Danse orientale', icon: orientalDanse },
  { id: 15, text: 'Balle à pied collectif', icon: footSports },
  { id: 17, text: 'Arts martiaux', icon: martialArts },
  { id: 4, text: 'Danse latine', icon: latinDanse },
  { id: 11, text: 'Sport de mer', icon: seaSports },
  { id: 18, text: 'Boxe', icon: boxe },
  { id: 10, text: 'Aérobic aquatique', icon: aquaticAerobic },
  { id: 5, text: 'Danse moderne', icon: modernDanse },
  { id: 19, text: 'Autre', icon: other },
];

export default SPORTS;

export function getSportsOptions(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  categories: Array<any>,
  key: string,
): Array<SportOptions> {
  const options: SportOptions[] = [];
  categories.forEach((cat) => {
    const sport = SPORTS.find((s) => s.id === cat[key]);
    if (sport) {
      options.push(sport);
    }
  });

  return options;
}
