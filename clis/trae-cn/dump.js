import { makeDumpCommand } from '../_shared/desktop-commands.js';

export const dumpCommand = makeDumpCommand('trae-cn', {
  example: 'TOYCLI_CDP_ENDPOINT=http://127.0.0.1:39240 TOYCLI_CDP_TARGET=talk toycli trae-cn dump -f json',
});
