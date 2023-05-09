import { createClient } from 'redis';
import { config } from '../config/server';

const redisClient = createClient({
	url: config.REDIS_URL
});

// eslint-disable-next-line no-console
redisClient.on('error', (err) => console.log('Redis Client Error', err));

await redisClient.connect();

export default redisClient;
