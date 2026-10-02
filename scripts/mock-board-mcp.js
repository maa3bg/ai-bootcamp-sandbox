#!/usr/bin/env node
/**
 * Mock Jira/Trello MCP server for Module 2 (Exercise 2A).
 *
 * A dependency-free Model Context Protocol server speaking JSON-RPC 2.0 over stdio
 * (one JSON message per line). The board is loaded from a seed file and all changes
 * are kept in memory only, so the exercise can be repeated by restarting the server.
 *
 * Environment variables:
 *   MOCK_BOARD_FILE  Path to the seed board JSON (default: data/mock-board.json)
 */
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const SERVER_INFO = { name: 'mock-board', version: '1.0.0' };
const DEFAULT_PROTOCOL_VERSION = '2025-06-18';
const BOARD_FILE = process.env.MOCK_BOARD_FILE
  ? path.resolve(process.env.MOCK_BOARD_FILE)
  : path.join(__dirname, '..', 'data', 'mock-board.json');

const board = JSON.parse(fs.readFileSync(BOARD_FILE, 'utf8'));

const TOOLS = [
  {
    name: 'list_cards',
    description: 'List all cards on the board, optionally filtered by status. Read-only.',
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: 'object',
      properties: { status: { type: 'string', enum: board.statuses } },
    },
  },
  {
    name: 'get_card',
    description: 'Get the full details and comments of a single card. Read-only.',
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'string', description: 'Card ID, e.g. BOOT-102' } },
      required: ['id'],
    },
  },
  {
    name: 'update_card_status',
    description: 'Move a card to another status column. WRITE action: requires human approval.',
    annotations: { readOnlyHint: false, destructiveHint: false },
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        status: { type: 'string', enum: board.statuses },
      },
      required: ['id', 'status'],
    },
  },
  {
    name: 'add_comment',
    description: 'Append a comment to a card. WRITE action: requires human approval.',
    annotations: { readOnlyHint: false, destructiveHint: false },
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        author: { type: 'string', description: 'Who is commenting (e.g. the agent name)' },
        text: { type: 'string' },
      },
      required: ['id', 'text'],
    },
  },
];

function findCard(id) {
  const card = board.cards.find((candidate) => candidate.id === id);
  if (!card) {
    throw new Error(`Card "${id}" not found. Known cards: ${board.cards.map((c) => c.id).join(', ')}`);
  }
  return card;
}

const handlers = {
  list_cards: ({ status } = {}) => board.cards
    .filter((card) => !status || card.status === status)
    .map(({ id, title, status: cardStatus, assignee, linkedTicket }) => ({
      id, title, status: cardStatus, assignee, linkedTicket,
    })),
  get_card: ({ id }) => findCard(id),
  update_card_status: ({ id, status }) => {
    if (!board.statuses.includes(status)) {
      throw new Error(`Invalid status "${status}". Valid statuses: ${board.statuses.join(', ')}`);
    }
    const card = findCard(id);
    const previous = card.status;
    card.status = status;
    return { id, previousStatus: previous, status };
  },
  add_comment: ({ id, author = 'agent', text }) => {
    if (!text || !text.trim()) {
      throw new Error('Comment text must not be empty.');
    }
    const card = findCard(id);
    card.comments.push({ author, text });
    return { id, comments: card.comments.length };
  },
};

function send(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

function handleRequest({ method, params = {} }) {
  switch (method) {
    case 'initialize':
      return {
        protocolVersion: params.protocolVersion || DEFAULT_PROTOCOL_VERSION,
        capabilities: { tools: {} },
        serverInfo: SERVER_INFO,
      };
    case 'ping':
      return {};
    case 'tools/list':
      return { tools: TOOLS };
    case 'tools/call': {
      const handler = handlers[params.name];
      if (!handler) {
        const error = new Error(`Unknown tool: ${params.name}`);
        error.code = -32602;
        throw error;
      }
      try {
        const result = handler(params.arguments || {});
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      } catch (toolError) {
        // Tool failures are reported to the model as results, not protocol errors.
        return { content: [{ type: 'text', text: toolError.message }], isError: true };
      }
    }
    default: {
      const error = new Error(`Method not found: ${method}`);
      error.code = -32601;
      throw error;
    }
  }
}

const input = readline.createInterface({ input: process.stdin });

input.on('line', (line) => {
  if (!line.trim()) {
    return;
  }
  let message;
  try {
    message = JSON.parse(line);
  } catch {
    send({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } });
    return;
  }
  // Notifications (no id) such as notifications/initialized need no response.
  if (message.id === undefined || message.id === null) {
    return;
  }
  try {
    send({ jsonrpc: '2.0', id: message.id, result: handleRequest(message) });
  } catch (error) {
    send({ jsonrpc: '2.0', id: message.id, error: { code: error.code || -32603, message: error.message } });
  }
});

process.stderr.write(`[mock-board] MCP server ready (board: ${BOARD_FILE})\n`);
