import type { BlockContent } from "@/sanity.types";

type Block = BlockContent[number];

function isTextBlock(
  block: Block,
): block is Extract<Block, { _type: "block" }> {
  return block._type === "block";
}

function blockPlainText(block: Extract<Block, { _type: "block" }>): string {
  return (block.children ?? [])
    .map((child) => child.text ?? "")
    .join("")
    .trim();
}

/**
 * Splits the first normal-style paragraph out of a Portable Text array, so it
 * can be used as a lesson subtitle without also appearing in the rendered body.
 */
export function splitLeadParagraph(notes: BlockContent | null | undefined): {
  lead: string | null;
  body: BlockContent;
} {
  if (!notes || notes.length === 0) return { lead: null, body: [] };

  const leadIndex = notes.findIndex(
    (block) => isTextBlock(block) && block.style === "normal",
  );

  if (leadIndex === -1) return { lead: null, body: notes };

  const leadBlock = notes[leadIndex] as Extract<Block, { _type: "block" }>;
  const body = [...notes.slice(0, leadIndex), ...notes.slice(leadIndex + 1)];

  return { lead: blockPlainText(leadBlock), body };
}
