import { ErrorAndLoading } from '../../state/types';

export type LanguageDict = {
  en: string;
  fr: string;
  es: string;
  nl: string;
  de: string;
  it: string;
};

export type TutorialSection = {
  id: number | string;
  uuid: string;
  names: LanguageDict;
  index: number;
  translated_name?: string;
  lessons?: Array<TutorialLesson>;
  icon?: string;
  completed?: boolean;
  viewed?: boolean;
  upsell_identifiers: Array<number>;
  disabled?: boolean;
};
export type TutorialLesson = {
  id: number | string;
  uuid: string;
  names: LanguageDict;
  videolinks: LanguageDict;
  bodies: LanguageDict;
  section: number | string;
  index: number;
  translated_name?: string;
  translated_videolink?: string;
  translated_body?: string;
  completed?: boolean;
  viewed?: boolean;
  disabled?: boolean;
};

export type TutorialCompletion = {
  has_seen_tutorial_section_timestamp: number;
  completed_by_section_id: {
    [section_id: number | string]: Array<number | string>;
  };
  viewed_by_section_id: {
    [section_id: number | string]: Array<number | string>;
  };
};

export type TutorialState = {
  section: ErrorAndLoading & {
    byId: { [id: number | string]: TutorialSection };
    allIds: Array<number | string>;
  };
  lesson: ErrorAndLoading & {
    byId: { [id: number | string]: TutorialLesson };
    allIds: Array<number | string>;
  };
  tutorial_user_status: ErrorAndLoading & {
    statistics: { [key: string | number]: Array<number> };
    all_tutorial_lessons: {
      [section_id: number | string]: Array<number | string>;
    };
    tutorial_completion: TutorialCompletion;
  };
};

export type TutorialSectionQueryParams = {
  uuid?: number | string;
  section_restricted?: boolean;
  disabled?: boolean;
};

export type TutorialLessonQueryParams = {
  uuid?: number | string;
  section_restricted?: boolean;
  lesson_restricted?: boolean;
  disabled?: boolean;
};

export type TutorialLessonUserStatusQueryParams = {
  lesson_id?: number | string;
  section_restricted?: boolean;
  lesson_restricted?: boolean;
};
