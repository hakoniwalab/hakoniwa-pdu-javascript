import { createServer } from 'node:http';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { extname, isAbsolute, join, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const fixture = resolve(root, 'tests/fixtures/vite-browser');
const output = await mkdtemp(join(tmpdir(), 'hako-pdu-vite-'));

async function filesUnder(directory) {
    const files = [];
    for (const entry of await readdir(directory, { withFileTypes: true })) {
        const path = join(directory, entry.name);
        if (entry.isDirectory()) {
            files.push(...await filesUnder(path));
        } else {
            files.push(path);
        }
    }
    return files;
}

try {
    const vite = resolve(root, 'node_modules/vite/bin/vite.js');
    const result = spawnSync(
        process.execPath,
        [vite, 'build', fixture, '--outDir', output, '--emptyOutDir'],
        { cwd: root, encoding: 'utf8' },
    );
    if (result.status !== 0) {
        process.stderr.write(result.stdout);
        process.stderr.write(result.stderr);
        throw new Error(`Vite contract build failed with status ${result.status}`);
    }

    const files = await filesUnder(output);
    const stringChunks = files.filter((path) =>
        extname(path) === '.js' && path.includes('pdu_cdr_conv_String-')
    );
    if (stringChunks.length === 0) {
        throw new Error('Vite did not emit the std_msgs/String CDR converter chunk');
    }

    const server = createServer(async (request, response) => {
        try {
            const pathname = new URL(request.url, 'http://127.0.0.1').pathname;
            const path = resolve(output, `.${pathname}`);
            const relativePath = relative(output, path);
            if (relativePath.startsWith('..') || isAbsolute(relativePath)) {
                response.writeHead(403).end();
                return;
            }
            response.writeHead(200, { 'content-type': 'text/javascript' });
            response.end(await readFile(path));
        } catch {
            response.writeHead(404).end();
        }
    });
    await new Promise((resolveListen) => server.listen(0, '127.0.0.1', resolveListen));
    try {
        const address = server.address();
        const asset = stringChunks[0].slice(output.length).replaceAll('\\', '/');
        const response = await fetch(`http://127.0.0.1:${address.port}${asset}`);
        if (!response.ok || (await response.arrayBuffer()).byteLength === 0) {
            throw new Error(`Generated converter chunk is not statically servable: HTTP ${response.status}`);
        }
    } finally {
        await new Promise((resolveClose, reject) =>
            server.close((error) => error ? reject(error) : resolveClose())
        );
    }

    console.log('Vite browser converter contract: PASS');
} finally {
    await rm(output, { recursive: true, force: true });
}
