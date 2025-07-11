'use server';
/**
 * @fileOverview An AI flow for correcting and formatting barcode text.
 *
 * - formatBarcodes - A function that takes a raw string of text and returns a formatted string with valid barcodes.
 * - FormatBarcodesInput - The input type for the formatBarcodes function.
 * - FormatBarcodesOutput - The return type for the formatBarcodes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const FormatBarcodesInputSchema = z.string();
export type FormatBarcodesInput = z.infer<typeof FormatBarcodesInputSchema>;

const FormatBarcodesOutputSchema = z.object({
  formattedText: z.string().describe('The formatted text, with each valid barcode on a new line.'),
});
export type FormatBarcodesOutput = z.infer<typeof FormatBarcodesOutputSchema>;

export async function formatBarcodes(input: FormatBarcodesInput): Promise<FormatBarcodesOutput> {
  return formatBarcodesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'formatBarcodesPrompt',
  input: {schema: FormatBarcodesInputSchema},
  output: {schema: FormatBarcodesOutputSchema},
  prompt: `You are an expert at parsing and cleaning up text to extract barcode numbers.
The user will provide a block of text that may contain valid barcode numbers mixed with other text, notes, or incorrect formats.
Your task is to identify and extract only the valid barcode numbers.
A valid barcode is a numeric string. Sometimes it might be part of a larger string like '12345 2-b3-web-dropoff' or '2-b3-web-dropoff 12345'. In such cases, you should extract only the numeric part.
Return a single string containing only the valid barcode numbers, with each number on a new line.

User input:
{{{input}}}
`,
});

const formatBarcodesFlow = ai.defineFlow(
  {
    name: 'formatBarcodesFlow',
    inputSchema: FormatBarcodesInputSchema,
    outputSchema: FormatBarcodesOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to get a response from the AI model.');
    }
    return output;
  }
);
