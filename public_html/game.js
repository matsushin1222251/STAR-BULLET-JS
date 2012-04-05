enchant();
window.onload = function() {

  var game=new Game(680,320);
  game.preload('charge.wav');
  
  game.preload('bomb.wav');
  game.preload('ziki.gif');
  game.preload('spin_effect.gif');
  game.preload('beam.gif');
  game.preload('beam_B.gif');
  game.preload('lock_on.gif');
  game.preload('bomb_b.gif');
  game.preload('bomb_s.gif');
  game.preload('bomb.gif');
  game.preload('lazer.gif');
  game.preload('zako.gif');
  game.preload('ring.gif');
  game.preload('window.png');
  game.preload('hp_gage.gif');
  game.preload('houdai.gif');
  game.preload('item.gif');
  game.preload('boss_bomb.gif');
  game.preload('boss_body.gif');
  game.preload('boss_shoulder.gif');
  game.preload('boss_arm.gif');
  game.preload('boss_head.gif');
  game.preload('boss_lazer.gif');
  game.preload('boss_shield.gif');
  game.preload('background.gif');
  game.preload('start.png');
  
  game.keybind(90,"a");
  game.keybind(88,"b");
  game.fps=30; 
  enemies = [];
  e_num=0;
  enemy_beam=[];
  e_beam_num=0;
  player=[];
  life=3;
  beam=[];
  beam_num=0;
  canon=[];
  canon_num=0;

  var START=0;
  var HIT2=0;
  var HIT=0;
  var BOMB=0;
  var TimeSpeed=1;
  var Weapon=0;
  var Power=1;
  var Lazer=0;
  var SB=0;
  var Counter=0;
  var Kill=0;
  var Set=0;
  var TimeLimit=0;
  var Boss_HP=0;
  var Boss=0;
  var LastBattle=0;
  var Clear=0;
  var Item=0;
  var Total=0;
  var Escape=0;
  var Speed=2;
  var BG_y=140;
  var Location=160;
  game.input.up=true;
  game.input.down=true;
  game.input.up=false;
  game.input.down=false;
  game.input.a=true;
  game.input.a=false;
  game.input.b=true;
  game.input.b=false;
  game.input.c=true;
  game.input.c=false;

  var isTouch = false;    // タッチフラグ(タッチ中のみ true にする)
  var touchX  = null;     // タッチX座標
  var touchY  = null;     // タッチY座標
  var touch_lug=0;
  var is2Touch=false;
  var shortTouch=false;
  var quick=0;
  var legth=0;
  
  
  
  game.rootScene.addEventListener("enterframe", function() { 
    touch_lug--;
    if(touch_lug<=0)shortTouch=false;
  });
  game.rootScene.addEventListener("touchstart", function(e) { 
    isTouch = true;
    startX = e.localX;
    startY = e.localY;
    touchX = e.localX;
    touchY = e.localY;
    if(touch_lug>0)is2Touch=true;
    touch_lug=9;
    
    
    
  }); // タッチ開始
  game.rootScene.addEventListener("touchend", function(e) {
    isTouch = false;
    if(touch_lug>0)shortTouch=true;
    is2Touch=false;
    quick=0;
    legth=0; 
  });  // タッチ終了
  game.rootScene.addEventListener("touchmove", function(e) {
    touchX = e.localX;
    touchY = e.localY;
    length=Math.sqrt((touchX-startX)*(touchX-startX)+(touchY-startY)*(touchY-startY));
    if(length>20 && quick==0){
      if(touchY>startY)quick=1;
      if(touchY<startY)quick=-1;
    }
  });

//自機のクラス設定

  
  
  var Player = Class.create(Sprite, { 
      initialize: function() { 
         Sprite.call(this,101,37);
         this.image=game.assets['ziki.gif'];
         player[life] = this;
         this.key=life;
         this.hp=100; //耐久力
         this.hit_lug=0;
         this.guard=1; //防御力
         this.face=0; //行動パターン
         this.anime=5; //アニメーション進行速度
         this.slow_time=0;//スローモーションの時間
         this.slow=0;
         this.spin=0;//回転方向
         this.shoot=0;
         this.beam_lug=0;//ビームの装填時間
         this.beam_chain=0;//ビームの連射数
         this.scaleX=0.5;
         this.scaleY=0.5;
         this.lock_on=null;
         this.target=0;
         this.search=0;
         this.star_bullet=0;
         this.lazer_charge=0;
         
         var hp_gage=new HP_gage();
         hp_gage.master=this;
         var hp=new HP_num();
         hp.master=this;
         
         this.act_moving=false;
         this.act_lockon=false;
         this.act_TS=0;
         this.act_beam=false;
         
         
         
         
         
         this.addEventListener('enterframe',function(){
           if(isTouch==true){
             this.act_beam=true;
             if(touchX<=300){
               this.act_moving=true;
               this.act_lockon=false;
             }else{
               this.act_lockon=true;
               this.act_moving=false;
             }
           }else{
             this.act_moving=false;
             this.act_beam=false;
             this.act_lockon=false;
           }
           
           this.hit_lug-=1*TimeSpeed;
           if(this.y<=0){this.y=0;}
           if(this.y>=290){this.y=290;}
           
           //アニメーションの設定
           if(this.face!=1){
             this.anime-=1;
             if(this.anime<=0){
               this.frame++;
               if(this.hp>25){
                 if(this.frame>1){this.frame=0;}
               }
　　　　　     else{
                 if(this.frame>5 || this.frame<3){this.frame=3;}
               }
               this.anime=3;
             }
           }
           if(this.face!=-1 && this.face!=4){
             if(this.hp<=0){
               if(Power>=3){
                 Power=1;
                 this.hp=50;
                 this.hit_lug=150;
                 this.face=5;
                 this.slow_time=10;
                 this.star_bullet=1;
                 
                 TimeSpeed=0;
                 var s = new spin_effect();
                 s.x=this.x;
                 s.y=this.y;
                 s.scaleX=2;
                 s.scaleY=2;
               }
               else{
                 BOMB=1;
                 Lazer=0;
                 this.face=-1;
                 var b=new bomb_b();
                 b.x=-50;
                 b.y=this.y-60;
                 b.scaleX=2;
                 b.scaleY=2;
               }
             }
           }
           if(this.face==-1){
             this.rotate(10);
             this.x-=3;
             if(this.x<=-100){
               BOMB=1;
               var b=new bomb_b();
               b.x=this.x-30;
               b.y=this.y-60;
               b.scaleX=3;
               b.scaleY=3;
               life--;
               this.x=110;
               this.y=160;
               delete player[this.key];
               game.rootScene.removeChild(this);
               delete this;
               
               if(life>0){
                 var p = new Player();
                 p.x=-1000;
                 p.y=160;
                 p.face=3;
                 p.hit_lug=150;
                 Power=1;
               }
               else{
                 Set--;
                 game.rootScene.backgroundColor='red';
                 for(var i in canon){
                   canon[i].hp=0;
                 }
                 for(var i in enemies){
                   enemies[i].x=2000;
                   game.rootScene.removeChild(enemies[i]);
                   delete enemies[i];
                 }
                 var result=new result_window();
               }
             }
           }
           if(this.face==0){
             
             
             //攻撃の設定
             if(game.input.a==false && this.act_beam==false){
               this.beam_chain=0;
             }
             if(Weapon==0){
               if(game.input.a || this.act_beam==true){
                 this.beam_lug-=1*TimeSpeed;
                 if(this.beam_lug<=0){
                   var s=new beam();
                   s.x=this.x+52*Math.cos((this.rotation+15)/180*Math.PI);
                   s.y=this.y+52*Math.sin((this.rotation+15)/180*Math.PI);
                   s.rotation=this.rotation;
                   if(Power>=3){
                     s.v=30;
                     s.frame=2;
                     s.damage=6;
                   }
                   this.beam_lug=2;
                   this.beam_chain++;
                   if(this.beam_chain>2){
                     if(Power>=2){
                       for(var i=0;i<=1;i++){
                         var s=new beam();
                         s.x=this.x+52*Math.cos((this.rotation-15+60*i)/180*Math.PI);
                         s.y=this.y+52*Math.sin((this.rotation-15+60*i)/180*Math.PI);
                         s.rotation=this.rotation;
                         if(Power>=3){
                           var t=new beam();
                           t.v=30;
                           t.frame=2;
                           t.damage=6;
                           t.x=this.x+52*Math.cos((this.rotation+15)/180*Math.PI);
                           t.y=this.y+52*Math.sin((this.rotation+15)/180*Math.PI);
                           t.rotation=this.rotation-5+10*i;
                         }
                       }
                     }
                     this.beam_lug=4;
                     this.beam_chain=0;
                   }
                 }
               }
             }
             
             if(Weapon==1){
               if(game.input.a || this.act_beam==true){
                 this.beam_lug-=1*TimeSpeed;
                 if(this.beam_lug<=0){
                   if(Power<2){
                     for(var i=-1;i<=1;i++){
                       var s=new beam();
                       s.x=this.x+52*Math.cos((this.rotation+15)/180*Math.PI);
                       s.y=this.y+52*Math.sin((this.rotation+15)/180*Math.PI);
                       s.rotation=this.rotation+6*i;
                     }
                   }
                   else if(Power<3){
                     for(var i=1;i<=2;i++){
                       var s=new beam();
                       s.x=this.x+52*Math.cos((this.rotation+15)/180*Math.PI);
                       s.y=this.y+52*Math.sin((this.rotation+15)/180*Math.PI);
                       s.rotation=this.rotation+6*i-3;
                       var t=new beam();
                       t.x=this.x+52*Math.cos((this.rotation+15)/180*Math.PI);
                       t.y=this.y+52*Math.sin((this.rotation+15)/180*Math.PI);
                       t.rotation=this.rotation-6*i+3;
                     }
                   }
                   else{
                     for(var i=-2;i<=2;i++){
                       var s=new beam();
                       s.x=this.x+52*Math.cos((this.rotation+15)/180*Math.PI);
                       s.y=this.y+52*Math.sin((this.rotation+15)/180*Math.PI);
                       s.rotation=this.rotation+6*i;
                     }
                   }
                   this.beam_lug=7;
                   this.beam_chain++;
                   if(this.beam_chain>6){
                     for(var i=1;i<=Power;i++){
                       var s=new beam();
                       s.horming=1;
                       s.frame=4;
                       s.v=20+Power;
                       s.x=this.x;
                       s.y=this.y+10;
                       s.rotation=this.rotation-45*i;
                       var t=new beam();
                       t.horming=1;
                       t.frame=4;
                       t.v=20+Power;
                       t.x=this.x;
                       t.y=this.y+10;
                       t.rotation=this.rotation+45*i;
                     }
                     this.beam_chain=0;
                   }
                 }
               }
             }
             
             if(this.act_moving==true){
               if(this.y<touchY){this.y+=8*TimeSpeed;}
               if(this.y>touchY){this.y-=8*TimeSpeed;}
             }
             if(this.act_lockon==true){
               this.rotation=Math.atan((this.y-touchY)/(this.x-touchX))*180/Math.PI;
               
             }
             
               
             
             //移動の設定
             if(game.input.up){
               if(game.input.b==false)this.y-=8*TimeSpeed;
               if(this.rotation>-60 && game.input.b==true){this.rotate(-4*TimeSpeed);}
             }
             if(game.input.down){
               if(game.input.b==false)this.y+=8*TimeSpeed;
               if(this.rotation<60 && game.input.b==true){this.rotate(4*TimeSpeed);}
             }
             if(game.input.b==false && this.act_lockon==false){
               if(this.rotation>0){this.rotate(-4*TimeSpeed);}
               if(this.rotation<0){this.rotate(4*TimeSpeed);}
               if(this.rotation<4 && this.rotation>-4){this.rotation=0;}
             }
             if(LastBattle==1 && Lazer>0){
               this.face=6;
             }
             if(Escape==1){
               this.face=8;
             }
             if((game.input.left || is2Touch==true) && Lazer>0){
               this.lazer_charge++;
               game.assets['charge.wav'].play();
               if(this.lazer_charge>=30){
                 this.face=2;
                 this.lazer_charge=0;
                 TimeSpeed=1;
                 var l= new lazer();
                 l.master=this;
                 
               }
             }
             else{this.lazer_charge=0;}
             
             if(game.input.left==false || is2Touch==false){this.slow=0;}
             
             if((game.input.left || is2Touch==true) && this.slow_time<=0 && this.slow==0){
               this.slow=1;
               this.rotation=0;
               this.slow_time=30;
               TimeSpeed=0.02;
               var bb=new bomb_r();
               bb.x=this.x-30;
               bb.y=this.y-60;
               bb.scaleX=0.4;
               bb.scaleY=0.4;
               bb.frame=3;
               if(SB==0){
                 for(var i in enemy_beam){
                   if(enemy_beam[i].within(this,enemy_beam[i].radious+5) && this.hit_lug<=0 && enemy_beam[i].hit==0 && this.star_bullet==0){
                     this.star_bullet=1;
                     game.assets['charge.wav'].play();
                     enemy_beam[i].hit=1;
                     var b=new bomb_r();
                     b.x=enemy_beam[i].x-50;
                     b.y=enemy_beam[i].y-70;
                     b.scaleX=0.2;
                     b.scaleY=0.2;
                     b.frame=2;
                     for(var j=0;j<2;j++){
                       var bs=new bomb_r();
                       bs.x=this.x-30;
                       bs.y=this.y-60;
                       bs.scaleX=0.5;
                       bs.scaleY=0.2;
                       bs.rotation=20+(-40)*j;
                       bs.frame=1+3*j;
                     }
                     enemy_beam[i].x=-100;
                     game.rootScene.removeChild(enemy_beam[i]);
                     delete enemy_beam[enemy_beam[i].key];
                   }
                 }
               }
             }
             if(this.slow_time>0){
               this.slow_time--;
               if(this.slow_time<=0){
                 TimeSpeed=1;
                 game.rootScene.backgroundColor='black';
                 this.star_bullet=0;
               }
               if(game.input.up || quick==-1){
                 quick=-2;
                 this.lazer_charge=0;
                 this.spin=-1;
                 this.face=1;
                 this.slow_time=10;
                 this.frame=6;
                 this.y-=50;
                 var s= new spin_effect();
                 s.x=this.x;
                 s.y=this.y;
                 s.move=-1;
                 
                 if(this.star_bullet==1){
                   for(var i in enemy_beam){
                     if(enemy_beam[i].within(this,500)){
                       enemy_beam[i].x=-100;
                       game.rootScene.removeChild(enemy_beam[i]);
                       delete enemy_beam[enemy_beam[i].key];
                     }
                   }
                   var s = new spin_effect();
                   s.x=this.x;
                   s.y=this.y;
                   s.scaleX=2;
                   s.scaleY=2;
                   Counter++;
                   BOMB=1;
                   for(var i=1;i<=7;i++){
                     var sb = new beam_SP();
                     sb.x=this.x;
                     sb.y=this.y;
                     sb.rotation=this.rotation+25*i;
                     sb.frame=2*(i-1);
                     var sa = new beam_SP();
                     sa.x=this.x;
                     sa.y=this.y;
                     sa.rotation=this.rotation-25*i;
                     sa.frame=2*(i-1);
                     game.rootScene.backgroundColor='white';
                   }
                   this.star_bullet=0;
                 }
                 
               }
               if(game.input.down || quick==1){
                 quick=2;
                 this.lazer_charge=0;
                 this.spin=1;
                 this.face=1;
                 this.slow_time=10;
                 this.frame=6;
                 this.y+=50;
                 var s = new spin_effect();
                 s.x=this.x;
                 s.y=this.y;
                 s.move=1;
                 if(this.star_bullet==1){
                   for(var i in enemy_beam){
                     if(enemy_beam[i].within(this,500)){
                       enemy_beam[i].x=-100;
                       game.rootScene.removeChild(enemy_beam[i]);
                       delete enemy_beam[enemy_beam[i].key];
                     }
                   }
                   var s = new spin_effect();
                   s.x=this.x;
                   s.y=this.y;
                   s.scaleX=2;
                   s.scaleY=2;
                   Counter++;
                   BOMB=1;
                   for(var i=1;i<=7;i++){
                     var sb = new beam_SP();
                     sb.x=this.x;
                     sb.y=this.y;
                     sb.rotation=this.rotation+25*i;
                     sb.frame=2*(i-1);
                     var sa = new beam_SP();
                     sa.x=this.x;
                     sa.y=this.y;
                     sa.rotation=this.rotation-25*i;
                     sa.frame=2*(i-1);
                     game.rootScene.backgroundColor='white';
                   }
                   this.star_bullet=0;
                 }
                 
               }
             }
           }
           
           if(this.face==1){
             this.scaleX=1;
             this.scaleY=1;
             this.frame+=1;
             if(this.frame>10){this.frame=9;}
             if(this.spin==-1){
               this.y-=1;
               this.rotate(40);
             }
             if(this.spin==1){
               this.y+=1;
               this.rotate(40);
             }
             this.slow_time--;
             if(this.slow_time<=0){
               this.face=0;
               this.spin=0;
               this.rotation=0;
               this.scaleX=0.5;
               this.scaleY=0.5;
               this.frame=0;
               this.star_bullet=0;
               TimeSpeed=1;
               game.rootScene.backgroundColor='black';
             }
           }
           if(this.face==2){
             if(game.input.down){this.y+=0.5;}
             if(game.input.up){this.y-=0.5;}
             if(this.act_moving==true){
               if(this.y<touchY){this.y+=0.5;}
               if(this.y>touchY){this.y-=0.5;}
             }
             if(this.x>-500)this.x-=20*TimeSpeed;
             var r = new bomb_r();
             r.x=this.x;
             r.y=this.y-50;
             r.scaleX=0.1;
             r.v=2;
             r.opacity=1.5;
             r.frame=Math.floor(Math.random()*5);
           }
           if(this.face==3){
             this.x+=10;
             if(this.x>110){
               this.face=0;
               
             }
           }
           if(this.face==4){
             this.frame=0;
             this.x-=3*TimeSpeed;
             this.rotate(60*TimeSpeed);
             if(this.hit_lug<=0){
               this.face=3;
               this.rotation=0;
             }
           }
           if(this.face==5){
             this.slow_time--;
             if(this.star_bullet==1){
                for(var i in enemy_beam){
                  enemy_beam[i].x=-100;
                  game.rootScene.removeChild(enemy_beam[i]);
                  delete enemy_beam[enemy_beam[i].key];
                }
                for(var i=1;i<=7;i++){
                  var sb = new beam_SP();
                  sb.x=this.x;
                  sb.y=this.y;
                  sb.rotation=this.rotation+25*i;
                  sb.frame=2*(i-1);
                  var sa = new beam_SP();
                  sa.x=this.x;
                  sa.y=this.y;
                  sa.rotation=this.rotation-25*i;
                  sa.frame=2*(i-1);
                  game.rootScene.backgroundColor='white';
                }
                this.star_bullet=0;
              }
             if(this.slow_time<=0){
               TimeSpeed=1;
               this.face=3;
               game.rootScene.backgroundColor='black';
             }
           }
           if(this.face==6){
             this.rotation=0;
             if(this.y>160){this.y-=3;}
             if(this.y<160){this.y+=3;}
             if((game.input.left || is2Touch==true)&& Lazer>0){
               this.lazer_charge++;
               if(this.lazer_charge>=30){
                 this.face=7;
                 LastBattle=2;
                 this.lazer_charge=0;
                 TimeSpeed=1;
                 var l= new lazer();
                 l.master=this;
                 l.controll=1;
                 l.hp=20000;
               }
             }
           }
           if(this.face==7){
             this.beam_lug-=1*TimeSpeed;
             if(this.x>-20)this.x-=10*TimeSpeed;
             if(this.beam_lug<=0){
               var r = new bomb_r();
               r.x=this.x;
               r.y=this.y-50;
               r.scaleX=0.1;
               r.v=2;
               r.opacity=1;
               r.frame=Math.floor(Math.random()*5);
               this.beam_lug=2;
             }
           }
           if(this.face==8){
             this.x+=40;
             this.rotation=0;
             if(this.x>2000){
               var result=new result_window();
               this.face=9;
             }
            
           }
         });
         game.rootScene.addChild(this);
      }
  });
  var result_window = Class.create(Sprite,{ 
      initialize: function() { 
         Sprite.call(this,598,300);
         this.image=game.assets['window.png'];
         this.frame=1;
         this.x=41;
         this.y=10;
         this.scaleX=1;
         this.scaleY=0;
         this.start=0;
         this.addEventListener('enterframe',function(){
           
           if(this.start==0){
             this.scaleY+=0.1;
             if(this.scaleY>=1){
               this.start=1;
               this.scaleY=1;
               var result=new result_1();
               
             }
           }
         });
         game.rootScene.addChild(this);
      }
  });
  var result_1 = Class.create(Label,{ 
      initialize: function() { 
         Label.call(this);
         this.set=0;
         this.kill=0;
         this.life=0;
         this.counter=0;
         this.item=0;
         this.font = "20px Palatino";
         this.color = 'white';
         this.x=80;
         this.y=80
         this.step=0;
         
         this.addEventListener('enterframe',function(){
           this.text="撃破した編隊："+this.set+"<br>"
                    +"⇒\\"+this.set*200+"<br>"
                    +"撃墜した敵機："+this.kill+"<br>"
                    +"⇒\\"+this.kill*10+"<br>"
                    +"残機："+this.life+"<br>"
                    +"⇒\\"+this.life*300+"<br>"
                    +"カウンター数："+this.counter+"<br>"
                    +"⇒\\"+this.counter*200+"<br>"
                    +"回収したアイテム数："+this.item+"<br>"
                    +"⇒\\"+this.item*20+"<br>";
           
           if(this.step==0){
             
             if(this.set>=Set){
               this.step=1;
               Total+=this.set*200;
             }else{
               this.set++;
             }
             
           }
           if(this.step==1){
             if(this.kill>=Kill){
               this.step=2;
               Total+=10*this.kill;
             }else{
               this.kill++;
             }
             
           }
           if(this.step==2){
             if(this.life>=life){
               this.step=3;
               Total+=this.life*300;
             }else{
               this.life++;
             }
           }
           if(this.step==3){
             if(this.counter>=Counter){
               this.step=4;
               Total+=this.counter*200;
             }else{
               this.counter++;
             }
           }
           if(this.step==4){
             if(this.item>=Item){
               this.step=5;
               Total+=this.item*20;
               var bonus=new result_2();
             }else{
               this.item++;
             }
           }
           
           
         });
         
         game.rootScene.addChild(this);
      }
  });
  var result_2 = Class.create(Label,{ 
      initialize: function() { 
         Label.call(this);
         this.bonus1=0;
         this.bonus2=0;
         this.bonus3=0;
         this.bonus4=0;
         this.bonus5=0;
         
         this.font = "20px Palatino";
         this.color = 'white';
         this.x=270;
         this.y=80
         this.step=0;
         this.addEventListener('enterframe',function(){
           this.text="BONUS<br>"
                    +"・2分間耐久突破：\\"+this.bonus1+"<br>"
                    +"・スイミーの陣撃破：\\"+this.bonus2+"<br>"
                    +"・青い三連星撃破：\\"+this.bonus3+"<br>"
                    +"・起動兵器ゼルフェス撃退：\\"+this.bonus4+"<br>"
                    +"・ノーミスクリア：\\"+this.bonus5+"<br>";
           if(this.step==0){
             if(Boss==1){
               if(this.bonus1>=200){
                 this.step=1;
                 Total+=this.bonus1;
               }else{
                 this.bonus1+=10;
               }
             }else{
               this.step=1;
             }
           }
           if(this.step==1){
             if(Set>=5){
               if(this.bonus2>=700){
                 this.step=2;
                 Total+=this.bonus2;
               }else{
                 this.bonus2+=10;
               }
             }else{
               this.step=2;
             }
           }
           if(this.step==2){
             if(Set>=13){
               if(this.bonus3>=1000){
                 this.step=3;
                 Total+=this.bonus3;
               }else{
                 this.bonus3+=20;
               }
             }else{
               this.step=3;
             }
           }
           if(this.step==3){
             if(Clear==1){
               if(this.bonus4>=1000){
                 this.step=4;
                 Total+=this.bonus4;
               }else{
                 this.bonus4+=20;
               }
             }else{
               this.step=4;
             }
           }
           if(this.step==4){
             if(life>=3){
               if(this.bonus5>=1000){
                 this.step=5;
                 Total+=this.bonus5;
                 var sum=new result_3();
               }else{
                 this.bonus5+=20;
               }
             }else{
               this.step=5;
               var sum=new result_3();
             }
           }
         });
         
         game.rootScene.addChild(this);
      }
  });
  var result_3 = Class.create(Label,{ 
      initialize: function() { 
         Label.call(this);
         this.searching=0;
         this.font = "40px Palatino";
         this.color = 'white';
         this.x=290;
         this.y=250;
         this.step=0;
         this.addEventListener('enterframe',function(){
           this.text="TOTAL :\\"+Total;
           this.searching++;
           if(Clear>0){
             if(this.searching%3==0){this.color = 'red';}
             if(this.searching%3==1){this.color = 'yellow';}
             if(this.searching%3==2){this.color = 'white';}
           }
           if(this.searching>=100){
             if(game.input.a || isTouch==true){
               var ending=new Scene();
               ending.backgroundColor = 'black';
               game.pushScene(ending);
               location.href = "http://starbulletjs.fluxflex.com";
             }
           }
         });
         game.rootScene.addChild(this);
       }
  });
  var HP_num = Class.create(Label,{ 
      initialize: function() { 
         Label.call(this);
         this.text="";
         this.font = "28px Palatino";
         this.color = 'white';
         this.x=0;
         this.y=6
         this.master=null;
         this.start=0;
         this.searching=0;
         
         this.addEventListener('enterframe',function(){
           
           if(this.start==0){
             this.text="Life×"+life;
             this.color='red';
             this.searching++;
             if(this.searching>=100){
               this.start=1;
             }
           }else{
             this.text="ENERGY";
             if(this.master.hp>25){this.color='white';}
             else if(this.master.hp>0){this.color='red';}
             else if(Power<3){
               game.rootScene.removeChild(this);
               delete this;
             }
           }
         });
         game.rootScene.addChild(this);
      }
  });
  var HP_gage = Class.create(Sprite,{ 
      initialize: function() { 
         Sprite.call(this,200,40);
         this.image=game.assets['hp_gage.gif'];
         this.frame=1;
         this.x=100;
         this.master=null;
         this.scaleX=0;
         this.start=0;
         this.opacity=0.5;
         this.addEventListener('enterframe',function(){
           
           if(this.start==0){
             this.scaleX+=0.01;
             if(this.scaleX>=1){
               this.start=1;
               this.opacity=1;
             }
           }else{
             this.scaleX=this.master.hp/100;
             if(this.master.hp>75){this.frame=1;}
             else if(this.master.hp>50){this.frame=2;}
             else if(this.master.hp>25){this.frame=3;}
             else if(this.master.hp>0){this.frame=4;}
             else if(Power<3){
               game.rootScene.removeChild(this);
               delete this;
             }
           }
         });
         game.rootScene.addChild(this);
      }
  });
  var manual = Class.create(Label,{ 
      initialize: function() { 
         Label.call(this);
         this.text="";
         this.font = "20px Palatino";
         this.color = 'white';
         this.x=0;
         this.y=265;
         this.sb=0;
         this.lazer=0;
         this.lastbattle=0;
         this.step=0;
         this.appear=1;
         this.searching=200;
         this.addEventListener('enterframe',function(){
           
           
             if(SB==1 && this.sb==0){
               this.searching=500;
               this.appear=2;
               this.sb=1;
             }
             if(Lazer>0 && this.lazer==0){
               this.searching=100;
               this.appear=3;
               this.lazer=1;
             }
             if(LastBattle==2 && this.lastbattle==0){
               this.searching=500;
               this.appear=4;
               this.lastbattle=1;
             }
             if(Boss==1 && this.step==0){
               this.searching=200;
               this.appear=5;
               this.step=1;
             }
           if(this.appear==0){
             this.text="";
             
             
           }
           if(this.appear==1){
             this.text="2分間で敵編隊を倒しまくれ！";
             this.searching--;
             if(this.searching<=0){this.appear=0;}
           }
           if(this.appear==2){
             this.text="敵の攻撃を引き付けてテレポートを使うと強力なカウンターが発動します。";
             
             this.searching--;
             if(this.searching<=0){this.appear=0;}
           }
           if(this.appear==3){
             this.text="左ボタンを長押しすることで極太レーザーを放ちます。";
             this.searching--;
             if(this.searching<=0){this.appear=0;}
           }
           if(this.appear==4){
             this.text="攻撃ボタンを連打しろ！";
             this.searching--;
             if(this.searching<=0){this.appear=0;}
           }
           if(this.appear==5){
             this.text="ボスを倒せ！";
             this.searching--;
             if(this.searching<=0){this.appear=0;}
           }
         });
         game.rootScene.addChild(this);
      }
  });
  var beam_condition = Class.create(Label,{ 
      initialize: function() { 
         Label.call(this);
         this.text="";
         this.font = "28px Palatino";
         this.color = 'white';
         this.x=0;
         this.y=46
         this.appear=0;
         this.searching=0;
         this.pow=1;
         this.level=1;
         this.weapon=0;
         this.beam="α";
         this.addEventListener('enterframe',function(){
           
           if(this.appear==0){
             if(Power<2){this.pow=1;}
             else if(Power<3){this.pow=2;}
             else{this.pow=3;}
             if(this.level!=this.pow){
               this.level=this.pow;
               this.searching=100;
               this.appear=1;
             }
             if(this.weapon!=Weapon){
               this.weapon=Weapon;
               if(this.weapon==0){this.beam="α";}
               if(this.weapon==1){this.beam="β";}
               this.searching=100;
               this.appear=1;
             }
             if(SB==1){
               this.searching=100;
               this.appear=2;
             }
             if(Lazer>0){
               this.searching=100;
               this.appear=3;
             }
             this.text="";
             
           }
           if(this.appear==1){
             this.text="Beam"+this.beam+" Level:"+this.pow;
             if(this.searching%3==0){this.color = 'red';}
             if(this.searching%3==1){this.color = 'yellow';}
             if(this.searching%3==2){this.color = 'white';}
             this.searching--;
             if(this.searching<=0){this.appear=0;}
           }
           if(this.appear==2){
             this.text="Star Bullet!";
             if(this.searching%3==0){this.color = 'red';}
             if(this.searching%3==1){this.color = 'yellow';}
             if(this.searching%3==2){this.color = 'white';}
             this.searching--;
             if(this.searching<=0){this.appear=0;}
           }
           if(this.appear==3){
             this.text="Milky Way!";
             if(this.searching%3==0){this.color = 'red';}
             if(this.searching%3==1){this.color = 'yellow';}
             if(this.searching%3==2){this.color = 'white';}
             this.searching--;
             if(this.searching<=0){this.appear=0;}
           }
         });
         game.rootScene.addChild(this);
      }
  });
var spin_effect = Class.create(Sprite,{ 
      initialize: function() { 
         Sprite.call(this,96,96);
         this.image=game.assets['spin_effect.gif'];
         this.frame=3.3;
         this.anime=1;
         this.opacity=1;
         this.speed=0;
         this.move=0;
         this.addEventListener('enterframe',function(){
           this.speed++;
           this.opacity-=0.02;
           this.rotate(this.speed*3);
           this.anime-=1;
           if(this.anime<=0){
             this.frame++;
             if(this.frame>6){this.frame=3.3;}
             this.anime=1;
           }
           if(this.move==1){
             this.y-=5*TimeSpeed;
           }
           if(this.move==-1){
             this.y+=5*TimeSpeed;
           }
           if(this.opacity<=0){
             game.rootScene.removeChild(this);
             delete this;
           }
         });
         game.rootScene.addChild(this);
      }
　});
　
  
  var lazer = Class.create(Sprite,{ 
      initialize: function() { 
         Sprite.call(this,98,98);
         this.image=game.assets['lazer.gif'];
         this.frame=5;
         this.master=null;
         this.scaleX=0.5;
         this.scaleY=2;
         this.hp=100;
         this.opacity=0.7;
         this.beam_lug=0;
         this.flash=0;
         this.controll=0;
         this.push=0;
         this.wave=90;
         this.addEventListener('enterframe',function(){
           this.frame++;
           if(this.opacity<=0.95)this.opacity+=0.01;
           this.hp--;
           if(this.frame>9){this.frame=5;}
           /*
           if(this.master==null){
             for(var i in player){
               if(player[i].hp>0){
                 this.master=player[i];
               }
             }
           }
           */
           this.x=this.master.x+50*this.scaleX+30;
           this.y=this.master.y-25;
           
           if(this.controll==1){
             this.beam_lug-=1*TimeSpeed;
             for(var j in enemy_beam){
               if(enemy_beam[j].type==1){
                 this.scaleX-=0.01;
                 enemy_beam[j].scaleX+=0.01;
                 if(enemy_beam[j].hp>0 && enemy_beam[j].x-55*enemy_beam[j].scaleX<=this.x+55*this.scaleX){
                   HIT=1;
                   this.scaleX-=1;
                   enemy_beam[j].scaleX-=1;
                   this.wave+=180;
                   this.master.y+=10*Math.sin(this.wave/180*Math.PI);
                   enemy_beam[j].master.y+=10*Math.sin(this.wave/180*Math.PI);
                   BG_y+=10*Math.sin(this.wave/180*Math.PI);
                   if(enemy_beam[j].scaleX<=0.1){
                     enemy_beam[j].hp=0;
                     enemy_beam[j].scaleY=0;
                     this.hp=100;
                     this.master.face=2;
                     LastBattle=0;
                     Clear=1;
                     Lazer=0;
                     BG_y=140;
                     enemy_beam[j].master.y=100;
                     enemy_beam[j].master.face=-3;
                     enemy_beam[j].master.pettern=0;
                     enemy_beam[j].master.attack_lug=100;
                   }
                   if(this.scaleX<=0.1 || this.master.face==4){
                     Lazer=0;
                     
                     LastBattle=3;
                     enemy_beam[j].type=2;
                     enemy_beam[j].hp=100;
                     enemy_beam[j].master.face=1;
                     enemy_beam[j].master.attack_lug=120;
                     enemy_beam[j].master.pettern=1;
                     game.rootScene.removeChild(this);
                     delete this;
                     this.master.face=4;
                   }
                   if(this.beam_lug<=0){
                     var b=new bomb_b();
                     b.x=this.x+50*this.scaleX;
                     b.y=this.y-25;
                     b.scaleX=1;
                     b.scaleY=1;
                     this.beam_lug=10;
                   }
                   if((game.input.a || isTouch==true)&& this.push==0){
                     this.scaleX+=0.1;
                     enemy_beam[j].scaleX-=0.1;
                     this.push=1;
                   }
                   if(game.input.a==false && isTouch==false){
                     this.push=0;
                   }
                 }
               }
             }
           }
           
           if(this.scaleX<20){
             this.scaleX+=1;
           }
           if(this.hp<=0){
             this.scaleY-=0.1;
             if(this.flash==1){
               this.flash=2;
               game.rootScene.backgroundColor='black';
             }
             if(this.scaleY<=0){
               this.master.face=3;
               this.Lazer=0;
               game.rootScene.removeChild(this);
               delete this;
             }
           }
           for(var j in enemy_beam){
             if(enemy_beam[j].type==0 && enemy_beam[j].y<this.y+150 && enemy_beam[j].y>this.y-150 && enemy_beam[j].hp>0){
               game.rootScene.removeChild(enemy_beam[j]);
               delete enemy_beam[j];
             }
           }
           for(var j in enemies){
             if(enemies[j].type==0 && enemies[j].y<this.y+100 && enemies[j].y>this.y-100 && enemies[j].x<this.x+50*this.scaleX  && enemies[j].x<700){
               enemies[j].spin=100;
               BOMB=1;
               if(this.hp>10){
                 if(enemies[j].hit_lug<=0){
                   enemies[j].x-=20;
                   enemies[j].hp-=5;
                   enemies[j].face=-1;
                   enemies[j].hit_lug=10;
                   var b=new bomb_b();
                   b.x=enemies[j].x+50;
                   b.y=enemies[j].y-30;
                   b.scaleX=0.5;
                   b.scaleY=0.5;
                 }
               }
               else{
                 if(this.flash==0){
                   game.rootScene.backgroundColor='white';
                   this.flash=1;
                 }
                 if(enemies[j].hit_lug<=0){
                   enemies[j].hp-=25;
                   enemies[j].hit_lug=20;
                 }
                 if(enemies[j].type==0){enemies[j].x+=30;}
               }
             }
           }
         });
         game.rootScene.addChild(this);
      }
　});
  var lazer_power = Class.create(Sprite,{ 
      initialize: function() { 
         Sprite.call(this,174,174);
         this.image=game.assets['ring.gif'];
         this.frame=0;
         this.master=null;
         this.scaleX=0.5;
         this.scaleY=1;
         this.opacity=0;
         this.flash=0;
         this.addEventListener('enterframe',function(){
           this.frame++;
           if(this.frame>4){this.frame=0;}
           if(this.master==null){
             for(var i in player){
               if(player[i].hp>0){
                 this.master=player[i];
               }
             }
           }
           else{
             this.x=this.master.x-30;
             this.y=this.master.y-70;
             this.rotate(20);
             if(this.master.hp<=0){
               this.master=null;
               Lazer=0;
             }
           }
           if(Lazer>0){
             Lazer--;
             this.opacity=1;
             for(var i in enemy_beam){
               if(enemy_beam[i].within(this,30) && enemy_beam[i].hit==0){
                 enemy_beam[i].rotate(180);
                 enemy_beam[i].hit=1;
               }
             }
           }
           else{
             this.opacity-=0.1;
           }
         });
         game.rootScene.addChild(this);
      }
　});

  var beam =Class.create(Sprite,{
      initialize: function(){
         Sprite.call(this,76,17);
         this.image=game.assets['beam.gif'];
         beam_num++;
         this.key = beam_num;
         beam[this.key] = this;
         this.scaleX=0.5;
         this.scaleY=0.5;
         this.hit=0;
         this.v=25;
         this.damage=3;
         this.frame=8;
         this.horming=0;
         this.target=null;
         this.direction=0;
         this.line=2;
         this.addEventListener('enterframe',function(){
           if(this.horming==1){
             if(this.target==null){
               for(var s=1;s<=20;s++){
                 for(var i in enemies){
                   if(enemies[i].within(this,s*50) && enemies[i].hp>0 && enemies[i].x<700){
                     this.target=enemies[i];
                   }
                 }
               }
             }
             else{
               this.direction=Math.atan((this.y-this.target.y-40)/(this.x-this.target.x-80))*180/Math.PI;
               if(this.x<=this.target.x){
                 if(this.rotation>this.direction){this.rotate(-10*Power*TimeSpeed);}
                 if(this.rotation<this.direction){this.rotate(10*Power*TimeSpeed);}
               }
               if(this.target.hp<=0){this.target=null;}
             }
           }
         
           this.x+=this.v*Math.cos(this.rotation/180*Math.PI)*TimeSpeed;
           this.y+=this.v*Math.sin(this.rotation/180*Math.PI)*TimeSpeed;
           for(var i in enemies){
             if(enemies[i].within(this,enemies[i].hit_radious) && enemies[i].hp>0){
               enemies[i].hp-=this.damage/enemies[i].guard;
               var b=new bomb_s();
               b.x=this.x;
               b.y=this.y-30;
               game.rootScene.removeChild(this);
               delete this;
               delete beam[this.key];
             }
           }
           
           if(this.x>700 || this.x<0 || this.y<-80 || this.y>400){
             game.rootScene.removeChild(this);
             delete this;
             delete beam[this.key];
           }
         });
         game.rootScene.addChild(this);
      }
  });
  
  
  var beam_B =Class.create(Sprite,{
      initialize: function(){
         Sprite.call(this,113,21);
         this.image=game.assets['beam_B.gif'];
         this.scaleX=0;
         this.scaleY=1;
         beam_num++;
         this.key = beam_num;
         beam[this.key] = this;
         this.hit=0;
         this.v=30;
         this.frame=0;
         this.line=2;
         this.addEventListener('enterframe',function(){
           if(this.scaleX<2){this.scaleX+=0.1*TimeSpeed;}
           this.x+=this.v*Math.cos(this.rotation/180*Math.PI)*TimeSpeed;
           this.y+=this.v*Math.sin(this.rotation/180*Math.PI)*TimeSpeed;
           for(var i in enemies){
             if(enemies[i].within(this,enemies[i].hit_radious+5) && enemies[i].hp>0){
               if(enemies[i].hit_lug<=0){
                 enemies[i].hp-=20/enemies[i].guard;
                 enemies[i].hit_lug=3;
               }
               BOMB=1;
               var bb=new bomb_r();
               bb.x=this.x-70;
               bb.y=this.y-80;
               bb.scaleX=0.2;
               bb.scaleY=0.4;
               bb.rotation=this.rotation;
               bb.frame=4;
             }
           }
           
           if(this.x>1000 || this.x<100 || this.y<0 || this.y>700){
             game.rootScene.removeChild(this);
             delete this;
             delete beam[this.key];
           }
         });
         game.rootScene.addChild(this);
      }
  });
  
  
  
  var beam_SP =Class.create(Sprite,{
      initialize: function(){
         Sprite.call(this,76,17);
         this.image=game.assets['beam.gif'];
         this.scaleX=0.5;
         this.scaleY=0.5;
         beam_num++;
         this.key = beam_num;
         beam[this.key] = this;
         this.hit=0;
         this.v=30;
         this.line=2;
         this.target=null;
         this.direction=0;
         this.wait=5;
         this.addEventListener('enterframe',function(){
           SB=1;
           this.wait-=1*TimeSpeed;
           if(this.target==null){
             for(var s=1;s<=10;s++){
               if(this.target==null){
                 for(var i in enemies){
                   if(enemies[i].within(this,s*100) && enemies[i].hp>0){
                     this.target=enemies[i];
                   }
                 }
               }
             }
           }
           else{
             this.direction=Math.atan((this.y-this.target.y-40)/(this.x-this.target.x-80))*180/Math.PI;
             if(this.wait<=0){
               if(this.rotation>this.direction){this.rotate(-20*TimeSpeed);}
               if(this.rotation<this.direction){this.rotate(20*TimeSpeed);}
             }
             if(this.target.hp<=0){this.target=null;}
           }
           this.x+=this.v*Math.cos(this.rotation/180*Math.PI)*TimeSpeed;
           this.y+=this.v*Math.sin(this.rotation/180*Math.PI)*TimeSpeed;
           for(var i in enemies){
             if(enemies[i].within(this,enemies[i].hit_radious) && enemies[i].hp>0){
               enemies[i].hp-=10;
               var bb=new bomb_r();
               bb.x=this.x-70;
               bb.y=this.y-80;
               bb.scaleX=0.2;
               bb.scaleY=0.4;
               bb.rotation=this.rotation;;
               bb.frame=this.frame/2;
               SB=0;
               BOMB=1;
               game.rootScene.removeChild(this);
               delete beam[this.key];
               delete this;
             }
           }
           this.line-=1*TimeSpeed;
           
           if(this.x>2700 || this.x<-1400 || this.y<-1000 || this.y>1400){
             SB=0;
             game.rootScene.removeChild(this);
             delete beam[this.key];
             delete this;
           }
         });
         game.rootScene.addChild(this);
      }
  });

  var enemy =Class.create(Sprite,{ 
      initialize: function() { 
         Sprite.call(this,238,104);
         this.image=game.assets['zako.gif'];
         e_num++;
         this.key = e_num;
         enemies[e_num] = this;
         this.scaleX=0.25;
         this.scaleY=0.25;
         this.frame=0;
         this.anime=2;
         this.face=0;
         this.beam_lug=10;
         this.beam_chain=0;
         this.interval=0;
         this.hit_lug=0;
         this.hit_radious=15;
         this.spin=0;
         this.type=0;
         this.guard=1;
         this.level=1;
         this.hp=5;
         this.stop=350;
         this.horming=0;
         this.lock_on=0;
         this.direction=0;
         this.addEventListener('enterframe',function(){
           if(this.target==null){
             for(var i in player){
               if(player[i].hp>0){
                 this.target=player[i];
               }
             }
           }
           else{
             this.direction=Math.atan((this.y+47-this.target.y-15)/(this.x+50-this.target.x+20))*180/Math.PI;
             
             if(this.target.hp<=0){this.target=null;}
           }
           this.hit_lug-=1*TimeSpeed;
           if(this.face==0){
             this.x-=3*TimeSpeed;
             this.anime-=1*TimeSpeed;
             if(this.anime<=0){
               if(this.frame<7){
                 this.frame++;
               }
               else{
                 this.frame=0;
               }
               this.anime=3;
             }
             if(this.x<=this.stop){
               this.guard=1;
               this.face=1;
               this.frame=8;
               if(this.level>=3){this.lock_on=1;}
             }
           }
           
           if(this.face==1){
             this.frame++;
             if(this.frame>11){this.frame=8;}
             if(this.x>this.stop){this.x-=2*TimeSpeed;}
             this.beam_lug-=1*TimeSpeed;
             if(this.lock_on==1){
               if(this.rotation<this.direction){this.rotate(2*TimeSpeed);}
               if(this.rotation>this.direction){this.rotate(-2*TimeSpeed);}
             }
             if(this.beam_lug<=0){
               this.beam_chain++;
               var b = new enemy_beam1();
               b.x=this.x+50;
               b.y=this.y+47;
               b.rotation=this.rotation+180;
               
               if(this.level==5){
                 for(var i=0;i<=1;i++){
                   var bb = new enemy_beam1();
                   bb.x=this.x+50;
                   bb.y=this.y+47;
                   bb.rotation=this.rotation+175+10*i;
                 }
               }
               
               if(this.level<4){this.beam_lug=6;}
               else{this.beam_lug=3;}
               if(this.beam_chain>3){
                 this.interval++;
                 this.beam_chain=0;
                 this.beam_lug=20;
                 if(this.interval>=3){
                   if(this.level>=2){
                     if(this.level>=3){
                       for(var i=-(this.level-3);i<=(this.level-3);i++){
                         var b = new enemy_beam2();
                         b.x=this.x+50;
                         b.y=this.y+47;
                         b.rotation=this.rotation+180+10*i;
                       }
                     }
                     this.face=2;
                     this.rotation=0;
                     this.interval=72;
                     this.beam_lug=0;
                     this.beam_chain=0;
                     this.anime=0;
                     this.frame=0;
                     if(Math.floor(Math.random()*5)==0){this.horming=1;}
                     else{
                       this.ny=Math.floor(Math.random()*240)+10;
                     }
                   }
                 }
               }
             }
           }
           if(this.face==2){
             if(this.level>=3){
               for(var i in beam){
                 if(beam[i].within(this,30)){
                   if(this.y<=beam[i].y){this.y+=this.level*TimeSpeed;}
                   if(this.y>=beam[i].y){this.y-=this.level*TimeSpeed;}
                 }
               }
             }
             this.interval-=1*TimeSpeed;
             this.anime-=1*TimeSpeed;
             if(this.anime<=0){
               this.frame++;
               if(this.frame>7){this.frame=0;}
               this.anime=3;
             }
             if(this.interval<=0 || this.target==null){
               if(Math.floor(Math.random()*2)==0 && this.level==5){
                 this.face=3;
                 if(this.y<=140){this.ny=1;}
                 if(this.y>140){this.ny=-1;}
               }
               else{this.face=1;}
               this.horming=0;
             }
             if(this.horming==1){
               if(this.y>this.target.y-45){this.y-=2*TimeSpeed;}
               if(this.y<this.target.y-45){this.y+=2*TimeSpeed;}
               this.x-=10*Math.cos((this.interval*5)/180*Math.PI)*TimeSpeed;
             }
             else{
               if(this.y>this.ny){this.y-=2*TimeSpeed;}
               if(this.y<this.ny){this.y+=2*TimeSpeed;}
               this.x-=10*Math.sin((this.interval*5)/180*Math.PI)*TimeSpeed;
             }
             
           }
           if(this.face==3){
             this.frame++;
             if(this.frame>15){this.frame=12;}
             if(this.x>this.stop){this.x-=2*TimeSpeed;}
             this.beam_lug-=1*TimeSpeed;
             if(this.ny==-1){this.y-=5*TimeSpeed;}
             if(this.ny==1){this.y+=5*TimeSpeed;}
             if(this.beam_lug<=0){
               var b = new enemy_beam2();
               b.x=this.x+50;
               b.y=this.y+47;
               b.scaleX=2;
               b.scaleY=2;
               b.rotation=this.rotation+180;
               this.beam_lug=30;
               if((this.ny==-1 && this.y<=0) || (this.ny==1 && this.y>=300)){
                 this.beam_chain=0;
                 this.face=2;
                 this.rotation=0;
                 this.interval=72;
                 this.beam_lug=0;
                 this.beam_chain=0;                    
                 this.anime=0;
                 this.frame=0;
                 if(Math.floor(Math.random()*5)==0){this.horming=1;}
                 else{this.ny=Math.floor(Math.random()*240)+10;}
               }
             }
           }
           if(this.face==-1){
             this.spin-=1*TimeSpeed;
             this.rotate(60*TimeSpeed);
             if(this.x>550 || this.spin<=0){
               this.face=0;
               this.rotation=0;
             }
           }
           if(this.hp<=0 && this.face != -1){
             var b=new bomb_b();
             b.x=this.x+50;
             b.y=this.y-30;
             if(this.key%100==0){
               var gg=new item();
               gg.x=this.x+70;
               gg.y=this.y+5;
               gg.type=4;
             }
             else if(this.key%50==0){
               var gg=new item();
               gg.x=this.x+70;
               gg.y=this.y+5;
               gg.type=5;
             }
             else if(this.key%10==0){
               var gg=new item();
               gg.x=this.x+70;
               gg.y=this.y+5;
               gg.type=2;
             }
             
             else if(this.key%16==0){
               var g=new item();
               g.x=this.x+70;
               g.y=this.y+5;
               g.type=0;
             }
             else if(this.key%3==0){
               var g=new item();
               g.x=this.x+70;
               g.y=this.y+5;
               g.type=1;
             }
             
             if(this.level==5){
               for(var i=0;i<8;i++){
                 var b = new enemy_beam2();
                 b.x=this.x+50;
                 b.y=this.y+47;
                 b.rotation=this.rotation+45*i;
               }
             }
             
             Kill++;
             
             BOMB=1;
             
             delete enemies[this.key];
             delete this;
             game.rootScene.removeChild(this);
             
           }
         });
         game.rootScene.addChild(this);
      }
  });
  
  var enemy_beam1 = Class.create(Sprite,{
      initialize: function(){
         Sprite.call(this,76,17);
         e_beam_num++;
         this.key = e_beam_num;
         enemy_beam[this.key] = this;
         this.image=game.assets['beam.gif'];
         this.scaleX=0.5;
         this.scaleY=0.5;
         this.hit=0;
         this.radious=15;
         this.type=0;
         this.v=20;
         this.frame=6;
         this.addEventListener('enterframe',function(){
           this.x+=this.v*Math.cos(this.rotation/180*Math.PI)*TimeSpeed;
           this.y+=this.v*Math.sin(this.rotation/180*Math.PI)*TimeSpeed;
           for(var i in player){
             if(player[i].within(this,this.radious) && player[i].hp>0 && player[i].hit_lug<=0 && player[i].face!=1){
               player[i].hp-=2;
               player[i].hit_lug=6;
               player[i].frame=5;
               var b=new bomb_s();
               b.x=this.x;
               b.y=this.y-30;
               this.x=-100;
               this.hit=1;
               
               HIT=1;
               
               game.rootScene.removeChild(this);
               delete enemy_beam[this.key];
               delete this;
               
               
             }
           }
           
           if(this.x>700 || this.x<0 || this.y<0 || this.y>350){
             game.rootScene.removeChild(this);
             delete enemy_beam[this.key];
             delete this;
           }
         });
         game.rootScene.addChild(this);
      }
  });
  var enemy_beam2 = Class.create(Sprite,{
      initialize: function(){
         Sprite.call(this,23,23);
         e_beam_num++;
         this.key = e_beam_num;
         enemy_beam[this.key] = this;
         this.image=game.assets['bomb.gif'];
         this.scaleX=1;
         this.scaleY=1;
         this.hit=0;
         this.radious=15;
         this.type=0;
         this.v=3;
         this.frame=2;
         this.addEventListener('enterframe',function(){
           this.x+=this.v*Math.cos(this.rotation/180*Math.PI)*TimeSpeed;
           this.y+=this.v*Math.sin(this.rotation/180*Math.PI)*TimeSpeed;
           this.radious=15*this.scaleX;
           for(var i in player){
             if(player[i].within(this,this.radious) && player[i].hp>0 && player[i].hit_lug<=0 && player[i].face!=1){
               player[i].hp-=3*this.scaleX;
               player[i].hit_lug=10;
               player[i].face=4;
               player[i].frame=5;
               TimeSpeed=1;
               var b=new bomb_r();
               b.x=this.x-35;
               b.y=this.y-65;
               b.scaleX=this.scaleX/2;
               b.scaleY=this.scaleY/2;
               b.frame=1;
               this.x=-100;
               this.hit=1;
               
               BOMB=1;
               
               game.rootScene.removeChild(this);
               delete enemy_beam[this.key];
               delete this;
               
               
             }
           }
           
           if(this.x>1200 || this.x<-500 || this.y<-500 || this.y>1200){
             game.rootScene.removeChild(this);
             delete enemy_beam[this.key];
             delete this;
           }
         });
         game.rootScene.addChild(this);
      }
  });
  var enemy_beam3 = Class.create(Sprite,{
      initialize: function(){
         Sprite.call(this,113,21);
         e_beam_num++;
         this.key = e_beam_num;
         enemy_beam[this.key] = this;
         this.image=game.assets['beam_B.gif'];
         this.scaleX=0;
         this.scaleY=1;
         this.radious=25;
         this.hit=0;
         this.type=0;
         this.line=0;
         this.v=10;
         this.frame=0;
         this.addEventListener('enterframe',function(){
           if(this.hit==1)this.v+=2*TimeSpeed;
           if(this.scaleX<0.5)this.scaleX+=0.1*TimeSpeed;
           this.line-=1*TimeSpeed;
           if(this.line<=0){
             var b=new bomb_r();
             b.x=this.x-30;
             b.y=this.y-70;
             b.scaleX=0.1;
             b.scaleY=0.2;
             b.rotation=this.rotation;
             if(this.hit==0)b.frame=3;
             else{b.frame=4;}
             this.line=5;
           }
           this.x+=this.v*Math.cos(this.rotation/180*Math.PI)*TimeSpeed;
           this.y+=this.v*Math.sin(this.rotation/180*Math.PI)*TimeSpeed;
           for(var i in player){
             if(player[i].hp>0){
               this.direction=Math.atan((this.y+50-player[i].y-50)/(this.x+50-player[i].x-80))*180/Math.PI+180;
               if(this.x>player[i].x-50 && this.hit==0){
                 if(this.rotation>this.direction){this.rotate(-10*TimeSpeed);}
                 if(this.rotation<this.direction){this.rotate(10*TimeSpeed);}
               }
               
               if(player[i].within(this,this.radious) && player[i].hit_lug<=0 && player[i].face!=1){
                 player[i].hp-=5;
                 player[i].hit_lug=10;
                 player[i].face=4;
                 player[i].frame=5;
                 TimeSpeed=1;
                 var b=new bomb_r();
                 b.x=this.x-35;
                 b.y=this.y-65;
                 b.scaleX=1;
                 b.scaleY=2;
                 b.rotation=this.rotation;
                 b.frame=1;
                 this.x=-100;
                 this.hit=1;
                 BOMB=1;
                 game.rootScene.removeChild(this);
                 delete enemy_beam[this.key];
                 delete this;
               }
             }
           }
           
           if(this.x>1200 || this.x<-500 || this.y<-500 || this.y>800){
             game.rootScene.removeChild(this);
             delete enemy_beam[this.key];
             delete this;
           }
         });
         game.rootScene.addChild(this);
      }
  });
  var enemy_bomb = Class.create(Sprite,{
      initialize: function(){
         Sprite.call(this,160,160);
         e_num++;
         this.key = e_num;
         enemies[this.key] = this;
         this.image=game.assets['boss_bomb.gif'];
         this.scaleX=0;
         this.scaleY=0;
         this.hit_radious=0;
         this.face=0;
         this.bomb=200;
         this.guard=1;
         this.hp=100;
         this.frame=6;
         this.addEventListener('enterframe',function(){
           if(this.face==0){
             this.rotate(10*TimeSpeed);
             this.hit_radious=75*this.scaleX;
             this.bomb-=1*TimeSpeed;
             if(this.hp<=0){
               for(var i=0;i<5;i++){
                 var g=new item();
                 g.x=this.x+50+Math.floor(Math.random()*150)-75;
                 g.y=this.y+47+Math.floor(Math.random()*150)-75;
                 g.type=Math.floor(Math.random()*3);
               }
               for(var i=0;i<6;i++){
                 for(var j=0;j<5;j++){
                   var b = new enemy_beam2();
                   b.x=this.x+50;
                   b.y=this.y+47;
                   b.rotation=Math.floor(Math.random()*60)+150;
                   b.frame=i;
                   b.v=3+b.frame/2;
                 }
               }
               BOMB=1;
               game.rootScene.removeChild(this);
               delete enemies[this.key];
               delete this;
             }
             if(this.bomb<=0){
               BOMB=1;
               this.x=-100;
               this.face=1;
               this.opacity=0;
               this.hp=30;
               var b=new bomb_r();
               b.x=320;
               b.y=100;
               b.scaleX=1;
               b.scaleY=1;
               b.frame=4;
               game.rootScene.backgroundColor='white';
               for(var i in player){
                 if(player[i].hp>0 && player[i].face==0){
                   player[i].hp-=10;
                   player[i].hit_lug=50;
                   player[i].face=4;
                   player[i].frame=5;
                   Power=1;
                 }
               }
             }
             
             if(this.scaleX<2){
               this.scaleX+=0.01*TimeSpeed;
               this.scaleY+=0.01*TimeSpeed;
             }
           }
           if(this.face==1){
             this.bomb-=1*TimeSpeed;
             if(this.bomb<=0){
               this.bomb=5;
               var b=new bomb_b();
               b.x=Math.floor(Math.random()*400)+30;
               b.y=Math.floor(Math.random()*250)+30;
               b.scaleX=3;
               b.scaleY=3;
               var r=new bomb_r();
               r.x=Math.floor(Math.random()*400)+30;
               r.y=Math.floor(Math.random()*250)+30;
               r.scaleX=0.5;
               r.scaleY=0.5;
               r.frame=4;
             }
             this.hp-=1*TimeSpeed;
             if(this.hp<=0){
               game.rootScene.backgroundColor='black';
               game.rootScene.removeChild(this);
               delete enemies[this.key];
               delete this;
             }
           }
           
         });
         game.rootScene.addChild(this);
      }
   });
  var enemy_manager=Class.create(Label,{ 
      initialize: function() { 
         Label.call(this);
         this.text="";
         this.font = "32px Palatino";
         this.color = 'white';
         this.x=250;
         this.y=140;
         this.time_lug=30;
         this.appear_lug=100;
         this.enemy_num=0;
         this.set=0;
         this.boss=0;
         this.addEventListener('enterframe',function(){
           
           this.time_lug--;
           if(this.time_lug<=0){
             TimeLimit--;
             this.time_lug=30;
           }
           this.enemy_num=0;
           for(var i in enemies){
             if(enemies[i].hp>=0 || enemies[i].face==-1){this.enemy_num++;}
           }
           this.appear_lug-=1*TimeSpeed;
           if(this.appear_lug>0){
             if(this.boss==0){
               this.text="SET "+this.set;
             }
           }else{
             this.text="";
           }
           if(life>0 && this.enemy_num==0){
             
             this.appear_lug=100;
             if(TimeLimit>0){
               Set++;
               this.set++;
               if(this.set==1){
                 for(var i=-4;i<=4;i++){
                   var zako=new enemy();
                   if(i>=0){zako.x=700+50*i;}
                   if(i<=0){zako.x=700-50*i;}
                   zako.y=120+30*i;
                 }
                 var zako1=new enemy();
                 zako1.x=900;
                 zako1.y=120;
               }
               else if(this.set==5){
                 for(var i=-4;i<=4;i++){
                   var zako=new enemy();
                   zako.guard=4;
                   if(i>=0){
                     zako.x=700+50*i;
                     zako.stop=200+50*i;
                   }
                   if(i<=0){
                     zako.x=700-50*i;
                     zako.stop=200-50*i;
                   }
                   zako.y=120+30*i;
                   
                 }
                 var zako1=new enemy();
                 zako1.x=800;
                 zako1.y=120;
                 zako1.guard=40;
                 zako1.stop=150;
                 zako1.level=4;
                   
                 for(var i=-4;i<=4;i++){
                   var zako=new enemy();
                   zako.guard=4;
                   if(i>=0){
                     zako.x=1200-70*i;
                     zako.stop=400-50*i;
                   }
                   if(i<=0){
                     zako.x=1200+70*i;
                     zako.stop=400+50*i;
                   }
                   zako.y=120+20*i;
                 }
                 for(var i=-4;i<=4;i++){
                   if(i!=0){
                     var zako=new enemy();
                     zako.level=3;
                     zako.hp=15;
                   }
                   if(i>0){
                     zako.x=1250+50*i;
                     zako.stop=200+50*i;
                   }
                   if(i<0){
                     zako.x=1250-50*i;
                     zako.stop=200-50*i;
                   }
                   zako.y=120+20*i;
                 }
               }
               else if(this.set==7){
                 for(var i=0;i<10;i++){
                   var zako=new enemy();
                   zako.x=700+50*i;
                   zako.y=120;
                   zako.hp=50;
                   zako.stop=200+2*i;
                 }
               }
               else if(this.set==13){
                 for(var i=-1;i<=1;i++){
                   var zako=new enemy();
                   zako.x=1000;
                   zako.y=120;
                   zako.hp=200;
                   zako.guard=100;
                   zako.level=5;
                 }
               }
               else{
                 for(var i=1;i<=10;i++){
                   var zako=new enemy(244,105);
                   zako.x=Math.floor(Math.random()*300)+700;
                   zako.y=Math.floor(Math.random()*210)+40;
                   
                   if(this.set>10){
                     zako.level=4;
                     zako.hp=20;
                   }
                   else if(this.set>5){
                     zako.level=3;
                     zako.hp=15;
                   }
                   else if(this.set>2){
                     zako.level=2;
                     zako.hp=10;
                   }
                   else if(this.set>1){zako.level=1;}
                 }
               }
             }
             else if(this.boss==0){
               this.appear_lug=100;
               this.text="WARNING!";
               this.color="red";
               this.boss=1;
               Boss=1;
               Speed=5;
               Set++;
               var g=new item();
               g.x=1000;
               g.y=140;
               g.type=3;
               
               var right_shoulder = new boss_shoulder();
               right_shoulder.frame=1;
               right_shoulder.type=3;
               right_shoulder.x=1200;
               right_shoulder.y=100;
               
   
               var right_arm = new boss_arm();
               right_arm.frame=4;
               right_arm.type=5;
               right_arm.x=1200;
               right_arm.y=100;
               
   
               var boss_body = new boss();
               boss_body.x=1200;
               boss_body.y=100;
               
               var head=new boss_head();
               head.x=1200;
               head.y=100;
               
               var left_shoulder = new boss_shoulder();
               left_shoulder.x=1200;
               left_shoulder.y=100;
               
   
               var left_arm = new boss_arm();
               left_arm.x=1200;
               left_arm.y=100;
               
   
               var shield = new boss_shield();
               shield.master=boss_body;
               shield.opacity=0;
   
               
             }
           }
         });
         game.rootScene.addChild(this);
      }
  });
  var houdai =Class.create(Sprite,{ 
      initialize: function() { 
         Sprite.call(this,125,79);
         this.image=game.assets['houdai.gif'];
         this.frame=0;
         this.hp=1000;
         this.face=0;
         this.beam_lug=0;
         this.target=null;
         this.direction=0;
         this.search=0;
         canon[canon_num]=this;
         canon_num++;
         this.addEventListener('enterframe',function(){
           
           this.frame++;
           if(this.frame>1){
             this.frame=0;
           }
           if(this.face==0){
             if(this.scaleX>0){this.scaleX-=0.1;}
             this.opacity-=0.1;
           }
           if(this.face==1){
             if(this.target==null){
               if(this.search<60)this.search++;
            　 for(var i in enemies){
                 if(enemies[i].within(this,this.search*10) && enemies[i].hp>0){
                   this.target=enemies[i];
                   this.search=0;
                 }
               }
             }
             else{
               this.direction=Math.atan((this.y+25-this.target.y-40)/(this.x+25-this.target.x-80))*180/Math.PI;
               if(1){
                 if(this.rotation>this.direction){this.rotate(-2*TimeSpeed);}
                 if(this.rotation<this.direction){this.rotate(2*TimeSpeed);}
               }
               if(this.target.hp<=0){this.target=null;}
             }
             if(this.scaleX<1){this.scaleX+=0.1;}
             this.opacity=1;
             this.beam_lug-=1*TimeSpeed;
             if(this.beam_lug<=0){
               HIT2=1;
               var b = new beam_B();
               b.x=this.x+25+10*Math.cos((this.rotation+15)/180*Math.PI);
               b.y=this.y+25+10*Math.sin((this.rotation+15)/180*Math.PI);
               b.rotation=this.rotation;
               this.beam_lug=80;
             }
             this.hp-=1*TimeSpeed;
             if(this.hp<=0){
               this.face=0;
             }
           }
         });
         game.rootScene.addChild(this);
      }
  });
  
  var bomb_s=Class.create(Sprite,{ 
      initialize: function() { 
         Sprite.call(this,94,94);
         this.image=game.assets['bomb_s.gif'];
         this.frame=0;
         this.rotation=Math.floor(Math.random()*360);
         this.scaleX=0.5;
         this.scaleY=0.5;
         this.addEventListener('enterframe',function(){
           this.anime-=1*TimeSpeed;
           this.frame++;
           if(this.frame==5){
             game.rootScene.removeChild(this);
             delete this;
           }
         });
         game.rootScene.addChild(this);
      }
  });
  var bomb_b=Class.create(Sprite,{ 
      initialize: function() { 
         Sprite.call(this,162,162);
         this.image=game.assets['bomb_b.gif'];
         this.rotation=Math.floor(Math.random()*360);
         this.frame=0;
         this.scaleX=1;
         this.scaleY=1;
         
         this.addEventListener('enterframe',function(){
           this.anime-=1*TimeSpeed;
           this.frame++;
           if(this.frame==15){
             game.rootScene.removeChild(this);
             delete this;
           }
         });
         game.rootScene.addChild(this);
      }
  });
  
  var beam_line = Class.create(Sprite,{ 
      initialize: function() { 
         Sprite.call(this,76,17);
         this.image=game.assets['beam.gif'];
         this.opacity=1;
         this.scaleX=0.5;
         this.scaleY=0.5;
         this.addEventListener('enterframe',function(){
           this.opacity-=0.4*TimeSpeed;
           if(this.opacity<=0){
             game.rootScene.removeChild(this);
             delete this;
           }
         });
         game.rootScene.addChild(this);
      }
　});
　var bomb_r = Class.create(Sprite,{ 
      initialize: function() { 
         Sprite.call(this,174,174);
         this.image=game.assets['ring.gif'];
         this.opacity=1;
         this.v=0;
         this.addEventListener('enterframe',function(){
           this.x+=this.v*Math.cos(this.rotation/180*Math.PI)*TimeSpeed;
           this.y+=this.v*Math.sin(this.rotation/180*Math.PI)*TimeSpeed;
           this.scaleX*=1.05;
           this.scaleY*=1.05;
           this.opacity-=0.05;
           if(this.opacity<=0){
             game.rootScene.removeChild(this);
             delete this;
           }
         });
         game.rootScene.addChild(this);
      }
　});

   var item = Class.create(Sprite,{ 
      initialize: function() { 
         Sprite.call(this,67,67);
         this.image=game.assets['item.gif'];
         this.type=0;
         this.face=0;
         this.scaleX=0.5;
         this.scaleY=0.5;
         this.addEventListener('enterframe',function(){
           if(this.face==0){
             this.x-=6*TimeSpeed;
             this.frame++;
             if(this.frame<5*this.type || this.frame>=5*(this.type+1)-1){
               this.frame=5*this.type;
             }
             for(var i in player){
               if(this.face==0 && player[i].within(this,30) && player[i].face!=-1){
                 this.face=1;
                 Item++;
                 for(var j=0;j<=1;j++){
                   var bb=new bomb_r();
                   bb.x=this.x-60;
                   bb.y=this.y-60;
                   bb.scaleX=0.1;
                   bb.scaleY=0.2;
                   bb.rotation=45+90*j;
                   if(this.type==0){bb.frame=4;}
                   if(this.type==1){bb.frame=1;}
                   if(this.type==2){bb.frame=3;}
                   if(this.type==3){bb.frame=0;}
                   if(this.type==4){bb.frame=2;}
                   if(this.type==5){bb.frame=2;}
                 }
                 
                 if(this.type==0){
                   player[i].hp+=10;
                   if(player[i].hp>100){player[i].hp=100;}
                   
                 }
                 if(this.type==1){
                   if(Power<3){
                     Power+=0.1;
                   }
                 }
                 if(this.type==2){
                   if(Weapon==0){
                     Weapon=1;
                   }
                   else if(Weapon==1){
                     Weapon=0;
                   }
                 }
                 if(this.type==3){
                   player[i].hp+=50;
                   if(player[i].hp>100){player[i].hp=100;}
                 }
                 if(this.type==4){
                   
                   Lazer=300;
                   if(LastBattle==1){
                     Lazer=100000;
                   }
                 }
                 if(this.type==5){
                   for(var i in canon){
                     canon[i].hp=500;
                     canon[i].face=1;
                     var b=new bomb_r();
                     b.x=canon[i].x-30;
                     b.y=canon[i].y-60;
                     b.scaleX=0.4;
                     b.scaleY=0.4;
                     b.frame=2;
                   }
                 }
               }
             }
             if(this.x<-10){
               game.rootScene.removeChild(this);
               delete this;
             }
           }

           if(this.face==1){
             this.opacity-=0.2*TimeSpeed;
             this.scaleX+=0.1*TimeSpeed;
             this.scaleY+=0.1*TimeSpeed;
             if(this.opacity<=0){
               game.rootScene.removeChild(this);
               delete this;
             }
           }
         });
         game.rootScene.addChild(this);
       }
   });
   
   var boss =Class.create(Sprite,{ 
      initialize: function() { 
         Sprite.call(this,265,210);
         this.image=game.assets['boss_body.gif'];
         e_num++;
         this.key = e_num;
         enemies[e_num] = this;
         this.hit_radious=70;
         this.hp=3000;
         this.guard=2;
         this.type=1;
         this.face=0;
         this.attack_lug=300;
         this.pettern=0;
         this.beam_lug=0;
         this.beam_chain=0;
         this.attack_num=0;
         this.hit_lug=0;
         this.ny=100;
         this.last=0;
         this.scaleX=0.7;
         this.scaleY=0.7;
         this.target=null;
         this.direction=0;
         this.last_attack=0;
         this.addEventListener('enterframe',function(){
           if(this.target==null){
             for(var i in player){
               if(player[i].hp>0){
                 this.target=player[i];
                 
               }
             }
           }else{
             this.direction=Math.atan((this.y+70-this.target.y-50)/(this.x-this.target.x-80))*180/Math.PI+180;
             if(this.target.hp<=0){this.target=null;}
           }
           if(this.hp<Boss_HP){Boss_HP=this.hp;}
           else{this.hp=Boss_HP;}
           
           
           if(LastBattle==0 && Boss_HP<=0 && Clear==0){
             LastBattle=1;
             game.assets['charge.wav'].play();
             this.attack_lug=500;
             for(var i=0;i<2;i++){
               var r=new bomb_r();
               r.x=this.x-30;
               r.y=this.y;
               r.scaleX=3-2*i;
               r.scaleY=0.1+0.9*i;
               r.rotation=0;
               r.frame=1;
             }
             var gg=new item();
             gg.x=1000;
             gg.y=160;
             gg.type=4;
             this.face=-1;
             for(var i in enemy_beam){
               enemy_beam[i].x=2000;
             }
           }
           
           if(this.face==-1){
             if(this.x>450)this.x-=10;
             if(this.x<450)this.x+=10;
             if(this.y>100)this.y-=5;
             if(this.y<100)this.y+=5;
             if(LastBattle==2){
               this.face=-2;
               var lazer =new boss_lazer();
               lazer.master=this;
               lazer.type=1;
               lazer.hp=40000;
             }
             this.attack_lug-=1*TimeSpeed;
             if(this.attack_lug<=0){
               this.face=1;
               this.pettern=0;
             }
           }
           if(this.face==-2){
             
             if(this.x<550)this.x+=10;
           }
           if(this.face==-3){
             this.attack_lug-=1*TimeSpeed;
             this.beam_lug-=1*TimeSpeed;
             if(this.pettern==0){
               this.y+=20*Math.sin(this.attack_lug*90/180*Math.PI);
               this.x-=2;
               if(this.beam_lug<=0){
                 BOMB=1;
                 HIT=1;
                 var b=new bomb_b();
                 b.x=this.x-30;
                 b.y=this.y;
                 b.scaleX=1;
                 b.scaleY=1;
                 this.beam_lug=5;
               }
               if(this.attack_lug<=0){
                 game.rootScene.backgroundColor='white';
                 this.pettern=1;
                 this.attack_lug=100;
                 var b=new bomb_b();
                 b.x=this.x-30;
                 b.y=this.y;
                 b.scaleX=5;
                 b.scaleY=5;
                 for(var i=0;i<2;i++){
                   var r=new bomb_r();
                   r.x=this.x-30;
                   r.y=this.y;
                   r.scaleX=3-2*i;
                   r.scaleY=0.1+0.9*i;
                   r.rotation=0;
                   r.frame=1;
                 }
               }
             }
             if(this.pettern==1){
               this.y+=0.5;
               this.x+=Math.sin(this.attack_lug/180*Math.PI)*TimeSpeed;
               if(this.attack_lug<=80){
                 game.rootScene.backgroundColor='black';
               }
               if(this.attack_lug<=0){
                 this.pettern=2;
                 this.attack_lug=50;
               }
             }
             if(this.pettern==2){
               
               if(this.attack_lug<=0){
                 this.pettern=3;
                 this.attack_lug=200;
               }
             }
             if(this.pettern==3){
               this.y-=10*TimeSpeed;
               this.x+=30*TimeSpeed;
               if(this.x>=2000){
                 Escape=1;
               }
             }
           }
           if(LastBattle==0 && Clear==0){
             if(this.y<this.ny){this.y+=10*TimeSpeed;}
             if(this.y>this.ny){this.y-=10*TimeSpeed;}
           }
           this.hit_lug-=1*TimeSpeed;
           if(this.face==0){
             Lazer=0;
             this.attack_lug-=1*TimeSpeed;
             if(this.pettern==0){
               this.x-=2*TimeSpeed;
               if(this.x<=450){
                 this.pettern=1;
                 this.attack_lug=50;
               }
               
             }
             if(this.pettern==1){
               if(this.attack_lug<=0){
                 this.pettern=0;
                 this.face=1;
                 this.attack_lug=50;
               }
             }
           }
           if(this.face==1){
             
             this.attack_lug-=1*TimeSpeed;
             if(this.pettern==0){
               game.assets['charge.wav'].play();
               if(this.attack_lug<=0){
                 this.pettern=1;
                 this.attack_lug=60;
                 var lazer =new boss_lazer();
                 lazer.master=this;
                 BOMB=1;
               }
             }
             if(this.pettern==1){
               if(this.x<1200)this.x+=20*TimeSpeed;
               if(this.attack_lug<=0){
                 this.pettern=2;
                 if(LastBattle>0){
                   LastBattle=0;
                   
                 }
               }
             }
             if(this.pettern==2){
               this.x-=5*TimeSpeed;
               if(this.x<=450){
                 this.face=3;
                 this.pettern=0;
                 this.attack_lug=20;
                 
               }
             }
           }
           if(this.face==2){
             this.attack_lug-=1*TimeSpeed;
             if(this.pettern==0){
               if(this.attack_lug<=0){
                 this.pettern=1;
                 this.attack_lug=10;
               }
             }
             if(this.pettern==1){
               if(this.attack_lug<=0){
                 this.pettern=2;
                 this.attack_lug=60;
               }
             }
             if(this.pettern==2){
               if(this.attack_lug<=0){
                 this.pettern=3;
                 this.attack_lug=30;
                 this.ny=Math.floor(Math.random()*50);
               }
             }
             if(this.pettern==3){
               if(this.attack_lug<=0){
                 this.pettern=4;
                 this.attack_lug=100;
                 
               }
             }
             if(this.pettern==4){
               if(this.attack_lug<=0){
                 this.face=3;
                 this.pettern=0;
                 this.attack_lug=20;
               }
             }
           }
           if(this.face==3){
             this.attack_lug-=1*TimeSpeed;
             if(this.pettern==0){
               this.x+=20*TimeSpeed;
               if(this.attack_lug<=0){
                 this.ny=Math.floor(Math.random()*200)+50;
                 this.pettern=1;
                 this.attack_lug=20;
               }
             }
             if(this.pettern==1){
               this.x-=30*TimeSpeed;
               if(this.attack_lug<=0){
                 this.ny=Math.floor(Math.random()*200)+50;
                 this.pettern=2;
                 this.attack_lug=20;
               }
             }
             if(this.pettern==2){
               this.x+=10*TimeSpeed;
               if(this.attack_lug<=0){
                 this.ny=Math.floor(Math.random()*200)+50;
                 this.attack_num++;
                 if(this.hp<=1000 && this.last==0){
                   this.face=7;
                   this.last=1;
                   this.ny=100;
                   this.attack_lug=50;
                   this.last_attack=7; 
                 }
                 else if(this.attack_num>=5){
                   this.face=0;
                   this.pettern=1;
                   this.attack_lug=20;
                   this.attack_num=0;
                   this.ny=this.target.y-50;
                 }/*
                 else if(this.last_attack!=7 && Math.floor(Math.random()*7)==0 && this.last==1){
                   this.face=7;
                   this.ny=100;
                   this.attack_lug=50;
                   this.last_attack=7; 
                 }*/
                 else if(this.last_attack!=6 && Math.floor(Math.random()*4)==0){
                   this.face=6;
                   this.ny=100;
                   this.attack_lug=50;
                   this.last_attack=6; 
                 }
                 else if(this.last_attack!=2 && Math.floor(Math.random()*3)==0){
                   this.face=2;
                   this.attack_lug=10;
                   this.ny=Math.floor(Math.random()*50)+100;
                   this.last_attack=2; 
                 }
                 else if(this.last_attack!=4 && Math.floor(Math.random()*2)==0){
                   this.face=4;
                   this.attack_lug=10;
                   this.last_attack=4;
                 }
                 else {
                   this.face=5;
                   this.attack_lug=50;
                   this.ny=this.target.y-50;
                   this.last_attack=5;
                 }
                 this.pettern=0;
               }
             }
           }
           if(this.face==4){
             this.attack_lug-=1*TimeSpeed;
             if(this.pettern==0){
               if(this.attack_lug<=0){
                 this.pettern=1;
                 this.attack_lug=200;
                 var bomb = new enemy_bomb();
                 bomb.x=400;
                 bomb.y=80;
               }
             }
             if(this.pettern==1){
               if(this.x<1200)this.x+=20*TimeSpeed;
               if(this.attack_lug<=0){
                 this.pettern=2;
                 this.attack_lug=20;
               }
             }
             if(this.pettern==2){
               this.x-=10*TimeSpeed;
               if(this.x<=450){
                 this.face=3;
                 this.pettern=0;
                 this.attack_lug=20;
               }
             }
           }
           if(this.face==5){
             
             this.attack_lug-=1*TimeSpeed;
             if(this.pettern==0){
               if(this.x<500)this.x+=5*TimeSpeed;
               if(this.attack_lug<=0){
                 this.pettern=1;
                 this.attack_lug=200;
               }
             }
             if(this.pettern==1){
               if(this.attack_lug<=0){
                 this.pettern=2;
                 this.attack_lug=20;
               }
             }
             if(this.pettern==2){
               if(this.x>450){this.x-=5*TimeSpeed;}
               if(this.x<=450){
                 this.face=3;
                 this.pettern=0;
                 this.attack_lug=20;
               }
             }
           }
           if(this.face==6){
             this.attack_lug-=1*TimeSpeed;
             if(this.pettern==0){
               if(this.x<500)this.x+=5*TimeSpeed;
               if(this.attack_lug<=0){
                 this.pettern=1;
                 this.attack_lug=200;
               }
             }
             if(this.pettern==1){
               if(this.attack_lug<=0){
                 this.pettern=2;
                 this.attack_lug=20;
               }
             }
             if(this.pettern==2){
               if(this.x>450){this.x-=5*TimeSpeed;}
               if(this.x<=450){
                 this.face=3;
                 this.pettern=0;
                 this.attack_lug=20;
               }
             }
           }
           if(this.face==7){
             this.attack_lug-=1*TimeSpeed;
             if(this.pettern==0){
               if(this.x<500)this.x+=5*TimeSpeed;
               if(this.attack_lug<=0){
                 this.pettern=1;
                 this.attack_lug=100;
                 for(var i=-4;i<=4;i++){
                   var bomb=new enemy_beam2();
                   bomb.x=650+100*Math.cos((180+6*i)/180*Math.PI);
                   bomb.y=160+100*Math.sin((180+6*i)/180*Math.PI);
                   bomb.rotation=180+6*i;
                   bomb.frame=1;
                   bomb.v=3;
                   bomb.scale(1,1);
                   var bomb=new enemy_beam2();
                   bomb.x=200+500*Math.cos((30*i)/180*Math.PI);
                   bomb.y=160+500*Math.sin((30*i)/180*Math.PI);
                   bomb.rotation=180+30*i;
                   bomb.frame=3;
                   bomb.v=3;
                   bomb.scale(1.5,1.5);
                 }
                 for(var i=0;i<=10;i++){
                   var bomb=new enemy_beam2();
                   bomb.x=600+100*Math.cos((150+10*i)/180*Math.PI);
                   bomb.y=50+100*Math.sin((150+10*i)/180*Math.PI);
                   bomb.rotation=115+10*i;
                   bomb.frame=4;
                   bomb.v=5;
                   bomb.scale(1.5,1.5);
                   var bomb=new enemy_beam2();
                   bomb.x=600+100*Math.cos(-(150+10*i)/180*Math.PI);
                   bomb.y=250+100*Math.sin(-(150+10*i)/180*Math.PI);
                   bomb.rotation=-115-10*i;
                   bomb.frame=4;
                   bomb.v=5;
                   bomb.scale(1.5,1.5);
                 }
                 for(var i=-5;i<=5;i++){
                   var bomb=new enemy_beam2();
                   bomb.x=600+50*Math.cos((10*i)/180*Math.PI);
                   bomb.y=160+50*Math.sin((10*i)/180*Math.PI);
                   bomb.rotation=180+10*i;
                   bomb.frame=0;
                   bomb.v=5;
                   bomb.scale(1.5,1.5);
                   
                 }
                 for(var i=0;i<10;i++){
                   var bomb=new enemy_beam2();
                   bomb.x=600+60*i;
                   bomb.y=160+80;
                   bomb.rotation=180;
                   bomb.frame=2;
                   bomb.v=3;
                   bomb.scale(1.5,1.5);
                   var bomb=new enemy_beam2();
                   bomb.x=600+60*i;
                   bomb.y=160-80;
                   bomb.rotation=180;
                   bomb.frame=2;
                   bomb.v=3;
                   bomb.scale(1.5,1.5);
                 }
                 
               }
             }
             if(this.pettern==1){
               if(this.attack_lug<=0){
                 this.pettern=2;
                 this.attack_lug=300;
               }
             }
             if(this.pettern==2){
               if(this.x<550){this.x+=5*TimeSpeed;}
               if(this.attack_lug<=0){
                 this.pettern=3;
                 this.attack_lug=180;
               }
             }
             if(this.pettern==3){
               if(this.attack_lug<=0){
                 this.pettern=4;
               }
             }
             if(this.pettern==4){
               if(this.x>450){this.x-=5*TimeSpeed;}
               if(this.x<=450){
                 this.face=3;
                 this.pettern=0;
                 this.attack_lug=20;
               }
             }
           }
         });
         game.rootScene.addChild(this);
       }
   });
   var boss_shoulder=Class.create(Sprite,{ 
      initialize: function() { 
         Sprite.call(this,167,80);
         this.image=game.assets['boss_shoulder.gif'];
         e_num++;
         this.key = e_num;
         enemies[e_num] = this;
         this.hit_radious=30;
         this.hp=3000;
         this.guard=4;
         this.face=0;
         this.type=2;
         this.frame=0;
         this.direction_1=180;
         this.direction_2=180;
         this.roll_1=10;
         this.roll_2=20;
         this.own_rotation=180;
         this.scaleX=0.7;
         this.scaleY=0.7;
         this.master=null;
         this.addEventListener('enterframe',function(){
           
           if(this.hp<Boss_HP){Boss_HP=this.hp;}
           else{this.hp=Boss_HP;}
           
           if(this.type==2){
             if(this.own_rotation<this.direction_1){
               this.own_rotation+=this.roll_1*TimeSpeed;
               if(this.direction_1-this.own_rotation<this.roll_1)this.own_rotation=this.direction_1;
             }
             if(this.own_rotation>this.direction_1){
               this.own_rotation-=this.roll_1*TimeSpeed;
               if(this.own_rotation-this.direction_1<this.roll_1)this.own_rotation=this.direction_1;
             }
           }
           if(this.type==3){
             if(this.own_rotation<this.direction_2){
               this.own_rotation+=this.roll_2*TimeSpeed;
               if(this.direction_2-this.own_rotation<this.roll_2)this.own_rotation=this.direction_2;
             }
             if(this.own_rotation>this.direction_2){
               this.own_rotation-=this.roll_2*TimeSpeed;
               if(this.own_rotation-this.direction_2<this.roll_2)this.own_rotation=this.direction_2;
             }
           }
           
           if(this.master==null){
             for(var i in enemies){
               if(enemies[i].type==1){
                 this.master=enemies[i];
               }
             }
           }
           else{
             this.pettern=this.master.pettern;
             this.face=this.master.face;
             this.rotation=this.own_rotation+this.master.rotation;
             this.x=this.master.x+70*Math.cos(this.master.rotation/180*Math.PI)+20*Math.cos(this.rotation/180*Math.PI);
             this.y=this.master.y+70*Math.sin(this.master.rotation/180*Math.PI)+20*Math.sin(this.rotation/180*Math.PI);
           }
           if(this.face==-1){
             this.roll_1=10;
             this.roll_2=10;
             this.direction_1=30;
             this.direction_2=-200;
           }
           if(this.face==0){
             if(this.pettern==1){
               this.roll_2=20;
               this.direction_1=30;
               this.direction_2=-200;
             }
           }
           if(this.face==-3){
             if(this.pettern==0){
               this.roll_1=10;
               this.roll_2=10;
               this.direction_1=100;
               this.direction_2=100;
             }
             if(this.pettern==1){
               this.roll_1=5;
               this.roll_2=5;
               this.direction_1=120;
               this.direction_2=120;
             }
             if(this.pettern==2){
               this.roll_1=20;
               this.roll_2=20;
               this.direction_1=30;
               this.direction_2=30;
             }
           }
           if(this.face==1){
             if(this.pettern==0){
               this.roll_1=10;
               this.roll_2=10;
               this.direction_1=30;
               this.direction_2=-200;
             }
             if(this.pettern==2){
               this.direction_1=60;
               this.direction_2=60;
             }
           }
           if(this.face==2){
             if(this.pettern==0){
               this.direction_1=150;
               this.direction_2=20;
             }
             if(this.pettern==1){
               this.direction_1=90;
               this.direction_2=20;
             }
             if(this.pettern==2){
               this.roll_1=2;
               this.direction_1=210;
             }
             if(this.pettern==3){
               this.roll_1=20;
               this.direction_1=20;
               this.roll_2=20;
               this.direction_2=180;
             }
             if(this.pettern==4){
               this.roll_2=0.5;
               this.direction_2=90;
             }
           }
           if(this.face==3){
             this.roll_1=10;
             this.roll_2=10;
             this.direction_1=120;
             this.direction_2=120;
           }
           if(this.face==5){
             this.roll_1=2;
             this.roll_2=2;
             this.direction_1=this.master.direction;
             this.direction_2=30;
           }
           if(this.face==6){
             this.roll_1=0.5;
             this.roll_2=0.5;
             this.direction_1=30;
             this.direction_2=this.master.direction;
           }
           if(this.face==7){
             
             if(this.pettern==0){
               this.roll_1=10;
               this.roll_2=10;
               this.direction_1=10;
               this.direction_2=170;
             }
             if(this.pettern==1){
               this.roll_1=20;
               this.roll_2=20;
               this.direction_1=260;
               this.direction_2=20;
             }
             if(this.pettern==2){
               this.direction_1=30;
               this.direction_2=160;
             }
             if(this.pettern==3){
               this.direction_1=160;
               this.direction_2=30;
             }
           }
         });
         game.rootScene.addChild(this);
       }
   });
   
   var boss_arm=Class.create(Sprite,{ 
      initialize: function() { 
         Sprite.call(this,257,92);
         this.image=game.assets['boss_arm.gif'];
         this.guard=4;
         e_num++;
         this.key = e_num;
         enemies[e_num] = this;
         this.hit_radious=40;
         this.hp=3000;
         this.face=0;
         this.type=4;
         this.frame=0;
         this.direction_1=180;
         this.direction_2=180;
         this.roll_1=10;
         this.roll_2=10;
         this.mode_1=0;
         this.mode_2=0;
         this.own_rotation=180;
         this.beam_lug=0;
         this.beam_chain=0;
         this.scaleX=0.7;
         this.scaleY=0.7;
         this.master=null;
         this.addEventListener('enterframe',function(){
           
           
           
           if(this.hp<Boss_HP){Boss_HP=this.hp;}
           else{this.hp=Boss_HP;}
           
           if(this.type==4){
             if(this.own_rotation<this.direction_1){
               this.own_rotation+=this.roll_1*TimeSpeed;
               if(this.direction_1-this.own_rotation<this.roll_1)this.own_rotation=this.direction_1;
             }
             if(this.own_rotation>this.direction_1){
               this.own_rotation-=this.roll_1*TimeSpeed;
               if(this.own_rotation-this.direction_1<this.roll_1)this.own_rotation=this.direction_1;
             }
             if(this.mode_1==0){this.frame=0;}
             if(this.mode_1==1){
               this.frame++;
               if(this.frame>2){this.frame=0;}
             }
             if(this.mode_1==2){this.frame=3;}
           }
           if(this.type==5){
             if(this.own_rotation<this.direction_2){
               this.own_rotation+=this.roll_2*TimeSpeed;
               if(this.direction_2-this.own_rotation<this.roll_2)this.own_rotation=this.direction_2;
             }
             if(this.own_rotation>this.direction_2){
               this.own_rotation-=this.roll_2*TimeSpeed;
               if(this.own_rotation-this.direction_2<this.roll_2)this.own_rotation=this.direction_2;
             }
             if(this.mode_2==0){this.frame=4;}
             if(this.mode_2==1){
               this.frame++;
               if(this.frame>6){this.frame=4;}
             }
             if(this.mode_2==2){this.frame=7;}
           }
           
           if(this.master==null){
             for(var i in enemies){
               if((this.type==4 && enemies[i].type==2) || (this.type==5 && enemies[i].type==3)){
                 this.master=enemies[i];
               }
             }
           }
           else{;
             this.face=this.master.master.face;
             this.pettern=this.master.master.pettern;
             this.rotation=this.own_rotation+this.master.rotation;
             this.x=this.master.x+50*Math.cos(this.master.rotation/180*Math.PI)+70*Math.cos(this.rotation/180*Math.PI)-45;
             this.y=this.master.y+50*Math.sin(this.master.rotation/180*Math.PI)+70*Math.sin(this.rotation/180*Math.PI);
             
           }
           if(this.face==-1){
             this.direction_1=130;
             this.direction_2=20;
             if(this.type==5){
               var r = new bomb_r();
          　   r.x=this.x-30;
               r.y=this.y-35;
               r.scaleX=0.1;
               r.opacity=1;
               r.frame=Math.floor(Math.random()*5);
             }
           }
           if(this.face==-2){
             this.beam_lug-=1*TimeSpeed;
             if(this.type==5){
               if(this.beam_lug<=0){
                 var r = new bomb_r();
          　     r.x=this.x-30;
                 r.y=this.y-35;
                 r.scaleX=0.1;
                 r.opacity=1;
                 r.v=-2;
                 r.frame=Math.floor(Math.random()*5);
                 this.beam_lug=2;
               }
             }
           }
           if(this.face==-3){
             if(this.pettern==0){
               this.roll_1=10;
               this.roll_2=10;
               this.direction_1=90;
               this.direction_2=90;
             }
             if(this.pettern==1){
               this.roll_1=5;
               this.roll_2=5;
               this.mode_1=2;
               this.mode_2=2;
               this.direction_1=30;
               this.direction_2=30;
             }
             if(this.pettern==2){
               this.mode_1=2;
               this.mode_2=2;
               this.roll_1=20;
               this.roll_2=20;
               this.direction_1=150;
               this.direction_2=150;
             }
           }
           if(this.face==0){
             if(this.pettern==1){
               this.direction_1=130;
               this.direction_2=20;
             }
           }
           if(this.face==1){
             if(this.pettern==0){
               this.direction_1=130;
               this.direction_2=20;
             }
             this.mode_2=1;
             if(this.type==5){
               if(this.pettern==0){
                 var r = new bomb_r();
        　   　  r.x=this.x-30;
                 r.y=this.y-35;
                 r.scaleX=0.1;
                 r.opacity=1;
                 r.frame=Math.floor(Math.random()*5);
               }
               if(this.pettern==1){
                 var r = new bomb_r();
        　   　  r.x=this.x-30;
                 r.y=this.y-35;
                 r.scaleX=0.1;
                 r.opacity=1.5;
                 r.v=-2;
                 r.frame=Math.floor(Math.random()*5);
               }
               
             }
             if(this.pettern==2){
               this.direction_1=120;
               this.direction_2=120;
             }
           }
           if(this.face==2){
             if(this.pettern==0){
               this.mode_1=0;
               this.mode_2=0;
               this.direction_1=30;
               this.direction_2=120;
               
             }
             if(this.pettern==1){
               if(this.type==4){
                 this.frame++;
                 if(this.frame>3){this.frame=0;}
                 this.beam_lug=5;
               }
             }
             if(this.pettern==2){
               this.mode_1=1;
               if(this.type==4){
                 this.beam_lug-=1*TimeSpeed;
                 if(this.beam_lug<=0){
                   HIT2=1;
                   var b =new enemy_beam2();
                   b.x=this.x+30*Math.cos(this.rotation/180*Math.PI);
                   b.y=this.y+30*Math.sin(this.rotation/180*Math.PI);
                   b.rotation=this.rotation;
                   b.scaleX=2;
                   b.scaleY=2;
                   b.frame=0;
                   this.beam_lug=7;
                 }
               }
             }
             if(this.pettern==3){
               this.mode_1=0;
               this.mode_2=1;
               this.beam_lug=0;
               this.beam_chain=0;
               this.direction_1=120;
               this.direction_2=30;
               
             }
             if(this.pettern==4){
               if(this.type==5){
                 this.beam_lug-=1*TimeSpeed;
                 if(this.beam_lug<=0){
                   this.beam_chain++;
                   for(var i=-2;i<=2;i++){
                     var b =new enemy_beam1();
                     b.x=this.x+100+80*Math.cos((this.rotation)/180*Math.PI);
                     b.y=this.y+50+80*Math.sin((this.rotation)/180*Math.PI);
                     b.rotation=this.rotation+(this.beam_chain%40)*i;
                     b.frame=(i+2)*2;
                   }
                   this.beam_lug=2;
                 }
               }
             }
           }
           if(this.face==3){
             this.mode_1=0;
             this.mode_2=0;
             this.roll_1=10;
             this.roll_2=10;
             this.direction_1=150;
             this.direction_2=150;
           }
           if(this.face==5){
             this.mode_1=1;
             this.mode_2=0;
             this.roll_1=10;
             this.roll_2=10;
             this.direction_1=0;
             this.direction_2=120;
             if(this.pettern==0){
               this.beam_lug=10;
             }
             if(this.pettern==1){
               this.beam_lug-=1*TimeSpeed;
               if(this.beam_lug<=0){
                 if(this.type==4){
                   HIT2=1;
                   var b =new enemy_beam3();
                   b.x=this.x+100+100*Math.cos((this.rotation)/180*Math.PI);
                   b.y=this.y+50+100*Math.sin((this.rotation)/180*Math.PI);
                   if(Math.floor(Math.random()*3)==0){b.rotation=this.rotation+360;}
                   else if(Math.floor(Math.random()*2)==0){b.rotation=this.rotation-360;}
                   else{b.rotation=this.rotation;}
                   
                 }
                 this.beam_lug=30;
               }
             }
           }
           if(this.face==6){
             this.mode_1=0;
             this.mode_2=1;
             this.roll_1=10;
             this.roll_2=10;
             this.direction_1=120;
             this.direction_2=0;
             if(this.pettern==0){
               this.beam_lug=10;
             }
             if(this.pettern==1){
               this.beam_lug-=1*TimeSpeed;
               if(this.beam_lug<=0){
                 if(this.type==5){
                   for(var i=-2;i<=2;i++){
                     var b =new enemy_beam1();
                     b.x=this.x+100+100*Math.cos((this.rotation)/180*Math.PI);
                     b.y=this.y+50+100*Math.sin((this.rotation)/180*Math.PI);
                     b.frame=2;
                     b.rotation=this.rotation+5*i;
                   }
                 }
                 this.beam_lug=3;
                 this.beam_chain++;
                 if(this.beam_chain>=5){
                   this.beam_lug=10;
                   this.beam_chain=0;
                 }
               }
             }
           }
           if(this.face==7){
             if(this.pettern==0){
               this.roll_1=10;
               this.roll_2=10;
               this.mode_1=1;
               this.mode_2=0;
               this.direction_1=60;
               this.direction_2=120;
             }
             if(this.pettern==1){
               this.roll_1=20;
               this.roll_2=20;
               this.direction_1=10;
               this.direction_2=20;
               this.beam_lug=50;
               this.beam_chain=0;
             }
             if(this.pettern==2){
               this.mode_1=0;
               this.mode_2=1;
               this.direction_1=120;
               this.direction_2=20;
               this.beam_lug-=1*TimeSpeed;
               if(this.beam_lug<=0 && this.type==5){
                 
                 for(var i=1;i<=5;i++){
                   var beam=new enemy_beam1();
                   beam.x=this.x-Math.floor(Math.random()*30)-20;
                   beam.y=this.y+Math.floor(Math.random()*100)-10;
                   beam.rotation=180;
                   beam.frame=Math.floor(Math.random()*6)*2;
                   beam.v=30;
                 }
                 
                 var r = new bomb_r();
        　   　  r.x=this.x-30;
                 r.y=this.y-35;
                 r.scaleX=0.1;
                 r.opacity=1;
                 
                 r.frame=Math.floor(Math.random()*5);
                 this.beam_lug=3;
               }
             }
             if(this.pettern==3){
               this.mode_1=1;
               this.mode_2=0;
               this.direction_1=20;
               this.direction_2=120;
               this.beam_lug-=1*TimeSpeed;
               if(this.beam_lug<=0 && this.type==4){
                 for(var i=-2;i<=2;i++){
                   var beam=new enemy_beam3();
                   beam.x=this.x-20;
                   beam.y=this.y+40;
                   beam.rotation=180+this.beam_chain*3*i;
                   beam.v=0;
                   beam.hit=1;
                   
                 }
                 HIT2=1;
                 this.beam_lug=20;
                 this.beam_chain++;
               }
             }
           }
         });
         game.rootScene.addChild(this);
       }
   });
   
   var boss_head=Class.create(Sprite,{ 
      initialize: function() { 
         Sprite.call(this,117,63);
         this.image=game.assets['boss_head.gif'];
         e_num++;
         this.key = e_num;
         enemies[e_num] = this;
         this.hit_radious=30;
         this.hp=3000;
         this.guard=0.5;
         this.face=0;
         this.type=6;
         this.frame=0;
         this.own_rotation=0;
         this.scaleX=0.7;
         this.scaleY=0.7;
         this.master=null;
         this.addEventListener('enterframe',function(){
           
           if(this.hp<Boss_HP){
             Boss_HP=this.hp;
             var bb=new bomb_r();
             bb.x=this.x-50;
             bb.y=this.y-50;
             bb.scaleX=0.25;
             bb.scaleY=0.5;
             bb.frame=1;
           }
           else{this.hp=Boss_HP;}
           if(this.master==null){
             for(var i in enemies){
               if(enemies[i].type==1){
                 this.master=enemies[i];
               }
             }
           }
           else{
             this.face=this.master.face;
             this.pettern=this.master.pettern;
             this.rotation=this.own_rotation+this.master.rotation;
             this.x=this.master.x+50*Math.cos((this.rotation-20)/180*Math.PI);
             this.y=this.master.y+50*Math.sin((this.rotation-20)/180*Math.PI);
           }
           if(this.face==-3 && this.pettern==1){this.frame=5;}
           else{
             this.frame++;
             if(this.frame>4)this.frame=0;
           }
           
         });
         game.rootScene.addChild(this);
       }
   });
   var boss_brade = Class.create(Sprite,{ 
      initialize: function() { 
         Sprite.call(this,159,159);
         this.image=game.assets['boss_shield.gif'];
         this.frame=0;
         this.scaleX=0;
         this.scaleY=0;
         this.face=0;
         this.v=-30;
         this.addEventListener('enterframe',function(){
           this.frame++;
           if(this.frame>4){this.frame=0;}
           this.rotate(60*TimeSpeed);
           if(this.face==0){
             this.scaleX+=0.01*TimeSpeed;
             this.scaleY+=0.01*TimeSpeed;
             if(this.scaleX>=1){
               this.face=1;
             }
           }
           if(this.face==1){
             this.x+=this.v*TimeSpeed;
             this.v+=1*TimeSpeed;
           }
         });
       game.rootScene.addChild(this);
      }
　});
　var boss_shield = Class.create(Sprite,{ 
      initialize: function() { 
         Sprite.call(this,160,160);
         this.image=game.assets['boss_shield.gif'];
         this.frame=0;
         this.scaleX=0.5;
         this.scaleY=3;
         this.face=1;
         this.master=null;
         this.hp=1000;
         this.wave=0;
         this.addEventListener('enterframe',function(){
           this.hp=1000;
           this.frame++;
           if(this.frame>6){this.frame=0;}
           this.rotate(0*TimeSpeed);
           if(this.master!=null){
             this.x=this.master.x-50;
             this.y=this.master.y;
           }
           if(this.face==0){
             if(this.scaleX<1)this.scaleX+=0.1;
             this.wave++;
             this.opacity=1+0.5*Math.sin(this.wave*10/180*Math.PI);
             if(LastBattle==0){this.face=1;}
             for(var i in beam){
               if(this.x<=beam[i].x && beam[i].rotation<90 && beam[i].rotation>-90){
                 beam[i].rotation=180-beam[i].rotation;
               }
             }
           }
           if(this.face==1){
             this.hit_radious=0;
             this.opacity-=0.1;
             if(LastBattle>0){this.face=0;}
           }
         });
       game.rootScene.addChild(this);
      }
　});
   var boss_lazer = Class.create(Sprite,{ 
      initialize: function() { 
         Sprite.call(this,98,98);
         this.image=game.assets['boss_lazer.gif'];
         e_beam_num++;
         this.key = e_beam_num;
         enemy_beam[this.key] = this;
         this.frame=0;
         this.type=2;
         this.master=null;
         this.scaleX=0;
         this.scaleY=2;
         this.hp=100;
         this.opacity=0.8;
         this.flash=0;
         this.addEventListener('enterframe',function(){
           this.frame++;
           if(this.frame>4){this.frame=0;}
           if(this.opacity<=1)this.opacity+=0.01;
           this.hp-=1*TimeSpeed;
           this.scaleY+=0.05*Math.sin(this.hp)*TimeSpeed;
           if(this.frame>4){this.frame=0;}
           if(this.master==null){
             for(var i in enemies){
               if(enemies[i].type==1){
                 this.master=enemies[i];
               }
             }
           }
           this.x=this.master.x-50*this.scaleX-100;
           this.y=this.master.y+20;
           
           if(this.scaleX<20){
             this.scaleX+=1*TimeSpeed;
           }
           if(this.hp<=0){
             this.scaleY-=0.1*TimeSpeed;
             if(this.flash==1){
               this.flash=2;
               game.rootScene.backgroundColor='black';
             }
             if(this.scaleY<=0){
               this.type=0;
               this.scaleX=0;
               this.x=20000;
               game.rootScene.removeChild(this);
               delete enemies[this.key];
               delete this;
             }
           }
           
           for(var j in player){
             if(this.hp>0 && player[j].y<this.y+130 && player[j].y>this.y-70 && player[j].x >= this.x-50*this.scaleX && player[j].face != 1){
     
               if(this.hp>10){
                 player[j].x+=4;
                 if(player[j].hit_lug<=0){
                   TimeSpeed=1;
                   Lazer=0;
                   HIT=1;
                   HIT2=1;
                   player[j].hp-=1;
                   player[j].face=4;
                   player[j].hit_lug=5;
                   var b=new bomb_b();
                   b.x=player[j].x+20;
                   b.y=player[j].y-40;
                   b.scaleX=1;
                   b.scaleY=1;
                   
                 }
               }
               else{
                 if(this.flash==0){
                   game.rootScene.backgroundColor='white';
                   this.flash=1;
                 }
                 if(player[j].hit_lug<=0){
                   BOMB=1;
                   player[j].hp-=7;
                   player[j].hit_lug=50;
                   player[j].face=4;
                 }
                 if(player[j].x>-100)player[j].x-=20;
               }
             }
           }
         });
         game.rootScene.addChild(this);
      }
　});
   
  game.onload = function(){
  
  

  game.rootScene.backgroundColor='black';

   var bg=new Sprite(1600,180);
   bg.image=game.assets["background.gif"];
   bg.y=BG_y;
   bg.scaleX=1;
   bg.scaleY=1;
   bg.addEventListener('enterframe',function(){
     this.y=BG_y;
     if(Clear==0)this.x-=Speed*TimeSpeed;
     if(this.x<=-640)this.x=0;
   });
   game.rootScene.addChild(bg);
   
   var start=new Sprite(236,48);
   start.image=game.assets["start.png"];
   start.x=240;
   start.y=130;
   start.opacity=1;
   start.addEventListener('enterframe',function(){
     if((game.input.a || isTouch) && this.opacity==1){
       this.opacity=0;
       var time=new Label();
       time.x=400;
       time.font = "32px Palatino";
       time.color = 'white';
       time.addEventListener('enterframe',function(){
         if(TimeLimit>0){
           if(TimeLimit%60>9){this.text="TIME LIMIT  "+(TimeLimit-TimeLimit%60)/60+":"+TimeLimit%60;}
           if(TimeLimit%60<=9){this.text="TIME LIMIT  "+(TimeLimit-TimeLimit%60)/60+":0"+TimeLimit%60;}
         }else{
           this.text="TIME LIMIT  0:00";
           this.color = 'red';
         }
       });
       game.rootScene.addChild(time);
   
       var canon = new houdai();
       canon.x=150;
       canon.y=20;
   
       var canon = new houdai();
       canon.beam_lug=40;
       canon.x=150;
       canon.y=230;

       var ziki = new Player(101,37);
       ziki.x=-100;
       ziki.y=160;
       ziki.face=3;
   
   
   
       var power = new lazer_power();
     
       var HP = new Sprite(200,40);
       HP.image=game.assets["hp_gage.gif"];
       HP.frame=0;
       HP.x=100;
       game.rootScene.addChild(HP);
   
       var weapon = new beam_condition();

       var sestsumei = new manual();
     
       var enemy_mother=new enemy_manager();
     
     
     
       var bomb=[];
       bomb_num=0;
       for(var i=0;i<3;i++){
         var Bomb = Sound.load("bomb.wav");
         Bomb.volume=0.5;
         bomb[i]=Bomb; 
       }
       game.rootScene.addEventListener(Event.ENTER_FRAME, function(){
         if(BOMB==1){
           bomb[bomb_num].stop();
           bomb[bomb_num].play();
           bomb_num++;
           if(bomb_num>2){bomb_num=0;}
           BOMB=0;
         }
       });
     
       var hit=[];
       hit_num=0;
       for(var i=0;i<3;i++){
         var Hit = Sound.load("lazer_hit.wav");
         Hit.volume=0.5;
         hit[i]=Hit; 
       }
       game.rootScene.addEventListener(Event.ENTER_FRAME, function(){
         if(HIT==1){
           hit[hit_num].stop();
           hit[hit_num].play();
           hit_num++;
           if(hit_num>2){hit_num=0;}
           HIT=0;
         }
       });
     
       var hit2=[];
       hit2_num=0;
       for(var i=0;i<3;i++){
         var Hit = Sound.load("lazer_hit2.wav");
         Hit.volume=0.5;
         hit2[i]=Hit; 
       }
       game.rootScene.addEventListener(Event.ENTER_FRAME, function(){
         if(HIT2==1){
           hit2[hit2_num].stop();
           hit2[hit2_num].play();
           hit2_num++;
           if(hit2_num>2){hit2_num=0;}
           HIT2=0;
         }
       });
     
       game.rootScene.removeChild(this);
       delete this;
     }
     
     
     
   });
   game.rootScene.addChild(start);
   
   
   
   
   
   /*
   var 右肩 = new boss_shoulder();
   右肩.frame=1;
   右肩.type=3;
   
   var 右腕 = new boss_arm();
   右腕.frame=4;
   右腕.type=5;
   
   var ボス = new boss();
   ボス.x=700;
   ボス.y=100;
   var 頭=new boss_head();
   var 左肩 = new boss_shoulder();
   
   var 左腕 = new boss_arm();
   
   var 盾 = new boss_shield();
   盾.master=ボス;
   盾.opacity=0;
   
   var ボスHP = new Label("Boss : "+Boss_HP);
   ボスHP.font = "32px Palatino";
   ボスHP.color = 'white';
   ボスHP.x=350;
   ボスHP.addEventListener('enterframe',function(){
     this.text="Boss : "+Boss_HP;
     
   });
   game.rootScene.addChild(ボスHP);
   */
   
                
 
  };

  
  game.start();

};