import * as path from "node:path";
import { createInterface } from "node:readline";
import { createReadStream } from "node:fs";
import { writeFile } from "node:fs/promises";

const journeyPath = "lib/journey.txt";
const absJourneyPath = path.resolve(process.cwd(), journeyPath);

type Event = {
  eventId: string;
  timeStamp: string;
  sender: string;
  senderRole: string;
  message: string;
};

async function convertToJson(filepath: string): Promise<void> {
  const fileStream = createReadStream(filepath);

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  const events: Event[] = [];
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.
  let eventCounter = 0;
  for await (const line of rl) {
    const parsedJson = {} as Event;
    const eventId: string = `evt-${String(eventCounter).padStart(3, "0")}`;

    const date = line.match(/\[.+?\]/);
    const sender = line.match(/\] \w+ \(/);
    const senderRole = line.match(/\((.+?)\)/);
    const message = line.match(/: (.+)$/);

    parsedJson.eventId = eventId;
    if (date) parsedJson.timeStamp = date[0];
    if (sender) parsedJson.sender = sender[0].replace(/[\]\(]/g, "").trim();
    if (senderRole)
      parsedJson.senderRole = senderRole[0].replace(/[\(\)]/g, "").trim();
    if (message) parsedJson.message = message[0].replace(/[:\n]/g, "").trim();
    if (
      parsedJson.message &&
      parsedJson.timeStamp &&
      parsedJson.sender &&
      parsedJson.senderRole
    ) {
      events.push(parsedJson);
      eventCounter++;
    }
  }

  const jsonPath = path.resolve(__dirname, "journey.json");
  await writeFile(jsonPath, JSON.stringify(events, null, 2), "utf-8");
}

convertToJson(absJourneyPath);
