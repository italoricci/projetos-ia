import { tool } from '@langchain/core/tools';
import csvtojson from 'csvtojson';
import { z } from 'zod/v3';

export function getCsv2JsonTool() {
  return tool(
    async ({ csv }) => {
      const result = await csvtojson().fromString(csv);
      console.log(
        `[csv_to_json] conversion result finished ${result.length} records`,
      );
      return JSON.stringify(result);
    },
    {
      name: 'csv_to_json',
      description: 'Convert CSV to JSON format',
      schema: z.object({
        csv: z.string().describe('CSV data to be converted to JSON format'),
      }),
    },
  );
}
