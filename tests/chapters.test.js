import test from "node:test";
import assert from "node:assert/strict";

import { chapterDocs, orderedChapters } from "../src/game/chapters.js";
import { levels } from "../src/game/levels.js";

test("every chapter used by levels has intro and outro docs", () => {
  const chaptersInLevels = [...new Set(levels.map((level) => level.chapter))];

  assert.deepEqual(orderedChapters, chaptersInLevels);

  for (const chapter of chaptersInLevels) {
    const doc = chapterDocs[chapter];

    assert.ok(doc, `missing docs for chapter ${chapter}`);
    assert.ok(doc.intro?.title, `missing intro title for chapter ${chapter}`);
    assert.ok(doc.intro?.summary, `missing intro summary for chapter ${chapter}`);
    assert.ok(Array.isArray(doc.intro?.concepts) && doc.intro.concepts.length > 0, `missing intro concepts for chapter ${chapter}`);
    assert.ok(doc.outro?.title, `missing outro title for chapter ${chapter}`);
    assert.ok(doc.outro?.summary, `missing outro summary for chapter ${chapter}`);
    assert.ok(Array.isArray(doc.outro?.takeaways) && doc.outro.takeaways.length > 0, `missing outro takeaways for chapter ${chapter}`);
  }
});
