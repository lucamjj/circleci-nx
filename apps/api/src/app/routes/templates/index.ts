import { Router } from 'express';
import { getTemplates } from '../../../utils/readContent';
import { templatesType } from '@types';

export const router = Router();

/**
 * @swagger
 *  components:
 *    schemas:
 *      Templates:
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
 * name: Templates
 * path:
 *  /api/templates/:
 *    get:
 *      summary: Get list of all templates
 *      tags: [Templates]
 *      responses:
 *        "200":
 *          description: Templates schema
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Actors&Directors'
 */
router.get('/', async (req, res) => {
  const data: templatesType = await getTemplates();
  if (data) {
    res.send(data).status(200);
    return;
  }

  res.send({ error: true, msg: 'no json to read' }).sendStatus(200);
});

export const TEMPLATES_ROUTE = '/api/templates';
export default router;
