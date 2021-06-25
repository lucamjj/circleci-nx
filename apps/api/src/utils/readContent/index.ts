import fsExtra = require('fs-extra');

const readContent = async (path) => {
  try {
    return await fsExtra.readJson(path);
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getQuestions = async () =>
  readContent(
    `${process.cwd()}/apps/api/src/app/routes/questions/data/questions.json`
  );

export const getPeople = async () =>
  readContent(`${process.cwd()}/apps/api/src/app/routes/people/data/data.json`);

export const getTemplates = async () =>
  readContent(
    `${process.cwd()}/apps/api/src/app/routes/templates/data/templates.json`
  );
