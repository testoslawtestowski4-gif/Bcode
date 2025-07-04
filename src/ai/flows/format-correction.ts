// src/ai/flows/format-correction.ts
'use server';

/**
 * @fileOverview AI-powered format correction for Code128 barcode inputs.
 *
 * - correctFormat - Reformats input to conform to Code128 requirements.
 * - FormatCorrectionInput - Input type for the correctFormat function.
 * - FormatCorrectionOutput - Return type for the correctFormat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FormatCorrectionInputSchema = z.object({
  inputString: z
    .string()
    .describe('The input string that needs to be corrected to match Code128 requirements.'),
});
export type FormatCorrectionInput = z.infer<typeof FormatCorrectionInputSchema>;

const FormatCorrectionOutputSchema = z.object({
  correctedString: z
    .string()
    .describe('The corrected string that conforms to Code128 requirements.'),
  correctionsApplied: z
    .string()
    .describe('Details on the corrections that were applied to the original string.'),
});
export type FormatCorrectionOutput = z.infer<typeof FormatCorrectionOutputSchema>;

export async function correctFormat(input: FormatCorrectionInput): Promise<FormatCorrectionOutput> {
  return correctFormatFlow(input);
}

const formatCorrectionPrompt = ai.definePrompt({
  name: 'formatCorrectionPrompt',
  input: {schema: FormatCorrectionInputSchema},
  output: {schema: FormatCorrectionOutputSchema},
  prompt: `You are an AI assistant specialized in reformatting input strings to conform to Code128 barcode requirements.

  The input string is: {{{inputString}}}

  Correct any formatting issues, remove invalid characters, and ensure the string is suitable for Code128 encoding.
  If no corrections are required, return the original string as is.

  Explain what corrections have been applied in the correctionsApplied field.

  Output the corrected string and the details of corrections applied in JSON format.
  If the string does not require changes, return it as correctedString and say "No changes needed" in correctionsApplied field.`,
});

const correctFormatFlow = ai.defineFlow(
  {
    name: 'correctFormatFlow',
    inputSchema: FormatCorrectionInputSchema,
    outputSchema: FormatCorrectionOutputSchema,
  },
  async input => {
    const {output} = await formatCorrectionPrompt(input);
    return output!;
  }
);
