import { questionsType, questionInfoType } from '@types';

const questionsFromTemplate = (
  questions: questionsType,
  template: string
): questionInfoType[] =>
  Object.values(questions).filter((info: questionInfoType) => {
    const { templatesIds } = info;
    return templatesIds.find((currElemId) => currElemId === Number(template));
  });

export default questionsFromTemplate;
