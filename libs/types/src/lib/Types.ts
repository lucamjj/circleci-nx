export type frequencyType = {
  numOfWeeks: string;
  repeat: boolean;
  text: 'Weekly' | 'Monthly' | 'Yearly';
};

export type templatesType = {
  [id: string]: {
    title: string;
    frequency: frequencyType;
  };
};

export type questionsType = {
  [questionId: string]: questionInfoType;
};

export type questionInfoType = {
  id: string;
  text: string;
  templatesIds: number[];
};
