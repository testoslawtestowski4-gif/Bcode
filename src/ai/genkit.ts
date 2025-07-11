/**
 * @fileoverview This file initializes the Genkit AI functionality.
 * It is used by flows to define and register AI operations.
 */
import {genkit} from '@genkit-ai/core';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    googleAI({
      apiVersion: 'v1beta',
    }),
  ],
});
