const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const COLS = 10;
const ROWS = 20;
const CELL = canvas.width / COLS;
const SHAPES = [
  [[1,1,1,1]],
  [[1,1],[1,1]],
  [[0,1,1],[1,1,0]],
  [[1,1,0],[0,1,1]],
  [[1,0,0],[1,1,1]],
  [[0,0,1],[1,1,1]],
];
const COLORS = ['#00FFFF','#FFFF00','#FFA500','#00FF00','#0000FF','#FF00FF'];
let grid = Array.from({length:ROWS},()=>Array(COLS).fill(0));
let piece = randomPiece();
let dropTimer = 0;
let dropInterval = 600;
let lastTime = 0;
let score=0;let level=1;let running=true;
const statusEl=document.getElementById('status');
const scoreEl=document.getElementById('score');
const levelEl=document.getElementById('level');
const restartBtn=document.getElementById('restart');
restartBtn.onclick=reset;
function randomPiece(){
  const shape=SHAPES[Math.floor(Math.random()*SHAPES.length)];
  return {shape:shape.map(r=>[...r]),x:Math.floor(COLS/2- (shape[0].length)/2),y:-1,color:COLORS[Math.floor(Math.random()*COLORS.length)]};
}
function rotate(piece){
  const rotated = piece.shape[0].map((_, idx)=>piece.shape.map(row=>row[idx]).reverse());
  piece.shape = rotated;
}
function valid(piece,dx=0,dy=0){
  for(let y=0;y<piece.shape.length;y++){
    for(let x=0;x<piece.shape[y].length;x++){
      if(!piece.shape[y][x]) continue;
      const nx=piece.x+x+dx;
      const ny=piece.y+y+dy;
      if(nx<0||nx>=COLS||ny>=ROWS) return false;
      if(ny>=0 && grid[ny][nx]) return false;
    }
  }
  return true;
}
function lockPiece(){
  piece.shape.forEach((row,y)=>{
    row.forEach((cell,x)=>{
      if(cell && piece.y+y>=0) grid[piece.y+y][piece.x+x]=piece.color;
    });
  });
  clearRows();
  piece=randomPiece();
  if(!valid(piece)) running=false;
}
function clearRows(){
  let lines=0;
  for(let y=ROWS-1;y>=0;y--){
    if(grid[y].every(cell=>cell)){
      grid.splice(y,1);grid.unshift(Array(COLS).fill(0));lines++;y++;
    }
  }
  if(lines){
    score+=lines*100;
    level=1+Math.floor(score/1000);
    dropInterval=Math.max(100,600-(level-1)*40);
  }
}
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(let y=0;y<ROWS;y++) for(let x=0;x<COLS;x++) if(grid[y][x]) drawCell(x,y,grid[y][x]);
  piece.shape.forEach((row,y)=>{
    row.forEach((cell,x)=>{
      if(cell && piece.y+y>=0) drawCell(piece.x+x,piece.y+y,piece.color);
    });
  });
}
function drawCell(x,y,color){
  ctx.fillStyle=color;
  ctx.fillRect(x*CELL,y*CELL,CELL-1,CELL-1);
}
function update(time=0){
  const delta=time-lastTime;lastTime=time;
  dropTimer+=delta;
  if(dropTimer>dropInterval){
    if(valid(piece,0,1)) piece.y++;
    else{lockPiece();}
    dropTimer=0;
  }
  draw();
  scoreEl.textContent=`Score: ${score}`;
  levelEl.textContent=`Level: ${level}`;
  statusEl.textContent=`Status: ${running?'running':'game over'}`;
  if(running) requestAnimationFrame(update);
}
requestAnimationFrame(update);
window.addEventListener('keydown',e=>{
  if(!running) return;
  if(e.key==='ArrowLeft'&&valid(piece,-1)) piece.x--;
  if(e.key==='ArrowRight'&&valid(piece,1)) piece.x++;
  if(e.key==='ArrowDown'&&valid(piece,0,1)) piece.y++;
  if(e.key==='ArrowUp'){rotate(piece); if(!valid(piece)) {rotate(piece); rotate(piece); rotate(piece);}}
});
let touchStartX=0, touchStartY=0;
canvas.addEventListener('touchstart',e=>{const t=e.touches[0];touchStartX=t.clientX;touchStartY=t.clientY;});
canvas.addEventListener('touchend',e=>{const t=e.changedTouches[0];const dx=t.clientX-touchStartX;const dy=t.clientY-touchStartY; if(Math.abs(dx)>Math.abs(dy)){
  if(dx>0&&valid(piece,1)) piece.x++; else if(dx<0&&valid(piece,-1)) piece.x--;
}else{if(dy>20&&valid(piece,0,1)) piece.y++; else if(Math.abs(dy)<20){rotate(piece); if(!valid(piece)){rotate(piece);rotate(piece);rotate(piece);}}}
});
function reset(){grid=Array.from({length:ROWS},()=>Array(COLS).fill(0));piece=randomPiece();score=0;level=1;dropInterval=600;running=true;requestAnimationFrame(update);}