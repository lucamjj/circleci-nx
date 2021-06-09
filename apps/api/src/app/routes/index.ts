import questionsRoute, { QUESTIONS_ROUTE } from './questions';
import peopleRoute, { PEOPLE_ROUTE } from './people';

export default {
  questions: {
    path: QUESTIONS_ROUTE,
    route: questionsRoute,
  },
  people: {
    path: PEOPLE_ROUTE,
    route: peopleRoute,
  },
};
