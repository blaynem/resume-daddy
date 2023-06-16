// TODO: This is broken right now. It throws a cannot find module @libs/predictinator/src error.
// import { Predictinator } from '@resume-daddy/predictinator';

// const predictinator = Predictinator(process.env.OPENAI_API_KEY);
const predictinator = {
  coverLetterPredict: () => ({}),
} as any;

export default predictinator;
