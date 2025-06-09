import * as request from 'supertest';
import 'dotenv/config';
import { DEFAULT_PORT } from '../../src/utils/defaults';

const port = process.env.PORT || DEFAULT_PORT;

const host = `localhost:${port}`;
const _request = request(host);

export default _request;
