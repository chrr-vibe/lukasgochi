/* 배경 그리기 코드 — 평소엔 열지 말 것 */
function recolorRoom(c){   // 동료의 집: 내 방 그림에서 보라·분홍 계열만 색을 돌림 (나무색·하늘색은 그대로)
  const x=c.getContext('2d'), id=x.getImageData(0,0,c.width,c.height), d=id.data;
  for(let i=0;i<d.length;i+=4){
    const r=d[i]/255,g=d[i+1]/255,b=d[i+2]/255, mx=Math.max(r,g,b), mn=Math.min(r,g,b), l=(mx+mn)/2, dl=mx-mn;
    if(dl<.04) continue;
    let h=mx===r?((g-b)/dl+6)%6:mx===g?(b-r)/dl+2:(r-g)/dl+4; h*=60;
    if(h<240||h>350) continue;
    h=(h-130+360)%360; const sat=dl/(1-Math.abs(2*l-1)), C=(1-Math.abs(2*l-1))*sat, X=C*(1-Math.abs((h/60)%2-1)), m=l-C/2;
    const [r1,g1,b1]=h<60?[C,X,0]:h<120?[X,C,0]:h<180?[0,C,X]:h<240?[0,X,C]:h<300?[X,0,C]:[C,0,X];
    d[i]=(r1+m)*255; d[i+1]=(g1+m)*255; d[i+2]=(b1+m)*255;
  }
  x.putImageData(id,0,0); return c;
}
function makeRoom(room,lampOn,night){
  if(room==='lhouse') return recolorRoom(makeRoom('bed',lampOn,night));
  const c=document.createElement('canvas');c.width=W;c.height=ROOM_H;const x=c.getContext('2d');
  if(room==='bed'){
    // wall
    R(x,0,0,128,54,'#cdb9ef');
    for(let i=0;i<128;i+=8)for(let j=3;j<50;j+=8)R(x,i+((j/8|0)%2?4:0),j,2,2,'#dccbf7');
    R(x,0,50,128,4,'#a98fd6');
    // floor
    R(x,0,54,128,34,'#e9be93');
    for(let j=58;j<88;j+=6){R(x,0,j,128,1,'#d6a57a');for(let i=(j%12?6:20);i<128;i+=28)R(x,i,j-5,1,5,'#d6a57a');}
    // window
    const day=lampOn&&!night;   // 밤이면 창문도 어둡게
    R(x,88,8,32,24,'#7d5ba6');R(x,90,10,28,20,day?'#bfe9ff':'#3c3f7a');
    R(x,103,10,2,20,'#7d5ba6');R(x,90,19,28,2,'#7d5ba6');
    if(!day){R(x,95,13,2,2,'#fff8c8');R(x,110,23,1,1,'#fff8c8');R(x,113,13,1,1,'#fff8c8');}
    else{R(x,92,12,6,3,'#ffffff');R(x,108,22,7,3,'#ffffff');}
    if(night){x.fillStyle='#fff3b0';x.beginPath();x.arc(112,15,3,0,7);x.fill();x.fillStyle='#3c3f7a';x.beginPath();x.arc(113,14,2.5,0,7);x.fill();}
    R(x,86,6,6,30,'#ff9cc8');R(x,116,6,6,30,'#ff9cc8');R(x,86,6,36,3,'#ff7fb6');
    // frame
    R(x,20,8,14,12,'#ffffff');R(x,21,9,12,10,'#ffd5e6');R(x,24,12,6,5,'#ff8fbf');
    // pendant lamp (전등)
    R(x,63,0,1,6,'#5b4475');
    x.fillStyle=lampOn?'#ffe58a':'#9d8fb3';x.beginPath();x.moveTo(57,13);x.lineTo(70,13);x.lineTo(66,6);x.lineTo(61,6);x.closePath();x.fill();
    R(x,57,13,13,1,'#5b4475');
    if(lampOn){x.fillStyle='rgba(255,240,170,.28)';x.beginPath();x.moveTo(57,14);x.lineTo(70,14);x.lineTo(84,40);x.lineTo(43,40);x.closePath();x.fill();}
    // bed
    R(x,2,26,46,30,'#8a5a48');R(x,4,28,42,26,'#b57a5e');   // headboard
    R(x,6,30,38,3,'#d79a78');
    R(x,0,46,52,22,'#8a5a48');                              // frame
    R(x,2,44,48,16,'#ffffff');                              // mattress/sheet
    R(x,4,40,20,8,'#fff6fb');R(x,4,47,20,1,'#e7d3e3');      // pillow
    R(x,14,48,38,18,'#ff9cc8');R(x,14,48,38,2,'#ffc2dd');   // blanket
    for(let i=18;i<52;i+=8)for(let j=53;j<66;j+=6)R(x,i+((j/6|0)%2?4:0),j,2,2,'#ffe1ee');
    R(x,2,66,4,6,'#6d4536');R(x,46,66,4,6,'#6d4536');
    // bedside table + small lamp
    R(x,100,50,22,16,'#b57a5e');R(x,100,50,22,2,'#d79a78');R(x,102,56,18,1,'#8a5a48');R(x,110,58,2,2,'#ffe58a');
    R(x,102,66,3,6,'#8a5a48');R(x,117,66,3,6,'#8a5a48');
    R(x,110,40,2,10,'#8a5a48');x.fillStyle=lampOn?'#fff1a8':'#a99bc0';x.beginPath();x.moveTo(104,41);x.lineTo(118,41);x.lineTo(115,33);x.lineTo(107,33);x.closePath();x.fill();
    // rug
    x.fillStyle='#c6f0e2';x.beginPath();x.ellipse(66,80,30,7,0,0,Math.PI*2);x.fill();
    x.fillStyle='#9fdcc8';x.beginPath();x.ellipse(66,80,24,5,0,0,Math.PI*2);x.fill();
  }else if(room==='living'){
    // wall
    R(x,0,0,128,52,'#a8e3d2');
    R(x,0,34,128,18,'#fff2dc');for(let i=2;i<128;i+=6)R(x,i,36,1,16,'#ead8bd');R(x,0,34,128,2,'#e6cfae');
    R(x,0,50,128,2,'#c9a98a');
    // floor
    R(x,0,52,128,36,'#dcb7da');
    for(let j=56;j<88;j+=6){R(x,0,j,128,1,'#c79ec6');for(let i=(j%12?10:24);i<128;i+=30)R(x,i,j-5,1,5,'#c79ec6');}
    // frames + hearts
    R(x,8,6,14,12,'#ffffff');R(x,9,7,12,10,'#ffe4b8');R(x,11,11,4,4,'#ff9fb7');
    R(x,26,10,10,10,'#ffffff');R(x,27,11,8,8,'#c8d8ff');R(x,29,15,4,3,'#7fb27f');
    R(x,40,6,10,8,'#ffffff');R(x,41,7,8,6,'#ffd5f0');
    bitmap(x,['.##.##.','#######','#######','.#####.','..###..','...#...'],8,24,'#ff7fae');
    bitmap(x,['.##.##.','#######','#######','.#####.','..###..','...#...'],18,24,'#b493e6');
    // chandelier
    R(x,63,0,1,4,'#6a6a8a');R(x,56,4,15,2,'#8a86b8');
    for(const cx of [56,63,70]){R(x,cx-1,6,3,3,'#b6b0ff');R(x,cx,9,1,1,'#fff7c2');}
    // bookshelf
    R(x,96,6,30,52,'#a86b45');R(x,98,8,26,48,'#7a4a30');
    const BK=['#ff8fb1','#7fc8ff','#ffd36b','#9be08f','#c59cff','#ff9f6b','#78d9c8'];
    for(let s=0;s<4;s++){const y=9+s*12;R(x,98,y+10,26,2,'#a86b45');
      let i=99;let k=s;while(i<122){const w=2+((i+s)%3);const h=6+((i*7+s)%4);R(x,i,y+10-h,w,h,BK[k%BK.length]);i+=w+ (k%4===0?1:0);k++;}}
    // plant
    R(x,84,46,9,8,'#e78f6b');R(x,85,46,7,1,'#ffb48f');
    bitmap(x,['..#.#..','.##.##.','#######','.#####.','..###..','...#...'],82,38,'#4fb072');
    // big table (커다란 탁자)
    R(x,4,48,52,5,'#c98a5a');R(x,4,48,52,1,'#e3a874');R(x,4,53,52,2,'#8f5c3a');
    R(x,6,55,4,14,'#8f5c3a');R(x,50,55,4,14,'#8f5c3a');R(x,28,55,4,10,'#8f5c3a');
    R(x,8,44,4,4,'#ffffff');R(x,9,42,2,2,'#ff8fbf');     // vase
    R(x,38,46,8,2,'#ffffff');R(x,39,45,6,1,'#f3e5c8');   // plate
    // rug
    x.fillStyle='#fff3e2';x.beginPath();x.ellipse(66,80,34,7,0,0,Math.PI*2);x.fill();
    x.fillStyle='#ffd9ea';x.beginPath();x.ellipse(66,80,27,5,0,0,Math.PI*2);x.fill();
  }else if(room==='library'){
    // ---- library (antique school library) ----
    R(x,0,0,128,32,'#9fbfa4');                                      // sage wallpaper
    for(let i=2;i<128;i+=8)for(let j=3;j<30;j+=8)R(x,i+((j/8|0)%2?4:0),j,1,1,'#d9c98a');
    R(x,0,30,128,2,'#c9a85a');                                      // gold rail
    R(x,0,32,128,22,'#6e4a36');                                     // walnut panelling
    for(let i=30;i<100;i+=14){R(x,i,35,11,16,'#7f5841');R(x,i,35,11,1,'#946a50');}
    R(x,0,52,128,2,'#4f3426');
    // herringbone-ish floor
    R(x,0,54,128,34,'#b88a5c');
    for(let j=54;j<88;j+=4)for(let i=((j/4)%2?0:4);i<128;i+=8){R(x,i,j,4,1,'#a2774d');R(x,i+3,j,1,4,'#a2774d');}
    // clock
    x.fillStyle='#7a5236';x.beginPath();x.arc(64,8,7,0,Math.PI*2);x.fill();
    x.fillStyle='#fff6dc';x.beginPath();x.arc(64,8,5,0,Math.PI*2);x.fill();
    R(x,64,4,1,4,'#3b2a46');R(x,64,8,3,1,'#3b2a46');
    // arched stained-glass windows
    for(const wx of [34,82]){
      R(x,wx,6,12,22,'#5a3b2a');R(x,wx+1,8,10,19,'#f6e7b8');
      R(x,wx,4,12,2,'#5a3b2a');R(x,wx+2,3,8,1,'#5a3b2a');R(x,wx+1,6,10,2,'#f6e7b8');
      R(x,wx+2,9,3,4,'#e98fa5');R(x,wx+7,9,3,4,'#8fb8e9');R(x,wx+2,15,3,4,'#9bd39a');R(x,wx+7,15,3,4,'#f2c55c');
      R(x,wx+5,8,2,19,'#5a3b2a');R(x,wx+1,14,10,1,'#5a3b2a');R(x,wx+1,20,10,1,'#5a3b2a');
    }
    // floor-to-ceiling shelves
    const BK=['#8e3b46','#2f4f7a','#3e6b48','#c9a24a','#6b4a7a','#a5643a','#5b6f8f','#7a2f2f'];
    for(const sx of [0,100]){
      R(x,sx,0,28,62,'#4a2f22');R(x,sx+2,2,24,58,'#2e1d15');
      for(let s2=0;s2<5;s2++){const y=2+s2*12;R(x,sx+2,y+10,24,2,'#4a2f22');
        let i=sx+3,k=s2*3+sx;while(i<sx+25){const w=2+((i+s2)%2);const h=6+((i*3+s2)%4);R(x,i,y+10-h,w,h,BK[k%BK.length]);R(x,i,y+10-h+1,w,1,'#e3c77a');i+=w+((k%6===0)?1:0);k++;}}
    }
    R(x,30,8,1,54,'#a07a4a');R(x,35,8,1,54,'#a07a4a');for(let y=12;y<62;y+=6)R(x,30,y,6,1,'#a07a4a');  // ladder
    // long reading table with green banker lamps
    R(x,26,50,76,4,'#5e3b28');R(x,26,50,76,1,'#7c5136');R(x,28,54,3,12,'#4a2f22');R(x,97,54,3,12,'#4a2f22');
    for(const lx of [34,90]){R(x,lx+3,45,1,5,'#c9a24a');R(x,lx,43,7,3,'#2f8a58');R(x,lx+1,42,5,1,'#5fc28a');R(x,lx,49,7,1,'#c9a24a');}
    R(x,44,47,6,3,'#8e3b46');R(x,45,46,6,1,'#2f4f7a');R(x,78,47,7,3,'#3e6b48');
    // globe
    R(x,108,70,2,8,'#7a5236');R(x,104,78,10,2,'#7a5236');
    x.fillStyle='#7fb7d9';x.beginPath();x.arc(109,66,5,0,Math.PI*2);x.fill();R(x,107,64,3,2,'#7fc27a');R(x,110,67,2,2,'#7fc27a');
    // burgundy runner
    R(x,38,74,52,12,'#8e3b46');R(x,40,76,48,8,'#a94c58');for(let i=42;i<88;i+=6)R(x,i,79,2,2,'#e3c77a');
  }else if(room==='brother'||room==='adrroom'){
    // ---- 형의 방 (고풍스러운 서재) ----
    R(x,0,0,128,40,'#5a1f2b');                                      // burgundy damask
    for(let j=2;j<38;j+=8)for(let i=((j/8|0)%2?6:2);i<128;i+=8){R(x,i,j,1,3,'#7a3341');R(x,i-1,j+1,3,1,'#7a3341');}
    R(x,0,38,128,2,'#c9a24a');                                      // gilded rail
    R(x,0,40,128,14,'#3e2418');for(let i=4;i<128;i+=14){R(x,i,42,10,10,'#4d2e1f');R(x,i,42,10,1,'#62402c');}
    R(x,0,53,128,1,'#2a170f');
    R(x,0,54,128,34,'#5b3a26');                                     // dark parquet
    for(let j=54;j<88;j+=4)for(let i=((j/4)%2?0:6);i<128;i+=12)R(x,i,j,12,1,'#4a2f1f');
    // chandelier
    R(x,63,0,1,5,'#c9a24a');R(x,54,5,19,2,'#c9a24a');
    for(const cx of [55,63,71]){R(x,cx,7,1,3,'#f6e7b8');R(x,cx,4,1,1,'#ffe58a');R(x,cx-1,3,3,1,'#fff3b0');}
    // gilded portrait
    R(x,52,12,24,20,'#c9a24a');R(x,54,14,20,16,'#2f2a3a');R(x,58,17,12,10,'#e8d2b0');R(x,60,16,8,5,'#e3c26a');R(x,60,25,8,5,'#2a2430');R(x,55,13,18,1,'#f2d98a');
    // tall bookcase (left)
    const BK=['#7a2f2f','#2f4f7a','#3e6b48','#c9a24a','#5b3a6b','#8e5a2a'];
    R(x,0,2,26,64,'#3a2116');R(x,2,4,22,60,'#24130c');R(x,0,2,26,2,'#c9a24a');
    for(let s2=0;s2<5;s2++){const y=4+s2*12;R(x,2,y+10,22,2,'#3a2116');
      let i=3,k=s2*2;while(i<23){const w=2+((i+s2)%2),h=6+((i*5+s2)%4);R(x,i,y+10-h,w,h,BK[k%BK.length]);R(x,i,y+10-h+1,w,1,'#e3c77a');i+=w+(k%5===0?1:0);k++;}}
    // writing desk + candle lamp (right)
    R(x,98,44,30,4,'#6b3d24');R(x,98,44,30,1,'#8a5434');R(x,100,48,26,8,'#5a321d');R(x,108,50,10,4,'#6b3d24');R(x,112,51,2,2,'#c9a24a');
    R(x,100,56,3,12,'#4a2a18');R(x,123,56,3,12,'#4a2a18');R(x,100,66,4,2,'#c9a24a');R(x,122,66,4,2,'#c9a24a');
    R(x,104,40,8,4,'#efe3c8');R(x,105,39,6,1,'#efe3c8');R(x,113,37,1,7,'#3b2a46');   // papers + quill
    R(x,119,36,1,8,'#c9a24a');R(x,117,43,5,1,'#c9a24a');R(x,119,33,1,3,'#fff3b0');R(x,118,34,3,1,'#ffd36b');
    // wingback armchair (right front)
    R(x,104,58,22,4,'#7a2a35');R(x,102,48,6,20,'#7a2a35');R(x,122,48,5,20,'#7a2a35');R(x,106,46,18,14,'#8e3446');R(x,106,46,18,1,'#a84a5c');
    R(x,104,62,22,4,'#6a2230');R(x,104,66,2,4,'#3e2418');R(x,124,66,2,4,'#3e2418');
    // persian carpet
    R(x,30,72,68,15,'#7a1f2b');R(x,32,74,64,11,'#a3343f');R(x,36,76,56,7,'#1f3a5a');R(x,38,77,52,5,'#a3343f');
    for(let i=40;i<90;i+=6){R(x,i,79,2,1,'#e3c77a');}R(x,62,78,4,3,'#e3c77a');
    for(let i=31;i<98;i+=3){R(x,i,71,1,1,'#efe3c8');R(x,i,87,1,1,'#efe3c8');}
  }else if(room==='dorm'||room==='adorm'){
    // ---- 판타지 기숙사 ----
    R(x,0,0,128,54,'#5e6a8a');                                       // stone wall
    for(let j=0;j<54;j+=6)for(let i=((j/6)%2?0:8);i<128;i+=16){R(x,i,j,16,1,'#4c5675');R(x,i,j,1,6,'#4c5675');R(x,i+1,j+1,14,1,'#6c7898');}
    R(x,0,52,128,2,'#3a4260');
    R(x,0,54,128,34,'#7a5236');for(let j=58;j<88;j+=5)R(x,0,j,128,1,'#654229');for(let i=6;i<128;i+=18)R(x,i,54,1,34,'#654229');
    // big arched window (sky follows game time)
    R(x,44,2,40,42,'#3a2a20');
    const sky=night?'#1b1f4a':'#9fd4ff';R(x,47,8,34,34,sky);x.fillStyle=sky;x.beginPath();x.arc(64,9,17,Math.PI,0);x.fill();
    if(night){for(const [sx,sy] of [[52,12],[58,26],[74,16],[70,34],[77,28],[55,36]])R(x,sx,sy,1,1,'#fff8c8');
      x.fillStyle='#fff3b0';x.beginPath();x.arc(71,18,5,0,7);x.fill();x.fillStyle=sky;x.beginPath();x.arc(73,16,4,0,7);x.fill();}
    else{x.fillStyle='#ffe58a';x.beginPath();x.arc(72,17,5,0,7);x.fill();R(x,50,30,10,3,'#ffffff');R(x,52,28,6,2,'#ffffff');
      R(x,47,36,34,6,'#8fc98a');R(x,54,32,6,4,'#6fae6a');}
    R(x,63,0,2,42,'#3a2a20');R(x,47,24,34,2,'#3a2a20');R(x,44,42,40,3,'#8a6a4a');
    // banners
    for(const bx of [30,90]){R(x,bx,4,10,20,'#8e2b3a');R(x,bx,4,10,1,'#c9a24a');R(x,bx+3,10,4,4,'#c9a24a');x.fillStyle='#8e2b3a';x.beginPath();x.moveTo(bx,24);x.lineTo(bx+5,28);x.lineTo(bx+10,24);x.closePath();x.fill();}
    // sconces
    for(const sx of [24,102]){R(x,sx,26,2,6,'#8a6a4a');R(x,sx,24,2,2,night?'#ffe58a':'#d9c08a');if(night){x.fillStyle='rgba(255,220,140,.25)';x.beginPath();x.arc(sx+1,25,7,0,7);x.fill();}}
    // beds both sides (canopy)
    const bed=(bx,flip)=>{R(x,bx,30,2,40,'#4a2f22');R(x,bx+30,30,2,40,'#4a2f22');R(x,bx,28,32,3,'#2f4f7a');R(x,bx,31,32,4,'#3e6694');
      R(x,bx+2,52,28,12,'#efe6d8');R(x,bx+(flip?18:4),48,10,6,'#ffffff');R(x,bx+2,56,28,10,'#2f4f7a');R(x,bx+2,56,28,1,'#5a7fb0');
      for(let i=bx+4;i<bx+30;i+=6)R(x,i,60,2,2,'#c9a24a');R(x,bx+2,66,28,4,'#4a2f22');};
    bed(0,false);bed(96,true);
    // trunk + rug
    R(x,40,62,14,8,'#6b3d24');R(x,40,62,14,2,'#8a5434');R(x,46,64,2,2,'#c9a24a');
    R(x,36,74,56,12,'#2f4f7a');R(x,38,76,52,8,'#3e6694');for(let i=40;i<90;i+=6)R(x,i,79,2,2,'#c9a24a');
  }else if(room==='market'){
    // ---- 상점가 (중세풍 야외 상점 거리) ----
    R(x,0,0,128,30,night?'#1b1f4a':'#b9d4ea');
    if(night){for(const [sx,sy] of [[12,4],[44,8],[80,3],[110,6]])R(x,sx,sy,1,1,'#fff8c8');x.fillStyle='#fff3b0';x.beginPath();x.arc(118,8,4,0,7);x.fill();}
    const SH=[[0,40,'#f2e2c4','#8a3b2a','#e05a6a','#fff3e0','빵'],[42,44,'#e9dcc0','#5a3a2a','#5aa0d8','#f4fbff','약'],[88,40,'#f0d8d0','#7a3b2a','#d9b030','#fff8d8','보석']];
    const lit=[];
    for(const [hx,hw,wall,roof,aw,aw2] of SH){
      x.fillStyle=roof;x.beginPath();x.moveTo(hx-1,16);x.lineTo(hx+hw/2,2);x.lineTo(hx+hw+1,16);x.closePath();x.fill();
      R(x,hx,16,hw,46,wall);R(x,hx,16,hw,2,'#5a3a24');R(x,hx,16,2,46,'#5a3a24');R(x,hx+hw-2,16,2,46,'#5a3a24');
      for(const wx of [hx+6,hx+hw-12]){const on=night;if(on)lit.push([wx+1,22]);R(x,wx,21,6,7,'#4a3424');R(x,wx+1,22,4,5,on?'#ffd98a':'#8fa6b8');}
      for(let i=0;i<hw;i+=6){R(x,hx+i,32,6,6,(i/6)%2?aw:aw2);}x.fillStyle=aw;for(let i=0;i<hw;i+=6){x.beginPath();x.arc(hx+i+3,38,3,0,Math.PI);x.fill();}   // 줄무늬 차양
      R(x,hx+4,42,hw-8,16,'#6b4426');R(x,hx+5,43,hw-10,14,night?'#ffe0a0':'#d8c8a8');   // 진열창
      R(x,hx+3,58,hw-6,4,'#7a5236');}
    // 진열품
    for(const [bx,c] of [[8,'#d99a5a'],[14,'#c9803e'],[20,'#e0ae6a'],[26,'#d99a5a']]){x.fillStyle=c;x.beginPath();x.ellipse(bx+2,54,3,2,0,0,7);x.fill();}
    for(const [bx,c] of [[50,'#7fc8f0'],[57,'#f07fb0'],[64,'#a0e08a'],[71,'#c09af0'],[78,'#7fc8f0']]){R(x,bx,50,3,6,c);R(x,bx+1,48,1,2,'#8a6a4a');}
    for(const [bx,c] of [[96,'#ff8fbf'],[103,'#7fd6ff'],[110,'#ffe066'],[117,'#b48cff']]){x.fillStyle=c;x.beginPath();x.moveTo(bx,52);x.lineTo(bx+3,49);x.lineTo(bx+6,52);x.lineTo(bx+3,56);x.closePath();x.fill();}
    // 걸린 간판
    for(const [sx,c] of [[20,'#e05a6a'],[64,'#5aa0d8'],[108,'#d9b030']]){R(x,sx,19,1,3,'#3b2a46');R(x,sx-5,22,11,7,'#7a5236');R(x,sx-4,23,9,5,c);}
    R(x,0,62,128,26,'#8a7f72');for(let j=62;j<88;j+=3)for(let i=((j/3)%2?0:3);i<128;i+=6)R(x,i,j,5,2,'#9c9184');   // 돌바닥
    // 가로등 (밤엔 공원처럼 어두워지고 불이 켜짐)
    R(x,40,28,2,38,'#2f2f36');R(x,37,26,8,2,'#2f2f36');R(x,38,28,6,5,night?'#fff3b0':'#d8d4c4');R(x,37,33,8,1,'#2f2f36');R(x,38,65,6,2,'#2f2f36');
    if(night){
      x.fillStyle='rgba(16,18,60,.45)';x.fillRect(0,0,128,88);
      for(const [lx,ly] of lit)R(x,lx,ly,4,5,'#ffd98a');
      R(x,38,28,6,5,'#fff3b0');
      x.fillStyle='rgba(255,240,170,.22)';x.beginPath();x.moveTo(38,33);x.lineTo(44,33);x.lineTo(56,70);x.lineTo(26,70);x.closePath();x.fill();
    }
  }else if(room==='street'||room==='bstreet'){
    // ---- 프로이센 거리 (18세기 · 중세풍 목조 골목) / 바덴 거리 (색만 다르게) ----
    const bd=room==='bstreet', lit=[];
    R(x,0,0,128,34,night?'#1b1f4a':'#b9cfe0');
    if(night){for(const [sx,sy] of [[10,3],[40,6],[76,2],[104,5],[120,9]])R(x,sx,sy,1,1,'#fff8c8');x.fillStyle='#fff3b0';x.beginPath();x.arc(112,8,4,0,7);x.fill();}
    // 멀리 교회 첨탑
    R(x,60,4,8,30,'#8d8478');x.fillStyle='#4f5a63';x.beginPath();x.moveTo(58,5);x.lineTo(64,-8);x.lineTo(70,5);x.closePath();x.fill();R(x,63,12,2,4,'#3b2a46');
    // 목조 가옥들 (하프팀버 + 뾰족 지붕)
    const HS=bd?[[0,30,'#f6dccb','#a0402a'],[30,24,'#f3e7b8','#8a3a2a'],[70,28,'#f0d6d2','#a0402a'],[98,30,'#e8e4c4','#6a3a2a']]:[[0,30,'#efe3c8','#7a3b2a'],[30,24,'#e6d6b4','#5a3a2a'],[70,28,'#f2e6cc','#7a3b2a'],[98,30,'#e9dcc0','#4f3a2e']];
    for(const [hx,hw,wall,roof] of HS){const top=20, peak=top-14;
      x.fillStyle=roof;x.beginPath();x.moveTo(hx-2,top);x.lineTo(hx+hw/2,peak);x.lineTo(hx+hw+2,top);x.closePath();x.fill();
      R(x,hx,top,hw,42,wall);
      const TB='#5a3a24';R(x,hx,top,hw,2,TB);R(x,hx,top+20,hw,2,TB);R(x,hx,top,2,42,TB);R(x,hx+hw-2,top,2,42,TB);R(x,hx+hw/2-1,top,2,20,TB);
      x.strokeStyle=TB;x.lineWidth=1.5;x.beginPath();x.moveTo(hx+2,top+2);x.lineTo(hx+hw/2-1,top+20);x.moveTo(hx+hw-2,top+2);x.lineTo(hx+hw/2+1,top+20);x.stroke();
      for(const wx of [hx+4,hx+hw-10]){const on=night&&((wx*3)%4<2);if(on)lit.push([wx+1,top+25]);R(x,wx,top+24,6,8,'#4a3424');R(x,wx+1,top+25,4,6,on?'#ffd98a':'#8fa6b8');R(x,wx+3,top+25,1,6,'#4a3424');R(x,wx-1,top+32,8,1,'#7a5236');}
      R(x,hx+hw/2-3,top+30,6,12,'#6b3d24');R(x,hx+hw/2-3,top+30,6,1,'#4a2a18');}
    // 깃발: 프로이센 (검정·하양) / 바덴 (빨강·노랑·빨강)
    R(x,54,22,1,18,'#3b2a46');R(x,55,22,10,3,bd?'#c8102e':'#1d1d22');R(x,55,25,10,3,bd?'#ffd200':'#f4f1ea');R(x,55,28,10,3,bd?'#c8102e':'#1d1d22');
    // 돌바닥
    R(x,0,62,128,26,'#8a7f72');for(let j=62;j<88;j+=3)for(let i=((j/3)%2?0:3);i<128;i+=6)R(x,i,j,5,2,'#9c9184');
    // 우물
    R(x,6,58,16,10,'#8d8478');R(x,6,58,16,2,'#a69d90');R(x,8,46,1,12,'#5a3a24');R(x,19,46,1,12,'#5a3a24');R(x,6,44,16,3,'#7a3b2a');R(x,13,48,1,6,'#3b2a46');
    // 기름 등불 (벽걸이)
    R(x,92,28,1,6,'#2f2f36');R(x,89,33,7,2,'#2f2f36');R(x,90,35,5,6,night?'#ffd36b':'#e8e2c8');R(x,90,35,5,1,'#2f2f36');R(x,89,41,7,1,'#2f2f36');
    if(night){x.fillStyle='rgba(255,220,140,.18)';x.beginPath();x.arc(92,38,12,0,7);x.fill();}
    if(bd){for(const fx of [98,112]){R(x,fx,70,12,8,'#8e6240');R(x,fx,70,12,1,'#a87a52');for(let i=0;i<4;i++)R(x,fx+1+i*3,66+(i%2),2,4,['#ff8fb1','#ffd36b','#c59cff','#ff6b6b'][i]);R(x,fx+2,69,8,1,'#5fae5a');}}   // 바덴: 꽃 화분
    else{   // 나무 수레
    R(x,98,68,22,6,'#7a5236');R(x,98,66,22,2,'#8e6240');R(x,100,74,6,6,'#3e2418');R(x,112,74,6,6,'#3e2418');R(x,102,76,2,2,'#8e6240');R(x,114,76,2,2,'#8e6240');R(x,120,70,7,1,'#5a3a24');}
    // 가로등 (밤엔 공원처럼 어두워지고 불이 켜짐)
    R(x,38,30,2,36,'#2f2f36');R(x,35,28,8,2,'#2f2f36');R(x,36,30,6,5,night?'#fff3b0':'#d8d4c4');R(x,35,35,8,1,'#2f2f36');R(x,36,65,6,2,'#2f2f36');
    if(night){
      x.fillStyle='rgba(16,18,60,.45)';x.fillRect(0,0,128,88);
      for(const [lx,ly] of lit)R(x,lx,ly,4,6,'#ffd98a');
      R(x,36,30,6,5,'#fff3b0');R(x,90,35,5,6,'#ffd36b');
      x.fillStyle='rgba(255,240,170,.22)';x.beginPath();x.moveTo(36,35);x.lineTo(42,35);x.lineTo(54,70);x.lineTo(24,70);x.closePath();x.fill();
      x.fillStyle='rgba(255,220,140,.18)';x.beginPath();x.arc(92,38,12,0,7);x.fill();
    }
  }else if(room==='aliving'){
    // ---- 안할트 거실 (형의 방 같은 고풍스러운 거실) ----
    R(x,0,0,128,40,'#3f2a4a');for(let j=2;j<38;j+=8)for(let i=((j/8|0)%2?6:2);i<128;i+=8){R(x,i,j,1,3,'#57396a');R(x,i-1,j+1,3,1,'#57396a');}
    R(x,0,38,128,2,'#c9a24a');R(x,0,40,128,14,'#3e2418');for(let i=4;i<128;i+=14){R(x,i,42,10,10,'#4d2e1f');R(x,i,42,10,1,'#62402c');}
    R(x,0,53,128,1,'#2a170f');R(x,0,54,128,34,'#5b3a26');for(let j=54;j<88;j+=4)for(let i=((j/4)%2?0:6);i<128;i+=12)R(x,i,j,12,1,'#4a2f1f');
    // 벽난로
    R(x,48,26,32,28,'#d8cbb6');R(x,46,24,36,3,'#efe3c8');R(x,54,34,20,20,'#2a1a14');R(x,58,44,12,10,'#ff9a3c');R(x,61,40,6,6,'#ffd36b');R(x,52,54,24,2,'#8d7f6c');
    // 가족 초상화들 (노려보는 시선)
    for(const [px,pc] of [[8,'#e3c26a'],[30,'#2a2430'],[90,'#e3c26a'],[108,'#2a2430']]){R(x,px,8,16,20,'#c9a24a');R(x,px+2,10,12,16,'#2f2a3a');R(x,px+4,13,8,8,'#e8d2b0');R(x,px+4,12,8,3,pc);R(x,px+5,16,2,1,'#3b2a46');R(x,px+9,16,2,1,'#3b2a46');R(x,px+4,21,8,5,'#5a1f2b');}
    // 소파 + 카펫
    R(x,30,74,68,12,'#8e3b46');R(x,32,76,64,8,'#a94c58');for(let i=34;i<96;i+=6)R(x,i,79,2,2,'#e3c77a');
    R(x,0,58,24,12,'#7a2a35');R(x,0,54,24,6,'#8e3446');R(x,104,58,24,12,'#7a2a35');R(x,104,54,24,6,'#8e3446');
    R(x,2,70,2,4,'#3e2418');R(x,20,70,2,4,'#3e2418');R(x,106,70,2,4,'#3e2418');R(x,124,70,2,4,'#3e2418');
  }else if(room==='academy'){
    // ---- 아카데미 (판타지풍 고풍스러운 학교 복도: 대리석 바닥 · 기둥 · 아치 창) ----
    R(x,0,0,128,58,'#e9e2d4');for(const [vx,vy,vl] of [[8,10,9],[30,30,7],[70,14,8],[96,36,6],[116,8,10]])for(let i=0;i<vl;i++)R(x,vx+i,vy+(i%3),1,1,'#d3c8b4');   // 대리석 결
    R(x,0,0,128,4,'#c9a24a');R(x,0,4,128,2,'#a8853a');
    for(const ax of [22,64,106]){   // 아치 창 (푸른 빛)
      x.fillStyle='#8a7f6c';x.beginPath();x.moveTo(ax-10,46);x.lineTo(ax-10,22);x.arc(ax,22,10,Math.PI,0);x.lineTo(ax+10,46);x.closePath();x.fill();
      x.fillStyle='#bcd8f2';x.beginPath();x.moveTo(ax-8,46);x.lineTo(ax-8,22);x.arc(ax,22,8,Math.PI,0);x.lineTo(ax+8,46);x.closePath();x.fill();
      R(x,ax-1,14,2,32,'#8a7f6c');R(x,ax-8,30,16,2,'#8a7f6c');x.fillStyle='rgba(255,255,255,.35)';x.fillRect(ax-7,18,3,26);}
    for(const cx of [0,43,85,124]){   // 기둥 (금 장식)
      R(x,cx,6,8,52,'#f4efe6');R(x,cx+1,6,1,52,'#ffffff');R(x,cx+6,6,2,52,'#d8cfbf');R(x,cx-1,6,10,4,'#c9a24a');R(x,cx-1,54,10,4,'#c9a24a');R(x,cx+3,10,1,44,'#e2d9c8');}
    for(const bx of [30,92]){R(x,bx,8,8,14,'#2f4f8a');R(x,bx,8,8,1,'#c9a24a');x.fillStyle='#2f4f8a';x.beginPath();x.moveTo(bx,22);x.lineTo(bx+4,26);x.lineTo(bx+8,22);x.closePath();x.fill();R(x,bx+3,13,2,4,'#e3c26a');}   // 깃발
    R(x,0,58,128,30,'#f2ede4');for(let j=0;j<6;j++)for(let i=0;i<16;i++)if((i+j)%2)R(x,i*8,58+j*5,8,5,'#3a3542');   // 체크 대리석 바닥
    R(x,0,58,128,1,'#c9a24a');
    R(x,40,58,48,30,'#8e2b3a');R(x,42,58,44,30,'#a8394a');for(let j=62;j<88;j+=6)R(x,44,j,40,1,'#c9a24a');   // 붉은 카펫
  }else if(room==='garden'){
    // ---- 바이에른 궁 전정 (왕궁 정원) ----
    R(x,0,0,128,26,'#bfe3ff');R(x,0,20,128,6,'#d8efff');
    R(x,8,8,112,22,'#fbf3e0');R(x,8,8,112,2,'#e3c26a');                       // 궁전 정면
    for(let i=12;i<118;i+=8){R(x,i,13,4,7,'#7fb6e0');R(x,i,13,4,1,'#e3c26a');R(x,i+1,21,2,7,'#e9dcc0');}
    for(const [cx,w] of [[18,14],[64,22],[110,14]]){x.fillStyle='#5f9fd6';x.beginPath();x.arc(cx,8,w/2,Math.PI,0);x.fill();R(x,cx,0,1,8-w/2,'#e3c26a');R(x,cx-1,0,3,2,'#ffd36b');}
    R(x,0,28,128,26,'#7fc48a');                                                  // 잔디
    R(x,52,28,24,60,'#efe2c2');x.fillStyle='#efe2c2';x.beginPath();x.moveTo(52,54);x.lineTo(76,54);x.lineTo(96,88);x.lineTo(32,88);x.closePath();x.fill();   // 자갈길
    for(const sx of [6,92]){R(x,sx,34,30,14,'#3f8f4f');R(x,sx+2,36,26,10,'#4fa85f');               // 문양 화단
      for(let i=sx+4;i<sx+28;i+=6){R(x,i,38,3,3,'#ff8fb1');R(x,i+2,42,3,3,'#ffd36b');}}
    for(const tx of [4,40,86,122]){x.fillStyle='#2f7f45';x.beginPath();x.moveTo(tx,24);x.lineTo(tx+4,40);x.lineTo(tx-4,40);x.closePath();x.fill();R(x,tx-1,40,2,3,'#7a5236');}   // 원뿔 정원수
    x.fillStyle='#d9e4ef';x.beginPath();x.ellipse(64,44,14,5,0,0,7);x.fill();x.fillStyle='#8fd0ec';x.beginPath();x.ellipse(64,44,11,3.5,0,0,7);x.fill();   // 분수
    R(x,63,33,3,10,'#e3c26a');R(x,60,32,9,2,'#e3c26a');for(let i=0;i<5;i++)R(x,58+i*3,28+(i%2),1,4,'#cfeeff');
    R(x,0,54,128,34,'#6fb87a');for(let j=56;j<88;j+=4)for(let i=(j%8?2:6);i<128;i+=8)R(x,i,j,1,1,'#85c98e');
    x.fillStyle='#efe2c2';x.beginPath();x.moveTo(44,54);x.lineTo(84,54);x.lineTo(104,88);x.lineTo(24,88);x.closePath();x.fill();
    for(const gx of [2,118]){R(x,gx,48,8,30,'#e3c26a');R(x,gx+1,46,6,3,'#ffd36b');R(x,gx+2,52,4,22,'#c9a24a');}   // 금빛 문기둥
    for(let i=0;i<16;i++){const fx=(i*29)%120+4, fy=60+(i*13)%24; if(fx>28&&fx<100)continue; R(x,fx,fy,2,2,['#ff8fb1','#ffd36b','#ffffff','#c59cff'][i%4]);}
  }else if(room==='hall'){
    // ---- 그레이트 홀 (거대한 계단 + 조각상) ----
    R(x,0,0,128,88,'#f6ecd6');
    for(let i=0;i<128;i+=16){R(x,i,0,3,56,'#e3c26a');R(x,i+1,0,1,56,'#fff3c4');}                     // 금빛 기둥
    R(x,0,0,128,4,'#c9a24a');for(let i=2;i<128;i+=6)R(x,i,4,3,2,'#e3c26a');
    R(x,40,6,48,12,'#bfe3ff');R(x,40,6,48,1,'#e3c26a');x.fillStyle='#bfe3ff';x.beginPath();x.arc(64,6,24,Math.PI,0);x.fill();   // 위 창
    R(x,63,0,2,18,'#e3c26a');R(x,40,12,48,1,'#e3c26a');
    for(let k=0;k<10;k++){const w=30+k*6,y=18+k*4;R(x,64-w/2,y,w,4,k%2?'#efe4ce':'#e6d8bc');R(x,64-w/2,y+3,w,1,'#cdbb98');   // 계단
      R(x,64-(w*.42)/2,y,w*.42,4,'#c8283c');R(x,64-(w*.42)/2,y,w*.42,1,'#e04a5a');}
    for(const sd of [-1,1]){for(let k=0;k<10;k++){const w=30+k*6,y=18+k*4;R(x,64+sd*w/2-(sd>0?2:0),y-3,2,5,'#e3c26a');}}       // 금 난간
    R(x,0,58,128,30,'#efe8dc');for(let j=58;j<88;j+=6)for(let i=(((j-58)/6)%2?6:0);i<128;i+=12)R(x,i,j,6,6,'#d8cbb4');   // 대리석 바닥
    R(x,50,58,28,30,'#c8283c');R(x,52,58,24,30,'#d63a4c');
    for(const sx of [8,104]){R(x,sx,46,16,12,'#e3c26a');R(x,sx+1,44,14,3,'#ffd36b');                                // 조각상
      x.fillStyle='#f4f1ec';x.beginPath();x.arc(sx+8,22,4,0,7);x.fill();R(x,sx+5,26,6,14,'#f4f1ec');R(x,sx+3,28,2,8,'#f4f1ec');R(x,sx+11,24,2,9,'#f4f1ec');R(x,sx+5,40,2,6,'#ebe6df');R(x,sx+9,40,2,6,'#ebe6df');
      R(x,sx+6,27,1,12,'#ddd6cc');}
    for(const cx of [24,104]){R(x,cx,0,1,8,'#c9a24a');R(x,cx-6,8,13,2,'#e3c26a');for(const dx of [-6,0,6])R(x,cx+dx,10,1,3,'#fff3b0');}   // 샹들리에
  }else if(room==='prince'||room==='nikolaus'||room==='bprince'){
    // ---- 왕세자 방 (니콜라우스 방은 색만 다르게) ----
    const P=room==='prince'?{w:'#cfe8fb',w2:'#b8dcf7',c:'#7fb6e0',c2:'#4f8fc8',r1:'#2f4f8a',r2:'#4f8fc8'}:room==='bprince'?{w:'#fbd6d6',w2:'#f5c0c0',c:'#e07f7f',c2:'#c84f4f',r1:'#8a2f2f',r2:'#c84f4f'}:{w:'#d8ecd6',w2:'#c4e0c0',c:'#6fae7a',c2:'#3f8f4f',r1:'#2f4f8a',r2:'#4f8fc8'};
    R(x,0,0,128,56,P.w);for(let i=4;i<128;i+=20){R(x,i,8,14,36,P.w2);x.strokeStyle='#e3c26a';x.lineWidth=1;x.strokeRect(i+.5,8.5,13,35);}   // 금 액자 패널
    R(x,0,0,128,4,'#e3c26a');for(let i=0;i<128;i+=5)R(x,i+1,4,3,2,'#c9a24a');R(x,0,54,128,2,'#c9a24a');
    R(x,0,56,128,32,'#e8d5b0');for(let j=58;j<88;j+=5)R(x,0,j,128,1,'#d6be92');
    R(x,92,10,24,34,'#fff7e0');R(x,94,12,20,30,'#bfe3ff');R(x,103,12,2,30,'#e3c26a');R(x,94,26,20,2,'#e3c26a');   // 창 + 커튼
    R(x,88,8,6,40,P.c);R(x,114,8,6,40,P.c);R(x,88,6,32,4,'#e3c26a');
    // 캐노피 거대 침대
    R(x,0,4,58,6,'#e3c26a');R(x,0,10,58,4,P.c2);for(let i=0;i<58;i+=6){x.fillStyle=P.c2;x.beginPath();x.moveTo(i,14);x.lineTo(i+6,14);x.lineTo(i+3,18);x.closePath();x.fill();}
    R(x,2,10,4,62,'#e3c26a');R(x,52,10,4,62,'#e3c26a');R(x,0,10,4,40,P.c);R(x,54,10,4,40,P.c);
    R(x,8,22,42,22,'#e3c26a');R(x,10,24,38,18,'#fff3d8');x.fillStyle='#e3c26a';x.beginPath();x.arc(29,24,8,Math.PI,0);x.fill();
    R(x,4,46,50,10,'#ffffff');R(x,8,44,16,6,'#fffaf0');R(x,32,44,16,6,'#fffaf0');
    R(x,4,52,50,16,P.c);R(x,4,52,50,2,'#e3c26a');for(let i=8;i<52;i+=8)R(x,i,58,3,3,'#ffd36b');R(x,4,68,50,4,'#c9a24a');
    for(const cx of [80]){R(x,cx,0,1,8,'#c9a24a');R(x,cx-8,8,17,2,'#e3c26a');for(const dx of [-8,-3,3,8])R(x,cx+dx,10,1,3,'#fff3b0');}   // 샹들리에
    R(x,94,60,24,6,'#e3c26a');R(x,96,66,3,10,'#c9a24a');R(x,113,66,3,10,'#c9a24a');R(x,100,56,6,4,'#ffffff');   // 금 탁자
    R(x,30,74,70,12,P.r1);R(x,32,76,66,8,P.r2);for(let i=36;i<96;i+=6)R(x,i,79,2,2,'#ffd36b');
  }else if(room==='kitchen'){
    // ---- kitchen ----
    R(x,0,0,128,54,'#fff8ee');
    for(let j=0;j<54;j+=6)for(let i=(j/6%2)?0:3;i<128;i+=6){R(x,i,j,6,1,'#f0e2cc');R(x,i,j,1,6,'#f0e2cc');}
    R(x,0,22,128,10,'#cdeee4');for(let i=0;i<128;i+=8)R(x,i,22,4,10,'#b6e3d6');   // mint tile band
    // window
    R(x,46,4,36,16,'#c98a5a');R(x,48,6,32,12,'#cdeeff');R(x,63,6,2,12,'#c98a5a');R(x,48,11,32,1,'#c98a5a');
    R(x,44,2,40,3,'#ff9cc8');for(let i=44;i<84;i+=4)R(x,i,5,2,2,'#ffc2dd');
    // hanging pans / utensils
    R(x,6,4,40,1,'#8a6a4a');
    x.fillStyle='#6b6f86';x.beginPath();x.arc(14,14,5,0,7);x.fill();R(x,13,5,2,5,'#6b6f86');
    x.fillStyle='#e8894a';x.beginPath();x.arc(28,13,4,0,7);x.fill();R(x,27,5,2,5,'#a8673e');
    R(x,38,5,1,10,'#a8673e');R(x,36,14,5,3,'#a8673e');
    // fridge
    R(x,100,8,24,48,'#e9f4ff');R(x,100,8,24,1,'#ffffff');R(x,100,26,24,1,'#b8c8dc');R(x,102,14,1,8,'#9aaac0');R(x,102,30,1,10,'#9aaac0');
    R(x,108,12,4,3,'#ff8fb1');R(x,114,30,3,4,'#ffd36b');
    // counter + stove + sink
    R(x,0,36,98,18,'#c98a5a');R(x,0,34,98,3,'#f3e5c8');R(x,0,37,98,1,'#a8673e');
    for(let i=4;i<98;i+=16){R(x,i,40,12,12,'#d79a6a');R(x,i+5,44,2,1,'#8a5a3c');}
    R(x,8,30,18,4,'#4a4e62');x.fillStyle='#ff7a3d';x.fillRect(11,33,3,1);x.fillRect(20,33,3,1);   // stove
    R(x,10,25,10,5,'#6b6f86');R(x,10,25,10,1,'#9aa0b8');R(x,13,22,1,2,'#ffffff');R(x,16,20,1,2,'#ffffff');  // pot
    R(x,70,32,20,3,'#b8c8dc');R(x,72,33,16,1,'#8ab8d8');R(x,79,26,2,6,'#9aa0b8');R(x,79,26,5,1,'#9aa0b8'); // sink
    R(x,54,30,8,4,'#ffffff');R(x,55,29,6,1,'#fff3d0');   // bowl
    // floor
    for(let j=0;j<9;j++)for(let i=0;i<16;i++)R(x,i*8,54+j*4,8,4,((i+j)%2)?'#ffd9b8':'#fff3e2');
    R(x,0,54,128,1,'#e6c9a8');
    // mat
    R(x,40,76,48,10,'#ff9cc8');R(x,42,78,44,6,'#ffc2dd');for(let i=44;i<86;i+=6)R(x,i,80,2,2,'#ff9cc8');
  }else{
    // ---- park ----
    R(x,0,0,128,20,'#bfe7ff');R(x,0,20,128,14,'#d9f2ff');
    for(const [cx,cy] of [[18,8],[78,5],[104,13]]){R(x,cx,cy,14,4,'#ffffff');R(x,cx+3,cy-2,8,2,'#ffffff');}
    // far trees
    for(let i=-4;i<132;i+=10){x.fillStyle=i%20?'#8fd19e':'#7cc58f';x.beginPath();x.arc(i,36,8,Math.PI,0);x.fill();}
    R(x,0,36,128,52,'#a8e2a0');
    for(let j=40;j<88;j+=5)for(let i=(j*7)%9;i<128;i+=11)R(x,i,j,1,2,'#93d38c');
    // path
    x.fillStyle='#f3dfb8';x.beginPath();x.moveTo(52,40);x.lineTo(76,40);x.lineTo(108,88);x.lineTo(20,88);x.closePath();x.fill();
    x.fillStyle='#e6cc9c';for(let j=44;j<88;j+=6)x.fillRect(64-(j-40)*.3,j,1,1);
    // big tree (left)
    R(x,10,26,6,34,'#8a5a3c');R(x,11,26,2,34,'#a06c48');
    x.fillStyle='#5fbf6a';for(const [cx,cy,r] of [[13,18,12],[4,26,8],[22,26,9],[13,8,8]]){x.beginPath();x.arc(cx,cy,r,0,Math.PI*2);x.fill();}
    x.fillStyle='#7fd88a';x.beginPath();x.arc(10,14,5,0,Math.PI*2);x.fill();
    R(x,6,20,2,2,'#ff8fb1');R(x,18,12,2,2,'#ff8fb1');R(x,20,24,2,2,'#ff8fb1');
    // lamp post
    R(x,92,24,2,30,'#4a4a6a');R(x,89,20,8,5,'#4a4a6a');R(x,90,21,6,3,'#fff3b0');
    // bench (right)
    R(x,98,48,28,3,'#c98a5a');R(x,98,44,28,2,'#c98a5a');R(x,98,40,28,2,'#c98a5a');
    R(x,100,51,2,8,'#5a5a72');R(x,122,51,2,8,'#5a5a72');R(x,100,40,1,11,'#5a5a72');R(x,123,40,1,11,'#5a5a72');
    // flowers
    const FL=['#ff8fb1','#ffd36b','#ffffff','#c59cff'];
    for(let i=0;i<22;i++){const fx=(i*37)%128, fy=60+((i*23)%26); if(fx>24&&fx<104&&fy<84) continue; R(x,fx,fy,2,2,FL[i%4]);R(x,fx,fy+2,1,2,'#5fae5a');}
    if(night){   // 밤 공원
      x.fillStyle='rgba(16,18,60,.62)';x.fillRect(0,0,128,88);
      R(x,0,0,128,30,'#1b1f4a');for(let i=-4;i<132;i+=10){x.fillStyle='#1d3a3a';x.beginPath();x.arc(i,36,8,Math.PI,0);x.fill();}
      for(const [sx,sy] of [[8,5],[30,12],[46,4],[70,9],[96,4],[118,14],[58,18],[84,20],[20,22]])R(x,sx,sy,1,1,'#fff8c8');
      x.fillStyle='#fff3b0';x.beginPath();x.arc(108,9,5,0,7);x.fill();x.fillStyle='#1b1f4a';x.beginPath();x.arc(110,7,4,0,7);x.fill();
      x.fillStyle='rgba(255,240,170,.22)';x.beginPath();x.moveTo(89,25);x.lineTo(97,25);x.lineTo(108,58);x.lineTo(78,58);x.closePath();x.fill();
      R(x,90,21,6,3,'#fff3b0');
    }
  }
  return c;
}

const PAGE_BG=[
  {name:'기본',     make:null},
  {name:'별밤',     make:(x)=>{R(x,0,0,90,160,'#3d3a7a');R(x,0,60,90,60,'#4d4890');R(x,0,110,90,50,'#6a5aa8');
      for(let i=0;i<60;i++){const sx=(i*37)%90, sy=(i*53)%120; R(x,sx,sy,1,1,i%5?'#fff6c8':'#ffd1f0'); if(i%9===0){R(x,sx-1,sy,3,1,'#fff6c8');R(x,sx,sy-1,1,3,'#fff6c8');}}
      x.fillStyle='#fff3b8';x.beginPath();x.arc(66,22,10,0,7);x.fill();x.fillStyle='#3d3a7a';x.beginPath();x.arc(71,19,9,0,7);x.fill();
      for(let i=0;i<90;i+=6){x.fillStyle='#2f2d63';x.beginPath();x.arc(i,152,7,Math.PI,0);x.fill();} R(x,0,152,90,8,'#2f2d63');}},
  {name:'민트 도트', make:(x)=>{R(x,0,0,90,160,'#d9f6ec');for(let y=4;y<160;y+=8)for(let i=4;i<90;i+=8)R(x,i,y,2,2,'#ffffff');}},
  {name:'라벤더 도트', make:(x)=>{R(x,0,0,90,160,'#e6defa');for(let y=4;y<160;y+=8)for(let i=4;i<90;i+=8)R(x,i,y,2,2,(i/8+y/8)%2?'#ffc8e2':'#ffffff');}},
  {name:'딸기체크', make:(x)=>{R(x,0,0,90,160,'#fff5f7');
      for(let j=0;j<160;j+=10)for(let i=0;i<90;i+=10){if((i/10+j/10)%2)R(x,i,j,10,10,'#ffd6e0');} for(let j=0;j<160;j+=10)R(x,0,j,90,5,'rgba(255,170,195,.35)');
      const sb=(cx,cy)=>{R(x,cx+1,cy,4,1,'#5fbf6a');R(x,cx+2,cy-1,2,1,'#5fbf6a');R(x,cx,cy+1,6,3,'#ff5a7a');R(x,cx+1,cy+4,4,1,'#ff5a7a');R(x,cx+2,cy+5,2,1,'#ff5a7a');
        R(x,cx+1,cy+2,1,1,'#fff3a0');R(x,cx+4,cy+2,1,1,'#fff3a0');R(x,cx+2,cy+4,1,1,'#fff3a0');};
      for(let j=4;j<160;j+=20)for(let i=(j/20%2)?12:2;i<90;i+=20)sb(i,j);}},
  {name:'노을바다', make:(x)=>{const sky=['#ffd1a8','#ffbfae','#ffb0bf','#f7a7d1','#d9a8ea'];sky.forEach((c,i)=>R(x,0,i*18,90,18,c));
      x.fillStyle='#fff0a8';x.beginPath();x.arc(45,86,14,Math.PI,0);x.fill();
      R(x,0,86,90,74,'#8fc9e8');for(let j=90;j<160;j+=6)for(let i=(j%12?0:6);i<90;i+=12)R(x,i,j,6,1,'#c2e6f7');
      for(let j=88;j<120;j+=3)R(x,45-(j-86)*.6,j,(j-86)*1.2,1,'rgba(255,240,170,.55)');
      R(x,0,146,90,14,'#ffe2b8');for(let i=3;i<90;i+=9)R(x,i,149,2,1,'#f5c98f');
      R(x,10,140,6,1,'#ffffff');R(x,70,128,8,1,'#ffffff');}},
];
