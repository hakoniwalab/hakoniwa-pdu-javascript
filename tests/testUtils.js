import fs from 'fs';
import path from 'path';

export function createCompactPdudefFixture(baseDir, prefix, robots, pdutypes) {
    const tempDirPath = fs.mkdtempSync(path.join(baseDir, prefix));
    const pdudefPath = path.join(tempDirPath, 'pdudef.json');
    const pdutypesPath = path.join(tempDirPath, 'pdutypes.json');

    const pdudef = {
        paths: [
            { id: 'default', path: 'pdutypes.json' },
        ],
        robots: robots.map((name) => ({ name, pdutypes_id: 'default' })),
    };

    fs.writeFileSync(pdutypesPath, JSON.stringify(pdutypes));
    fs.writeFileSync(pdudefPath, JSON.stringify(pdudef));

    return {
        tempDirPath,
        pdudefPath,
        pdutypesPath,
        cleanup() {
            fs.rmSync(tempDirPath, { recursive: true, force: true });
        },
    };
}
