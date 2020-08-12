/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html

  SPDX-License-Identifier: EPL-2.0

  Copyright Contributors to the Zowe Project.
*/

import { exit } from 'process';
import fs from 'fs-extra';
import { convert } from './converter';
import path from 'path';
import { IBM1047_to_ISO8859_1 } from './charmap';

function help(): void {
  const prog = 'autoconv';
  console.log(`${prog} copies [input-dir] into [output-dir], detects files in IBM-1047 encoding, and converts them to ISO-8859-1 encoding.`);
  console.log(`Usage:`);
  console.log(`       ${prog} [input-dir] [output-dir]`);
}

async function main(): Promise<void> {
  if (process.argv.length !== 4) {
    help();
    exit(1);
  }
  const inputDir = process.argv[2];
  const outputDir = path.join(process.argv[3], path.basename(inputDir));
  try {
    console.log(`Copying files from ${inputDir} to ${outputDir}...`);
    await fs.copy(inputDir, outputDir);
    console.log(`Scanning files...`);
    await convert(outputDir);
    console.log(`Done.`);
  } catch (e) {
    console.error(e.message);
  }
}

const timTable = '000\\001\\002\\003\\234\\011\\206\\177\\227\\215\\216\\013\\014\\015\\016\\017\\020\\021\\022\\023\\235\\012\\010\\207\\030\\031\\222\\217\\034\\035\\036\\037\\200\\201\\202\\203\\204\\205\\027\\033\\210\\211\\212\\213\\214\\005\\006\\007\\220\\221\\026\\223\\224\\225\\226\\004\\230\\231\\232\\233\\024\\025\\236\\032\\040\\240\\342\\344\\340\\341\\343\\345\\347\\361\\242\\056\\074\\050\\053\\174\\046\\351\\352\\353\\350\\355\\356\\357\\354\\337\\041\\044\\052\\051\\073\\136\\055\\057\\302\\304\\300\\301\\303\\305\\307\\321\\246\\054\\045\\137\\076\\077\\370\\311\\312\\313\\310\\315\\316\\317\\314\\140\\072\\043\\100\\047\\075\\042\\330\\141\\142\\143\\144\\145\\146\\147\\150\\151\\253\\273\\360\\375\\376\\261\\260\\152\\153\\154\\155\\156\\157\\160\\161\\162\\252\\272\\346\\270\\306\\244\\265\\176\\163\\164\\165\\166\\167\\170\\171\\172\\241\\277\\320\\133\\336\\256\\254\\243\\245\\267\\251\\247\\266\\274\\275\\276\\335\\250\\257\\135\\264\\327\\173\\101\\102\\103\\104\\105\\106\\107\\110\\111\\255\\364\\366\\362\\363\\365\\175\\112\\113\\114\\115\\116\\117\\120\\121\\122\\271\\373\\374\\371\\372\\377\\134\\367\\123\\124\\125\\126\\127\\130\\131\\132\\262\\324\\326\\322\\323\\325\\060\\061\\062\\063\\064\\065\\066\\067\\070\\071\\263\\333\\334\\331\\332\\237';

const symbols = timTable.split('\\').map(v => parseInt(v, 8).toString(16));

const m: string[] = [];

IBM1047_to_ISO8859_1.forEach(v => m.push(Number(v).toString(16)));
for (let i = 0; i < m.length; i++) {
  if (m[i] !== symbols[i]) {
    console.log("i = %d rick %s tim %s", i.toString(16), m[i], symbols[i]);
  }
}
//console.log(m);
//console.log(symbols);

main();


/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html

  SPDX-License-Identifier: EPL-2.0

  Copyright Contributors to the Zowe Project.
*/
