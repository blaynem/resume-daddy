# predictinator

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test predictinator` to execute the unit tests via [Jest](https://jestjs.io).

## How to add a new predict option

Using the steps below we can make sure that the Predictinator always returns in the same format.

1. Create a new file under the `/prompts` directory. Copy the predict [example](./src/lib/prompts/_example_prompt.ts) file.

2. Export the new file from the [/prompts/index](./src/lib/prompts/index.ts) file.

3. Add the new predict option to the PredictinatorType in [types](./src/types.ts).

```ts
// Import your Prompt Args for your new predict type, and add them like below
export type PredictinatorType = {
  /**
   * My new predict option
   */
  myNewPredict: PredictinatorPredict<NewPredictTemplateArgs>;
  // ... Rest of the predict options
};
```

4. Add the new predict option the the Predictinator by adding the key and using the `createPredictor` function as the value.

```ts
import {
    // ... Rest of the imports
    NewPredictTemplateArgs,
    newPredictPromptBuilder,
} from './promps'.

export const Predictinator = (openAIApiKey: string): PredictinatorType => {
  // ... Rest of the predict options
  return {
    myNewPredict: (args: NewPredictTemplateArgs) =>
      createPredictor<NewPredictTemplateArgs>(
        args,
        gptClient,
        newPredictPromptBuilder
      ),
  }
};
```
