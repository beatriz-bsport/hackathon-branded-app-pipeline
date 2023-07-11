import { fakerFR as faker } from '@faker-js/faker';
import { TutorialLesson, TutorialSection } from './types';

function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}
function randomBoolean() {
  const table = [true, false];
  return table[randomInt(2)];
}

function fakerBodyContent() {
  let fakeText = '';

  for (let i = 0; i < randomInt(600) + 1; i += 1) {
    fakeText += faker.hacker.phrase();
  }

  return fakeText;
}
const fakerDict = {
  en: 'en',
  fr: 'fr',
  de: 'de',
  es: 'es',
  it: 'it',
  nl: 'nl',
  pt: 'pt',
  cs: 'cs',
};
const sectionNames = [
  'Paiements en plusieurs fois',
  'Programmes',
  'Podcasts',
  'Marketing Auto',
  'Cartes de cours',
  'Mon Profil',
  'Mon compte',
  'Mes commandes',
  'Mes souscriptions',
];

const translated_videolinks = [
  'https://www.youtube.com/watch?v=11ZVgbFFJzI',
  'https://www.youtube.com/watch?v=yC0X873bUN0',
  'https://www.youtube.com/watch?v=nrXA4noIGxg',
];

export function TutorialLessonFactory(
  id_choice?: number,
  translated_name_choice?: number,
  section_choice?: number,
  completed_choice?: boolean,
  viewed_choice?: boolean,
): TutorialLesson {
  const id = id_choice ?? randomInt(1000);
  const translated_name = `Lesson ${id} ${
    sectionNames[translated_name_choice ?? randomInt(sectionNames.length - 1)]
  }`;
  const section = section_choice ?? randomInt(1000);
  const translated_videolink =
    translated_videolinks[randomInt(translated_videolinks.length - 1)];
  const completed = completed_choice ?? randomBoolean();
  const viewed = viewed_choice ?? randomBoolean();
  const hasUpsell = randomBoolean();
  return {
    id,
    uuid: id.toString(),
    names: fakerDict,
    videolinks: fakerDict,
    bodies: fakerDict,
    translated_name,
    section,
    index: id,
    translated_videolink,
    translated_body: fakerBodyContent(),
    completed,
    viewed,
    upsell_identifiers: hasUpsell ? [1] : [],
  };
}

export function TutorialLessonsFactory(
  length: number,
  translated_name_choice: number,
  section_choice?: number,
  completed_choice?: boolean,
  viewed_choice?: boolean,
): Array<TutorialLesson> {
  const res = new Array(length).fill(0);
  return res.map((value, index) =>
    TutorialLessonFactory(
      index,
      translated_name_choice,
      section_choice,
      completed_choice,
      viewed_choice,
    ),
  );
}

export function TutorialSectionFactory(
  id_choice?: number,
  translated_name_choice?: number,
  nb_lessons_choice?: number,
  completed_choice?: boolean,
  viewed_choice?: boolean,
  hasUpsell_choice?: boolean,
): TutorialSection {
  const id = id_choice ?? randomInt(1000);
  const translated_name =
    translated_name_choice ?? randomInt(sectionNames.length - 1);
  const nb_lessons = nb_lessons_choice ?? randomInt(6) + 1;
  const completed = completed_choice ?? randomBoolean();
  const viewed = viewed_choice ?? randomBoolean();
  const hasUpsell = hasUpsell_choice ?? randomBoolean();
  return {
    id,
    uuid: id.toString(),
    names: fakerDict,
    translated_name: sectionNames[translated_name],
    index: id,
    lessons: TutorialLessonsFactory(
      nb_lessons,
      translated_name,
      id,
      completed,
      viewed,
    ),
    completed,
    viewed,
    upsell_identifiers: hasUpsell ? [1] : [],
  };
}

export function TutorialSectionsFactory(
  length: number,
  nb_lessons_choice?: number,
  completed_choice?: boolean,
  viewed_choice?: boolean,
  hasUpsell_choice?: boolean,
): Array<TutorialSection> {
  const res = new Array(length).fill(0);
  return res.map((value, index) =>
    TutorialSectionFactory(
      index,
      index,
      nb_lessons_choice,
      completed_choice,
      viewed_choice,
      hasUpsell_choice,
    ),
  );
}
