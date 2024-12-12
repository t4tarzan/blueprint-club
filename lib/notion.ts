import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';

if (!process.env.NOTION_API_KEY) {
  throw new Error('Missing NOTION_API_KEY environment variable');
}

export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export const n2m = new NotionToMarkdown({ notionClient: notion });

export async function getDatabase(databaseId: string) {
  const response = await notion.databases.query({
    database_id: databaseId,
  });
  return response.results;
}

export async function getPage(pageId: string) {
  const response = await notion.pages.retrieve({ page_id: pageId });
  return response;
}

export async function getBlocks(blockId: string) {
  const blocks = [];
  let cursor;
  while (true) {
    const { results, next_cursor } = await notion.blocks.children.list({
      start_cursor: cursor,
      block_id: blockId,
    });
    blocks.push(...results);
    if (!next_cursor) {
      break;
    }
    cursor = next_cursor;
  }
  return blocks;
}

// Convert Notion page to markdown
export async function pageToMarkdown(pageId: string) {
  const mdblocks = await n2m.pageToMarkdown(pageId);
  const mdString = n2m.toMarkdownString(mdblocks);
  return mdString;
}
