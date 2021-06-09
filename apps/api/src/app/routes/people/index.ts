import { Router } from 'express';
import fsExtra = require('fs-extra');

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

router.get('/', async (req, res) => {
  const data: contentData = await readContent();
  if (data) {
    const people = Object.entries(data).map(([personId, personObj]) => {
      return {
        personId,
        name: personObj.name,
      };
    });

    res.send(people).status(200);
    return;
  }

  res.send({ error: true, msg: 'no json to read' }).sendStatus(200);
});

router.get('/:personId', async (req, res) => {
  const { personId } = req.params;

  const data = await readContent();
  if (data) {
    console.log(data);

    const person = data[personId];

    res.send(person).status(200);
    return;
  }

  res.send({ error: true, msg: 'no json to read' }).sendStatus(200);
});

router.get('/read/:personId/:meetingId', async (req, res) => {
  const { personId, meetingId } = req.params;

  const data = await readContent();
  if (data) {
    console.log(data);

    const meeting = data[personId]['meetings'][meetingId];

    res.send(meeting);
    return;
  }

  res.sendStatus(412);
});

async function readContent() {
  try {
    return await fsExtra.readJson(
      `${process.cwd()}/apps/api/src/app/routes/people/data/data.json`
    );
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function storeData(filePath, content) {
  try {
    await fsExtra.outputJson(filePath, content);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

router.put('/write/:personId/:meetingId', async (req, res) => {
  const { content } = req.body;
  const { personId, meetingId } = req.params;
  console.log(
    `%c${personId} ${meetingId}`,
    `color: green; background-color: black`
  );
  console.log(`%c${content}`, `color: green; background-color: red`);
  const data = await readContent();
  if (data) {
    console.log(data);

    const meetings = data[personId]['meetings'];
    const newMeetings = {
      ...meetings,
      [meetingId]: {
        date: new Date(),
        notes: content,
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

export const PEOPLE_ROUTE = '/api/people';
export default router;
