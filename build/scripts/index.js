import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { chdir } from 'process';

// @ts-ignore
const path_script = import.meta.dirname;
const path_build = path.join(path_script, '../');
const path_root = path.join(path_build, '../');
const path_src = path.join(path_root, 'src');
const path_dist_templates = path.join(path_build, 'templates');
const path_dist_template_npm = path.join(path_dist_templates, 'npm');
const path_dist_template_npm_types = path.join(path_dist_templates, 'npm-types');
const path_dist = path.join(path_root, 'dist');
const path_dist_npm = path.join(path_dist, 'npm');
const path_dist_npm_types = path.join(path_dist, 'npm-types');
const path_local_cdn = 'C:/inetpub/wwwroot/cdn/ps-ebnf';

/**
 * @param {string} source
 * @param {string} destination
 * @param {string} name
 */
function copyFile(source, destination, name)
{
    fs.copyFileSync(path.join(source, name), path.join(destination, name));
}

export function buildNpm()
{
    fs.rmSync(path_dist_npm, { recursive: true, force: true });
    fs.cpSync(path_src, path_dist_npm, { recursive: true });
    fs.copyFileSync(path.join(path_dist_template_npm, 'package.json'), path.join(path_dist_npm, 'package.json'));
}

export function buildNpmTypes()
{
    fs.rmSync(path_dist_npm_types, { recursive: true, force: true });
    fs.mkdirSync(path_dist_npm_types);
    execSync('npx -p typescript tsc ./src/index.js --declaration --allowJs --emitDeclarationOnly --outDir dist/npm-types');
    // fs.copyFileSync(path.join(path_src, 'types.d.ts'), path.join(path_dist_types, 'types.d.ts'));
    fs.copyFileSync(path.join(path_dist_template_npm_types, 'package.json'), path.join(path_dist_npm_types, 'package.json'));
}

export function packNpm()
{
    chdir(path_dist_npm);
    execSync('npm pack');
}

export function packNpmTypes()
{
    chdir(path_dist_npm_types);
    execSync('npm pack');
}

export function publishToLocalCdn()
{
    fs.rmSync(path_local_cdn, { recursive: true, force: true });
    fs.cpSync(path_dist_npm, path_local_cdn, { recursive: true });
}

export function all()
{
    buildNpm();
    buildNpmTypes();
    packNpm();
    packNpmTypes();
    publishToLocalCdn();
}