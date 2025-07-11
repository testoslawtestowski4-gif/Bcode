'use server';
/**
 * @fileOverview Centralized AI configuration for Genkit.
 * This file initializes and configures the `ai` object with the necessary plugins.
 * It is used by flows to define and register AI operations.
 */
import {genkit} from '@genkit-ai/core';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
});
