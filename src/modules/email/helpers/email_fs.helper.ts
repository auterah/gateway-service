import { readFileSync, writeFileSync } from 'fs';

export class EmailHelpers {
  static appendToJson(path: string, data) {
    try {
      // Read existing JSON data from file
      const existingData = readFileSync(path, 'utf8');

      let existingObject;
      try {
        existingObject = JSON.parse(existingData);
      } catch (error) {
        existingObject = [];
      }

      existingObject.push(data);

      // Write the updated JavaScript object back to the file
      writeFileSync(path, JSON.stringify(existingObject, null, 2));
      console.log(`Data appended to ${path}`);
    } catch (error) {
      console.error(`Error appending data to ${path}: ${error}`);
    }
  }

  static readAsJson(path: string) {
    try {
      // Read existing JSON data from file
      const existingData = readFileSync(path, 'utf8');

      let existingObject;
      try {
        existingObject = JSON.parse(existingData);
      } catch (error) {
        existingObject = [];
      }

      return existingObject;
    } catch (error) {
      console.error(`Error appending data to ${path}: ${error}`);
    }
  }

  async removeTransactionsByRefId(path: string, refId: string) {
    try {
      // Read existing JSON data from file
      const existingData = readFileSync(path, 'utf8');

      let existingObject: [] | null;
      try {
        existingObject = JSON.parse(existingData);
      } catch (error) {
        return;
      }

      writeFileSync(
        path,
        JSON.stringify(
          existingObject.filter((e: any) => e?.refId != refId),
          null,
          2,
        ),
      );
      console.log(`Tnx ref removed: ${refId}`);
    } catch (error) {
      console.error(`Error removing Tnx ref: ${error}`);
    }
  }
}
