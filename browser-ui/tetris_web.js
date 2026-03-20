window.addEventListener('DOMContentLoaded',()=>{
  const canvas=document.getElementById('game');
  const ctx=canvas.getContext('2d');
  const COLS=10,ROWS=20,CELL=canvas.width/COLS;
  const SHAPES=[[[1,1,1,1]],[[1,1],[1,1]],[[0,1,1],[1,1,0]],[[1,1,0],[0,1,1]],[[1,0,0],[1,1,1]],[[0,0,1],[1,1,1]]];
  const COLORS=['#00FFFF','#FFFF00','#FFA500','#00FF00','#0000FF','#FF00FF'];
  let grid=Array.from({length:ROWS},()=>Array(COLS).fill(0));
  let current=randomPiece(); let score=0,level=1; let running=true;
  let dropTimer=0,dropInterval=600,lastTime=0;
  const statusEl=document.getElementById('status');
  const scoreEl=document.getElementById('score');
  const levelEl=document.getElementById('level');
  const restartBtn=document.getElementById('restart');
  restartBtn.onclick=reset;
  document.getElementById('controls').addEventListener('click',e=>{
    if(e.target.tagName!=='BUTTON'||!running) return;
    const action=e.target.dataset.action;
    switch(action){
      case 'left': if(valid(current,-1)) current.x--; break;
      case 'right': if(valid(current,1)) current.x++; break;
      case 'down': if(valid(current,0,1)) current.y++; break;
      case 'rotate': rotate(current); if(!valid(current)){rotate(current);rotate(current);rotate(current);} break;
    }
  });
  function randomPiece(){
    const shape=SHAPES[Math.floor(Math.random()*SHAPES.length)];
    return {shape:shape.map(row=>[...row]),x:Math.floor(COLS/2-(shape[0].length)/2),y:-1,color:COLORS[Math.floor(Math.random()*COLORS.length)]};
  }
  function rotate(piece){ piece.shape=piece.shape[0].map((_,idx)=>piece.shape.map(row=>row[idx]).reverse()); }
  function valid(piece,dx=0,dy=0){
    for(let y=0;y<piece.shape.length;y++)
      for(let x=0;x<piece.shape[y].length;x++){
        if(!piece.shape[y][x]) continue;
        const nx=piece.x+x+dx; const ny=piece.y+y+dy;
        if(nx<0||nx>=COLS||ny>=ROWS) return false;
        if(ny>=0 && grid[ny][nx]) return false;
      }
    return true;
  }
  function lockPiece(){
    current.shape.forEach((row,y)=>row.forEach((cell,x)=>{if(cell && current.y+y>=0) grid[current.y+y][current.x+x]=current.color;}));
    clearRows(); current=randomPiece(); if(!valid(current)) running=false;
  }
  function clearRows(){
    let lines=0;
    for(let y=ROWS-1;y>=0;y--){
      if(grid[y].every(cell=>cell)){grid.splice(y,1);grid.unshift(Array(COLS).fill(0));lines++;y++;}
    }
    if(lines){score+=lines*100;level=1+Math.floor(score/1000);dropInterval=Math.max(100,600-(level-1)*40);}
  }
  function draw(){
    ctx.fillStyle='#000';ctx.fillRect(0,0,canvas.width,canvas.height);
    grid.forEach((row,y)=>row.forEach((cell,x)=>{if(cell) drawCell(x,y,cell);}));
    current.shape.forEach((row,y)=>row.forEach((cell,x)=>{if(cell&&current.y+y>=0) drawCell(current.x+x,current.y+y,current.color);}));
  }
  function drawCell(x,y,color){ctx.fillStyle=color;ctx.fillRect(x*CELL,y*CELL,CELL-1,CELL-1);}
  function reset(){grid=Array.from({length:ROWS},()=>Array(COLS).fill(0));current=randomPiece();score=0;level=1;dropInterval=600;running=true;requestAnimationFrame(update);}  
  function update(time=0){
    if(!running){statusEl.textContent='Status: game over';return;}
    const delta=time-lastTime;lastTime=time;dropTimer+=delta;
    if(dropTimer>dropInterval){ if(valid(current,0,1)) current.y++; else lockPiece(); dropTimer=0; }
    draw(); scoreEl.textContent=`Score: ${score}`; levelEl.textContent=`Level: ${level}`;
    requestAnimationFrame(update);
  }
  window.addEventListener('keydown',e=>{if(!running)return; if(e.key==='ArrowLeft'&&valid(current,-1)) current.x--; if(e.key==='ArrowRight'&&valid(current,1)) current.x++; if(e.key==='ArrowDown'&&valid(current,0,1)) current.y++; if(e.key==='ArrowUp'){rotate(current); if(!valid(current)){rotate(current);rotate(current);rotate(current);}}});
  requestAnimationFrame(update);
});