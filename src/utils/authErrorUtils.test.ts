import test from 'node:test';
import assert from 'node:assert/strict';
import { formatAuthError, getPasswordStrength } from './authErrorUtils.js';

test('formatAuthError correctly identifies rate limit error', () => {
  const err = formatAuthError({ message: 'email rate limit exceeded', status: 429 });
  assert.equal(err.isRateLimit, true);
  assert.equal(err.userMessage, 'A verification request was recently issued. Please wait a few minutes before requesting another email.');
});

test('formatAuthError handles unconfirmed email message', () => {
  const err = formatAuthError({ message: 'Email not confirmed' });
  assert.equal(err.isUnconfirmedEmail, true);
  assert.equal(err.userMessage, 'Your email address has not been confirmed yet. Please check your inbox for the confirmation link.');
});

test('formatAuthError handles invalid credentials', () => {
  const err = formatAuthError({ message: 'Invalid login credentials' });
  assert.equal(err.userMessage, 'Invalid email address or password. Please verify your credentials and try again.');
});

test('getPasswordStrength calculates score correctly', () => {
  assert.equal(getPasswordStrength('12345').label, 'Weak');
  assert.equal(getPasswordStrength('Password123!').label, 'Strong');
});
