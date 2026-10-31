import test from 'node:test';
import assert from 'node:assert/strict';
import { checkSupabaseConnection, saveScanToSupabase, submitThreatReportToSupabase } from './supabaseService.js';
import { analyzeUrlThreat } from '../utils/scannerLogic.js';

test('checkSupabaseConnection returns active Supabase endpoint', async () => {
  const status = await checkSupabaseConnection();
  assert.equal(status.connected, true);
  assert.ok(status.endpoint.includes('supabase.co'));
});

test('saveScanToSupabase creates a valid database record object', async () => {
  const scanResult = analyzeUrlThreat('https://paypal-security-update.xyz');
  const record = await saveScanToSupabase(scanResult);
  assert.ok(record);
  assert.equal(record?.domain, 'paypal-security-update.xyz');
  assert.equal(record?.status, scanResult.status);
});

test('submitThreatReportToSupabase handles report submission', async () => {
  const res = await submitThreatReportToSupabase({
    url: 'http://fake-chase-bank.net',
    threatType: 'Banking Phish',
    description: 'Deceptive credential harvesting portal targeting Chase customers.',
    reporterEmail: 'analyst@secorg.com',
  });
  assert.equal(res.success, true);
  assert.ok(res.message);
});
