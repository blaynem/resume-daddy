import { Predictinator } from '@libs/predictinator/src';

const predictinator = Predictinator(process.env.OPENAI_API_KEY);

export default predictinator;
