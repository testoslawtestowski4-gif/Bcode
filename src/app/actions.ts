'use server';

import { correctFormat, type FormatCorrectionInput } from '@/ai/flows/format-correction';

export async function correctBarcodeFormat(input: FormatCorrectionInput) {
  try {
    const result = await correctFormat(input);
    return result;
  } catch (error) {
    console.error('Error correcting format:', error);
    // Return a default error structure if the AI call fails
    return {
      correctedString: input.inputString,
      correctionsApplied: 'Error: Could not process the input.',
    };
  }
}
