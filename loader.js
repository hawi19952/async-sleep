import { readFile } from 'node:fs/promises';
const { paths } = JSON.parse(await readFile(new URL('./loader.paths.json', import.meta.url)));

export function resolve (specifier, context, defaultResolve) {
  const newSpecifier = getNewSpecifier(specifier);
  if (newSpecifier) {
    const { parentURL = null } = context;

    return {
      shortCircuit: true,
      url: parentURL ?
        new URL(newSpecifier, parentURL).href :
        new URL(newSpecifier).href
    };
  }

  return defaultResolve(specifier, context, defaultResolve);
}

function getNewSpecifier (specifier) {
  const aliases = Object.keys(paths);

  for (const alias of aliases) {
    if (specifier.startsWith(alias)) {
      const directoryPath = new URL(paths[alias], import.meta.url).href;
      return specifier.replace(alias, directoryPath);
    }
  }
}