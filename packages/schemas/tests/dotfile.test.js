'use strict';

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildDotfileDoc, dotfileUrl, WORKSPACE_DOTFILES_REPO, DOTFILE_FEATURE } from '@augmentd-labs/canvas-schemas';

test('a bare entry path resolves against the workspace repo', () => {
    assert.equal(dotfileUrl('shell/bashrc'), 'workspace:dotfiles#shell/bashrc');
    assert.equal(dotfileUrl('/shell/bashrc/'), 'workspace:dotfiles#shell/bashrc');
    assert.equal(WORKSPACE_DOTFILES_REPO, 'workspace:dotfiles');
    assert.equal(buildDotfileDoc('shell/bashrc').data.url, 'workspace:dotfiles#shell/bashrc');
});

test('a full identity URI is passed through untouched', () => {
    const url = 'git+ssh://git@github.com/me/dotfiles#shell/bashrc';
    assert.equal(buildDotfileDoc(url).data.url, url);
    assert.equal(buildDotfileDoc('workspace:dotfiles#vim/vimrc').data.url, 'workspace:dotfiles#vim/vimrc');
});

test('type is the schema leaf, not a data field — the engine rejects the base id', () => {
    assert.equal(buildDotfileDoc('shell/bashrc').schema, 'data/schema/dotfile/file');
    assert.equal(buildDotfileDoc('shell/bashrc', { type: 'file' }).schema, 'data/schema/dotfile/file');
    assert.equal(buildDotfileDoc('cfg/nvim', { type: 'folder' }).schema, 'data/schema/dotfile/folder');
    assert.equal('type' in buildDotfileDoc('x/y', { type: 'folder' }).data, false);
    assert.throws(() => buildDotfileDoc('x/y', { type: 'symlink' }), /Invalid dotfile type/);
    // The base id is what gets asserted as a feature, so a query finds both leaves.
    assert.equal(DOTFILE_FEATURE, 'data/schema/dotfile');
});

test('per-device links map deviceId to local path', () => {
    const doc = buildDotfileDoc('shell/bashrc', {
        type: 'file',
        links: { devA: '$HOME/.bashrc', devB: '/root/.bashrc' }
    });
    assert.deepEqual(doc, {
        schema: 'data/schema/dotfile/file',
        schemaVersion: '3.0',
        data: {
            url: 'workspace:dotfiles#shell/bashrc',
            links: { devA: '$HOME/.bashrc', devB: '/root/.bashrc' }
        }
    });
});

test('tags land in data.tags and metadata.features; empty inputs are dropped', () => {
    const doc = buildDotfileDoc('vim/vimrc', { tags: 'editor', priority: 0, links: {} });
    assert.deepEqual(doc.data.tags, ['editor']);
    assert.deepEqual(doc.metadata, { features: ['tag/editor'] });
    assert.equal(doc.data.priority, 0);
    assert.equal('links' in doc.data, false);
    assert.throws(() => buildDotfileDoc(''), /requires a url/);
});
