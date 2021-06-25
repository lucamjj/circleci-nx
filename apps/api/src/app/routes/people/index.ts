import questionsFromTemplate from '../../../utils/questionsFromTemplate';
import { Router } from 'express';
import fsExtra = require('fs-extra');
import { getPeople, getQuestions } from '../../../utils/readContent';

export const router = Router();

/**
 * @swagger
 *  components:
 *    schemas:
 *      People:
 *        type: object
 *        properties:
 *          count:
 *            type: number
 *            example: 1
 *          values:
 *            type: array
 *            items:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  example: ridley scott
 *                info:
 *                  type: object
 *                  properties:
 *                    movies:
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties:
 *                          title:
 *                            type: string
 *                            example: Blade Runner
 *                          type:
 *                            type: string
 *                            enum: [movie,series]
 *                            example: movie
 *                    awards:
 *                      type: array
 *                      items:
 *                        type: string
 *                      example: ["Nominated for 2 Oscars. Another 5 wins & 6 nominations."]
 */

/**
 * @swagger
 * name: People
 * path:
 *  /api/people/:
 *    get:
 *      summary: Get list of all people
 *      tags: [People]
 *      responses:
 *        "200":
 *          description: People schema
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Actors&Directors'
 */

type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
};

type CustomElement = {
  type: 'paragraph' | 'block-quote';
  children: CustomText[];
};

type contentData = {
  [personId: string]: {
    name: string;
    meetings: {
      data: string; //will need to be date type I think
      notes: CustomElement;
    };
  };
};

async function storeData(filePath, content) {
  try {
    await fsExtra.outputJson(filePath, content);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

router.get('/', async (req, res) => {
  const data: contentData = await getPeople();
  if (data) {
    const people = Object.entries(data).map(([personId, rest]) => {
      return {
        personId,
        ...rest,
      };
    });

    res.send(people).status(200);
    return;
  }

  res.send({ error: true, msg: 'no json to read' }).sendStatus(200);
});

router.get('/:personId', async (req, res) => {
  const { personId } = req.params;

  const data = await getPeople();
  if (data) {
    const person = data[personId];

    res.send(person).status(200);
    return;
  }

  res.send({ error: true, msg: 'no json to read' }).sendStatus(200);
});

router.put('/:personId', async (req, res) => {
  const { personId } = req.params;
  const { content } = req.body;

  const data = await getPeople();
  if (data) {
    data[personId]['notes'] = content;
    storeData(
      `${process.cwd()}/apps/api/src/app/routes/people/data/data.json`,
      data
    );
    res.sendStatus(200);
    return;
  }

  res.sendStatus(412);
});

router.get('/:personId/meetings/:meetingId', async (req, res) => {
  const { personId, meetingId } = req.params;

  const data = await getPeople();
  if (data) {
    const meeting = data[personId]['meetings'][meetingId];

    res.send(meeting);
    return;
  }

  res.sendStatus(412);
});

router.delete('/:personId/meetings/:meetingId', async (req, res) => {
  // const { personId, meetingId } = req.params;
  console.log(req.body);
  console.log(req.params);

  const { personId, meetingId } = req.body;

  const data = await getPeople();
  if (data) {
    const newData = { ...data };
    delete newData[personId]['meetings'][meetingId];
    storeData(
      `${process.cwd()}/apps/api/src/app/routes/people/data/data.json`,
      newData
    );
    res.sendStatus(200);
    return;
  }

  res.sendStatus(412);
});

router.get('/:personId/meetings', async (req, res) => {
  const { personId } = req.params;

  const data = await getPeople();
  if (data) {
    const meetings = data[personId]['meetings'];

    res.send(meetings);
    return;
  }

  res.sendStatus(412);
});

router.post('/:personId/meetings', async (req, res) => {
  const { title, date, template } = req.body;

  console.log(req.body);

  const { personId } = req.params;
  const data = await getPeople();
  const questions = await getQuestions();

  if (data) {
    const meetings = data[personId]['meetings'];
    const numOfMeetings = Object.entries(meetings).length;
    const newMeetings = {
      ...meetings,
      [numOfMeetings + 1]: {
        title,
        date,
        template,
        questions: questionsFromTemplate(questions, template),
        notes: [{ type: 'paragraph', children: [{ text: '' }] }],
      },
    };
    data[personId]['meetings'] = newMeetings;
    storeData(
      `${process.cwd()}/apps/api/src/app/routes/people/data/data.json`,
      data
    );
    res.sendStatus(200);
    return;
  }

  res.sendStatus(412);
});

router.put('/:personId/meetings/:meetingId', async (req, res) => {
  const { content } = req.body;
  const { personId, meetingId } = req.params;

  const data = await getPeople();

  if (data) {
    const meetings = data[personId]['meetings'];
    const oldMeeting = data[personId]['meetings'][meetingId];
    const newMeeting = {
      ...meetings,
      [meetingId]: {
        ...oldMeeting,
        notes: content,
      },
    };
    data[personId]['meetings'] = newMeeting;

    storeData(
      `${process.cwd()}/apps/api/src/app/routes/people/data/data.json`,
      data
    );
    res.sendStatus(200);
    return;
  }

  res.sendStatus(412);
});

export const PEOPLE_ROUTE = '/api/people';
export default router;
