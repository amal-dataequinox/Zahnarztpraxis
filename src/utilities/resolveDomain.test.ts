import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { resolveDomain, sanitizeHostname } from './resolveDomain.ts'

describe('sanitizeHostname', () => {
  it('strips port and lowercases', () => {
    assert.equal(sanitizeHostname('Appenzell.Localhost:3000'), 'appenzell.localhost')
  })

  it('rejects empty and invalid values', () => {
    assert.equal(sanitizeHostname(null), null)
    assert.equal(sanitizeHostname(''), null)
    assert.equal(sanitizeHostname('not a host'), null)
    assert.equal(sanitizeHostname('http://evil.example'), null)
  })
})

describe('resolveDomain', () => {
  it('maps production domains to the correct location', () => {
    assert.equal(resolveDomain('zahnarztpraxis-palatty.ch'), 'appenzell')
    assert.equal(resolveDomain('www.zahnarztpraxis-palatty.ch'), 'appenzell')
    assert.equal(resolveDomain('zahnarzt-palatty.ch'), 'gais')
    assert.equal(resolveDomain('www.zahnarzt-palatty.ch'), 'gais')
  })

  it('maps local development hostnames', () => {
    assert.equal(resolveDomain('appenzell.localhost:3000'), 'appenzell')
    assert.equal(resolveDomain('gais.localhost:3000'), 'gais')
  })

  it('falls back for bare localhost when DEFAULT_LOCATION_SLUG is set', () => {
    const previous = process.env.DEFAULT_LOCATION_SLUG
    process.env.DEFAULT_LOCATION_SLUG = 'appenzell'
    assert.equal(resolveDomain('localhost:3000'), 'appenzell')
    process.env.DEFAULT_LOCATION_SLUG = previous
  })

  it('returns null for unknown domains', () => {
    assert.equal(resolveDomain('evil.example'), null)
    assert.equal(resolveDomain('not-a-domain'), null)
  })
})
