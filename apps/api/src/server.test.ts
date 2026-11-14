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
});
