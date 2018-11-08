//run node test/LargeFileCreator.js to create the file
const fs = require('fs');
const file = fs.createWriteStream('./largefile.txt');
let txt=`access, adduser, audit, bin, bugs, c, cache, ci, cit,
completion, config, create, ddp, dedupe, deprecate,
dist-tag, docs, doctor, edit, explore, get, help,
help-search, hook, i, init, install, install-test, it, link,
list, ln, login, logout, ls, outdated, owner, pack, ping,
prefix, profile, prune, publish, rb, rebuild, repo, restart,
root, run, run-script, s, se, search, set, shrinkwrap, star,
stars, start, stop, t, team, test, token, tst, un,
uninstall, unpublish, unstar, up, update, v, version, view,
whoami
\n`;
for(let i=0; i<= 1e6; i++) {
  file.write(txt);
}

file.end();