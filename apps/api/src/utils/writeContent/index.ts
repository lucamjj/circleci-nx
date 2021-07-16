import fsExtra = require('fs-extra');

const writeContent = async (filePath, content) => {
  try {
    await fsExtra.outputJson(filePath, content);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const writeQuestion = async (content) => {
  writeContent(
    `${process.cwd()}/apps/api/src/app/routes/questions/data/questions.json`,
    content
  );
};

export const writeMeeting = async (content) => {
  writeContent(
    `${process.cwd()}/apps/api/src/app/routes/people/data/data.json`,
    content
  );
};

export const writePerson = async (content) => {
  writeContent(
    `${process.cwd()}/apps/api/src/app/routes/people/data/data.json`,
    content
  );
};
