import { questionInfoType } from '@types';

export const questionsFromTemplate = (
  questions: questionInfoType[],
  template: string
): questionInfoType[] =>
  questions.filter((info: questionInfoType) => {
    const { templatesIds } = info;
    return templatesIds.find((currElemId) => currElemId === Number(template));
  });
