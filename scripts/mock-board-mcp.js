#!/usr/bin/env node
/**
 * Mock Jira/Trello MCP server for Module 2 (Exercise 2A) and the PO track exercises.
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
const CARD_TYPES = ['Epic', 'Story', 'Task', 'Sub-task'];
const DEFAULT_CARD_TYPE = 'Story';

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
    name: 'create_card',
    description: 'Create a new card in the To Do column: an Epic, Story, Task or Sub-task, optionally under a parent card. WRITE action: requires human approval.',
    annotations: { readOnlyHint: false, destructiveHint: false },
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        type: { type: 'string', enum: CARD_TYPES },
        parent: { type: 'string', description: 'ID of the parent card, e.g. BOOT-105. Required for a Sub-task.' },
        description: { type: 'string', description: 'What the card is about, including its acceptance criteria' },
        assignee: { type: 'string' },
      },
      required: ['title', 'type'],
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

function nextCardId() {
  const numbers = board.cards.map((card) => Number(card.id.split('-')[1])).filter(Number.isFinite);
  const prefix = board.cards.length > 0 ? board.cards[0].id.split('-')[0] : 'BOOT';
  return `${prefix}-${Math.max(100, ...numbers) + 1}`;
}

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
    .map(({ id, title, type, parent, status: cardStatus, assignee, linkedTicket }) => ({
      id, title, type: type || DEFAULT_CARD_TYPE, parent, status: cardStatus, assignee, linkedTicket,
    })),
  get_card: ({ id }) => ({
    ...findCard(id),
    children: board.cards.filter((card) => card.parent === id).map((card) => card.id),
  }),
  create_card: ({ title, type, parent, description = '', assignee = '' }) => {
    if (!title || !title.trim()) {
      throw new Error('Card title must not be empty.');
    }
    if (!CARD_TYPES.includes(type)) {
      throw new Error(`Invalid type "${type}". Valid types: ${CARD_TYPES.join(', ')}`);
    }
    if (type === 'Sub-task' && !parent) {
      throw new Error('A Sub-task needs a parent card (a Story or Task).');
    }
    if (type === 'Epic' && parent) {
      throw new Error('An Epic cannot have a parent card.');
    }
    if (parent) {
      const parentType = findCard(parent).type || DEFAULT_CARD_TYPE;
      if (parentType === 'Sub-task') {
        throw new Error(`Card "${parent}" is a Sub-task and cannot have children.`);
      }
    }
    const card = {
      id: nextCardId(),
      title: title.trim(),
      type,
      parent,
      status: board.statuses[0],
      assignee,
      linkedTicket: '',
      description,
      comments: [],
    };
    board.cards.push(card);
    return { id: card.id, type: card.type, parent: card.parent, status: card.status };
  },
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
