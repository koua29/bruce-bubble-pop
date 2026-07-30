// ============================================================================
//  Bubble Pop  -  Bruce / LilyGO T-Embed CC1101
//  A Puzzle-Bobble / bust-a-move for the rotary wheel, laid out sideways to
//  fit the landscape screen: the bubble wall is anchored on the LEFT, the
//  shooter sits on the RIGHT.  Rotate = aim up/down, click = fire, ESC = menu.
//  Match 3+ same-colour bubbles to pop them; disconnected clusters fall.
//  The wall creeps toward you every few shots. Persistent top-5 scores.
// ============================================================================

// --- UI helpers -------------------------------------------------------------
function C(r,g,b){ return display.color(r,g,b); }
var CW=C(255,255,255), CGY=C(140,140,140), CB=C(80,160,255), CY=C(255,200,0),
    CG=C(0,255,90), CR=C(255,70,70), BG=C(0,0,0), HUDBG=C(18,20,34);
function W(){ return display.width(); }
function H(){ return display.height(); }
function clear(){ display.fill(BG); }
function at(x,y,t,col){ display.setTextColor(col); display.drawString(""+t,x,y); }
function purgeKeys(){ for (var i=0;i<6;i++){ keyboard.getAnyPress(); delay(8); } }
function clampf(v,a,b){ return v<a?a:(v>b?b:v); }

// --- geometry / palette -----------------------------------------------------
var HUD=11, ROWS=10, R=7, DX=12, DY=14, X0=8;
var Y0=HUD+R+1;                                  // first row centre y (19)
var SX=W()-12, SY=Math.floor((HUD+H())/2), WBOT=H(), DANGERX=W()-42;
var SHOTSPEED=5;
var PAL=[C(255,70,70),C(255,200,0),C(0,220,90),C(0,190,255),C(200,120,255),C(255,140,0)];

// --- mutable game state (single game at a time -> module globals) -----------
var cols, phase, NC, advEvery, curCol, nextCol, angle, shots, level, score, best;
var aimDots=[];

// --- grid maths (hex, offset columns; parity tracked via `phase`) -----------
function cellX(c){ return X0 + c*DX; }
function cellY(c,r){ return Y0 + r*DY + (((c+phase)&1)?7:0); }
function getCell(c,r){ if(c<0||r<0||r>=ROWS||c>=cols.length) return 0; return cols[c][r]||0; }
function ensureCol(c){ while(cols.length<=c){ var col=[]; for(var i=0;i<ROWS;i++) col.push(0); cols.push(col); } }
function setCell(c,r,v){ if(c<0||r<0||r>=ROWS) return; ensureCol(c); cols[c][r]=v; }
function nbrs(c,r){
  if(!((c+phase)&1)) return [[c,r-1],[c,r+1],[c-1,r-1],[c-1,r],[c+1,r-1],[c+1,r]];
  return                    [[c,r-1],[c,r+1],[c-1,r],[c-1,r+1],[c+1,r],[c+1,r+1]];
}
function occ(){ var n=0; for(var c=0;c<cols.length;c++) for(var r=0;r<ROWS;r++) if(cols[c][r]) n++; return n; }
function inDanger(){ for(var c=0;c<cols.length;c++){ if(cellX(c)>=DANGERX){ for(var r=0;r<ROWS;r++) if(cols[c][r]) return true; } } return false; }
function pickColor(){
  var present=[], seen={};
  for(var c=0;c<cols.length;c++) for(var r=0;r<ROWS;r++){ var v=cols[c][r]; if(v && !seen[v]){ seen[v]=1; present.push(v-1); } }
  if(!present.length) return Math.floor(Math.random()*NC);
  return present[Math.floor(Math.random()*present.length)];
}

// --- drawing ----------------------------------------------------------------
function drawBubbleAt(x,y,ci){ x=Math.round(x); y=Math.round(y);
  display.drawFillCircle(x,y,R,PAL[ci]);
  display.drawCircle(x,y,R,C(0,0,0));
  display.drawFillCircle(x-2,y-2,2,C(255,255,255));
}
function drawHUD(){ display.drawFillRect(0,0,W(),HUD-1,HUDBG);
  at(3,2,"SC "+score,CW); at(110,2,"LV "+level,CY); at(168,2,"best "+best,CGY); }
function drawShooter(){
  display.drawFillCircle(SX,SY,R+2,C(60,60,80));
  drawBubbleAt(SX,SY,curCol);
  display.drawFillCircle(SX,SY+R+12,4,PAL[nextCol]); display.drawCircle(SX,SY+R+12,4,C(0,0,0));
}
function clearAim(){ for(var i=0;i<aimDots.length;i++){ var d=aimDots[i]; display.drawFillRect(d[0]-1,d[1]-1,3,3,BG); } aimDots=[]; }
function drawAim(ang){
  clearAim();
  var x=SX-10, y=SY, vx=-Math.cos(ang), vy=Math.sin(ang), n=0, dots=[];
  for(var step=0; step<240 && n<26; step++){
    x+=vx*4; y+=vy*4;
    if(y<HUD+R){ y=HUD+R; vy=-vy; } else if(y>WBOT-R){ y=WBOT-R; vy=-vy; }
    if(x<=X0+R || hitsGrid(x,y)) break;
    if(step%3===0){ var rx=Math.round(x), ry=Math.round(y); display.drawFillCircle(rx,ry,1,CGY); dots.push([rx,ry]); n++; }
  }
  aimDots=dots;
}
function render(){
  display.drawFillRect(0,HUD,W(),H()-HUD,BG);
  for(var y=HUD;y<H();y+=8) display.drawFastVLine(DANGERX,y,4,C(120,40,40));
  for(var c=0;c<cols.length;c++) for(var r=0;r<ROWS;r++){ var v=cols[c][r]; if(v) drawBubbleAt(cellX(c),cellY(c,r),v-1); }
  drawShooter(); drawHUD(); aimDots=[]; drawAim(angle);
}

// --- collision / flight -----------------------------------------------------
function hitsGrid(x,y){
  if(x<=X0-1) return true;
  var c=Math.round((x-X0)/DX), lim=(2*R-1)*(2*R-1);
  for(var cc=c-1;cc<=c+1;cc++){ if(cc<0||cc>=cols.length) continue;
    for(var rr=0;rr<ROWS;rr++){ if(!cols[cc][rr]) continue;
      var dx=cellX(cc)-x, dy=cellY(cc,rr)-y; if(dx*dx+dy*dy<=lim) return true; } }
  return false;
}
function shoot(ci){
  clearAim();
  var vx=-Math.cos(angle)*SHOTSPEED, vy=Math.sin(angle)*SHOTSPEED, x=SX-8, y=SY, guard=0;
  drawBubbleAt(Math.round(x),Math.round(y),ci);
  while(guard++<5000){
    var ox=Math.round(x), oy=Math.round(y), landed=false;
    for(var s=0;s<3;s++){ x+=vx/3; y+=vy/3;
      if(y<HUD+R){ y=HUD+R; vy=-vy; } else if(y>WBOT-R){ y=WBOT-R; vy=-vy; }
      if(x<=X0+R || hitsGrid(x,y)){ landed=true; break; } }
    display.drawFillRect(ox-R-1,oy-R-1,2*R+3,2*R+3,BG);
    if(landed) break;
    drawBubbleAt(Math.round(x),Math.round(y),ci); delay(6);
  }
  return {x:x,y:y};
}
function snapBall(x,y){
  var c=Math.round((x-X0)/DX); if(c<0) c=0;
  var r=Math.round((y-Y0-(((c+phase)&1)?7:0))/DY); if(r<0) r=0; if(r>=ROWS) r=ROWS-1;
  var cand=[[c,r]], nb=nbrs(c,r); for(var i=0;i<nb.length;i++) cand.push(nb[i]);
  var best2=null, bd=1e9;
  for(var i2=0;i2<cand.length;i2++){ var cc=cand[i2][0], rr=cand[i2][1];
    if(cc<0||rr<0||rr>=ROWS||getCell(cc,rr)!==0) continue;
    var dx=cellX(cc)-x, dy=cellY(cc,rr)-y, d=dx*dx+dy*dy; if(d<bd){ bd=d; best2=[cc,rr]; } }
  return best2 || [c<0?0:c, r];
}
function floodSame(c,r,v){
  var seen={}, stack=[[c,r]], out=[];
  while(stack.length){ var e=stack.pop(), k=e[0]+","+e[1]; if(seen[k]) continue; seen[k]=1;
    if(getCell(e[0],e[1])!==v) continue; out.push(e);
    var nb=nbrs(e[0],e[1]); for(var i=0;i<nb.length;i++){ var kk=nb[i][0]+","+nb[i][1]; if(!seen[kk]) stack.push(nb[i]); } }
  return out;
}
function dropFloating(){
  var seen={}, stack=[];
  for(var r=0;r<ROWS;r++) if(getCell(0,r)!==0) stack.push([0,r]);
  while(stack.length){ var e=stack.pop(), k=e[0]+","+e[1]; if(seen[k]||getCell(e[0],e[1])===0) continue; seen[k]=1;
    var nb=nbrs(e[0],e[1]); for(var i=0;i<nb.length;i++) stack.push(nb[i]); }
  var fell=0;
  for(var c=0;c<cols.length;c++) for(var rr=0;rr<ROWS;rr++) if(cols[c][rr]!==0 && !seen[c+","+rr]){ cols[c][rr]=0; fell++; }
  return fell;
}
function resolveShot(res, ci){
  var cell=snapBall(res.x,res.y), c=cell[0], r=cell[1];
  setCell(c,r,ci+1);
  var cluster=floodSame(c,r,ci+1), popped=0, fell=0;
  if(cluster.length>=3){
    for(var i=0;i<cluster.length;i++) setCell(cluster[i][0],cluster[i][1],0);
    popped=cluster.length; fell=dropFloating();
  }
  score += popped*10*level + fell*20*level;
}
function advance(){
  var col=[]; for(var r=0;r<ROWS;r++) col.push(1+Math.floor(Math.random()*NC));
  cols.unshift(col); phase^=1;
}

// --- level ------------------------------------------------------------------
function startLevel(){
  cols=[]; phase=0; shots=0; angle=0;
  NC=Math.min(6, 4+Math.floor((level-1)/2));
  advEvery=Math.max(4, 7-Math.floor((level-1)/2));
  var start=4+Math.min(level-1,4);
  for(var c=0;c<start;c++){ ensureCol(c); for(var r=0;r<ROWS;r++) cols[c][r]=1+Math.floor(Math.random()*NC); }
  curCol=pickColor(); nextCol=pickColor();
  render();
}

// --- persistent scores ------------------------------------------------------
var SFILE="/bubblepop_scores.json";
function loadScores(){ try { var t=storage.read(SFILE); var a=JSON.parse(""+t); return (a&&a.length)?a:[]; } catch(e){ return []; } }
function saveScores(a){ try { storage.write(SFILE, JSON.stringify(a), "write"); } catch(e){} }
function bestScore(s){ return s.length? s[0].score : 0; }

// --- game loop --------------------------------------------------------------
function playGame(scores){
  best=bestScore(scores); score=0; level=1;
  startLevel(); purgeKeys();
  while(true){
    if(keyboard.getPrevPress()){ angle=clampf(angle-0.09,-1.30,1.30); drawAim(angle); }
    else if(keyboard.getNextPress()){ angle=clampf(angle+0.09,-1.30,1.30); drawAim(angle); }
    else if(keyboard.getSelPress()){
      var res=shoot(curCol);
      resolveShot(res,curCol);
      curCol=nextCol; nextCol=pickColor(); shots++;
      if(shots%advEvery===0) advance();
      render();
      if(occ()===0){ level++; flash("LEVEL "+level,CG); startLevel(); purgeKeys(); }
      else if(inDanger()){ return {score:score,quit:false}; }
    }
    else if(keyboard.getEscPress()){ return {score:score,quit:true}; }
    delay(30);
  }
}
function flash(msg,col){ display.drawFillRect(W()/2-52,H()/2-12,104,24,C(0,0,0)); display.drawRect(W()/2-52,H()/2-12,104,24,col);
  display.setTextSize(2); at(W()/2-46,H()/2-6,msg,col); display.setTextSize(1); delay(700); }

// --- game over --------------------------------------------------------------
function gameOver(sc, scores){
  var qualifies = sc>0 && (scores.length<5 || sc>scores[scores.length-1].score);
  var isBest = sc>0 && sc>bestScore(scores);
  if(qualifies){
    var nm=keyboard.keyboard("",3,"New high score! Initials");
    nm=(nm&&nm.length)?(""+nm).substring(0,3).toUpperCase():"YOU";
    scores.push({name:nm,score:sc}); scores.sort(function(a,b){return b.score-a.score;});
    if(scores.length>5) scores.length=5; saveScores(scores);
  }
  clear();
  display.setTextSize(3); at(W()/2-84,26,"GAME OVER",CR); display.setTextSize(1);
  display.setTextSize(2); at(W()/2-54,70,"Score "+sc,CW);
  if(isBest) at(W()/2-60,96,"NEW BEST!",CY); display.setTextSize(1);
  at(W()/2-78,H()-15,"click = retry    ESC = menu",CGY);
  purgeKeys(); while(true){ if(keyboard.getSelPress()) return "retry"; if(keyboard.getEscPress()) return "menu"; delay(40); }
}

// --- high scores ------------------------------------------------------------
function showScores(scores){
  clear(); display.setTextSize(2); at(6,6,"High Scores",CB); display.setTextSize(1);
  display.drawFastHLine(0,28,W(),CGY);
  if(!scores.length) at(6,44,"no scores yet - go play!",CGY);
  else for(var i=0;i<scores.length;i++){ var y=40+i*20; at(20,y,(i+1)+".",CY); at(60,y,scores[i].name,CW); at(W()-120,y,""+scores[i].score,CG); }
  at(6,H()-14,"any key = back",CGY);
  purgeKeys(); while(!keyboard.getAnyPress()) delay(60);
}

// --- menu -------------------------------------------------------------------
function icoPlay(x,y,col){ display.drawFillTriangle(x+1,y,x+1,y+12,x+12,y+6,col); }
function icoTrophy(x,y,col){ display.drawFillRect(x+2,y,9,6,col); display.drawFastVLine(x+6,y+6,3,col); display.drawFastHLine(x+2,y+10,9,col); }
function icoQuit(x,y,col){ display.drawCircle(x+6,y+7,5,col); display.drawFastVLine(x+6,y+1,6,col); }
function drawIcon(k,x,y,col){ if(k==="play") icoPlay(x,y,col); else if(k==="trophy") icoTrophy(x,y,col); else icoQuit(x,y,col); }
function menu(scores){
  var rows=[{ic:"play",s:"Play"},{ic:"trophy",s:"High Scores"},{ic:"quit",s:"Quit"}];
  var sel=0, dirty=true; purgeKeys();
  while(true){
    if(dirty){
      clear(); display.setTextSize(3); at(W()/2-84,12,"BUBBLE POP",CB); display.setTextSize(1);
      at(W()/2-48,46,"best: "+bestScore(scores),CGY);
      for(var c=0;c<11;c++) drawBubbleAt(20+c*28,66,c%6);   // decorative bubble row
      for(var i=0;i<rows.length;i++){ var y=84+i*22;
        if(i===sel){ display.drawFillRoundRect(W()/2-80,y-3,160,20,3,CB); drawIcon(rows[i].ic,W()/2-72,y,C(0,0,0)); at(W()/2-52,y+2,rows[i].s,C(0,0,0)); }
        else { drawIcon(rows[i].ic,W()/2-72,y,CW); at(W()/2-52,y+2,rows[i].s,CW); } }
      at(6,H()-11,"rotate=aim   OK=fire   ESC=quit",CGY); dirty=false;
    }
    if(keyboard.getPrevPress()){ sel=(sel+rows.length-1)%rows.length; dirty=true; }
    else if(keyboard.getNextPress()){ sel=(sel+1)%rows.length; dirty=true; }
    else if(keyboard.getSelPress()) return sel;
    else if(keyboard.getEscPress()) return 2;
    delay(40);
  }
}

// --- main -------------------------------------------------------------------
function main(){
  var scores=loadScores();
  while(true){
    var m=menu(scores);
    if(m===2) return;
    if(m===1){ showScores(scores); continue; }
    while(true){
      var r=playGame(scores);
      var next=gameOver(r.score, scores);
      if(next==="menu") break;
    }
  }
}
main();
