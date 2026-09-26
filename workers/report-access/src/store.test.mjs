import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import test from 'node:test';
import { AccessStore } from './store.mjs';

function store() {
  const db = new DatabaseSync(':memory:');
  return new AccessStore({ exec(query, ...args) {
    const statement = db.prepare(query);
    return { toArray: () => statement.all(...args), ...(/^SELECT/.test(query) ? {} : statement.run(...args)) };
  }});
}
const now = 1_800_000_000_000;
test('requires confirmed email delivery and permits only one successful verification', () => {
  const s=store(); s.issue('a','hash',now);
  assert.equal(s.verify('a','hash','visitor@gmail.com',now),'expired');
  s.delivered('a');
  assert.equal(s.verify('a','wrong','visitor@gmail.com',now),'incorrect');
  assert.equal(s.verify('a','hash','visitor@gmail.com',now),'verified');
  assert.equal(s.verify('a','hash','visitor@gmail.com',now),'expired');
});
test('failed sends and expired challenges cannot unlock', () => {
  const s=store();s.issue('a','hash',now);s.delivered('a');
  assert.equal(s.verify('a','hash','x@company.com',now+600000),'expired');
  s.issue('b','hash',now+600000);s.failed('b');
  assert.equal(s.verify('b','hash','x@company.com',now+600000),'expired');
});
test('locks after five incorrect attempts', () => {
  const s=store();s.issue('a','hash',now);s.delivered('a');
  for(let i=0;i<5;i++)assert.equal(s.verify('a','wrong','x@company.com',now),'incorrect');
  assert.equal(s.verify('a','hash','x@company.com',now),'locked');
});
test('resend enforces cooldown and invalidates the old code', () => {
  const s=store();s.issue('a','hash',now);s.delivered('a');
  assert.equal(s.issue('b','new',now+59999),null);
  assert.ok(s.issue('b','new',now+60000));s.delivered('b');
  assert.equal(s.verify('a','hash','x@company.com',now+60000),'expired');
  assert.equal(s.verify('b','new','x@company.com',now+60000),'verified');
});
test('persists the send limit for the whole window', () => {
  const s=store();for(let i=0;i<5;i++)assert.ok(s.issue(String(i),'hash',now+i*60000));
  assert.equal(s.issue('six','hash',now+300000),null);
  assert.ok(s.issue('reset','hash',now+900000));
});
test('cleanup preserves verified lead while removing expired codes', () => {
  const s=store();s.issue('a','hash',now);s.delivered('a');s.verify('a','hash','visitor@gmail.com',now);
  s.cleanup(now+1000000);
  assert.equal(s.sql.exec('SELECT * FROM challenge').toArray().length,0);
  assert.equal(s.sql.exec('SELECT * FROM lead').toArray()[0].domain,'gmail.com');
});
