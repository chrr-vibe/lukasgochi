// 미니게임 코드(MG/MG2/MG3/MG4/MG5) — 미니게임 수정 작업이 아니면 열지 말 것
const MG=(()=>{
  const CFG={combo:10,timeLimit:40000,perfect:80,good:150,speed:50,holdRate:.28,gapMin:520,gapMax:1250};
  const LINE_Y=ROOM_Y+74, LX={L:30,R:98};
  const r=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(x|0,y|0,w|0,h|0);};
  const bmp=(rows,x,y,pal)=>rows.forEach((row,j)=>{for(let i=0;i<row.length;i++){const c=pal[row[i]];if(c){ctx.fillStyle=c;ctx.fillRect((x|0)+i,(y|0)+j,1,1);}}});
  const HEART=['.KK.KK.','KPPKPPK','KPWPPPK','KPPPPPK','.KPPPK.','..KPK..','...K...'], HP={K:'#5a1030',P:'#ff4f8f',W:'#ffd6e8'};
  const POISON=['..KKK..','..KCK..','.KKKKK.','KGGGGGK','KGWGWGK','KGGWGGK','KGWGWGK','KGGGGGK','.KKKKK.'], PP={K:'#22102e',C:'#c9a24a',G:'#9b5cff',W:'#e8ddff'};
  const BUG=['.Y...Y.','..YYY..','.YRYRY.','YYYYYYY','Y.YYY.Y','Y.....Y'], BP={Y:'#ffd23f',R:'#ff4f6d'};
  const BUG2=['..C.C..','.CCCCC.','CCWCWCC','CCCCCCC','.C.C.C.'], BP2={C:'#5ec8f2',W:'#ffffff'};
  const F={A:'010101111101101',B:'110101110101110',C:'011100100100011',D:'110101101101110',E:'111100110100111',F:'111100110100100',G:'011100101101011',I:'111010010010111',K:'101101110101101',L:'100100100100111',M:'101111111101101',N:'110101101101101',O:'010101101101010',P:'110101110100100',R:'110101110101101',S:'011100010001110',T:'111010010010010',U:'101101101101111',Y:'101101010010010',H:'101101111101101',X:'101101010101101',' ':'000000000000000','!':'010010010000010',':':'000010000010000',
    '0':'111101101101111','1':'010110010010111','2':'110001010100111','3':'110001010001110','4':'101101111001001','5':'111100110001110','6':'011100111101111','7':'111001010010010','8':'111101111101111','9':'111101111001110'};
  const text=(s,x,y,col,k=1)=>{s=String(s).toUpperCase();ctx.fillStyle=col;for(let n=0;n<s.length;n++){const g=F[s[n]]||F[' '];for(let q=0;q<15;q++)if(g[q]==='1')ctx.fillRect(x+(n*4+(q%3))*k,y+((q/3)|0)*k,k,k);}};
  const textC=(s,cx,y,col,k=1)=>text(s,Math.round(cx-((String(s).length*4-1)*k)/2),y,col,k);
  const stars=[...Array(46)].map((_,i)=>({x:Math.random()*W,y:Math.random()*ROOM_H,s:[8,16,30][i%3],c:['#6f7bd8','#c9d2ff','#ffffff','#ffd6f0','#9ff0ff'][i%5]}));
  let s=null;
  function chart(){const n=[];let t=1400;while(t<CFG.timeLimit+3000){const lane=Math.random()<.5?'L':'R',hold=Math.random()<CFG.holdRate?450+Math.random()*650:0;
    n.push({lane,t,hold,state:'wait'});t+=hold+CFG.gapMin+Math.random()*(CFG.gapMax-CFG.gapMin);}return n;}
  const EXIT=['GGGGGGGGG','GGGGGGWWG','GGGWWWWWG','GGWGWWGGG','GGGGWWWGG','GGGWGGGWG','GGWGGGGWG','GWGGGGGGG','GGGGGGGGG'], EP={G:'#1fae5a',W:'#ffffff'};   // 비상구 픽토그램 (플레로마)
  const lamps=[14,64,114];
  function start(onEnd,theme){s={t0:performance.now(),now:0,notes:chart(),combo:0,best:0,fx:[],pops:[],held:{L:false,R:false},flash:{L:0,R:0},phase:'play',endT:0,onEnd,theme:theme||''};
    beep(660,.08);setTimeout(()=>beep(990,.1),160);closeMenu();}
  const spd=()=>CFG.speed*(1+Math.min(s.combo,10)*.03);
  const yOf=t=>LINE_Y-(t-s.now)*spd()/1000;
  function pop(txt,lane,c){s.pops.push({txt,lane,c,t:s.now});}
  function burst(lane,k){for(let i=0;i<k;i++){const a=Math.random()*6.28,v=20+Math.random()*40;s.fx.push({x:LX[lane],y:LINE_Y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-10,t:s.now,c:lane==='L'?'#ff8fbf':'#c9a4ff'});}}
  function good(n){n.state='done';s.combo++;s.best=Math.max(s.best,s.combo);if(s.combo>=CFG.combo)finish(true);}
  function miss(n,lane){n.state='miss';if(s.combo>0)pop('BREAK',lane,'#ff6b8a');else pop('MISS',lane,'#ff6b8a');s.combo=0;beep(180,.12,'sawtooth',.04);}
  function finish(ok){if(s.phase!=='play')return;s.phase=ok?'clear':'fail';s.endT=s.now;
    if(ok)[1320,1568,1760,2093].forEach((f,i)=>setTimeout(()=>beep(f,.12,'square',.05),i*110));else[440,330,220].forEach((f,i)=>setTimeout(()=>beep(f,.16,'triangle',.06),i*150));
    setTimeout(()=>{const cb=s&&s.onEnd;s=null;cb&&cb(ok);},1700);}
  function press(lane){if(!s)return;s.held[lane]=true;s.flash[lane]=s.now;if(s.phase!=='play')return;
    let b=null,bd=1e9;for(const n of s.notes){if(n.lane!==lane||n.state!=='wait')continue;const d=Math.abs(s.now-n.t);if(d<bd){bd=d;b=n;}if(n.t-s.now>400)break;}
    if(b&&bd<=CFG.good){const p=bd<=CFG.perfect;pop(p?'PERFECT':'GOOD',lane,p?'#fff36b':'#9ff0ff');burst(lane,p?14:9);beep(lane==='L'?1320:990,.06,'square',.05);
      if(b.hold)b.state='holding';else good(b);} else beep(330,.03,'square',.02);}
  function release(lane){if(!s)return;s.held[lane]=false;
    for(const n of s.notes)if(n.lane===lane&&n.state==='holding'){if(s.now<n.t+n.hold-CFG.good)miss(n,lane);else{good(n);pop('OK',lane,'#fff36b');burst(lane,10);}}}
  function update(now){if(!s)return;s.now=now-s.t0;if(s.phase!=='play')return;
    for(const n of s.notes){if(n.state==='wait'&&s.now-n.t>CFG.good)miss(n,n.lane);else if(n.state==='holding'&&s.now>=n.t+n.hold){good(n);pop('OK',n.lane,'#fff36b');burst(n.lane,10);beep(1760,.06);}}
    if(s&&s.phase==='play'&&s.now>CFG.timeLimit+1200)finish(false);}
  function draw(){if(!s)return;
    const pl=s.theme==='pleroma';
    if(pl){   // 어두운 골목 + 가로등
      r(0,ROOM_Y,W,ROOM_H,'#0d0c16');
      for(let j=0;j<ROOM_H;j+=5)for(let i=((j/5)%2?4:0);i<W;i+=8){r(i,ROOM_Y+j,7,4,'#1a1824');}
      for(const lx of lamps){const fl=((s.now/90+lx)|0)%23?1:.5;ctx.fillStyle='rgba(255,226,140,'+(.13*fl)+')';ctx.beginPath();ctx.moveTo(lx-3,ROOM_Y+7);ctx.lineTo(lx+3,ROOM_Y+7);ctx.lineTo(lx+16,ROOM_Y+ROOM_H);ctx.lineTo(lx-16,ROOM_Y+ROOM_H);ctx.closePath();ctx.fill();
        r(lx-1,ROOM_Y,2,5,'#3a3846');r(lx-4,ROOM_Y+4,8,2,'#3a3846');r(lx-3,ROOM_Y+6,6,1,fl<1?'#a08850':'#ffe28c');}
    } else {
    r(0,ROOM_Y,W,ROOM_H,'#06061a');
    for(const p of stars){const y=ROOM_Y+((p.y+s.now/1000*p.s)%ROOM_H);if(((s.now/250+p.x)|0)%7)r(p.x,y,1,p.s>20?2:1,p.c);}
    const bx=Math.sin(s.now/900)*10;for(let i=0;i<5;i++)bmp(i%2?BUG2:BUG,22+i*18+bx,ROOM_Y+3+(i%2)*2+((s.now/300|0)%2),i%2?BP2:BP);
    }
    for(const l of ['L','R']){r(LX[l]-8,ROOM_Y+12,17,ROOM_H-12,pl?'rgba(60,220,120,.08)':l==='L'?'rgba(255,90,160,.10)':'rgba(150,100,255,.10)');r(LX[l]-9,ROOM_Y+12,1,ROOM_H-12,'rgba(255,255,255,.12)');r(LX[l]+9,ROOM_Y+12,1,ROOM_H-12,'rgba(255,255,255,.12)');}
    r(0,LINE_Y-1,W,3,'rgba(255,60,80,.35)');r(0,LINE_Y,W,1,'#ff3b4f');
    for(const l of ['L','R']){const on=s.held[l]||s.now-s.flash[l]<90;if(pl)bmp(EXIT,LX[l]-4,LINE_Y-4,on?EP:{G:'rgba(255,255,255,.18)',W:'rgba(255,255,255,.5)'});else bmp(l==='L'?HEART:POISON,LX[l]-3,LINE_Y-4-(l==='L'?0:1),on?(l==='L'?HP:PP):{K:'rgba(255,255,255,.35)'});}
    for(const n of s.notes){if(n.state==='done'||n.state==='miss')continue;const yh=yOf(n.t);if(yh<ROOM_Y-30)break;const x=LX[n.lane];
      if(n.hold){const yt=Math.max(ROOM_Y+12,yOf(n.t+n.hold)),yb=n.state==='holding'?LINE_Y:yh;if(yb>yt){r(x-2,yt,5,yb-yt,pl?'#3fd47a':n.lane==='L'?'#ff8fbf':'#b48cff');r(x-1,yt,1,yb-yt,'rgba(255,255,255,.6)');for(let y=yt;y<yb;y+=4)r(x-2,y,5,1,'rgba(0,0,0,.25)');r(x-3,yt-1,7,2,pl?'#1fae5a':n.lane==='L'?'#ff4f8f':'#9b5cff');}}
      const yy=n.state==='holding'?LINE_Y:yh;if(yy>ROOM_Y+8){if(pl)bmp(EXIT,x-4,yy-4,EP);else bmp(n.lane==='L'?HEART:POISON,x-3,yy-4,n.lane==='L'?HP:PP);}}
    s.fx=s.fx.filter(p=>s.now-p.t<500);for(const p of s.fx){const k=(s.now-p.t)/1000;r(p.x+p.vx*k,p.y+p.vy*k+40*k*k,1,1,p.c);}
    s.pops=s.pops.filter(p=>s.now-p.t<600);for(const p of s.pops){const k=(s.now-p.t)/600;textC(p.txt,LX[p.lane],LINE_Y-16-k*8,p.c);}
    if(s.combo>=1&&s.phase==='play'){textC(s.combo+' COMBO',64,ROOM_Y+15,s.combo>=7?'#fff36b':'#ffffff');}
    r(0,ROOM_Y+ROOM_H-9,W,9,'rgba(6,6,26,.85)');
    for(let i=0;i<CFG.combo;i++)r(4+i*6,ROOM_Y+ROOM_H-6,4,3,i<s.combo?'#ff4f8f':'#3a2f5a');
    const left=Math.max(0,CFG.timeLimit+1200-s.now),sec=Math.ceil(left/1000);
    text(Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0'),106,ROOM_Y+ROOM_H-7,sec<=20&&((s.now/300|0)%2)?'#ff6b8a':'#9ff0ff');
    if(s.now<700)textC('READY',64,ROOM_Y+38,'#fff36b',2);else if(s.now<1200)textC('GO!',64,ROOM_Y+38,'#9ff0ff',2);
    if(s.phase!=='play'){const k=Math.min(1,(s.now-s.endT)/400);r(0,ROOM_Y+30,W,22*k,'rgba(6,6,26,.75)');
      if(k>=1&&pl&&s.phase==='clear'){ctx.font='bold 10px sans-serif';ctx.textAlign='center';ctx.fillStyle='#9ff0b0';ctx.fillText('플레로마를 소탕했다.',64,ROOM_Y+45);ctx.textAlign='start';}
      else if(k>=1)textC(s.phase==='clear'?'CLEAR!':'TIME UP',64,ROOM_Y+35,s.phase==='clear'?'#fff36b':'#ff6b8a',s.phase==='clear'?3:2);}
  }
  return {start,press,release,update,draw,active:()=>!!s,kit:{r,bmp,text,textC,HEART,HP,POISON,PP,EXIT,EP,lamps}};
})();
// 플레로마 잡기 (명성 최대 + 니콜라우스): 갤러그식. 왼/오 완드 이동, 가운데 꾹 누르면 레이저(그 줄 전부 소멸). 1분 버티기, 하트 5개
const MG3=(()=>{
  const {r,bmp,text,textC,HEART,HP,POISON,PP,EXIT,EP,lamps}=MG.kit;
  const CFG={time:60000,lives:5,maxLives:5,wandSpd:78,laserW:6,stick:700,spawn0:1150,spawn1:520,fall0:16,fall1:30};
  const BOT=ROOM_Y+ROOM_H-10, WY=BOT-10;   // 하단선 / 완드 위치
  const WAND=['..Y..','.YWY.','..Y..','..B..','..B..','..B..','..B..'], WP={Y:'#ffe066',W:'#ffffff',B:'#8a5a2b'};
  const KIND=[['poison',5],['exit',4],['heart',1]], KIND_RUSH=[['poison',5],['exit',4],['heart',2]];   // 비중 5:4:1 / 피버타임: 하트 2배
  let s=null;
  const pickKind=rush=>{const K=rush?KIND_RUSH:KIND;let x=Math.random()*K.reduce((a,[,w])=>a+w,0);for(const [k,w] of K){if((x-=w)<0)return k;}return 'poison';};
  function start(onEnd,rush=5000){s={rush,t0:performance.now(),last:performance.now(),now:0,x:W/2,held:{L:false,R:false},shots:[],objs:[],fx:[],pops:[],lives:CFG.lives,nextSpawn:1500,laser:false,hum:0,phase:'play',endT:0,hurt:-9999,onEnd};
    beep(660,.08);setTimeout(()=>beep(990,.1),160);closeMenu();}
  function move(l,on){if(!s)return;if(on&&!s.held[l]&&s.phase==='play')s.x=Math.max(4,Math.min(W-4,s.x+(l==='L'?-4:4)));s.held[l]=on;}   // 톡 눌러도 조금은 움직이게
  function fire(on=true){if(!s)return;s.laser=on;if(on){s.laserUntil=s.now+CFG.stick;if(s.phase==='play')beep(1760,.04,'square',.03);}}   // 가운데 버튼: 누르는 동안 레이저 (살짝 눌러도 0.7초는 유지)
  function burst(x,y,c,k){for(let i=0;i<k;i++){const a=Math.random()*6.28,v=15+Math.random()*35;s.fx.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,t:s.now,c});}}
  function pop(txt,x,y,c){s.pops.push({txt,x,y,c,t:s.now});}
  function finish(ok){if(s.phase!=='play')return;s.phase=ok?'clear':'fail';s.endT=s.now;
    if(ok)[1320,1568,1760,2093].forEach((f,i)=>setTimeout(()=>beep(f,.12,'square',.05),i*110));else[440,330,220].forEach((f,i)=>setTimeout(()=>beep(f,.16,'triangle',.06),i*150));
    setTimeout(()=>{const cb=s&&s.onEnd;s=null;cb&&cb(ok);},1900);}
  function update(t){if(!s)return;const dt=Math.min(.05,(t-s.last)/1000);s.last=t;s.now=t-s.t0;if(s.phase!=='play')return;
    const rush=s.now>=CFG.time+1200-s.rush, k=rush?1:.3*Math.min(1,s.now/(CFG.time+1200-s.rush));   // 천천히 조금씩 → 마지막 피버타임(기본 5초)만 확 빨라짐
    if(s.held.L)s.x-=CFG.wandSpd*dt; if(s.held.R)s.x+=CFG.wandSpd*dt; s.x=Math.max(4,Math.min(W-4,s.x));
    if(s.now>=s.nextSpawn){const kind=pickKind(rush);s.objs.push({kind,x:8+Math.random()*(W-16),y:ROOM_Y+2,v:CFG.fall0+(CFG.fall1-CFG.fall0)*k+Math.random()*6,ph:Math.random()*6.28,sw:kind==='exit'?6+Math.random()*6:kind==='poison'?Math.random()*4:2,bx:0});
      s.objs[s.objs.length-1].bx=s.objs[s.objs.length-1].x;
      s.nextSpawn=s.now+(CFG.spawn0+(CFG.spawn1-CFG.spawn0)*k)*(.7+Math.random()*.6);}
    const beam=(s.laser||s.now<(s.laserUntil|0))&&s.now>=1200;
    if(beam&&s.now>=s.hum){s.hum=s.now+140;beep(1100+Math.random()*200,.03,'square',.015);}
    for(const o of s.objs){o.y+=o.v*dt;o.x=Math.max(5,Math.min(W-5,o.bx+Math.sin(s.now/700+o.ph)*o.sw));
      if(beam&&o.y<WY&&Math.abs(o.x-s.x)<=CFG.laserW){o.dead=true;   // 레이저 줄에 있는 건 전부 소멸
        if(o.kind==='heart'){burst(o.x,o.y,'#ff8fbf',8);pop('OOPS',o.x,o.y,'#ff8fbf');beep(330,.08,'triangle',.05);}
        else{burst(o.x,o.y,o.kind==='poison'?'#c9a4ff':'#3fd47a',12);beep(1320,.05,'square',.04);}}
      if(!o.dead&&o.y>=BOT){o.dead=true;
        if(o.kind==='heart'){if(s.lives<CFG.maxLives){s.lives++;pop('+1',o.x,BOT-6,'#ff8fbf');}[1320,1760].forEach((f,i)=>setTimeout(()=>beep(f,.07,'triangle',.06),i*80));}
        else{s.lives--;s.hurt=s.now;pop('-1',o.x,BOT-6,'#ff6b8a');beep(160,.18,'sawtooth',.05);if(s.lives<=0)finish(false);}}}
    s.objs=s.objs.filter(o=>!o.dead);
    if(s.phase==='play'&&s.now>=CFG.time+1200)finish(true);}
  function draw(){if(!s)return;
    r(0,ROOM_Y,W,ROOM_H,'#0d0c16');   // 골목 (플레로마 미니게임 배경)
    for(let j=0;j<ROOM_H;j+=5)for(let i=((j/5)%2?4:0);i<W;i+=8){r(i,ROOM_Y+j,7,4,'#1a1824');}
    for(const lx of lamps){const fl=((s.now/90+lx)|0)%23?1:.5;ctx.fillStyle='rgba(255,226,140,'+(.13*fl)+')';ctx.beginPath();ctx.moveTo(lx-3,ROOM_Y+7);ctx.lineTo(lx+3,ROOM_Y+7);ctx.lineTo(lx+16,ROOM_Y+ROOM_H);ctx.lineTo(lx-16,ROOM_Y+ROOM_H);ctx.closePath();ctx.fill();
      r(lx-1,ROOM_Y,2,5,'#3a3846');r(lx-4,ROOM_Y+4,8,2,'#3a3846');r(lx-3,ROOM_Y+6,6,1,fl<1?'#a08850':'#ffe28c');}
    r(0,BOT,W,1,s.now-s.hurt<300?'#ff3b4f':'rgba(255,60,80,.6)');
    for(const o of s.objs){if(o.kind==='poison')bmp(POISON,o.x-3,o.y-4,PP);else if(o.kind==='exit')bmp(EXIT,o.x-4,o.y-4,EP);else bmp(HEART,o.x-3,o.y-3,HP);}
    if((s.laser||s.now<(s.laserUntil|0))&&s.phase==='play'&&s.now>=1200){const w=((s.now/60)|0)%2;r(s.x-2-w,ROOM_Y,5+w*2,WY-ROOM_Y,'rgba(160,220,255,.35)');r(s.x-1,ROOM_Y,3,WY-ROOM_Y,'rgba(220,245,255,.8)');r(s.x,ROOM_Y,1,WY-ROOM_Y,'#ffffff');}
    if(!(s.now-s.hurt<600&&((s.now/80|0)%2)))bmp(WAND,s.x-2,WY,WP);
    if(((s.now/150)|0)%2)r(s.x,WY-1,1,1,'#fff6c8');
    s.fx=s.fx.filter(p=>s.now-p.t<500);for(const p of s.fx){const q=(s.now-p.t)/1000;r(p.x+p.vx*q,p.y+p.vy*q,1,1,p.c);}
    s.pops=s.pops.filter(p=>s.now-p.t<700);for(const p of s.pops)textC(p.txt,p.x,p.y-(s.now-p.t)/100,p.c);
    r(0,ROOM_Y+ROOM_H-9,W,9,'rgba(6,6,26,.85)');
    for(let i=0;i<CFG.maxLives;i++)bmp(HEART,4+i*9,ROOM_Y+ROOM_H-8,i<s.lives?HP:{K:'rgba(255,255,255,.3)'});
    const left=Math.max(0,CFG.time+1200-s.now),sec=Math.ceil(left/1000);
    text(Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0'),106,ROOM_Y+ROOM_H-7,sec<=20&&((s.now/300|0)%2)?'#fff36b':'#9ff0ff');
    if(s.now<700)textC('READY',64,ROOM_Y+38,'#fff36b',2);else if(s.now<1200)textC('GO!',64,ROOM_Y+38,'#9ff0ff',2);
    if(s.phase!=='play'){const q=Math.min(1,(s.now-s.endT)/400);r(0,ROOM_Y+30,W,22*q,'rgba(6,6,26,.75)');
      if(q>=1)textC(s.phase==='clear'?'CLEAR!':'FAIL',64,ROOM_Y+35,s.phase==='clear'?'#fff36b':'#ff6b8a',s.phase==='clear'?3:2);}
  }
  return {start,move,fire,update,draw,active:()=>!!s};
})();
// 이심전심: 3·2·1 뒤 왼쪽(레오나르드 눈색)/오른쪽(에라스미오스 눈색) 하트 중 하나 고르기
// 기억 결투 (아카데미 · 레오나르드): 10라운드. 1~5라운드 5개, 6~10라운드는 라운드 수만큼 화살표를 1.5초 보여주고 기억해서 입력
const MG4=(()=>{
  const r=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(x|0,y|0,w|0,h|0);};
  const AL=['...##','..###','.####','#####','.####','..###','...##'], AR=AL.map(l=>[...l].reverse().join(''));
  const arrow=(x,y,d,c,k=2)=>(d==='L'?AL:AR).forEach((row,j)=>{for(let i=0;i<row.length;i++)if(row[i]==='#')r(x+i*k,y+j*k,k,k,c);});
  const SHOW=1500, ROUNDS=10, lenOf=n=>n<=5?5:n;
  let s=null;
  function newRound(){s.round++;s.seq=[...Array(lenOf(s.round))].map(()=>Math.random()<.5?'L':'R');s.inp=[];s.phase='ready';s.pt=s.now;}
  function start(onEnd){s={t0:performance.now(),now:0,round:0,score:0,onEnd,res:null};newRound();beep(660,.08);setTimeout(()=>beep(990,.1),160);closeMenu();}
  function input(d){if(!s||s.phase!=='input')return;if(s.inp.length>=s.seq.length){beep(220,.05);return;}s.inp.push(d);beep(d==='L'?880:1175,.04,'square',.04);}
  function submit(){if(!s||s.phase!=='input')return;const ok=s.inp.join('')===s.seq.join('');if(ok)s.score++;s.res=ok;s.phase='judge';s.pt=s.now;
    if(ok)[1320,1760].forEach((f,i)=>setTimeout(()=>beep(f,.08,'square',.05),i*90));else beep(200,.2,'sawtooth',.05);}
  function update(t){if(!s)return;s.now=t-s.t0;const e=s.now-s.pt;
    if(s.phase==='ready'&&e>900){s.phase='show';s.pt=s.now;beep(990,.05);}
    else if(s.phase==='show'&&e>SHOW){s.phase='input';s.pt=s.now;}
    else if(s.phase==='judge'&&e>1100){if(s.round<ROUNDS)newRound();else{s.phase='end';s.pt=s.now;}}
    else if(s.phase==='end'&&e>1800){const cb=s.onEnd,sc=s.score;s=null;cb&&cb(sc);}}
  function row(seq,y,col,slots){const n=slots||seq.length,k=2,w=10,g=n>8?2:3,tw=n*w+(n-1)*g,x0=Math.round(64-tw/2);
    for(let i=0;i<n;i++){const x=x0+i*(w+g);if(seq[i])arrow(x,y,seq[i],col,k);else r(x+3,y+6,4,2,'rgba(255,240,200,.45)');}}
  function draw(){if(!s)return;const Y=ROOM_Y;
    r(0,Y,W,ROOM_H,'#1c0e16');   // 중세풍 연극 무대
    ctx.fillStyle='rgba(255,236,170,.12)';ctx.beginPath();ctx.moveTo(56,Y);ctx.lineTo(72,Y);ctx.lineTo(100,Y+72);ctx.lineTo(28,Y+72);ctx.closePath();ctx.fill();
    for(const bx of [36,84]){r(bx,Y+12,8,16,'#2f4f8a');r(bx,Y+12,8,1,'#e3c26a');r(bx+3,Y+17,2,5,'#e3c26a');}   // 문장 깃발
    r(0,Y+72,W,16,'#6b4426');for(let i=0;i<W;i+=12)r(i,Y+72,1,16,'#55351d');r(0,Y+72,W,2,'#c9a24a');   // 나무 무대
    for(let i=0;i<22;i+=4){r(i,Y,4,74,(i/4)%2?'#8e1b2b':'#b02a3a');r(W-4-i,Y,4,74,(i/4)%2?'#8e1b2b':'#b02a3a');}   // 양옆 막
    r(0,Y,W,9,'#9e1f30');for(let i=0;i<W;i+=8){ctx.fillStyle='#9e1f30';ctx.beginPath();ctx.arc(i+4,Y+9,4,0,Math.PI);ctx.fill();}r(0,Y+12,W,1,'#e3c26a');   // 위쪽 막 + 금 술
    ctx.textAlign='center';ctx.font='bold 8px sans-serif';ctx.fillStyle='#ffe9a8';
    ctx.fillText('ROUND '+s.round+'/'+ROUNDS+'   성공 '+s.score,64,Y+22);
    if(s.phase==='ready'){ctx.font='bold 11px sans-serif';ctx.fillStyle='#fff3c8';ctx.fillText('기억해!',64,Y+46);}
    else if(s.phase==='show')row(s.seq,Y+34,'#fff3c8');
    else if(s.phase==='input'){row(s.inp,Y+34,'#9ff0ff',s.seq.length);ctx.font='7px sans-serif';ctx.fillStyle='#ffe9a8';ctx.fillText('◀ ▶ 입력 · 가운데: 확인',64,Y+84);}
    else if(s.phase==='judge'){row(s.seq,Y+34,s.res?'#9ff0b0':'rgba(255,240,200,.5)');ctx.font='bold 14px sans-serif';ctx.fillStyle=s.res?'#9ff0b0':'#ff6b8a';ctx.fillText(s.res?'O':'X',64,Y+66);}
    else if(s.phase==='end'){ctx.font='bold 11px sans-serif';ctx.fillStyle='#fff3c8';ctx.fillText('결투 종료 · '+s.score+'/'+ROUNDS,64,Y+48);}
    ctx.textAlign='start';
  }
  return {start,input,submit,update,draw,active:()=>!!s,info:()=>s&&{phase:s.phase,round:s.round,score:s.score,n:s.seq.length}};
})();
const MG2=(()=>{
  const r=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(x|0,y|0,w|0,h|0);};
  const HEART=['.KK.KK.','KPPKPPK','KPWPPPK','KPPPPPK','.KPPPK.','..KPK..','...K...'];
  const PAL={L:{K:'#2f5f8a',P:'#a9d8f6',W:'#ffffff'},R:{K:'#4a4a52',P:'#b4b4bc',W:'#ffffff'}}, LX={L:36,R:92};
  const big=(x,y,pal,k)=>HEART.forEach((row,j)=>{for(let i=0;i<row.length;i++){const c=pal[row[i]];if(c)r(x+i*k,y+j*k,k,k,c);}});
  const stars=[...Array(40)].map((_,i)=>({x:Math.random()*W,y:Math.random()*ROOM_H,s:[6,12,22][i%3],c:['#6f7bd8','#c9d2ff','#ffffff','#ffd6f0'][i%4]}));
  let s=null;
  function start(onEnd,title){s={title:title||'에라스미오스는 어느 쪽?',t0:performance.now(),now:0,ans:Math.random()<.5?'L':'R',pick:null,pickT:0,onEnd};beep(660,.08);}
  function pick(l){if(!s||s.pick||s.now<3000)return;s.pick=l;s.pickT=s.now;const ok=l===s.ans;
    if(ok)[1320,1568,1760].forEach((f,i)=>setTimeout(()=>beep(f,.12,'square',.05),i*110));else[440,330,220].forEach((f,i)=>setTimeout(()=>beep(f,.16,'triangle',.06),i*150));
    setTimeout(()=>{const cb=s&&s.onEnd;s=null;cb&&cb(ok);},1800);}
  function draw(t){if(!s)return;s.now=t-s.t0;
    r(0,ROOM_Y,W,ROOM_H,'#06061a');
    for(const p of stars){const y=ROOM_Y+((p.y+s.now/1000*p.s)%ROOM_H);r(p.x,y,1,1,p.c);}
    for(const l of ['L','R']){r(LX[l]-14,ROOM_Y+6,29,ROOM_H-12,l==='L'?'rgba(120,190,255,.10)':'rgba(180,180,200,.10)');}
    const cd=Math.ceil((3000-s.now)/1000);
    ctx.fillStyle='#ffffff';ctx.font='bold 9px sans-serif';ctx.textAlign='center';
    ctx.fillText(s.title,64,ROOM_Y+25);
    if(s.now<3000){ctx.fillStyle='#fff36b';ctx.font='bold 24px sans-serif';ctx.fillText(String(cd),64,ROOM_Y+62);}
    else if(!s.pick){ctx.fillStyle='#9ff0ff';ctx.font='bold 10px sans-serif';ctx.fillText('골라!',64,ROOM_Y+58);}
    for(const l of ['L','R']){const dim=s.now<3000||(s.pick&&s.pick!==l&&s.ans!==l);
      const k=(s.pick===l||(!s.pick&&s.now>=3000&&((s.now/300|0)%2)))?4:3, w=7*k;
      big(LX[l]-w/2,ROOM_Y+56-w/2,dim?{K:'rgba(255,255,255,.25)',P:'rgba(255,255,255,.12)',W:'rgba(255,255,255,.2)'}:PAL[l],k);}
    ctx.font='bold 8px sans-serif';ctx.fillStyle='#a9d8f6';ctx.fillText('◀ A',LX.L,ROOM_Y+ROOM_H-6);ctx.fillStyle='#c4c4cc';ctx.fillText('C ▶',LX.R,ROOM_Y+ROOM_H-6);
    if(s.pick){const ok=s.pick===s.ans;ctx.fillStyle='rgba(6,6,26,.7)';ctx.fillRect(0,ROOM_Y+30,W,16);ctx.fillStyle=ok?'#fff36b':'#ff6b8a';ctx.font='bold 11px sans-serif';
      ctx.fillText(ok?'통했다!':'엇갈렸다…',64,ROOM_Y+42);}
    ctx.textAlign='start';
  }
  return {start,pick,draw,active:()=>!!s};
})();
// 야바위 (아카데미 기숙사 · 엘리아스): 하·중·상 3판 (top이면 최고 난이도 1판). 동전이 든 컵을 보여준 뒤 섞고, ◀▶로 고른 뒤 가운데로 확인. 틀리면 그 자리에서 끝
const MG5=(()=>{
  const r=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(x|0,y|0,w|0,h|0);};
  const LV=[{n:'하',swaps:5,dur:480},{n:'중',swaps:14,dur:320},{n:'상',swaps:20,dur:210}], TOP=[{n:'최고',swaps:20,dur:150}], SX=[34,64,94];
  let s=null;
  function newRound(){s.round++;s.slot=[0,1,2];s.coin=Math.random()*3|0;s.cur=1;s.swaps=[];
    for(let i=0;i<s.lv[s.round-1].swaps;i++){const a=Math.random()*3|0,b=(a+1+(Math.random()*2|0))%3;s.swaps.push([a,b]);}
    s.si=0;s.phase='show';s.pt=s.now;}
  function start(onEnd,top){s={t0:performance.now(),now:0,round:0,wins:0,onEnd,res:null,lv:top?TOP:LV};newRound();beep(660,.08);setTimeout(()=>beep(990,.1),160);closeMenu();}
  function move(d){if(!s||s.phase!=='pick')return;s.cur=(s.cur+d+3)%3;beep(880,.04,'square',.04);}
  function submit(){if(!s||s.phase!=='pick')return;const ok=s.slot[s.coin]===s.cur;if(ok)s.wins++;s.res=ok;s.phase='judge';s.pt=s.now;
    if(ok)[1320,1760].forEach((f,i)=>setTimeout(()=>beep(f,.08,'square',.05),i*90));else beep(200,.2,'sawtooth',.05);}
  function update(t){if(!s)return;s.now=t-s.t0;const e=s.now-s.pt,dur=s.lv[s.round-1].dur;
    if(s.phase==='show'&&e>1500){s.phase='shuffle';s.pt=s.now;}
    else if(s.phase==='shuffle'&&e>dur){const[a,b]=s.swaps[s.si];for(let k=0;k<3;k++){if(s.slot[k]===a)s.slot[k]=b;else if(s.slot[k]===b)s.slot[k]=a;}beep(520,.02,'square',.03);
      s.si++;s.pt=s.now;if(s.si>=s.swaps.length)s.phase='pick';}
    else if(s.phase==='judge'&&e>1400){if(s.res&&s.round<s.lv.length)newRound();else{s.phase='end';s.pt=s.now;}}
    else if(s.phase==='end'&&e>1500){const cb=s.onEnd,ok=s.wins>=s.lv.length;s=null;cb&&cb(ok);}}
  function cup(x,y){r(x-9,y,18,3,'#7a3b1e');for(let j=3;j<20;j++){const w=16-((20-j)/3|0);r(x-w/2,y+j,w,1,j%5?'#b5562c':'#d9864a');}r(x-10,y+19,20,2,'#5a2a14');}
  function coin(x,y){r(x-3,y,6,5,'#e3b23c');r(x-2,y+1,4,3,'#ffe27a');}
  function draw(){if(!s)return;const Y=ROOM_Y,TY=Y+44,dur=s.lv[s.round-1].dur;
    r(0,Y,W,ROOM_H,'#2a1a2e');for(let i=0;i<W;i+=16)r(i,Y,1,64,'#24152a');r(0,Y+60,W,ROOM_H-60,'#21142a');   // 어두운 기숙사 벽
    ctx.fillStyle='rgba(255,226,140,.10)';ctx.beginPath();ctx.moveTo(52,Y);ctx.lineTo(76,Y);ctx.lineTo(112,Y+86);ctx.lineTo(16,Y+86);ctx.closePath();ctx.fill();   // 램프 불빛
    r(8,TY+21,W-16,6,'#5b3a24');r(8,TY+21,W-16,1,'#c9a24a');r(12,TY+27,4,10,'#3e2716');r(W-16,TY+27,4,10,'#3e2716');   // 탁자
    ctx.textAlign='center';ctx.font='bold 8px sans-serif';ctx.fillStyle='#ffe9a8';
    ctx.fillText('야바위 · '+s.lv[s.round-1].n+'   ('+s.round+'/'+s.lv.length+')',64,Y+14);
    const sw=s.phase==='shuffle'?s.swaps[s.si]:null,q=sw?Math.min(1,(s.now-s.pt)/dur):0;
    const lift=k=>(s.phase==='show'&&k===s.coin&&s.now-s.pt<1100)||(s.phase==='judge'&&(k===s.coin||s.slot[k]===s.cur))||(s.phase==='end'&&k===s.coin)?14:0;
    for(let k=0;k<3;k++){let x=SX[s.slot[k]],y=TY;
      if(sw&&(s.slot[k]===sw[0]||s.slot[k]===sw[1])){const to=s.slot[k]===sw[0]?sw[1]:sw[0];x=SX[s.slot[k]]+(SX[to]-SX[s.slot[k]])*q;y+=Math.sin(q*Math.PI)*(s.slot[k]===sw[0]?-6:3);}
      if(k===s.coin&&lift(k))coin(x,TY+15);
      cup(x,y-lift(k));}
    if(s.phase==='pick'){const x=SX[s.cur];ctx.fillStyle='#9ff0ff';ctx.beginPath();ctx.moveTo(x-4,TY-9);ctx.lineTo(x+4,TY-9);ctx.lineTo(x,TY-4);ctx.closePath();ctx.fill();
      ctx.font='7px sans-serif';ctx.fillStyle='#ffe9a8';ctx.fillText('◀ ▶ 고르기 · 가운데: 확인',64,Y+25);}
    else if(s.phase==='show'){ctx.font='7px sans-serif';ctx.fillStyle='#ffe9a8';ctx.fillText('동전은 여기!',64,Y+25);}
    else if(s.phase==='judge'){ctx.font='bold 14px sans-serif';ctx.fillStyle=s.res?'#9ff0b0':'#ff6b8a';ctx.fillText(s.res?'O':'X',64,Y+82);}
    else if(s.phase==='end'){ctx.font='bold 9px sans-serif';ctx.fillStyle='#fff3c8';ctx.fillText(s.wins>=s.lv.length?(s.lv.length>1?'세 판 모두 맞혔다!':'맞혔다!'):'틀렸다...',64,Y+80);}
    ctx.textAlign='start';
  }
  return {start,move,submit,update,draw,active:()=>!!s,info:()=>s&&{phase:s.phase,round:s.round,wins:s.wins,coinSlot:s.slot[s.coin],cur:s.cur}};
})();
