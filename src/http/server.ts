import fastify, { } from 'fastify';
import { fastifyCors } from '@fastify/cors'
import { z } from 'zod';
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod'
import { client, db } from '../db/client.ts';


const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.get('/health', () => {
    return 'OK';
})

app.register(fastifyCors, { origin: '*' });

app.get('/evolution', {
    schema: {
        querystring: z.object({
            origin: z.string().optional(),
            dateStart: z.string().optional(),
            dateEnd: z.string().optional(),
            status: z.array(z.number()).optional()
        })
    }
}, async (request, reply) => {
    const { origin, dateStart, dateEnd, status } = request.query as any;

    const conditions: string[] = [];
    if (origin) conditions.push(`origin='${origin}'`);
    if (dateStart) conditions.push(`created_at >= '${dateStart}'`);
    if (dateEnd) conditions.push(`created_at <= '${dateEnd}'`);
    if (status) conditions.push(`response_status_id = ANY('{${status.join(',')}}'::integer[])`);
    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
      SELECT
        origin,
        date_trunc('day', created_at)::date as day,
        count(*) as total,
        sum(CASE WHEN response_status_id = 1 THEN 1 ELSE 0 END) as valid,
        round(
          CASE WHEN count(*) = 0 THEN 0
            ELSE sum(CASE WHEN response_status_id = 1 THEN 1 ELSE 0 END)::decimal / count(*) * 100 END
          ,2) as conversion_rate
      FROM users_surveys_responses_aux
      ${whereClause}
      GROUP BY origin, day
      ORDER BY day ASC, origin ASC
    `;

    const result = await client.query(query);

    return reply.send(result.rows);
});

app.listen({ host: '0.0.0.0', port: 3333 }).then(() => {
    console.log('[Order] HTTP Server running !');
})
