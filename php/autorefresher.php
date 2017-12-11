<?php
	
?>
<!-- HTML content -->
<div class='wrapper'>
<?xml version="1.0"?>
<svg width="500" height="350" viewBox="0 0 500 350" style="position: absolute">
  <path id="myPath" fill="none" stroke="#000000" stroke-miterlimit="10" d="M91.4,104.2c3.2-3.4,18.4-0.6,23.4-0.6c5.7,0.1,10.8,0.9,16.3,2.3
    c13.5,3.5,26.1,9.6,38.5,16.2c12.3,6.5,21.3,16.8,31.9,25.4c10.8,8.7,21,18.3,31.7,26.9c9.3,7.4,20.9,11.5,31.4,16.7
    c13.7,6.8,26.8,9.7,41.8,9c21.4-1,40.8-3.7,61.3-10.4c10.9-3.5,18.9-11.3,28.5-17.8c5.4-3.7,10.4-6.7,14.8-11.5
    c1.9-2.1,3.7-5.5,6.5-6.5"/>
  <text>
    <textpath xlink:href="#myPath">

      Text laid out along a path.
      </textpath>
      <clipPath id="clip">
	      <circle cx="100" cy="100" r="15" fill="#FFFFFF">
	      	<animate attributeName="startOffset" from="0%" to ="100%" begin="0s" dur="5s" repeatCount="indefinite" keyTimes="0; 1" calcMode="spline" keySplines="0.01 0.2 .22 1"/>
	      </circle>
    	</clipPath>
      <image xlink:href="images/lem_fm_logo_4.png" height="10px" width="10px" clip-path="url(#clip)" />
      	
    	
  </text>
</svg>
	<svg width="100%" height="100%" viewPort="0 0 120 120" style="position: absolute" version="1.1"
	     xmlns="http://www.w3.org/2000/svg">
	  
	  <circle cx="144.6" cy="44.93" r="5.5" fill="#FF452A">
	    <animate 
	    attributeType="XML" 
	    attributeName="cy" 
	    from="0" 
	    to="44.93"
	    dur="3s" 
	    start="2s"
      values="0; 44.93; 15; 44.93; 25; 44.93; 35; 44.93"
	    keyTimes="0; 0.15; 0.3; 0.45; 0.6; 0.75; 0.9; 1"
	    keySplines=".42 0 1 1;
                0 0 .59 1;
                .42 0 1 1;
                0 0 .59 1;
                .42 0 1 1;
                0 0 .59 1;
                .42 0 1 1;
                0 0 .59 1;"
	    fill="freeze"
	    onend="endAnimateKropka()"/>
	  </circle>
	</svg>
	<div id='logoContainer'>
		<img id='lemFmLogo' src="images/lem_fm_logo_4_bez_kropky.png">
	</div>
	<div class='topnav'>
		<div class="channels">
					<a href="#">Музыка</a>
					<a href="#">Гулянка</a>
			</div>
		<div class="upper">
			
		</div>
		<div class="lower"></div>
	</div>

	<div class='container'>
		<div id="scheduler">
			<div class='currentSong'>
				<div class='live'>Тепер граме</div>
				<div class='songTitle'></div>
				<div class='artist'></div>
			</div>
			<div class="playedSongs">
				<div class='heading'>Гралисме</div>
				<div></div>
				<div class='songsContainer'>
				</div>
			</div>
		</div>
		<div class="previewPanel">
			<div class='heading'>Заповіды</div>
			<div class='today'>
				<div class='innerHeading'>Гнеска</div>
				<table class='previewsTable'>
					<tbody>
						<tr>
							<td>asd
							</td>
							<td>ww
							</td>
						</tr>
						<tr>
							<td>asdasd
							</td>
							<td>wasasdw asdf asdf asdf
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class='tomorrow'>
				<div class='innerHeading'>Заран</div>
			</div>
		</div>
	</div>
	
	<div class='navbar'>
		<div class='buttons'>
			<div class="playButtonWrapper">
				<div class="svg-frame">
					<a href="#">
						<embed id="playButtonId" src="images/play_button_80x80.svg" height="100%" width="100%">
						<audio id="player" preload="none" src="http://lemfm.radiokitstream.org/lemfm.mp3"></audio>
					</a>
				</div>
			</div>
			<div id='slider-horizontal'></div>
		</div>
	</div>
</div>

<!-- end HTML content -->
<?php

?>