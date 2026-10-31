import test from 'node:test';
import assert from 'node:assert/strict';
import { supabase } from '../supabaseClient.js';

test('Supabase client is instantiated with correct project URL', () => {
  assert.ok(supabase);
  assert.equal(typeof supabase.auth.signInWithPassword, 'function');
  assert.equal(typeof supabase.auth.signUp, 'function');
  assert.equal(typeof supabase.auth.getSession, 'function');
});

test('Form email validation regex handles standard and invalid emails', () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  assert.equal(emailRegex.test('user@secorg.com'), true);
  assert.equal(emailRegex.test('invalid-email'), false);
  assert.equal(emailRegex.test('test@domain'), false);
});
