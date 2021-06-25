import questionsRoute, { QUESTIONS_ROUTE } from './questions';
import peopleRoute, { PEOPLE_ROUTE } from './people';
import templatesRoute, { TEMPLATES_ROUTE } from './templates';

export default {
  questions: {
    path: QUESTIONS_ROUTE,
    route: questionsRoute,
  },
  people: {
    path: PEOPLE_ROUTE,
    route: peopleRoute,
  },
  templates: {
    path: TEMPLATES_ROUTE,
    route: templatesRoute,
  },
};
