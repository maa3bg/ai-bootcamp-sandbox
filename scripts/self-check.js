#!/usr/bin/env node
/**
 * self-check.js - Checks your result for a self-paced lab or track exercise.
 *
 * Usage:
 *   npm run check -- <lab>      e.g. npm run check -- lab1
 *   node scripts/self-check.js  (lists every available check)
 *
 * Dependency-free on purpose. Comparisons are made against BASE_REF (default: main, falling back to origin/main).
 *
 * Environment variables:
 *   SELF_CHECK_BASE   Git ref that holds the original training files (default: main)
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const ORIGINAL_AGENTS = ['reviewer.md', 'test-author.md', 'feature-builder.md'];
const SPEC_HEADINGS = ['GOAL', 'CONTEXT', 'CONSTRAINTS', 'ACCEPTANCE CRITERIA', 'VERIFY WITH'];
const MIN_NODE_MAJOR = 20;

let failures = 0;

function pass(message) { console.log(`[PASS] ${message}`); }
function fail(message, hint) {
  failures += 1;
  console.log(`[FAIL] ${message}`);
  if (hint) {
    console.log(`       ${hint}`);
  }
}
function warn(message) { console.log(`[WARN] ${message}`); }
function info(message) { console.log(`[INFO] ${message}`); }

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { cwd: ROOT, encoding: 'utf8', ...options });
  return { status: result.status, stdout: (result.stdout || '').trim(), error: result.error };
}

function git(...args) {
  return run('git', args);
}

function exists(relativePath) {
  return fs.existsSync(path.join(ROOT, relativePath));
}

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function resolveBase() {
  const candidates = [process.env.SELF_CHECK_BASE, 'main', 'origin/main'].filter(Boolean);
  return candidates.find((ref) => git('rev-parse', '--verify', '--quiet', ref).status === 0) || null;
}

function currentBranch() {
  return git('rev-parse', '--abbrev-ref', 'HEAD').stdout;
}

/** True when the checked-out branch is the base branch (also when the base is a remote ref such as origin/main). */
function onBase(base) {
  return currentBranch() === base.replace(/^origin\//, '');
}

/** True when the path is identical to the base ref (committed and uncommitted changes both count). */
function unchangedSince(base, relativePath) {
  return git('diff', '--quiet', base, '--', relativePath).status === 0;
}

function trackedChanges() {
  return git('status', '--porcelain', '--untracked-files=no').stdout;
}

/** Runs Jest with JSON output in the given folder; returns { passed, failed } or null when Jest cannot run. */
function runTests(cwd = ROOT) {
  const jestBin = path.join(cwd, 'node_modules', 'jest', 'bin', 'jest.js');
  if (!fs.existsSync(jestBin)) {
    return null;
  }
  const result = spawnSync(process.execPath, [jestBin, '--json', '--silent'], { cwd, encoding: 'utf8' });
  try {
    const report = JSON.parse(result.stdout);
    return { passed: report.numPassedTests, failed: report.numFailedTests };
  } catch {
    return null;
  }
}

function frontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match ? match[1] : null;
}

function isReadOnlyAgent(content) {
  const meta = frontmatter(content);
  if (!meta) {
    return { ok: false, reason: 'no frontmatter (the file must start with a --- block)' };
  }
  if (!/^description:\s*\S/m.test(meta)) {
    return { ok: false, reason: 'no description in the frontmatter' };
  }
  if (!/^\s+edit:\s*deny\s*$/m.test(meta)) {
    return { ok: false, reason: 'permission edit is not deny' };
  }
  if (!/^\s+bash:\s*deny\s*$/m.test(meta)) {
    return { ok: false, reason: 'permission bash is not deny' };
  }
  return { ok: true };
}

function checkAgentFile(relativePath) {
  if (!exists(relativePath)) {
    fail(`${relativePath} does not exist.`, 'Create it, then restart OpenCode and run: opencode agent list');
    return;
  }
  const verdict = isReadOnlyAgent(read(relativePath));
  if (verdict.ok) {
    pass(`${relativePath} is a read-only agent with a description.`);
  } else {
    fail(`${relativePath}: ${verdict.reason}.`, 'Compare with .opencode/agents/reviewer.md');
  }
}

function checkSpec(relativePath, minCriteria, extraSections = []) {
  if (!exists(relativePath)) {
    fail(`${relativePath} does not exist.`, 'Save your spec under exactly this name.');
    return;
  }
  const content = read(relativePath);
  const missing = [...SPEC_HEADINGS, ...extraSections]
    .filter((heading) => !new RegExp(`^##\\s+${heading}\\s*$`, 'm').test(content));
  if (missing.length > 0) {
    fail(`Spec is missing sections: ${missing.join(', ')}.`, 'Use level-2 headings, for example: ## GOAL');
  } else {
    pass('Spec has all required sections.');
  }
  if (/\bTODO\b/.test(content)) {
    fail('Spec still contains TODO.', 'Replace every TODO with a decision, or state it as out of scope.');
  } else {
    pass('No TODO left.');
  }
  const criteriaSection = content.split(/^##\s+ACCEPTANCE CRITERIA\s*$/m)[1] || '';
  const criteria = (criteriaSection.split(/^##\s/m)[0].match(/^\s*\d+\.\s/gm) || []).length;
  if (criteria >= minCriteria) {
    pass(`${criteria} numbered acceptance criteria (at least ${minCriteria} needed).`);
  } else {
    fail(`Only ${criteria} numbered acceptance criteria; at least ${minCriteria} needed.`, 'Number them: 1. 2. 3.');
  }
  const verifySection = content.split(/^##\s+VERIFY WITH\s*$/m)[1] || '';
  if (/npm test/.test(verifySection)) {
    pass('VERIFY WITH includes npm test.');
  } else {
    fail('VERIFY WITH does not include npm test.');
  }
}

function checkUnchanged(base, relativePath) {
  if (unchangedSince(base, relativePath)) {
    pass(`${relativePath} is unchanged.`);
  } else {
    fail(`${relativePath} was changed.`, `Restore it with: git checkout ${base} -- ${relativePath}`);
  }
}

function checkNoTrackedChanges() {
  const changes = trackedChanges();
  if (changes) {
    fail('Tracked files were changed:', changes.split('\n').join(', '));
  } else {
    pass('No tracked files were changed.');
  }
}

function sectionAfter(content, heading) {
  const parts = content.split(new RegExp(`^##\\s+${heading}\\s*$`, 'm'));
  return parts.length > 1 ? parts[1].split(/^##\s/m)[0] : null;
}

function checkBacklog(content) {
  const epics = (content.match(/^##\s+EPIC:/gm) || []).length;
  if (epics === 1) {
    pass('One EPIC.');
  } else {
    fail(`Found ${epics} EPIC headings; exactly one is needed.`, 'Use: ## EPIC: <title>');
  }
  const stories = content.split(/^###\s+STORY:/m).slice(1).map((part) => part.split(/^##\s/m)[0]);
  if (stories.length >= 3 && stories.length <= 6) {
    pass(`${stories.length} STORY blocks (3-6 needed).`);
  } else {
    fail(`Found ${stories.length} STORY blocks; 3-6 are needed.`, 'Use: ### STORY: <title>');
  }
  const incomplete = [];
  stories.forEach((story) => {
    const title = story.split('\n')[0].trim() || '(no title)';
    const missing = [];
    if (!/\bAs an?\b[\s\S]*\bso that\b/i.test(story)) {
      missing.push('no user-story sentence');
    }
    const criteria = ((story.split(/Acceptance criteria:?/i)[1] || '').split(/Sub-tasks:?/i)[0]
      .match(/^\s*\d+\.\s+\S/gm) || []).length;
    if (criteria < 2) {
      missing.push(`${criteria} acceptance criteria (2+ needed)`);
    }
    if (!/SUBTASK:/.test(story)) {
      missing.push('no sub-task');
    }
    if (missing.length > 0) {
      incomplete.push(`"${title}": ${missing.join(', ')}`);
    }
  });
  if (stories.length > 0 && incomplete.length === 0) {
    pass('Every story has a user-story sentence, 2+ acceptance criteria and a sub-task.');
  }
  incomplete.forEach((problem) => fail(`Story ${problem}.`));
  const outOfScope = sectionAfter(content, 'OUT OF SCOPE');
  if (outOfScope === null) {
    fail('No ## OUT OF SCOPE section.');
  } else {
    pass('OUT OF SCOPE section present.');
  }
  const questions = sectionAfter(content, 'OPEN QUESTIONS');
  const questionCount = questions ? (questions.match(/^\s*[-*]\s+\S/gm) || []).length : 0;
  if (questionCount >= 2) {
    pass(`${questionCount} open questions.`);
  } else {
    fail(`${questionCount} open question(s) found; at least 2 are needed under ## OPEN QUESTIONS.`);
  }
  const storyTitles = stories.map((story) => story.split('\n')[0]).join(' ');
  if (/monthly/i.test(outOfScope || '') || /monthly/i.test(storyTitles)) {
    pass('Monthly totals are handled on purpose.');
  } else {
    warn('Monthly totals are not mentioned in OUT OF SCOPE or in a story title. Did you decide on them?');
  }
  if (/\bTODO\b|<(title|role|capability|benefit)>/.test(content)) {
    fail('The file still contains TODO or template placeholders such as <title>.');
  }
}

const CHECKS = {
  lab0: {
    title: 'Lab 0: setup',
    run(base) {
      const major = Number(process.versions.node.split('.')[0]);
      if (major >= MIN_NODE_MAJOR) {
        pass(`Node.js ${process.versions.node}`);
      } else {
        fail(`Node.js ${process.versions.node} is too old; v${MIN_NODE_MAJOR}+ needed.`);
      }
      const opencode = run('opencode --version', [], { shell: true });
      if (opencode.status === 0) {
        pass(`OpenCode ${opencode.stdout.split('\n')[0]}`);
      } else {
        fail('OpenCode was not found.', 'Install it with: npm install -g opencode-ai (then open a new terminal)');
      }
      const tests = runTests();
      if (!tests) {
        fail('Jest is not installed.', 'Run: npm ci');
        return;
      }
      pass('Dependencies are installed.');
      if (tests.passed === 1 && tests.failed === 2) {
        pass('npm test: 1 passed, 2 failed. That is the expected starting point.');
      } else if (!onBase(base)) {
        info(`npm test: ${tests.passed} passed, ${tests.failed} failed (you are not on ${base}).`);
      } else {
        warn(`npm test: ${tests.passed} passed, ${tests.failed} failed. Expected 1 and 2: were the training bugs fixed?`);
      }
    },
  },
  lab1: {
    title: 'Lab 1: the agentic loop',
    run(base) {
      if (onBase(base)) {
        fail(`You are on ${base}.`, 'Do this lab on its own branch: git checkout -b lab-1');
      } else {
        pass(`Working on branch ${currentBranch()}.`);
      }
      checkUnchanged(base, 'tests/');
      checkUnchanged(base, 'data/team_metrics.csv');
      const tests = runTests();
      if (tests && tests.failed === 0) {
        pass(`npm test: ${tests.passed} passed. Prompt A is complete.`);
      } else if (tests) {
        info(`npm test: ${tests.failed} failing. Fine if you chose Prompt B; for Prompt A the fix is not done yet.`);
      } else {
        fail('Jest could not run.', 'Run: npm ci');
      }
    },
  },
  lab2: {
    title: 'Lab 2: spec-driven development',
    run() {
      checkSpec('tickets/practice/my-ticket-00-spec.md', 4);
    },
  },
  lab3: {
    title: 'Lab 3: custom agent with guardrails',
    run(base) {
      const folder = '.opencode/agents';
      const custom = fs.readdirSync(path.join(ROOT, folder))
        .filter((file) => file.endsWith('.md') && !ORIGINAL_AGENTS.includes(file));
      if (custom.length === 0) {
        fail('No new agent file found in .opencode/agents/.', 'Create one, for example .opencode/agents/spec-checker.md');
      }
      const readOnly = custom.filter((file) => isReadOnlyAgent(read(`${folder}/${file}`)).ok);
      custom.forEach((file) => {
        const verdict = isReadOnlyAgent(read(`${folder}/${file}`));
        if (verdict.ok) {
          pass(`${file} is a read-only agent with a description.`);
        } else {
          info(`${file}: ${verdict.reason}.`);
        }
      });
      if (custom.length > 0 && readOnly.length === 0) {
        fail('None of your agents has a description plus edit: deny and bash: deny.');
      }
      checkUnchanged(base, 'src/');
    },
  },
  lab4: {
    title: 'Lab 4: MCP and skills',
    run(base) {
      if (!onBase(base)) {
        warn(`You are on ${currentBranch()}, not ${base}. The BOOT-102 evidence depends on the training bugs.`);
      }
      checkNoTrackedChanges();
      info('The board itself cannot be checked from here: compare your final get_card output with the answer key.');
    },
  },
  lab5: {
    title: 'Lab 5: multi-agent orchestration',
    run(base) {
      ['plan.md', 'review.md'].forEach((file) => {
        const artifact = `.pipeline-runs/ticket-01/${file}`;
        if (exists(artifact)) {
          pass(`${artifact} exists.`);
        } else {
          fail(`${artifact} is missing.`, 'Run /ticket-to-pr TICKET-01 in OpenCode until it reaches the human gate.');
        }
      });
      const branch = 'feature/ticket-01';
      if (git('rev-parse', '--verify', '--quiet', branch).status !== 0) {
        info(`Branch ${branch} not found (fine if you already cleaned up after the gate).`);
      } else {
        const ahead = Number(git('rev-list', '--count', `${base}..${branch}`).stdout);
        if (ahead > 0) {
          pass(`${branch} has ${ahead} commit(s) ahead of ${base}.`);
        } else {
          info(`${branch} has no commits ahead of ${base}: either it was already merged, or the builder did not commit.`);
        }
        const changed = git('diff', '--name-only', `${base}...${branch}`).stdout.split('\n').filter(Boolean);
        const allowed = ['src/utils/filters.js', 'tests/filters.test.js'];
        const outside = changed.filter((file) => !allowed.includes(file));
        if (outside.length === 0) {
          pass('The pipeline changed only the files TICKET-01 allows.');
        } else {
          warn(`Files outside the ticket's constraints changed: ${outside.join(', ')}. Did you catch this at the gate?`);
        }
      }
      const worktree = path.join(ROOT, '.worktrees', 'ticket-01');
      if (fs.existsSync(worktree)) {
        const tests = runTests(worktree);
        if (tests && tests.failed === 0) {
          pass(`npm test in the worktree: ${tests.passed} passed.`);
        } else if (tests) {
          warn(`npm test in the worktree: ${tests.failed} failing. A "no" at the gate was the right call.`);
        }
      }
      checkNoTrackedChanges();
      if (exists('.pipeline-runs/ticket-01/run-log.md')) {
        info('run-log.md exists: you answered "no" at the gate. That is a valid outcome.');
      }
    },
  },
  'qa-01': {
    title: 'QA-01: edge-case hunt',
    run(base) {
      if (onBase(base)) {
        fail(`You are on ${base}.`, 'Do track exercises on their own branch: git checkout -b qa-01');
      }
      checkUnchanged(base, 'src/');
      if (unchangedSince(base, 'tests/filters.test.js')) {
        fail('No tests were added to tests/filters.test.js.');
      } else {
        const removed = git('diff', base, '--', 'tests/filters.test.js').stdout.split('\n')
          .filter((line) => line.startsWith('-') && !line.startsWith('---') && line.trim() !== '-');
        if (removed.length === 0) {
          pass('Tests were appended; no existing line was removed or changed.');
        } else {
          fail(`${removed.length} existing line(s) in tests/filters.test.js were removed or changed.`,
            'Only append tests. Existing assertions must stay as they are.');
        }
      }
      const tests = runTests();
      if (tests) {
        info(`npm test: ${tests.passed} passed, ${tests.failed} failed. Failing new tests are product bugs to report.`);
      }
    },
  },
  'dev-02': {
    title: 'DEV-02: path-scoped agent and slash command',
    run(base) {
      const agent = '.opencode/agents/docs-writer.md';
      if (!exists(agent)) {
        fail(`${agent} does not exist.`);
      } else {
        const meta = frontmatter(read(agent)) || '';
        if (/"?docs\/\*\*"?:\s*allow/.test(meta) && /^\s+bash:\s*deny\s*$/m.test(meta)) {
          pass('docs-writer may edit only docs/** and cannot run bash.');
        } else {
          fail('docs-writer needs edit "*": deny, "docs/**": allow, and bash: deny.');
        }
      }
      const command = '.opencode/commands/explain-file.md';
      if (!exists(command)) {
        fail(`${command} does not exist.`);
      } else if (/^agent:\s*reviewer\s*$/m.test(frontmatter(read(command)) || '')) {
        pass('/explain-file runs with the reviewer agent.');
      } else {
        fail('/explain-file must set agent: reviewer in its frontmatter.');
      }
      if (exists('docs/filters.md')) {
        pass('docs/filters.md exists.');
      } else {
        fail('docs/filters.md does not exist.', 'Ask docs-writer to create it.');
      }
      checkUnchanged(base, 'src/');
    },
  },
  'qa-02': {
    title: 'QA-02: data profiling',
    run(base) {
      checkAgentFile('.opencode/agents/data-profiler.md');
      checkUnchanged(base, 'data/team_metrics.csv');
    },
  },
  'po-01': {
    title: 'PO-01: from request to spec',
    run(base) {
      checkAgentFile('.opencode/agents/story-refiner.md');
      checkSpec('tickets/practice/po-01-my-spec.md', 5, ['DECISIONS']);
      checkUnchanged(base, 'src/');
    },
  },
  'po-02': {
    title: 'PO-02: board refinement with MCP',
    run() {
      checkNoTrackedChanges();
      info('The board itself cannot be checked from here: compare your final get_card output with the answer key.');
    },
  },
  'po-03': {
    title: 'PO-03: from a requirement to tickets',
    run(base) {
      const file = 'tickets/practice/po-03-my-backlog.md';
      if (exists(file)) {
        checkBacklog(read(file));
      } else {
        fail(`${file} does not exist.`, 'Save your breakdown under exactly this name.');
      }
      checkUnchanged(base, 'src/');
      checkUnchanged(base, 'data/');
      info('The board cannot be checked from here: compare list_cards and get_card on the epic with your file.');
    },
  },
  'coach-01': {
    title: 'COACH-01: sprint-health agent',
    run(base) {
      checkAgentFile('.opencode/agents/sprint-health.md');
      checkUnchanged(base, 'data/sprint-history.csv');
    },
  },
  'coach-02': {
    title: 'COACH-02: retro synthesis skill',
    run(base) {
      const skill = '.opencode/skills/retro-synthesis/SKILL.md';
      if (!exists(skill)) {
        fail(`${skill} does not exist.`, 'The folder name and the file name must match exactly.');
      } else {
        const meta = frontmatter(read(skill));
        if (!meta) {
          fail('SKILL.md has no frontmatter.', 'It must start with a --- block containing name and description.');
        } else {
          if (/^name:\s*retro-synthesis\s*$/m.test(meta)) {
            pass('name: retro-synthesis matches the folder name.');
          } else {
            fail('The name in the frontmatter must be exactly: retro-synthesis');
          }
          if (/^description:\s*\S/m.test(meta)) {
            pass('The skill has a description.');
          } else {
            fail('The skill has no description. Agents only see the description before loading a skill.');
          }
        }
      }
      checkUnchanged(base, 'data/retro-notes.md');
    },
  },
};

function main() {
  const name = (process.argv[2] || '').toLowerCase();
  if (!CHECKS[name]) {
    console.log('Usage: npm run check -- <name>\n\nAvailable checks:');
    Object.entries(CHECKS).forEach(([key, check]) => console.log(`  ${key.padEnd(9)} ${check.title}`));
    process.exitCode = name ? 1 : 0;
    return;
  }
  const base = resolveBase();
  if (!base) {
    console.log('[FAIL] Could not find the main branch to compare against. Set SELF_CHECK_BASE to its name.');
    process.exitCode = 1;
    return;
  }
  console.log(`=== ${CHECKS[name].title} ===`);
  CHECKS[name].run(base);
  console.log(failures === 0 ? '\nAll checks passed. Well done!' : `\n${failures} check(s) failed. See the hints above.`);
  process.exitCode = failures === 0 ? 0 : 1;
}

main();
