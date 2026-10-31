import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeUrl, calculateEntropy, analyzeUrlThreat } from './scannerLogic.js';

test('normalizeUrl handles standard domain and adds https protocol', () => {
  const res = normalizeUrl('google.com');
  assert.equal(res.hostname, 'google.com');
  assert.equal(res.protocol, 'https');
  assert.equal(res.isHttps, true);
  assert.equal(res.isIpAddress, false);
});

test('normalizeUrl detects raw IP address', () => {
  const res = normalizeUrl('http://192.168.1.1/admin');
  assert.equal(res.hostname, '192.168.1.1');
  assert.equal(res.isIpAddress, true);
  assert.equal(res.isHttps, false);
});

test('normalizeUrl throws on empty input', () => {
  assert.throws(() => normalizeUrl(''), /Please enter a website URL/);
});

test('calculateEntropy returns expected range', () => {
  const lowEntropy = calculateEntropy('aaaaaa');
  const highEntropy = calculateEntropy('8fa3b7c9e0123');
  assert.ok(lowEntropy < 1.0);
  assert.ok(highEntropy > 3.0);
});

test('analyzeUrlThreat classifies trusted domains as SAFE', () => {
  const res = analyzeUrlThreat('https://www.google.com');
  assert.equal(res.status, 'SAFE');
  assert.ok(res.trustScore >= 90);
  assert.ok(res.riskScore <= 10);
  assert.equal(res.telemetry.brandImpersonated, null);
});

test('analyzeUrlThreat flags brand impersonation and typosquatting as DANGEROUS', () => {
  const res = analyzeUrlThreat('http://paypa1-security-update-login.xyz/verify');
  assert.equal(res.status, 'DANGEROUS');
  assert.ok(res.riskScore >= 60);
  assert.ok(res.telemetry.brandImpersonated !== null);
  assert.ok(res.signals.length >= 2);
});

test('analyzeUrlThreat detects high-risk TLD and multiple hyphens', () => {
  const res = analyzeUrlThreat('https://secure-banking-verification-center.top');
  assert.ok(res.status === 'SUSPICIOUS' || res.status === 'DANGEROUS');
  assert.ok(res.signals.some(s => s.id.includes('risky-tld')));
});
