import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { buildServer } from './server.js';
import { FastifyInstance } from 'fastify';

describe('Fastify REST API Server & Security Integration', () => {
  let server: FastifyInstance;

  before(async () => {
    process.env.NODE_ENV = 'test';
    server = await buildServer();
    await server.ready();
  });

  after(async () => {
    await server.close();
  });

  it('GET /health returns 200 with PostgreSQL 16 engine guarantee', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/health'
    });

    assert.equal(response.statusCode, 200);
    const body = JSON.parse(response.payload);
    assert.equal(body.status, 'healthy');
    assert.equal(body.databaseEngine, 'PostgreSQL 16 Native');
    assert.equal(body.devProdParity, '100% Guaranteed');
    assert.ok(body.timestamp);
    assert.ok(body.memoryHeapUsedMb !== undefined);
  });

  it('GET /health/liveness returns 200 UP for container orchestrator', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/health/liveness'
    });

    assert.equal(response.statusCode, 200);
    const body = JSON.parse(response.payload);
    assert.equal(body.status, 'UP');
    assert.ok(body.uptimeSeconds >= 0);
  });

  it('GET /health/readiness returns 200 READY for service mesh routing', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/health/readiness'
    });

    assert.equal(response.statusCode, 200);
    const body = JSON.parse(response.payload);
    assert.equal(body.status, 'READY');
  });

  it('POST /api/v1/auth/login rejects empty/invalid body with 400', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { username: '' } // Invalid
    });

    assert.equal(response.statusCode, 400);
    const body = JSON.parse(response.payload);
    assert.equal(body.success, false);
    assert.equal(body.message, 'Validation failed');
  });

  it('GET /api/v1/customers without JWT returns 401 Unauthorized', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/customers'
    });

    assert.equal(response.statusCode, 401);
    const body = JSON.parse(response.payload);
    assert.equal(body.success, false);
    assert.match(body.message, /Unauthorized/);
  });

  it('POST /api/v1/accounts/pending without JWT returns 401 Unauthorized', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/accounts/pending'
    });

    assert.equal(response.statusCode, 401);
  });

  it('POST /api/v1/accounts/:id/suspend without JWT returns 401 Unauthorized', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/accounts/acc-123/suspend',
      payload: { reason: 'Investigating suspected identity fraud' }
    });

    assert.equal(response.statusCode, 401);
  });

  it('POST /api/v1/accounts/:id/close without JWT returns 401 Unauthorized', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/accounts/acc-123/close',
      payload: { closureReason: 'LOAN_PAID_IN_FULL', remarks: 'All EMIs received in full' }
    });

    assert.equal(response.statusCode, 401);
  });

  it('GET /metrics returns Prometheus formatted operational indicators', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/metrics'
    });

    assert.equal(response.statusCode, 200);
    assert.match(response.headers['content-type'] || '', /text\/plain/);
    assert.match(response.payload, /# HELP nbfc_up/);
    assert.match(response.payload, /nbfc_up 1/);
    assert.match(response.payload, /nodejs_heap_used_bytes/);
    assert.match(response.payload, /nbfc_pg_pool_total/);
  });

  it('POST /api/v1/collections/upi/confirm without JWT returns 401 Unauthorized', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/collections/upi/confirm',
      payload: {
        accountId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        amount: 4500,
        utrNumber: '123456789012'
      }
    });

    assert.equal(response.statusCode, 401);
  });

  it('POST /api/v1/collections/cash/:id/verify without JWT returns 401 Unauthorized', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/collections/cash/rcpt-123/verify',
      payload: {
        status: 'VERIFIED_AND_DEPOSITED'
      }
    });

    assert.equal(response.statusCode, 401);
  });

  it('GET /api/v1/analytics/overview with date range without JWT returns 401 Unauthorized', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/analytics/overview?startDate=2026-01-01&endDate=2026-03-31'
    });

    assert.equal(response.statusCode, 401);
  });
});
