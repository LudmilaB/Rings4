 	  var Cookie="best-rings4";
	
	  var cells=4;   //cellsxcells in game table
	  var RpCell=4;   //in one cell RpCell rings
	  
	  var colors=["red", "Green", "Blue","Yellow","purple"];
	  var score=0;
	  var canvas = document.getElementById('myCanvas');
	  var ctx = canvas.getContext('2d');
	  
      var best=window.localStorage.getItem(Cookie);
	  document.getElementById('best-container').innerHTML=best;
	  
	  var dragging=false;
	  var redragging=false;
	  var mouseX;
	  var mouseY;
	  var dragHoldX;
	  var dragHoldY;

	  var ring_rad=[15,25,35,45,55];			 

	  var Rings=new Array(cells);
	  for (var i=0; i<cells; i++)
		  Rings[i]=new Array(cells);
	  for (var i=0; i<cells; i++)
		  for (var j=0; j<cells; j++)
		  Rings[i][j]=new Array(RpCell+1);  // 1 more for indicating where max radius ring is
	  var StartP;   // start point for Ring (outside)
	  var Ring;     //ring outsise
	  var Ring1;     //ring dragged
	  var Returni, Returnj, Returnk;
      var RingInCell = new sound("sounds/menu-button-click-switch-01.mp3");
	  var MistakeSound = new sound("sounds/notification-alert-95.mp3");
	  var RingsDissapear = new sound("sounds/correct-answer-bell-gliss-04.mp3");
	  var EndOfGameSound = new sound("sounds/correct-answer-bell-gliss-01.mp3");
	  
	  var PlaySounds=false;
	  StartGame();

function shape(ct_x, ct_y,type)
{
	this.ct_x=ct_x;
	this.ct_y=ct_y;
	var ind=Math.floor(Math.random() * RpCell);
	this.clr=colors[ind];
	this.r=ring_rad[ind];
	this.ind=ind;
}		  

 	 function StartGame(){
		
	  RemoveMessage();
	  
	  for (var i=0;i<cells;i++)	
		 for (var j=0;j<cells;j++)
		 {
			for (var k=0;k<RpCell;k++)
		        Rings[i][j][k]=0;
			Rings[i][j][RpCell]=-1;  //where max radius ring is
	     }
	    
	  score=0;
	  level=1;	
	  document.getElementById('best-container').innerHTML=best;
	  document.getElementById('score-container').innerHTML=0;
//	  Start=true;	
	  canvas.height=500;
	  canvas.width=400;
	  var w=canvas.width;
	  var h=canvas.height;
	  StartP=new point(w/2, w+(h-w)/2);
	  AddRing();
	  Ring1=new shape(-1000,-1000, "ring");
	  draw();
	  canvas.addEventListener("mousedown", mouseDownListener, false);
	  canvas.addEventListener("touchstart", touchStartListener, false);
	}
  
	  function draw()
	  {  
	     DrawField();	 
         ctx.lineWidth=8;		
       
	  for (var i=0;i<cells;i++)	
	  {
		 for (var j=0;j<cells;j++)
			 for (var k=0;k<RpCell;k++)
		       if( Rings[i][j][k]!=0 )
			   {
				 ctx.beginPath();
				 var ct_x=(j+.5)*canvas.width/cells;
			     var ct_y=(i+.5)*canvas.width/cells;
				 ctx.arc(ct_x, ct_y, ring_rad[k], 0, 2 * Math.PI, false);
    	         ctx.strokeStyle = colors[k];
				 ctx.stroke(); 
			   }
	  }	
	  DrawRing(Ring);
	  if(redragging)
		  DrawRing(Ring1);
     }

	 
	 function DrawRing(r){
		ctx.beginPath();
        ctx.arc(r.ct_x, r.ct_y, r.r, 0, 2 * Math.PI, false);
    	ctx.strokeStyle = r.clr;	
        ctx.lineWidth=8;		
        ctx.stroke(); 
		 
	 }
	 function AddRing(){	
       Ring=new shape(StartP.x, StartP.y, "ring");		    
	 }
	 
	 function DrawField(){
		ctx.beginPath();
		var w=canvas.width;
		ctx.clearRect(0, 0, w, canvas.height);	
		ctx.fillStyle= "#eee4da";
		ctx.fillRect(0, 0, w, w);
		ctx.fillStyle= "#a0b9fd";
		ctx.fillRect(0, w, w, canvas.height-w);
		canvas.style.border = "0px";
		ctx.strokeStyle="MediumBlue";
		ctx.lineWidth=2;
	    ctx.moveTo(1,1);   //for border - next 5 lines
		ctx.lineTo(1,w);
		ctx.lineTo(w-1,w);
		ctx.lineTo(w-1,1);
		ctx.lineTo(1,1); 
		for( i=0; i<cells; i++)
		{
			from_edge=w/cells*i;
			ctx.moveTo(1,from_edge);
			ctx.lineTo(w,from_edge);
			ctx.moveTo(from_edge,1);
			ctx.lineTo(from_edge,w);
		}
		
		ctx.stroke();
		 
	 }
	 

function touchStartListener(evt){
	
	return mouseDownListener(evt);
}
function mouseDownListener(evt) {
	//    if(evt.type!="mousemove")
			//evt.preventDefault();
		
		//getting mouse position correctly, being mindful of resizing that may have occured in the browser:
		var bRect = canvas.getBoundingClientRect();
		var clientX= evt.type=="mousedown"? evt.clientX:evt.changedTouches[0].clientX;
		var clientY= evt.type=="mousedown"? evt.clientY:evt.changedTouches[0].clientY;
		mouseX = (clientX - bRect.left)*(canvas.width/bRect.width);
		mouseY = (clientY - bRect.top)*(canvas.height/bRect.height);
//		document.getElementById('score-container').innerHTML=evt.changedTouches[0].clientX;

		var quadr = whatQuadrant(mouseX,mouseY);
		if( quadr!=null)
		{
           for(var i =RpCell-1; i>=0; i--)
		   {
			   if(Rings[quadr[0]][quadr[1]][i]==1)
			   {
				 Rings[quadr[0]][quadr[1]][i]=0;
				 dragging = true;
			     redragging=true; 
				 
				 Ring1.ct_x=(quadr[1]+.5)*canvas.width/cells;
				 Ring1.ct_y=(quadr[0]+.5)*canvas.width/cells;
				 Ring1.r=ring_rad[i];
				 Ring1.clr=colors[i];
				 Ring1.ind=i;
				 
				 Returni=quadr[0]; 
				 Returnj=quadr[1]; 
				 Returnk=i;
				 
				 dragHoldX = mouseX - Ring1.ct_x;
			     dragHoldY = mouseY - Ring1.ct_y;
				 break;
			   }			   
		   }
	
		}		
		else if(hitTest(Ring, mouseX, mouseY))
		{
			dragging = true;
			redragging=false;
			dragHoldX = mouseX - Ring.ct_x;
			dragHoldY = mouseY - Ring.ct_y;
		}
		
			
		if (dragging) {
			window.addEventListener("mousemove", mouseMoveListener, false);
			window.addEventListener("touchmove", touchMoveListener, false);
		}
		if(quadr!=null ||dragging)
		   evt.preventDefault();
		
		canvas.removeEventListener("mousedown", mouseDownListener, false);
		canvas.removeEventListener("touchstart", touchStartListener, false);
		window.addEventListener("mouseup", mouseUpListener, false);
		window.addEventListener("touchend", touchEndListener, false);
		
		//code below prevents the mouse down from having an effect on the main browser window:
	/*	if (evt.preventDefault||evt.type!="mousedown") {
			evt.preventDefault();
		} //standard
		else if (evt.returnValue) {
			evt.returnValue = false;
		} //older IE  */
	//	document.getElementById('score-container').innerHTML=evt.changedTouches[0].clientX;
		return false;
	}

	function touchEndListener(evt){
		return mouseUpListener(evt);
	}
	
 	function mouseUpListener(evt) {
	//	if(evt.type!="mousemove")
		//	evt.preventDefault();
		canvas.addEventListener("mousedown", mouseDownListener, false);
		canvas.addEventListener("touchstart", touchStartListener, false);
		window.removeEventListener("mouseup", mouseUpListener, false);
		window.removeEventListener("touchend", touchEndListener, false);
		if (dragging) {
			dragging = false;
			window.removeEventListener("mousemove", mouseMoveListener, false);
			window.removeEventListener("touchmove", touchMoveListener, false);

			var rng=redragging==false?Ring:Ring1;
			var quadr = whatQuadrant(rng.ct_x,rng.ct_y);
			if( quadr!=null && Rings[quadr[0]][quadr[1]][rng.ind]==0 && rng.ind > Rings[quadr[0]][quadr[1]][RpCell])  //you can leave ring here
			{
				Rings[quadr[0]][quadr[1]][rng.ind]=1;
				Rings[quadr[0]][quadr[1]][RpCell]= rng.ind;
				var x=(quadr[1]+.5)*canvas.width/cells;  //x and y of quadrant cener
			    var y=(quadr[0]+.5)*canvas.width/cells;
				if(redragging==false)
				{
				    AddRing();
					score++;
					MovingScore('+1', x, y, 0 );
			    }
				else  //change largest ring in cell where ring was taken from
				{
					Rings[Returni][Returnj][RpCell]= -1;
					for (var i= rng.ind-1; i>=0; i--)
					{
						if(Rings[Returni][Returnj][i]==1)
						{
							Rings[Returni][Returnj][RpCell]=i;
							break;
						}
					}
					
				}
                                var bFullCell=false;  //cell has max rings
				Ring1.ct_x=-1000;
				Ring1.ct_y=-1000;
				if(rng.ind==RpCell-1) //check for complete cell
				{
					var rings=1;
					for(var i=0; i<RpCell-1; i++)
					{
						if(Rings[quadr[0]][quadr[1]][i]==0)
							break;
						else 
							rings++;
					}

					if (rings==RpCell) //if cell has max rings- empty it
					{
						for(var i=0; i<RpCell; i++)
					       Rings[quadr[0]][quadr[1]][i]=0;
						Rings[quadr[0]][quadr[1]][RpCell]=-1;
						score+=10;
						MovingScore('+10', x, y, 0 );
                                                bFullCell=true;
						RingsDissapear.play();
					}
				}
                               if(!bFullCell && !redragging)
					RingInCell.play();
	            document.getElementById('score-container').innerHTML=score;
	 
	            if(score > best)
	            {
	               best=score;
	               document.getElementById('best-container').innerHTML= best;
				   window.localStorage.setItem(Cookie, best );	
		        }
				
            //    draw();
				if(EndOfGame()==true)
				{
                                        EndOfGameSound.play();
					messageContainer = document.querySelector(".game-message");
					messageContainer.classList.add("game-over");
					messageContainer.getElementsByTagName("p")[0].textContent ="Out of moves";
	//				ShareScore();
				}
				
			}
			else
			{
                                MistakeSound.play();
				if(redragging==false)
				{
				  Ring.ct_x=StartP.x;
				  Ring.ct_y=StartP.y;
				}
				else
				   Rings[Returni][Returnj][Returnk]=1;
			}
			redragging=false;
		}
		draw();
	}

	function touchMoveListener(evt){
//		document.getElementById('score-container').innerHTML=evt.changedTouches[0].clientX;
		return mouseMoveListener(evt);
	}
	function mouseMoveListener(evt) {
	//	document.getElementById('score-container').innerHTML=evt.changedTouches[0].clientX;
		if(evt.type!="mousemove")
			evt.preventDefault();

		var rng=redragging==false?Ring:Ring1;
		var posX;
		var posY;
		var shapeRad = rng.r;
		var minX = shapeRad+2;
		var maxX = canvas.width - shapeRad-2;
		var minY = shapeRad+2;
		var maxY = canvas.height - shapeRad-2;
		//getting mouse position correctly 
		var bRect = canvas.getBoundingClientRect();
		var clientX= evt.type=="mousemove"? evt.clientX:evt.changedTouches[0].clientX;
		var clientY= evt.type=="mousemove"? evt.clientY:evt.changedTouches[0].clientY;
//		document.getElementById('best-container').innerHTML=evt.changedTouches[0].clientX;
		mouseX = (clientX - bRect.left)*(canvas.width/bRect.width);
		mouseY = (clientY - bRect.top)*(canvas.height/bRect.height);
		
		//clamp x and y positions to prevent object from dragging outside of canvas
		posX = mouseX - dragHoldX;
		posX = (posX < minX) ? minX : ((posX > maxX) ? maxX : posX);
		posY = mouseY - dragHoldY;
		posY = (posY < minY) ? minY : ((posY > maxY) ? maxY : posY);
		
		rng.ct_x = posX;
		rng.ct_y = posY;
		draw();
	}
	
	function hitTest(shape,mx,my) {
		
		var dx;
		var dy;
		dx = mx - shape.ct_x;
		dy = my - shape.ct_y;
		var rad= shape.r<45?45:shape.r+7;
		
		//a "hit" will be registered if the distance away from the center is less than the radius of the circular object		
		return (dx*dx + dy*dy < rad*rad);
	}  
	
	function point(x,y){
		this.x=x;
		this.y=y;
	}
	
	function whatQuadrant(X, Y){
		
		var q=[0,0];
		q[1]=Math.floor(X/canvas.width*cells);
		q[0]=Math.floor(Y/canvas.width*cells);
		if(q[0]>cells-1)
			return null;
		return q;
	}
	
	function EndOfGame()
	{
	  var MaxCounts =new Array(RpCell);  //max size rings
	  var TotalRings=new Array(RpCell);    //total ammount 
	  var MaxRingsInOneCell=0;  
	  for (var i=0; i<RpCell; i++)
	  {
		  MaxCounts[i]=0;
	      TotalRings[i]=0;
	  }
	  for (var i=0;i<cells;i++)	
	  {
		 for (var j=0;j<cells;j++)
		 {			
		    if( Rings[i][j][RpCell]==-1 )
			   return false;
		    MaxCounts[Rings[i][j][RpCell]]++;
			
			var max=0;
			for (var k=0; k< RpCell; k++)
				if( Rings[i][j][k]==1 )
				{
				  TotalRings[k]++;
				  if(max!=-1)
				  {
				     max++;
					 if(max>MaxRingsInOneCell)
						 MaxRingsInOneCell=max;
				  }
				}
				else
					max=-1;
		 }
	  }

	  var allcells=cells*cells;
//	  if(MaxCounts[RpCell-1]==allcells)  //all cells have largest circles
//		  return true;
	  var AddRings=MaxRingsInOneCell;
	  for (var i=MaxRingsInOneCell; i< RpCell; i++) 
			if(MaxCounts[i]>0)
				AddRings++;
      if(AddRings==RpCell)	 //you have moves
         return false;
	 
	  for (var i=0; i< RpCell; i++)
	  {
		  if((MaxCounts[i] ==allcells || TotalRings[i]==allcells) && Ring.ind<=i)
			  return true;
	  }
	  return false;
	}
	

function MovingScore(txt, x, y, moves )
{
	if(moves>=30)
	{
		draw();
		return;
	}
   moves++;	
   draw();
   ctx.font = "24px Arial";
   ctx.fillStyle="black";
   ctx.fillText(txt,x,y-moves*2);
   setTimeout( function(){MovingScore(txt, x, y, moves)}, 20);
}
	
function RemoveMessage()
{
		
	  messageContainer = document.querySelector(".game-message");
	  messageContainer.classList.remove("game-over");
      messageContainer.classList.remove("game-continue");  
		
}
function ActivateSounds()
{
      RingInCell.play();
	  RingInCell.stop();
	  MistakeSound.play();
	  MistakeSound.stop();
	  EndOfGameSound.play();
	  EndOfGameSound.stop();  
	  RingsDissapear.play(); 
	  RingsDissapear.stop(); 
}

function ToggleSound()
{
	PlaySounds=!PlaySounds;
	if(PlaySounds)
	{
		ActivateSounds();
		document.getElementById("sound-button").src="res/sound_mute.png";
	}
	else
		document.getElementById("sound-button").src="res/sound.png";
}

function sound(src)
{
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
		if(PlaySounds)
		{
		  this.sound.pause();
          this.sound.currentTime = 0;
          this.sound.play();
		}
    }
    this.stop = function(){
        this.sound.pause();
    }
}
	


	
