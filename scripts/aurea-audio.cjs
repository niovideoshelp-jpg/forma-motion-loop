// AUREA: deterministic 22-second editorial mix from verified licensed sources.
// Missing sources are downloaded to the ignored raw/lume cache. No raw audio is published.
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { spawnSync } = require('child_process');
const root = path.resolve(__dirname, '..');
process.chdir(root);
const sr = 48000, channels = 2, duration = 22, count = sr * duration;
const rate = 120 / 124, preroll = 1, head = sr, opening = 3.3;
const offset = 15.478 - opening * rate;
const output = 'public/assets/aurea-mix.wav';
const docs = 'docs/aurea';
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'aurea-audio-'));
const smooth = x => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
const db = x => 20 * Math.log10(Math.max(1e-12, x));
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const reproductionRequirements = 'Node.js 18+, ffmpeg and ffprobe on PATH. Missing MP3 sources are fetched from the five official Mixkit URLs into ignored raw/lume; existing files are preserved and every source is SHA-256 verified.';
const reproductionNote = 'Reproduce with `node scripts/aurea-audio.cjs`. Requires Node.js 18+, ffmpeg and ffprobe. The script downloads only missing sources from the official URLs recorded in audio-sources.json into the ignored raw/lume cache, rejects HTTP errors, non-audio data and SHA-256 mismatches, and preserves existing sources. Run `node scripts/aurea-audio.cjs --sources-only` to prepare/verify the cache without rewriting the final WAV. No raw sources are copied into public assets or documentation.';
function loadProvenance() { return JSON.parse(fs.readFileSync(`${docs}/audio-sources.json`, 'utf8')); }
async function ensureSources() {
  const provenance = loadProvenance();
  const expected = new Map([
    ['raw/lume/deep-urban.mp3', 'https://assets.mixkit.co/music/623/623.mp3'],
    ['raw/lume/select-click.mp3', 'https://assets.mixkit.co/active_storage/sfx/1109/1109-preview.mp3'],
    ['raw/lume/option-select.mp3', 'https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3'],
    ['raw/lume/page-chime.mp3', 'https://assets.mixkit.co/active_storage/sfx/1107/1107-preview.mp3'],
    ['raw/lume/air-whoosh.mp3', 'https://assets.mixkit.co/active_storage/sfx/2605/2605-preview.mp3'],
  ]);
  const sources = [provenance.selection, ...provenance.effects];
  if(sources.length !== expected.size || new Set(sources.map(s=>s.local)).size !== expected.size) throw Error('Expected exactly five distinct recorded sources');
  fs.mkdirSync('raw/lume', { recursive: true });
  for(const source of sources) {
    if(expected.get(source.local) !== source.url || !/^[a-f0-9]{64}$/.test(source.sha256)) throw Error(`Unexpected source ledger entry: ${source.local}`);
    const cached = fs.existsSync(source.local);
    let candidate = source.local;
    if(!cached) {
      const response = await fetch(source.url, { signal: AbortSignal.timeout(60000), redirect: 'error' });
      if(!response.ok) throw Error(`${source.local}: HTTP ${response.status}`);
      const type = (response.headers.get('content-type') || '').split(';')[0].toLowerCase();
      if(!type.startsWith('audio/') && type !== 'application/octet-stream') throw Error(`${source.local}: non-audio HTTP content type ${type}`);
      const maximum = 32 * 1024 * 1024;
      if(Number(response.headers.get('content-length')) > maximum) throw Error('Unexpectedly large source download');
      const chunks=[]; let size=0;
      for await(const chunk of response.body) {
        size += chunk.length;
        if(size > maximum) throw Error('Source download exceeded 32 MiB');
        chunks.push(chunk);
      }
      const bytes=Buffer.concat(chunks);
      if(bytes.length < 1024 || sha(bytes) !== source.sha256) throw Error(`${source.local}: downloaded source SHA-256 mismatch`);
      candidate=path.join(temp,path.basename(source.local));
      fs.writeFileSync(candidate,bytes);
    }
    if(sha(fs.readFileSync(candidate)) !== source.sha256) throw Error(`${source.local}: cached source SHA-256 mismatch; existing file preserved`);
    const probe=JSON.parse(run('ffprobe',['-v','error','-show_streams','-show_format','-of','json',candidate]).stdout.toString());
    if(!probe.streams.some(s=>s.codec_type==='audio' && s.codec_name==='mp3') || !Number.isFinite(Number(probe.format.duration)) || Number(probe.format.duration)<=0) throw Error(`${source.local}: expected valid MP3 audio`);
    if(!cached) fs.copyFileSync(candidate,source.local,fs.constants.COPYFILE_EXCL);
    console.log(`${cached?'Verified cached':'Downloaded and verified'} ${source.local}`);
  }
}
let inputNumber = 0;
function run(bin, args, input) {
  // File-backed PCM avoids a Windows pipe EOF when atrim closes before all input.
  if (input) {
    const inputPath = path.join(temp, `input-${inputNumber++}.f32`);
    fs.writeFileSync(inputPath, input);
    args = args.map(arg => arg === 'pipe:0' ? inputPath : arg);
  }
  const r = spawnSync(bin, args, { maxBuffer: 128 * 1024 * 1024 });
  if (r.error || r.status !== 0) throw r.error || Error(r.stderr.toString());
  return r;
}
const ff = (args, input) => run('ffmpeg', ['-hide_banner', '-loglevel', 'info', '-y', ...args], input);
const pcmArgs = (n = 2) => ['-f', 'f32le', '-ar', String(sr), '-ac', String(n), '-i', 'pipe:0'];
const buf = floats => Buffer.from(floats.buffer, floats.byteOffset, floats.byteLength);
const floats = b => { const result = new Float32Array(b.length / 4); for (let i = 0; i < result.length; i++) result[i] = b.readFloatLE(i * 4); return result; };
const filter = (x, fx, n = 2) => floats(ff([...pcmArgs(n), '-af', fx, '-ar', String(sr), '-ac', String(n), '-f', 'f32le', 'pipe:1'], buf(x)).stdout);
function measure(file) {
  const text = ff(['-i', file, '-af', 'loudnorm=I=-14:TP=-1:LRA=11:print_format=json', '-f', 'null', '-']).stderr.toString();
  const parsed = JSON.parse(text.match(/\{[\s\S]*\}/)[0]);
  for (const key of ['input_i', 'input_tp', 'input_lra']) if (!Number.isFinite(Number(parsed[key]))) throw Error(`Invalid loudness ${key}`);
  return parsed;
}
function wav(name, x) { const p = path.join(temp, name); ff([...pcmArgs(), '-c:a', 'pcm_f32le', p], buf(x)); return p; }
function rms(x, start, end) { let sum = 0; const a = Math.round(start * sr) * 2, b = Math.round(end * sr) * 2; for(let i=a;i<b;i++)sum+=x[i]*x[i]; return Math.sqrt(sum/(b-a)); }
function main() {
  fs.mkdirSync(docs, { recursive: true });
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const provenance = loadProvenance();
  const sources = [provenance.selection, ...provenance.effects];
  for (const source of sources) {
    if (!fs.existsSync(source.local)) throw Error(`Required local source missing: ${source.local}`);
    if (sha(fs.readFileSync(source.local)) !== source.sha256) throw Error(`Source hash changed: ${source.local}`);
  }
  const unprocessed = floats(ff(['-i', provenance.selection.local, '-af', `atrim=start=${offset-preroll*rate},asetpts=PTS-STARTPTS,atempo=${rate},atrim=duration=${duration+preroll}`, '-ar', String(sr), '-ac', '2', '-f', 'f32le', 'pipe:1']).stdout);
  const musicEq = 'highpass=f=45:p=2,bass=g=-4:f=150:w=0.7,treble=g=-1.5:f=4000:w=0.7,lowpass=f=9500:p=2';
  const full = filter(unprocessed, musicEq);
  const low = filter(full, 'lowpass=f=1050:p=2');
  if(full.length < (head+count)*2)throw Error('Insufficient music source');
  const music = new Float32Array(count*2);
  const musicGain = 0.52;
  for(let i=0;i<count;i++){
    const t=i/sr, open=smooth((t-3.14)/0.16), close=smooth((t-20.3)/1.15);
    const air=0.10+0.90*open*(1-close), level=0.74+0.26*open*(1-close);
    for(let c=0;c<2;c++)music[i*2+c]=musicGain*level*(full[(head+i)*2+c]*air+low[(head+i)*2+c]*(1-air));
  }
  // The tail approaches the real samples BEFORE the opening, not replayed opening samples.
  const seamFrames=Math.round(sr*0.5);
  for(let j=0;j<seamFrames;j++){
    const w=smooth(j/(seamFrames-1)), i=count-seamFrames+j;
    for(let c=0;c<2;c++){
      const k=(head-seamFrames+j)*2+c;
      const pre=musicGain*0.74*(full[k]*0.10+low[k]*0.90);
      music[i*2+c]=music[i*2+c]*(1-w)+pre*w;
    }
  }
  const mixed=new Float32Array(music), effects=new Float32Array(music.length);
  const specs=[
    ['hover',0.35,'option-select',0.012,'soft interface hover'],
    ['click',3.3,'select-click',0.037,'opening selection'],
    ['look-change',5.8,'air-whoosh',0.028,'dress change'],
    ['selection',8.3,'select-click',0.028,'detail selection'],
    ['detail',9.3,'air-whoosh',0.017,'fabric close-up'],
    ['whatsapp',12.3,'select-click',0.032,'contact CTA press; no message or order confirmation'],
    ['signature',16.3,'page-chime',0.015,'quiet brand signature; not a notification'],
    ['return',20.3,'air-whoosh',0.019,'return transition'],
  ];
  const cues=[];
  for(const [name,time,source,gain,meaning]of specs){
    const isAir=source==='air-whoosh', isChime=source==='page-chime';
    const fx=`highpass=f=${isAir?260:180}:p=2,lowpass=f=${isAir?4800:isChime?5200:3800}:p=2`;
    const data=floats(ff(['-i',`raw/lume/${source}.mp3`,'-af',fx,'-ac','1','-ar',String(sr),'-f','f32le','pipe:1']).stdout);
    let peak=0;for(let i=1;i<data.length;i++)if(Math.abs(data[i])>Math.abs(data[peak]))peak=i;
    const before=isAir?0.12:0.06, after=isAir?0.23:isChime?0.40:0.13;
    const from=Math.max(0,peak-Math.round(before*sr)),to=Math.min(data.length,peak+Math.round(after*sr));
    const shift=Math.round(time*sr)-peak;
    let actualPeak=0,actualSample=0;
    for(let i=from;i<to;i++){
      const j=i+shift;if(j<0||j>=count)continue;
      const envelope=smooth((i-from)/(sr*0.008))*smooth((to-1-i)/(sr*0.045));
      const value=data[i]*gain*envelope;
      if(Math.abs(value)>actualPeak){actualPeak=Math.abs(value);actualSample=j;}
      for(let c=0;c<2;c++){mixed[j*2+c]+=value;effects[j*2+c]+=value;}
    }
    cues.push({name,meaning,source,targetPeakSeconds:time,measuredPeakSeconds:actualSample/sr,deltaMs:1000*(actualSample/sr-time),sourceFilteredPeakSeconds:peak/sr,gainLinear:gain,gainDb:db(gain),peakBeforeMasterDbfs:db(actualPeak),startSeconds:(from+shift)/sr,endSeconds:(to+shift)/sr,filter:fx});
  }
  let master=new Float32Array(mixed), masterMethod='constant gain';
  const original=measure(wav('unmastered.wav',master));
  let before=original, gainDb=-14-Number(before.input_i);
  if(Number(before.input_tp)+gainDb > -1.15){
    // A warmed limiter is only used if measured crest factor requires it.
    const repeated=new Float32Array(master.length*3);for(let n=0;n<3;n++)repeated.set(master,n*master.length);
    master=filter(repeated,`loudnorm=I=-14:TP=-2:LRA=11,atrim=start=${duration}:duration=${duration},asetpts=PTS-STARTPTS`);
    masterMethod='loudnorm on three repeated cycles, retained middle cycle, then constant gain';
    before=measure(wav('center-cycle.wav',master));
    gainDb=Math.min(-14-Number(before.input_i),-1.15-Number(before.input_tp));
  }
  const masterGain=10**(gainDb/20);
  ff([...pcmArgs(),'-af',`volume=${gainDb}dB,atrim=end_sample=${count}`,'-ar',String(sr),'-ac','2','-c:a','pcm_s24le',output],buf(master));
  const final=measure(output);
  const decoded=floats(ff(['-i',output,'-ar',String(sr),'-ac','2','-f','f32le','pipe:1']).stdout);
  const probe=JSON.parse(run('ffprobe',['-v','error','-show_streams','-show_format','-of','json',output]).stdout.toString());
  const audio=probe.streams.find(s=>s.codec_type==='audio');
  if(decoded.length!==count*2||audio.sample_rate!=='48000'||audio.channels!==2||Number(probe.format.duration)!==22)throw Error('Wrong audio format or duration');
  if(Number(final.input_tp)>-1||Math.abs(Number(final.input_i)+14)>0.2)throw Error('Final loudness outside target');
  if(cues.some(c=>Math.abs(c.deltaMs)>1000/sr))throw Error('SFX transient not aligned to cue');
  for(const cue of cues){
    cue.finalStaticGainDb=gainDb;
    cue.finalEffectiveGainLinear=masterMethod==='constant gain'?cue.gainLinear*masterGain:null;
    cue.finalIsolatedPeakDbfs=masterMethod==='constant gain'?cue.peakBeforeMasterDbfs+gainDb:null;
    cue.gainNote=masterMethod==='constant gain'?'Exact linear contribution; no dynamic master gain.':'Cue input gain is exact; dynamic master prevents an exact isolated output gain claim.';
    let peak=0;for(let i=Math.round(cue.startSeconds*sr)*2;i<Math.round(cue.endSeconds*sr)*2;i++)peak=Math.max(peak,Math.abs(decoded[i]));
    cue.finalMixWindowPeakDbfs=db(peak);
  }
  const steps=[0,1].map(c=>Math.abs(decoded[c]-decoded[decoded.length-2+c]));
  let sumSteps=0,maxLocal=0,nSteps=0;
  for(const [a,b]of[[0,Math.round(sr*.02)],[count-Math.round(sr*.02),count-1]])for(let i=a;i<b;i++)for(let c=0;c<2;c++){const d=Math.abs(decoded[(i+1)*2+c]-decoded[i*2+c]);sumSteps+=d*d;maxLocal=Math.max(maxLocal,d);nSteps++;}
  const seam={method:'True 0.5-second pre-roll crossfade; 44 beats at 120 BPM',boundaryStep:steps,boundaryStepDbfs:steps.map(db),localMaximumAdjacentStep:maxLocal,localRmsAdjacentStep:Math.sqrt(sumSteps/nSteps),boundaryWithinLocalMaximum:Math.max(...steps)<=maxLocal};
  if(!seam.boundaryWithinLocalMaximum)throw Error('Loop boundary exceeds neighboring sample changes');
  const bandComparison=[];
  for(const [name,fx]of[['bass45to180Hz','highpass=f=45,lowpass=f=180'],['upper4to10kHz','highpass=f=4000,lowpass=f=10000']]){
    const beforeBand=filter(unprocessed,fx),afterBand=filter(full,fx);
    const beforeDb=db(rms(beforeBand,4,20)),afterDb=db(rms(afterBand,4,20));
    bandComparison.push({band:name,beforeEqRmsDbfs:beforeDb,afterEqRmsDbfs:afterDb,changeDb:afterDb-beforeDb,scope:'Same music segment, before automation or mastering'});
  }
  const musicalAttacks=[3.3,5.8,8.3,9.3,12.3,16.3,20.3].map(time=>{
    let best={strength:-Infinity,time:null};
    for(let i=Math.round((time-.04)*sr);i<=Math.round((time+.04)*sr);i+=120){
      let now=0,previous=0;
      for(let j=0;j<240;j++)for(let c=0;c<2;c++){now+=full[(head+i-j)*2+c]**2;previous+=full[(head+i-240-j)*2+c]**2;}
      const strength=Math.sqrt(now/480)-Math.sqrt(previous/480);
      if(strength>best.strength)best={strength,time:i/sr};
    }
    return {targetSeconds:time,measuredAttackSeconds:best.time,deltaMs:1000*(best.time-time),method:'Strongest 5 ms RMS rise in the EQ music within +/-40 ms; excludes SFX'};
  });
  if(musicalAttacks.some(a=>Math.abs(a.deltaMs)>25))throw Error('Musical attack alignment exceeded 25 ms');
  const reports={output,sha256:sha(fs.readFileSync(output)),duration,sampleRate:sr,channels,samplesPerChannel:count,bpm:120,sourceBpm:124,rate,offset,openingSeconds:opening,musicEq,musicGain,cues,musicalAttacks,bandComparison,master:{method:masterMethod,original,beforeConstantGain:before,constantGainDb:gainDb,final},seam,levels:{introRmsDbfs:db(rms(decoded,.6,2.6)),bodyRmsDbfs:db(rms(decoded,4,6)),sfxInputRmsDbfs:db(rms(effects,0,22))},qa:{exactSampleCount:true,loudnessPassed:true,truePeakPassed:true,allEightCuePeaksAligned:true,cuePeakMeasurementScope:'Filtered and enveloped isolated effects before dynamic mastering; target placement is sample-exact',musicalAttacksWithin25ms:true,loopSampleStepPassed:true,subjectiveListeningPerformed:false}};
  fs.writeFileSync(`${docs}/audio-cues.json`,JSON.stringify(reports,null,2)+'\n');
  const ledger={verifiedOn:'2026-10-04',selection:{...provenance.selection,reason:'Existing instrumental bed, retimed to 120 BPM; reduced bass and high frequencies for AUREA editorial styling.'},effects:provenance.effects,licenseVerification:{music:'https://mixkit.co/license/modal/musicFree/',effects:'https://mixkit.co/license/modal/sfxFree/',index:'https://mixkit.co/license/',summary:'Official licenses checked in this task: music permits social video and online advertising; effects have a separate free license. Sources are incorporated into the film, not redistributed as a sound library.'},distribution:{sourceDownloadsCopied:false,rawAudioInDocs:false,embeddedMix:output,sha256:reports.sha256},reproduce:'node scripts/aurea-audio.cjs',requirements:'Existing verified MP3 sources in raw/lume, ffmpeg and ffprobe on PATH.'};
  ledger.requirements=reproductionRequirements;
  ledger.prepareSources='node scripts/aurea-audio.cjs --sources-only';
  ledger.cachePolicy='Download only missing official source files. Validate HTTP status, audio type, MP3 stream and SHA-256. Preserve existing files; reject mismatches without replacing them.';
  fs.writeFileSync(`${docs}/audio-sources.json`,JSON.stringify(ledger,null,2)+'\n');
  fs.writeFileSync(`${docs}/audio-review.md`,[
    '# AUREA audio review','',
    `The 22-second mix measures ${final.input_i} LUFS integrated and ${final.input_tp} dBTP. It contains exactly ${count} stereo sample frames at 48 kHz in 24-bit PCM.`, '',
    'Deep Urban by Eugenio Mininni is reused from the verified local Mixkit source. Bass is reduced by 4 dB around 150 Hz, sub-bass below 45 Hz is removed, and upper frequencies are softened. The introduction opens from 3.14 to 3.30 seconds. These are intentional editorial changes, not a diagnosis of a defective source.', '',
    'Eight filtered effects are placed by their measured transient peaks. The hover is quieter than all primary clicks; fabric and return sweeps are short. The brand chime is an editorial accent and does not imply a received WhatsApp message or completed order. Cue gains and measured peak positions are in audio-cues.json.', '',
    `Mastering: ${masterMethod}; final constant gain ${gainDb.toFixed(3)} dB. Loop closure uses actual pre-roll and preserves beat phase. Its boundary sample steps remain within adjacent changes measured near the seam.`, '',
    'Checks completed: source SHA-256, exact duration/sample count, sample rate/channels, integrated loudness, true peak, eight isolated cue peak positions and seam sample continuity. This is measured QA; no subjective listening claim is made. The final AAC/MP4 must be measured separately.', '',
    '[Music source](https://mixkit.co/free-stock-music/house/) · [Interface effects](https://mixkit.co/free-sound-effects/interface/) · [Whoosh effects](https://mixkit.co/free-sound-effects/woosh/) · [Music license](https://mixkit.co/license/modal/musicFree/) · [SFX license](https://mixkit.co/license/modal/sfxFree/)', '',
    reproductionNote,''
  ].join('\n'));
  console.log(JSON.stringify({output,sha256:reports.sha256,LUFS:final.input_i,dBTP:final.input_tp,masterMethod,seam,cuePeakErrorsMs:cues.map(c=>c.deltaMs)},null,2));
}
async function start() {
  try {
    await ensureSources();
    if(process.argv.includes('--sources-only')) console.log('Five sources verified. Final mix was not rewritten.');
    else main();
  } finally {
    const resolved=path.resolve(temp), parent=path.resolve(os.tmpdir());
    if(path.dirname(resolved)!==parent||!path.basename(resolved).startsWith('aurea-audio-'))throw Error('Unexpected temporary cleanup target');
    fs.rmSync(resolved,{recursive:true,force:true});
  }
}
start().catch(error=>{console.error(error);process.exitCode=1;});
