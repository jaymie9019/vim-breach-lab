import { basicLevels } from "./basics.js";
import { lineEditingLevels } from "./lineEditing.js";
import { searchLevels } from "./search.js";
import { countLevels } from "./count.js";
import { visualLevels } from "./visual.js";
import { registerLevels } from "./registers.js";
import { recoveryLevels } from "./recovery.js";
import { markLevels } from "./marks.js";
import { caseEditingLevels } from "./caseEditing.js";
import { exCommandLevels } from "./exCommands.js";
import { gCommandLevels } from "./gCommands.js";

export const levels = [
  ...basicLevels,
  ...lineEditingLevels,
  ...searchLevels,
  ...countLevels,
  ...recoveryLevels,
  ...visualLevels,
  ...registerLevels,
  ...markLevels,
  ...caseEditingLevels,
  ...gCommandLevels,
  ...exCommandLevels
];
