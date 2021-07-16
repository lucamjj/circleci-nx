import { Router } from 'express';
import { getQuestions } from '../../../utils/readContent';
import { questionsFromTemplate } from '@utils';
import { writeQuestion } from '../../../utils/writeContent';

export const router = Router();

/**
 * @swagger
 *  components:
 *    schemas:
 *      Questions:
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
 * name: Questions
 * path:
 *  /api/questions/:
 *    get:
 *      summary: Get list of all questions
 *      tags: [Questions]
 *      responses:
 *        "200":
 *          description: Questions schema
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Actors&Directors'
 */
router.get('/', async (req, res) => {
  const listOfQuestions = await getQuestions();
  res.send(Object.values(listOfQuestions));
});

router.post('/', async (req, res) => {
  const { text, templatesIds } = req.body;
  console.log(text);

  const questions = await getQuestions();
  // Math.random() * (1000 - 500 + 1) + 500 it is just a temp thing
  const newQuestionId = Math.floor(Math.random() * (1000 - 500 + 1) + 500);
  const newQuestions = {
    ...questions,
    [newQuestionId]: {
      id: String(newQuestionId),
      text,
      templatesIds,
    },
  };

  writeQuestion(newQuestions);
  res.sendStatus(200);
});

router.get('/templates/:templateId', async (req, res) => {
  const { templateId } = req.params;
  const questions = await getQuestions();
  const listOfQuestions = questionsFromTemplate(
    Object.values(questions),
    templateId
  );
  res.send(listOfQuestions);
});

export const QUESTIONS_ROUTE = '/api/questions';
export default router;
