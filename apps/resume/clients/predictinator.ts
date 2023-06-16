import { Predictinator } from '@resume-daddy/predictinator';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const predictinator = Predictinator(process.env.OPENAI_API_KEY!);

export default predictinator;
