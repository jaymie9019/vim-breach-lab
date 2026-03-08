import { basicLevels } from "./basics.js";
import { lineEditingLevels } from "./lineEditing.js";
import { searchLevels } from "./search.js";
import { countLevels } from "./count.js";
import { visualLevels } from "./visual.js";
import { registerLevels } from "./registers.js";
import { recoveryLevels } from "./recovery.js";

export const levels = [
  ...basicLevels,
  ...lineEditingLevels,
  ...searchLevels,
  ...countLevels,
  ...recoveryLevels,
  ...visualLevels,
  ...registerLevels
];
