var colors = {};
var properties = {
	panelName: 'WSHcontrols',	
    enableDiskCache: window.GetProperty("COVER Disk Cache", true),		
    random_function: window.GetProperty("Random function", "default"),	
	remaining_time: window.GetProperty("Show remaining time",false),
    globalFontAdjustement: window.GetProperty("MAINPANEL: Global Font Adjustement", -1),
	maindarklayout: window.GetProperty("_DISPLAY: Main layout:Dark", true),		
	minidarklayout: window.GetProperty("_DISPLAY: Mini layout:Dark", true),		
	showwallpaper: window.GetProperty("_DISPLAY: Show Wallpaper", false),
    wallpapermode: window.GetProperty("_SYSTEM: Wallpaper Mode", 0),
    wallpaperblurred: window.GetProperty("_DISPLAY: Wallpaper Blurred", true),
    wallpaperblurvalue: window.GetProperty("_DISPLAY: Wallpaper Blur Value", 1.05),
    wallpaperdisplay: window.GetProperty("_DISPLAY: Wallpaper 0=Filling 1=Adjust 2=Stretch", 0),	
    screensaver_dark_theme: window.GetProperty("SCREENSAVER dark theme", false),		
    library_dark_theme: window.GetProperty("LIBRARY dark theme", false),	
    playlists_dark_theme: window.GetProperty("PLAYLISTS dark theme", false),
    displayEqualizer: window.GetProperty("_DISPLAY equalizer", false),	
    displayScheduler: window.GetProperty("_DISPLAY scheduler", false),		
    displayRating: window.GetProperty("_DISPLAY rating", true),	
    displayPlayRandom: window.GetProperty("_DISPLAY play random btn", true),		
    displayShuffle: window.GetProperty("_DISPLAY shuffle btn", true),	
    displayRepeat: window.GetProperty("_DISPLAY repeat btn", true),
    displayOpen: window.GetProperty("_DISPLAY open btn", true),		
    minimode_dark_theme: window.GetProperty("MINIMODE dark theme", false),		
    bio_dark_theme: window.GetProperty("BIO dark theme", false),	
    bio_stick_to_dark_theme: window.GetProperty("BIO stick to dark theme", false),		
    visualization_dark_theme: window.GetProperty("VISUALIZATION dark theme", false),
    cursor_style: window.GetProperty("_DISPLAY slider cursor style", 0),	//0 circle, 1 full disk, 2 full disk on hover
	panelFontAdjustement: -1	
}

scheduler = {	
    shutdown_after_current: false,	
    shutdown_after_playlist: false,			
    hibernate_after_current: false,
    hibernate_after_playlist: false	
}
timers = {
    waitForRandomization: false,
    SetRating: false,
    hideVolume: false,
};
oImageCache = function () {
    this.cachelist = Array();
    this.hit = function (metadb) {	
		var img;
		cachekey = process_cachekey(metadb);				
		try{img = this.cachelist[cachekey];}catch(e){}
		if (typeof(img) == "undefined" || img == null && globalProperties.enableDiskCache ) {			
			cache_filename = check_cacheV2(metadb, 0, cachekey);	
			// load img from cache				
			if(cache_filename) {	
				img = load_image_from_cache_directV2(cache_filename);
				cover_path = cache_filename;
			} else get_albumArt_async(metadb,AlbumArtId.front, cachekey); 
		}
		return img;
    };	
    this.reset = function(key) {
        this.cachelist[key] = null;
    };	
	this.resetAll = function(){
		this.cachelist = Array();
	};	
};

if(layout_state.isEqual(0)) properties.showTrackInfo = showtrackinfo_big.isActive();
else properties.showTrackInfo = showtrackinfo_small.isActive();

function clamp(x, l, h) { return (x < l) ? l : ((x > h) ? h : x); }

var drag_timer = false;
var update_wallpaper = false;
var nowplaying_cachekey = '';
var ww = 0, wh = 0;
var m_pos_progress = 0;
var global_top_m=15;
var button_top_m=global_top_m;
var buttons_right_top_m=global_top_m+4;
var button_left_m=28;
var button_right_m=60;
var remaining_playlist_tracks = ""
var button_width = 32;
var button_padding = 14;
var items_removed=items_added=false;
var Randomsetfocus=false;
var timeInfo_length = 0;
var is_over_panel = false;
var g_genre_cache = null;
var scheduler_timer = false;
var g_text_artist=""; 
var g_text_title=""; 
var time_e = fb.TitleFormat("%playback_time%");
var time_t = fb.TitleFormat("$if(%length_seconds%,%length_seconds%,'ON AIR')");
var time_r = fb.TitleFormat("$if(%length%,-%playback_time_remaining%,%playback_time%)");
var tf_elapsed_seconds = fb.TitleFormat("$if2(%playback_time_seconds%,'ON AIR')");
var tf_radio_artist = fb.TitleFormat("$if2(%artist%,%bitrate%'K')");
var tf_title = fb.TitleFormat("%title%");  
var tf_rating = fb.TitleFormat("$if2(%rating%,0)");
var elapsed_seconds = -1;
var TimeElapsed=".";var TimeRemaining=".";var TimeTotal=".";var text_length="";
var TimeTotalSeconds = 0;
var repaint_volume,repaint_progress = false;
var TimerSetRating = false;
var Randomize=true;
var hideProgressWhenVolumeChange = false;
var nb_of_buttons_right = 5;
var g_dragndrop_x = 0;
var g_dragndrop_y = 0;
var g_dragndrop_timer = false;
var g_dragndrop_targetPlaylistId = -1;
// --- Volume and progress bars
progress_vars = {
	ellipse_border_size:1,
	ellipse_diameter_hover:15,
	ellipse_diameter:10,
	ellipse_line_width: 1.55,
	height_start:2,
	height_hover:2,
	height:2,
	hover_slider: false,
	drag: false,	
}
progress_vars.ellipse_diameter_start = progress_vars.ellipse_diameter;
progress_vars.ellipse_margin_top=-Math.ceil(progress_vars.ellipse_diameter/2);
//if(properties.cursor_style==0) progress_vars.ellipse_diameter_start = progress_vars.ellipse_diameter = progress_vars.ellipse_diameter-1;
mini_btns = {
	button_width:20,
	button_left_m:20,
	button_top_m:8
}

volume_vars = {
	ellipse_border_size:1,
	ellipse_diameter_hover:15,
	ellipse_line_width: 1.55,	
	height_start:2,
	height_hover:2,
	height:2, 
	margin_top:global_top_m+20,
	margin_right:40,
	margin_left:0,
	width:154,
	width_min:0,
	hover_slider: false,
	drag: false,	
	gradvolume: 0,
	volumesize:	0,
}
volume_vars.ellipse_diameter_start = volume_vars.ellipse_diameter = progress_vars.ellipse_diameter;
volume_vars.ellipse_margin_top=-Math.ceil(volume_vars.ellipse_diameter/2);

var VolumeSliderActive=false;

var hoovervolume=false;
var g_pos_progress = 0;
var g_length_progress = fb.PlaybackLength;
var hooverprogress=false;

var time_font = null;

var cur_btn, down_btn = null;
var btn_down = false;
var wait_for_randomization = false;
var old_playback_order = 0;
var current_played_track = null;
var showTitleTooltip = false
function calculate_volume_ellipse_vars(hover_state){ 
	if(hover_state && properties.cursor_style!=2) volume_vars.ellipse_diameter=volume_vars.ellipse_diameter_hover;
	else volume_vars.ellipse_diameter=volume_vars.ellipse_diameter_start;
	volume_vars.ellipse_margin_top=-Math.ceil(volume_vars.ellipse_diameter/2);	
}
function calculate_progress_ellipse_vars(hover_state){
	if(hover_state && properties.cursor_style!=2) progress_vars.ellipse_diameter=progress_vars.ellipse_diameter_hover;
	else progress_vars.ellipse_diameter=progress_vars.ellipse_diameter_start;
	progress_vars.ellipse_margin_top=-Math.ceil(progress_vars.ellipse_diameter/2);	
}
function build_images(){
	if(properties.darklayout) var theme_path = "controls_Dark"; else var theme_path = "controls_Light";	
	play_img_hover = gdi.Image(theme_img_path + "\\" + theme_path + "\\play_hover.png");
	play_img = gdi.Image(theme_img_path + "\\" + theme_path + "\\play.png");
	pause_img_hover = gdi.Image(theme_img_path + "\\" + theme_path + "\\pause_hover.png");
	pause_img = gdi.Image(theme_img_path + "\\" + theme_path + "\\pause.png");
	prev_img_hover = gdi.Image(theme_img_path + "\\" + theme_path + "\\prev_hover.png");
	prev_img = gdi.Image(theme_img_path + "\\" + theme_path + "\\prev.png");
	next_img_hover = gdi.Image(theme_img_path + "\\" + theme_path + "\\next_hover.png");
	next_img = gdi.Image(theme_img_path + "\\" + theme_path + "\\next.png");
	
	mini_play_img_hover = gdi.Image(theme_img_path + "\\" + theme_path + "\\play_mini_hover.png");
	mini_play_img = gdi.Image(theme_img_path + "\\" + theme_path + "\\play_mini.png");
	mini_pause_img_hover = gdi.Image(theme_img_path + "\\" + theme_path + "\\pause_mini_hover.png");
	mini_pause_img = gdi.Image(theme_img_path + "\\" + theme_path + "\\pause_mini.png");

	mini_prev_img_hover = gdi.Image(theme_img_path + "\\" + theme_path + "\\mini_prev_hover.png");
	mini_prev_img = gdi.Image(theme_img_path + "\\" + theme_path + "\\mini_prev.png");
	mini_next_img_hover = gdi.Image(theme_img_path + "\\" + theme_path + "\\mini_next_hover.png");
	mini_next_img = gdi.Image(theme_img_path + "\\" + theme_path + "\\mini_next.png");	
	mini_volume_img_hover = gdi.Image(theme_img_path + "\\" + theme_path + "\\mini_volume_hover.png");
	mini_volume_img = gdi.Image(theme_img_path + "\\" + theme_path + "\\mini_volume.png");	
	
	repeat_img_hover = gdi.Image(theme_img_path + "\\" + theme_path + "\\repeat_hover.png");
	repeat_img = gdi.Image(theme_img_path + "\\" + theme_path + "\\repeat.png");
	repeat_img_active = gdi.Image(theme_img_path + "\\" + theme_path + "\\repeat_active.png");
	repeat_all_hover = gdi.Image(theme_img_path + "\\" + theme_path + "\\repeat_all_hover.png");
	repeat_all = gdi.Image(theme_img_path + "\\" + theme_path + "\\repeat_all.png");
	repeat_track_hover = gdi.Image(theme_img_path + "\\" + theme_path + "\\repeat_track_hover.png");
	repeat_track = gdi.Image(theme_img_path + "\\" + theme_path + "\\repeat_track.png");
	menu_img_hover = gdi.Image(theme_img_path + "\\" + theme_path + "\\settings_hover.png");
	menu_img = gdi.Image(theme_img_path + "\\" + theme_path + "\\settings.png");
	equalizer_img_hover = gdi.Image(theme_img_path + "\\" + theme_path + "\\equalizer_hover.png");
	equalizer_img = gdi.Image(theme_img_path + "\\" + theme_path + "\\equalizer.png");	
	shuffle_img_hover = gdi.Image(theme_img_path + "\\" + theme_path + "\\shuffle_hover.png");
	shuffle_img_active = gdi.Image(theme_img_path + "\\" + theme_path + "\\shuffle_active.png");
	shuffle_img = gdi.Image(theme_img_path + "\\" + theme_path + "\\shuffle.png");
	shuffle_off = gdi.Image(theme_img_path + "\\" + theme_path + "\\shuffle_off.png");
	shuffle_off_hover = gdi.Image(theme_img_path + "\\" + theme_path + "\\shuffle_off_hover.png");
	volume1_img = gdi.Image(theme_img_path + "\\" + theme_path + "\\volume1.png");
	volume1_img_hover = gdi.Image(theme_img_path + "\\" + theme_path + "\\volume1_hover.png");
	volume2_img = gdi.Image(theme_img_path + "\\" + theme_path + "\\volume2.png");
	volume2_img_hover = gdi.Image(theme_img_path + "\\" + theme_path + "\\volume2_hover.png");
	volume3_img = gdi.Image(theme_img_path + "\\" + theme_path + "\\volume3.png");
	volume3_img_hover = gdi.Image(theme_img_path + "\\" + theme_path + "\\volume3_hover.png");
	volume4_img = gdi.Image(theme_img_path + "\\" + theme_path + "\\volume4.png");
	volume4_img_hover = gdi.Image(theme_img_path + "\\" + theme_path + "\\volume4_hover.png");
	mute_img_hover = gdi.Image(theme_img_path + "\\" + theme_path + "\\mute_hover.png");
	mute_img = gdi.Image(theme_img_path + "\\" + theme_path + "\\mute.png");
	random_img_hover = gdi.Image(theme_img_path + "\\" + theme_path + "\\random_hover.png");
	random_img = gdi.Image(theme_img_path + "\\" + theme_path + "\\random.png");	
	shutdown_img_hover = gdi.Image(theme_img_path + "\\" + theme_path + "\\shutdown_hover.png");
	shutdown_img = gdi.Image(theme_img_path + "\\" + theme_path + "\\shutdown.png");		
	hibernate_img_hover = gdi.Image(theme_img_path + "\\" + theme_path + "\\scheduler_hibernate_hover.png");
	hibernate_img = gdi.Image(theme_img_path + "\\" + theme_path + "\\scheduler_hibernate.png");	
	scheduler_stop_img_hover = gdi.Image(theme_img_path + "\\" + theme_path + "\\scheduler_stop_hover.png");
	scheduler_stop_img = gdi.Image(theme_img_path + "\\" + theme_path + "\\scheduler_stop.png");		
	scheduler_donothing_img_hover = gdi.Image(theme_img_path + "\\" + theme_path + "\\scheduler_donothing_hover.png");
	scheduler_donothing_img = gdi.Image(theme_img_path + "\\" + theme_path + "\\scheduler_donothing.png");	
	open_img_hover = gdi.Image(theme_img_path + "\\" + theme_path + "\\open_hover.png");
	open_img = gdi.Image(theme_img_path + "\\" + theme_path + "\\open.png");	

	more_img_hover = gdi.Image(theme_img_path + "\\" + theme_path + "\\more_hover.png");
	more_img = gdi.Image(theme_img_path + "\\" + theme_path + "\\more.png");	
	
	rating0_img_hover = gdi.Image(theme_img_path + "\\" + theme_path + "\\rating_0_hover.png");
	rating0_img = gdi.Image(theme_img_path + "\\" + theme_path + "\\rating_0.png");	
	rating1_img_hover = gdi.Image(theme_img_path + "\\" + theme_path + "\\rating_1_hover.png");
	rating1_img = gdi.Image(theme_img_path + "\\" + theme_path + "\\rating_1.png");	
	rating2_img_hover = gdi.Image(theme_img_path + "\\" + theme_path + "\\rating_2_hover.png");
	rating2_img = gdi.Image(theme_img_path + "\\" + theme_path + "\\rating_2.png");	
	rating3_img_hover = gdi.Image(theme_img_path + "\\" + theme_path + "\\rating_3_hover.png");
	rating3_img = gdi.Image(theme_img_path + "\\" + theme_path + "\\rating_3.png");
	rating4_img_hover = gdi.Image(theme_img_path + "\\" + theme_path + "\\rating_4_hover.png");
	rating4_img = gdi.Image(theme_img_path + "\\" + theme_path + "\\rating_4.png");
	rating5_img_hover = gdi.Image(theme_img_path + "\\" + theme_path + "\\rating_5_hover.png");
	rating5_img = gdi.Image(theme_img_path + "\\" + theme_path + "\\rating_5.png");
	
	slider_cursor = gdi.CreateImage(volume_vars.ellipse_diameter_start+3, volume_vars.ellipse_diameter_start+3);
	gb = slider_cursor.GetGraphics();
		gb.SetSmoothingMode(2);
		if(properties.cursor_style==1 || properties.cursor_style==2) { 
			gb.FillEllipse(1,1,volume_vars.ellipse_diameter_start+1,volume_vars.ellipse_diameter_start+1,volumeOncolor);			
		} else if(properties.cursor_style==0) { 
			gb.DrawEllipse(1,1,volume_vars.ellipse_diameter_start,volume_vars.ellipse_diameter_start,volume_vars.ellipse_line_width, volumeOncolor);				
			gb.FillEllipse(1,1,volume_vars.ellipse_diameter_start-volume_vars.ellipse_border_size*2,volume_vars.ellipse_diameter_start-volume_vars.ellipse_border_size*2,colors.ellipse_inner);			
		}
		gb.SetSmoothingMode(0);		
	slider_cursor.ReleaseGraphics(gb);

	if(properties.cursor_style==0 || properties.cursor_style==1) var diameter_hover = volume_vars.ellipse_diameter_hover;
	else if(properties.cursor_style==2) var diameter_hover = volume_vars.ellipse_diameter;	
	slider_cursor_hover = gdi.CreateImage(diameter_hover+3, diameter_hover+3);
	gb = slider_cursor_hover.GetGraphics();
		gb.SetSmoothingMode(2);
		if(properties.cursor_style==1 || properties.cursor_style==2) { 
			gb.FillEllipse(1,1,diameter_hover+1,diameter_hover+1,volumeOncolor);			
		} else if(properties.cursor_style==0) { 
			gb.DrawEllipse(1,1,diameter_hover,diameter_hover,volume_vars.ellipse_line_width, volumeOncolor);				
			gb.FillEllipse(1,1,diameter_hover-volume_vars.ellipse_border_size*2,diameter_hover-volume_vars.ellipse_border_size*2,colors.ellipse_inner);			
		}
		gb.SetSmoothingMode(0);		
	slider_cursor_hover.ReleaseGraphics(gb);

	
	build_buttons();
	setSchedulerText();
}
var colors = {};
function get_colors(){
	if(layout_state.isEqual(0)) properties.darklayout = properties.maindarklayout;
	else properties.darklayout = properties.minidarklayout;
	get_colors_global();	
	if(properties.darklayout) {		
		colors.wallpaper_overlay = GetGrey(0,200);
		colors.wallpaper_overlay_blurred = GetGrey(0,130);			
		colors.slidersOn=GetGrey(255);  
		colors.slidersOff=GetGrey(255,40);  		
		colors.ellipse_inner=GetGrey(0,20);
		colors.line_top_light = GetGrey(255,20);
		colors.line_top_dark = GetGrey(200);
		colors.line_bottom = GetGrey(40,200);		
		colors.dotted_progress = GetGrey(255,220);
		colors.normal_txt = GetGrey(255);		
	} else {			
		colors.wallpaper_overlay = GetGrey(255,235);
		colors.wallpaper_overlay_blurred = GetGrey(255,235);					
		colors.slidersOn=GetGrey(30);
		colors.slidersOff=GetGrey(30,32); 		
		colors.ellipse_inner=GetGrey(255);
		colors.line_top_light = GetGrey(255,20)		
		colors.line_top_dark = GetGrey(200);
		colors.line_bottom = GetGrey(40,200);		
		colors.dotted_progress = GetGrey(0);
	}
	
	volumeOncolor=colors.slidersOn;
	progressOncolor=colors.slidersOn;
	volumeOffcolor=colors.slidersOff;
	progressOffcolor=colors.slidersOff;
	
	build_images();
	adapt_display_to_layout();
} 
function adapt_display_to_layout(){
	if(layout_state.isEqual(1)){
		hideProgressWhenVolumeChange = true;
		for (var i in buttons_right) {
			buttons_right[i].changeState(ButtonStates.hide)
		}	
		buttons.Prev.changeState(ButtonStates.hide)
		buttons.Next.changeState(ButtonStates.hide)		
		if(properties.showTrackInfo) {
			global_top_m=2;
			buttons.Pause.y = global_top_m+2;				
			title_margin_top = -20;
			artist_margin_top = title_margin_top;
			time_margin_top = title_margin_top;				
			progress_margin_top = global_top_m+32;
			progress_margin_left = 22;
			progress_margin_right = button_right_m;
			volume_vars.margin_top = global_top_m+22;
			volume_vars.margin_right = progress_margin_right+10;
			volume_vars.margin_left = progress_margin_left+volume3_img.Width;
			volume_vars.width = window.Width-volume_vars.margin_right-volume_vars.margin_left;		
			buttons_mini.Prev.y = mini_btns.button_top_m;		
			buttons_mini.Next.y = mini_btns.button_top_m;				
		} else { 	
			global_top_m=0;		
			buttons.Pause.y = global_top_m;				
			time_margin_top = 2;				
			progress_margin_top = global_top_m+20;
			progress_margin_left = 60;
			progress_margin_right = button_right_m + 38;
			volume_vars.margin_top = global_top_m+20;
			volume_vars.margin_right = button_right_m + 10;
			volume_vars.margin_left = 36+volume3_img.Width;
			volume_vars.width = window.Width-volume_vars.margin_right-volume_vars.margin_left;	
			buttons_mini.Prev.y = global_top_m+11;		
			buttons_mini.Next.y = global_top_m+11;		
			buttons_mini.Prev.x = 27;		
			buttons_mini.Next.x = -77;			
		}
		buttons.Pause.x = -button_right_m+7;
		font_adjusted = g_font.normal;
		font_adjusted_italic = g_font.normal;				
		time_font = g_font.normal;		
	} else {
		hideProgressWhenVolumeChange = false;	
		if(mini_controlbar.isActive()) {
			font_adjusted = g_font.plus1;
			font_adjusted_italic = g_font.italicplus1;				
			time_font = g_font.plus1;
		} else {
			font_adjusted = g_font.plus1;
			font_adjusted_italic = g_font.italicplus1;	
			time_font = g_font.plus2;		
		}			

		for (var i in buttons_mini) {
			buttons_mini[i].changeState(ButtonStates.hide)
		}	
				
		if(properties.showTrackInfo) {
			if(mini_controlbar.isActive()) {
				title_margin_top = -19;
				global_top_m=5;				
				progress_margin_top = global_top_m+31;				

			} else {
				title_margin_top = -24;
				global_top_m=14;				
				progress_margin_top = global_top_m+32;				
			}	
			time_margin_top = title_margin_top;
			artist_margin_top = title_margin_top;
			button_top_m=global_top_m;
			buttons_right_top_m=global_top_m+4;				
			for (var i in buttons) {
				buttons[i].y = button_top_m;
			}	
			for (var i in buttons_right) {
				buttons_right[i].y = buttons_right_top_m;
			}					

			progress_margin_left = button_left_m + 180;
			progress_margin_right = button_right_m + nb_of_buttons_right*(button_width+button_padding)-5;	
			
			volume_vars.margin_top = global_top_m+20;
			volume_vars.margin_right = 40;
			volume_vars.width = -1*buttons_right.Volume.x-button_width*3+5;				
			volume_vars.margin_left = window.Width-volume_vars.width-volume_vars.margin_right;			
		} else { 
			if(mini_controlbar.isActive()) {
				title_margin_top = -19;		
				global_top_m=2;
				progress_margin_top = global_top_m+20;
				time_margin_top = 1;				
			} else {
				title_margin_top = -24;
				global_top_m=15;
				progress_margin_top = global_top_m+20;
				time_margin_top = 0;					
			}	
			artist_margin_top = title_margin_top;
			button_top_m=global_top_m;
			buttons_right_top_m=global_top_m+4;	
			for (var i in buttons) {
				buttons[i].y = button_top_m;
			}	
			for (var i in buttons_right) {
				buttons_right[i].y = buttons_right_top_m;
			}				
			
			progress_margin_left = button_left_m + 201;
			progress_margin_right =  button_right_m + nb_of_buttons_right*(button_width+button_padding)+20;	

			volume_vars.margin_top = global_top_m+20;
			volume_vars.margin_right = 40;
			volume_vars.width = -1*buttons_right.Volume.x-button_width*3+5;					
			volume_vars.margin_left = window.Width-volume_vars.width-volume_vars.margin_right;			
		}			
	}	
} 
function build_buttons(){
	if(mini_controlbar.isActive() && !properties.showTrackInfo) {
		button_right_m=55;	
		button_left_m=22;
		button_sep_value=49;
	} else if(mini_controlbar.isActive()) {	
		button_right_m=55;	
		button_left_m=28;
		button_sep_value=53;		
	} else {
		button_right_m=60;	
		button_left_m=28;
		button_sep_value=53;		
	}		
	nb_of_buttons_right = 1;
	properties.displayMore = (!properties.displayScheduler || !properties.displayEqualizer || !properties.displayRating || !properties.displayPlayRandom || !properties.displayShuffle || !properties.displayRepeat || !properties.displayOpen);
	
	nb_of_buttons_right+= (properties.displayMore)?1:0;	
	nb_of_buttons_right+= (properties.displayScheduler)?1:0;
	nb_of_buttons_right+= (properties.displayEqualizer)?1:0;
	nb_of_buttons_right+= (properties.displayRating)?1:0;	
	nb_of_buttons_right+= (properties.displayPlayRandom)?1:0;		
	nb_of_buttons_right+= (properties.displayShuffle)?1:0;		
	nb_of_buttons_right+= (properties.displayRepeat)?1:0;	
	nb_of_buttons_right+= (properties.displayOpen)?1:0;	
	
	buttons = {
		Prev: new SimpleButton(button_left_m, button_top_m, 41, 41, "Prev",false, function () {
			fb.Prev();
		},false,prev_img,prev_img_hover),
		Pause: new SimpleButton(button_sep_value+button_left_m, button_top_m, 41, 41, "Play",false, function () {
			if(!fb.IsPlaying) fb.Play();
			else fb.Pause();
		},false,play_img,play_img_hover),
		Next: new SimpleButton(button_sep_value*2+button_left_m, button_top_m, 41, 41, "Next",false, function () {
			fb.Next();
		},false,next_img,next_img_hover)  	
	} 
	buttons_mini = {
		/*Volume: new SimpleButton(mini_btns.button_left_m, mini_btns.button_top_m, 15, 15, "Next",false, function () {
			showVolumeSlider();
		},false,mini_volume_img,mini_volume_img_hover),	*/	
		Prev: new SimpleButton(-75-mini_btns.button_width-2, mini_btns.button_top_m, 21, 21, "Prev",false, function () {
			fb.Prev();
		},false,mini_prev_img,mini_prev_img_hover),
		/*Pause: new SimpleButton(mini_btns.button_width*2+mini_btns.button_left_m, mini_btns.button_top_m, 15, 15, "Playmini",false, function () {
			if(!fb.IsPlaying) fb.Play();
			else fb.Pause();
		},false,mini_play_img,mini_play_img_hover),*/
		Next: new SimpleButton(-75, mini_btns.button_top_m, 21, 21, "Next",false, function () {
			fb.Next();
		},false,mini_next_img,mini_next_img_hover)
		
	} 	
	if(properties.displayScheduler) schedulerPosition = 5 + (properties.displayEqualizer ? 1 : 0) + (properties.displayRating ? 1 : 0);
	else schedulerPosition = 2;
	displayed_button = 0;
	buttons_right = {	
		More: new SimpleButton(-button_right_m-(button_width+button_padding)*(displayed_button++), buttons_right_top_m, button_width, 32, "More", function () {
				moreMenu(window.Width, 15);  
		},false,false,more_img,more_img_hover),	
		Scheduler: new SimpleButton(-button_right_m-(button_width+button_padding)*(displayed_button++), buttons_right_top_m, button_width, 32, "Scheduler", function () {
				schedulerMenu(window.Width-button_right_m-(button_width+button_padding)*(nb_of_buttons_right-schedulerPosition)-152, 15);  
		},false,false,shutdown_img,shutdown_img_hover), 	
		Rating: new SimpleButton(-button_right_m-(button_width+button_padding)*(displayed_button++), buttons_right_top_m, button_width, 32, "",false, function () {
			if(fb.IsPlaying) {
				//draw_rating_menu(window.Width-button_right_m-(button_width+button_padding)*2+9, 15);  
				g_rating = Number(g_rating);
				old_g_rating = g_rating;
				if(g_rating<5) {
					g_rating = g_rating+1;
				} else {
					g_rating = 0;
				}
				setRatingBtn(current_played_track, g_rating);
				clearTimeout(timers.SetRating);
				timers.SetRating = setTimeout(function() {
					g_rating = rateSong(g_rating, old_g_rating, current_played_track);
					clearTimeout(timers.SetRating);
					timers.SetRating = false;
				}, 300);
			}
		},function () {
			if(fb.IsPlaying) {
				g_rating = Number(g_rating);
				old_g_rating = g_rating;
				if(g_rating<5) {
					g_rating = g_rating+1;
				} else {
					g_rating = 0;
				}
				setRatingBtn(current_played_track, g_rating);
				clearTimeout(timers.SetRating);
				timers.SetRating = setTimeout(function() {
					g_rating = rateSong(g_rating, old_g_rating, current_played_track);
					clearTimeout(timers.SetRating);
					timers.SetRating = false;
				}, 300);					
			}
		},rating0_img,rating0_img_hover),	
		Equalizer: new SimpleButton(-button_right_m-(button_width+button_padding)*(displayed_button++), buttons_right_top_m, button_width, 32, "",false, function () {
			fb.RunMainMenuCommand("View/DSP/Equalizer");
		},false,equalizer_img,equalizer_img_hover),		
		Open: new SimpleButton(-button_right_m-(button_width+button_padding)*(displayed_button++), buttons_right_top_m, button_width, 32, "Open",false, function () {
			fb.AddFiles()
		},false,open_img,open_img_hover),				
		playRandom: new SimpleButton(-button_right_m-(button_width+button_padding)*(displayed_button++), buttons_right_top_m, button_width, 32, "playRandom", function () {
				randomPlayMenu(window.Width-button_right_m-(button_width+button_padding)*1-130, 15);  
		},false,false,random_img,random_img_hover),    		
		Shuffle: new SimpleButton(-button_right_m-(button_width+button_padding)*(displayed_button++), buttons_right_top_m, button_width, 32, "Shuffle",false, function () {
			old_playback_order = plman.PlaybackOrder;		
			if(plman.PlaybackOrder!=4 && plman.PlaybackOrder!=3 && plman.PlaybackOrder!=5 && plman.PlaybackOrder!=6) plman.PlaybackOrder=4;
			else plman.PlaybackOrder=0;
			this.changeState(ButtonStates.hoverinactive);
		}, function () {
			plman.PlaybackOrder = old_playback_order;			
			wait_for_randomization=true;
			if(!timers.waitForRandomization) {
				timers.waitForRandomization = setTimeout(function() {
					wait_for_randomization=false;	
					clearTimeout(timers.waitForRandomization);		
					timers.waitForRandomization = false;
				}, 150);	
			}			
			if(Randomize) plman.SortByFormat(plman.PlayingPlaylist,""); 
			else plman.SortByFormat(plman.PlayingPlaylist,sort_by_album_artist);
			Randomize=!Randomize		
		},shuffle_img_active,shuffle_img_hover),
		Repeat: new SimpleButton(-button_right_m-(button_width+button_padding)*(displayed_button++), buttons_right_top_m, button_width, 32, "Repeat",false, function () {
			if(plman.PlaybackOrder==1) {
				plman.PlaybackOrder=2;				
			} else if(plman.PlaybackOrder==2) {
				plman.PlaybackOrder=0;					
			} else {
				plman.PlaybackOrder=1;					
			}			
			this.changeState(ButtonStates.hoverinactive);		
		},false,repeat_img,repeat_img_hover),   		
		Volume: new SimpleButton(-button_right_m-(button_width+button_padding)*(displayed_button++), buttons_right_top_m, button_width, 32, "Volume",false, function () {
			fb.VolumeMute();
		},false,volume1_img,volume1_img_hover),
	}	
	if(!properties.displayRating){ 
		buttons_right.Rating.changeState(ButtonStates.hide);
	}
	if(!properties.displayEqualizer){ 	
		buttons_right.Equalizer.changeState(ButtonStates.hide);		
	}
	if(!properties.displayScheduler){ 	
		buttons_right.Scheduler.changeState(ButtonStates.hide);		
	}	
	if(!properties.displayPlayRandom){ 
		buttons_right.playRandom.changeState(ButtonStates.hide);
	}	
	if(!properties.displayShuffle){ 
		buttons_right.Shuffle.changeState(ButtonStates.hide);
	}		
	if(!properties.displayRepeat){ 
		buttons_right.Repeat.changeState(ButtonStates.hide);
	}	
	if(!properties.displayOpen){ 
		buttons_right.Open.changeState(ButtonStates.hide);
	}	
	if(!properties.displayMore){ 
		buttons_right.More.changeState(ButtonStates.hide);
	}	
	displayed_button = 0;
	for (var i in buttons_right) {
		if(buttons_right[i].state != ButtonStates.hide) buttons_right[i].x = -button_right_m-(button_width+button_padding)*(displayed_button++);
	}	
	setSchedulerText();
	if(typeof g_rating !== 'undefined') setRatingBtn();	
}

function get_text(metadb) { 
	metadb = typeof metadb !== 'undefined' ? metadb : fb.GetNowPlaying();
    g_text_artist = ""; 
    g_text_title = ""; 
    g_text_tracknumber = "";
    if (metadb) { 		
		current_played_track = metadb;
        g_text_artist = tf_radio_artist.EvalWithMetadb(metadb);
        g_text_title = tf_title.EvalWithMetadb(metadb);     
    } else {
		current_played_track = null;
        g_text_artist="Nothing Played";	
        g_text_title="No Sound";   
    } 
	setRatingBtn(metadb);
	g_panel.set_title_text(g_text_title);
	g_panel.set_artist_text(g_text_artist);		
} 
function setRatingBtn(metadb,new_rating){
	metadb = typeof metadb !== 'undefined' ? metadb : fb.GetNowPlaying();
	if (metadb) {
		if(typeof new_rating == 'undefined') g_rating = tf_rating.EvalWithMetadb(metadb);
		else g_rating = new_rating;
		buttons_right.Rating.N_img = eval("rating"+g_rating+"_img");
		buttons_right.Rating.H_img = eval("rating"+g_rating+"_img_hover");
		buttons_right.Rating.D_img = buttons_right.Rating.H_img;		
	} else {
		g_rating = 0;	
	}
}
function showVolumeSlider(new_state){
	var toggle = typeof new_state !== 'undefined' ? false : true;
	if(toggle){
		for (var i in buttons_right) {
			if(buttons_right[i].text!="Volume") buttons_right[i].Togglehide();		
		}
		for (var i in buttons_mini) {
			if(buttons_mini[i].text!="Volume") buttons_mini[i].Togglehide();		
		}		
		VolumeSliderActive=!VolumeSliderActive;		
	} else {
		for (var i in buttons_right) {
			if(buttons_right[i].text!="Volume") buttons_right[i].hide = new_state;		
		}
		for (var i in buttons_mini) {
			if(buttons_mini[i].text!="Volume") buttons_mini[i].hide = new_state;		
		}		
		VolumeSliderActive=new_state;
	}
}

function showVolumeSliderTemp(){
	showVolumeSlider(true);		
	clearTimeout(timers.hideVolume);
	timers.hideVolume = setTimeout(function(){
		showVolumeSlider(false);
		clearTimeout(timers.hideVolume);
		timers.hideVolume=false;	
		window.Repaint();
	}, 1000);    	
}

function on_size(){  
    ww = Math.max(window.Width,globalProperties.miniMode_minwidth-50);
    wh = window.Height;
	
    // set wallpaper
    if(fb.IsPlaying && properties.showwallpaper) {
        //g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
    }
	
	//Volume
	if(layout_state.isEqual(0)) volume_vars.margin_left = window.Width-volume_vars.width-volume_vars.margin_right;
	else volume_vars.width = window.Width-volume_vars.margin_right-volume_vars.margin_left
	calculateVolumeSize();
	
	//Progress   
    ww_progress = window.Width-progress_margin_left-progress_margin_right;

	if (fb.IsPlaying) {on_playback_time(fb.PlaybackTime);} 

}  

function on_paint(gr) {	
	gr.SetTextRenderingHint(globalProperties.TextRendering);

    //BG
	if(!properties.showwallpaper){
		gr.FillSolidRect(0, 0, ww, wh, colors.normal_bg);	
	}
    // BG wallpaper	
    if(properties.showwallpaper && (typeof(g_wallpaperImg) == "undefined" || !g_wallpaperImg || update_wallpaper)) {
        g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
    };		
	if(properties.showwallpaper && g_wallpaperImg) {
		gr.DrawImage(g_wallpaperImg, 0, 0, ww, wh, 0, 0, g_wallpaperImg.Width, g_wallpaperImg.Height);
		gr.FillSolidRect(0, 0, ww, wh, (properties.wallpaperblurred)?colors.wallpaper_overlay_blurred:colors.wallpaper_overlay);
	}
	
	switch(true){
		case (layout_state.isEqual(0) && screensaver_state.isActive() && properties.screensaver_dark_theme && properties.darklayout):		
		case (layout_state.isEqual(1) && properties.minimode_dark_theme && properties.darklayout):		
		case (main_panel_state.isEqual(0) && properties.library_dark_theme && layout_state.isEqual(0) && properties.darklayout):
		case (main_panel_state.isEqual(1) && properties.playlists_dark_theme && layout_state.isEqual(0) && properties.darklayout):
		case (main_panel_state.isEqual(2) && (properties.bio_dark_theme || properties.bio_stick_to_dark_theme) && layout_state.isEqual(0) && properties.darklayout):	
		case (main_panel_state.isEqual(3) && layout_state.isEqual(0) && properties.darklayout):
			gr.FillSolidRect(0, 0, ww, 1,colors.line_top_light);					
		break;
		case (properties.darklayout):
		break;		
		case (layout_state.isEqual(1) && !properties.minimode_dark_theme && !properties.darklayout):		
		case (main_panel_state.isEqual(0) && !properties.library_dark_theme && layout_state.isEqual(0)):
		case (main_panel_state.isEqual(1) && !properties.playlists_dark_theme && layout_state.isEqual(0)):
		case (main_panel_state.isEqual(2) && !(properties.bio_dark_theme || properties.bio_stick_to_dark_theme) && layout_state.isEqual(0)):	
			gr.FillSolidRect(0, 0, ww, 1, colors.line_top_dark);						
		break;		
	}	
	gr.FillGradRect(ww, 0, 1, wh, 90,colors.line_bottom,colors.line_bottom);		
	gr.FillGradRect(0, wh-1, ww, 1, 0,colors.line_bottom,colors.line_bottom);	
	
	//Progress	
	if(ww_progress > 0 && !(hideProgressWhenVolumeChange && VolumeSliderActive)) {
		if(properties.cursor_style==2 && !(progress_vars.hover_slider || progress_vars.drag)) var ellipse_radius = 0;
		else var ellipse_radius = Math.ceil(progress_vars.ellipse_diameter/2);
		
		if(properties.cursor_style==2) {
			gr.FillSolidRect(progress_margin_left, progress_margin_top-Math.round(progress_vars.height/2)+1, ww_progress, progress_vars.height,progressOffcolor); 
		} else {
			var dot_x = progress_margin_left + ww_progress;
			while (dot_x >= progress_margin_left + g_pos_progress + (fb.IsPlaying?ellipse_radius:0)) {
				gr.FillSolidRect(dot_x, progress_margin_top+1, 1, 1, colors.dotted_progress);
				dot_x = dot_x-3;
			}
		}	

		if (fb.IsPlaying && g_length_progress > 0) {    
			gr.FillSolidRect(progress_margin_left, progress_margin_top-Math.round(progress_vars.height/2)+1, g_pos_progress-ellipse_radius, progress_vars.height,progressOncolor); 
			if(!(properties.cursor_style==2 && !(progress_vars.hover_slider || progress_vars.drag))){
				var slider2draw = (progress_vars.hover_slider || progress_vars.drag)?slider_cursor_hover:slider_cursor;
				gr.DrawImage(slider2draw,progress_margin_left+g_pos_progress-Math.round(slider2draw.Width/2)-1,progress_margin_top-Math.round(slider2draw.Height/2)+1,slider2draw.Width,slider2draw.Height,0,0,slider2draw.Width,slider2draw.Height,0,255);		
			}
		}	
    }
	
	//Track Info
	if(!(hideProgressWhenVolumeChange && VolumeSliderActive)) {
		if(properties.showTrackInfo){ 
			timeInfo_length = g_panel.get_time_length(gr);
			gr.GdiDrawText(scheduler_string+g_text_title, font_adjusted , colors.normal_txt, progress_margin_left, progress_margin_top + title_margin_top, ww_progress - timeInfo_length, 10,  DT_LEFT | DT_BOTTOM | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
			var title_length = g_panel.get_title_length(gr);
			gr.GdiDrawText(" -  "+g_text_artist, font_adjusted_italic , colors.normal_txt, progress_margin_left+title_length +((layout_state.isEqual(0))?4:2), progress_margin_top + artist_margin_top, ww_progress - title_length - timeInfo_length, 10, DT_LEFT | DT_BOTTOM | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
			var artist_length = g_panel.get_artist_length(gr);
			showTitleTooltip = (title_length+artist_length > ww_progress - timeInfo_length);
			
			g_panel.set_fullTitle_length(gr);
			
			if(!is_over_panel || layout_state.isEqual(0)) gr.GdiDrawText(text_length+" ", font_adjusted_italic , colors.normal_txt, progress_margin_left, progress_margin_top + time_margin_top, ww_progress+3, 10, DT_RIGHT | DT_BOTTOM | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX); 		
			
		} else if(!is_over_panel || layout_state.isEqual(0)) {
			if(properties.remaining_time)  {
				gr.GdiDrawText(TimeElapsed, time_font, colors.normal_txt, progress_margin_left-55, progress_margin_top-8+time_margin_top, 40, 40,DT_RIGHT);
			} else {
				gr.GdiDrawText(TimeRemaining, time_font, colors.normal_txt, progress_margin_left-55, progress_margin_top-8+time_margin_top, 40, 40,DT_RIGHT);
			}	
			gr.GdiDrawText(TimeTotal, time_font, colors.normal_txt, progress_margin_left+ww_progress+15, progress_margin_top-8+time_margin_top, 40, 40);   		
		}		
	}
	//Volume
	if(VolumeSliderActive) { 
		if(layout_state.isEqual(1)) gr.DrawImage(volume3_img, volume_vars.margin_left-volume3_img.Width-10, volume_vars.margin_top-Math.round(volume3_img.Height/2), volume3_img.Width, volume3_img.Height, 0, 0, volume3_img.Width, volume3_img.Height,0,255);
		if(properties.cursor_style==2 && !(volume_vars.hover_slider || volume_vars.drag)) var ellipse_radius = 0;
		else var ellipse_radius = Math.ceil(volume_vars.ellipse_diameter/2);
		
		if(properties.cursor_style==2) {
			gr.FillSolidRect(volume_vars.margin_left,volume_vars.margin_top-Math.round(volume_vars.height/2)+1, volume_vars.width, volume_vars.height,volumeOffcolor);
		} else {
			var dot_x = volume_vars.margin_left + volume_vars.width;
			while (dot_x > volume_vars.margin_left + volume_vars.volumesize + ellipse_radius) {
				gr.FillSolidRect(dot_x, volume_vars.margin_top+1, 1, 1, colors.dotted_progress);
				dot_x = dot_x-3;
			}		
		}		
		gr.FillSolidRect(volume_vars.margin_left,volume_vars.margin_top-Math.round(volume_vars.height/2)+1, volume_vars.volumesize-ellipse_radius, volume_vars.height,volumeOncolor);
		if(!(properties.cursor_style==2 && !(volume_vars.hover_slider || volume_vars.drag))){
			var slider2draw = (volume_vars.hover_slider || volume_vars.drag)?slider_cursor_hover:slider_cursor;
			gr.DrawImage(slider2draw,volume_vars.margin_left+volume_vars.volumesize-Math.round(slider2draw.Width/2)-1,volume_vars.margin_top-Math.round(slider2draw.Height/2)+1,slider2draw.Width,slider2draw.Height,0,0,slider2draw.Width,slider2draw.Height,0,255);	
		}		
	}
    drawAllButtons(gr);	
}

function is_hover_volume(x,y){	
    if(x>volume_vars.margin_left-volume3_img.Width-10 && x<=volume_vars.margin_left+volume_vars.width+30 && y>0 && y<=wh && VolumeSliderActive) return true;
    return false;
}
function is_hover_volume_btn(x,y){
    if(x>window.Width+buttons_right.Volume.x && x<=window.Width+buttons_right.Volume.x+button_width && y>buttons_right_top_m-4 && y<=buttons_right_top_m+button_width && layout_state.isEqual(0)) {		
		return true;
	}
    return false;
}
function is_hover_volume_slider(x,y){
    volume_vars.hover_slider = (x>volume_vars.margin_left && x<=volume_vars.margin_left+volume_vars.width && y>volume_vars.margin_top-20 && y<=volume_vars.height+volume_vars.margin_top+20 && VolumeSliderActive);
    return  volume_vars.hover_slider;
}
function is_hover_progress(x,y){
	if(!fb.IsPlaying) return false;	
    progress_vars.hover_slider = (y>=progress_margin_top-10 && y<=progress_margin_top+progress_vars.height+10 && x>progress_margin_left && x<window.Width-progress_margin_right && !hoovervolume && !(layout_state.isEqual(1) && VolumeSliderActive));
    return progress_vars.hover_slider;    
}
function is_hover_title(x,y){
	if(!fb.IsPlaying) return false;
    if(properties.showTrackInfo && y>=progress_margin_top - 30 && y<=progress_margin_top-30+17 && x>progress_margin_left && x<progress_margin_left+g_panel.get_fullTitle_length() && !hoovervolume && !(layout_state.isEqual(1) && VolumeSliderActive)) 	return true;
    else {
		g_tooltip.Deactivate();
		return false;    
	}
}
function is_hover_time_elapsed(x,y){
	if(properties.showTrackInfo){  
		if(y>=progress_margin_top - 30 && y<=progress_margin_top-30+17 && x>progress_margin_left+ww_progress-timeInfo_length && x<progress_margin_left+ww_progress) return true;
	} else {
		if(y>=progress_margin_top - 15 && y<=progress_margin_top+15 && x>progress_margin_left-60 && x<progress_margin_left) return true;
	}	
    return false;    
}
function is_hover_track_info(x,y){
    if(y>=progress_margin_top - 30 && y<=progress_margin_top-30+17 && x>progress_margin_left && x<progress_margin_left+ww_progress-timeInfo_length) return true;
    return false;    
}
function setVolume(val){
	var volume = (val-volume_vars.margin_left) / volume_vars.width;
	volume = (volume<0) ? 0 : (volume<1) ? volume : 1;
	volume = 100 * (Math.pow(volume,1/2) - 1);
	fb.Volume = volume;
}
function on_mouse_lbtn_down(x,y,m){	
	if(g_cursor.x!=x || g_cursor.y!=y) on_mouse_move(x,y);
	//Volume
    if(is_hover_volume_slider(x,y) && !is_hover_volume_btn(x,y)) {
		volume_vars.drag = true;
		setVolume(x);
	}
	
	g_resizing.on_mouse("lbtn_down", x, y, m);

	//Time Display
    if (is_hover_time_elapsed(x,y) && TimeTotalSeconds!="ON AIR") {
        window.SetProperty("Show remaining time",!properties.remaining_time);
        window.NotifyOthers("remaingingToggle",properties.remaining_time);
		properties.remaining_time=!properties.remaining_time;
		evalTimeDisplayed('',true);
        window.Repaint();    
    }
	
	if(is_hover_track_info(x,y)) {
		showNowPlaying();
	}

	//Progress	
    if (g_length_progress > 0 && is_hover_progress(x,y) && !(layout_state.isEqual(1) && VolumeSliderActive)) {
        progress_vars.drag = true;
		g_cursor.x=-1;
        on_mouse_move(x, y);
    }	
    btn_down = true;    
    if (cur_btn) {
        cur_btn.changeState(ButtonStates.down);	
		cur_btn.onMouse('lbtn_down',x,y);		
		down_btn = cur_btn;
        window.Repaint();
    }	
}

function on_mouse_lbtn_up(x,y,m){
	//Volume
	g_cursor.x=-1;	
	
	volume_vars.drag = false;
	
	g_resizing.on_mouse("lbtn_up", x, y, m);
	
	//Progress
    if (g_length_progress > 0 && progress_vars.drag) {
        fb.PlaybackTime = g_length_progress * g_pos_progress / ww_progress;
		g_tooltip.Deactivate(); 
        //on_mouse_move(x, y);
    }
    progress_vars.drag = false;  
	on_mouse_move(x,y);
	
    btn_down = false;    
    if (cur_btn !== null && typeof cur_btn === 'object') {
        if(down_btn && down_btn.text == cur_btn.text) cur_btn.onMouse('lbtn_up',x,y);
        window.Repaint();
    }
    down_btn = false;
	mouse_dble_clic = false;	
}
function on_mouse_lbtn_dblclk(x, y) {
	if(is_hover_track_info(x,y)) {
		showNowPlaying(true);
	}
    if (cur_btn) {
        cur_btn.onDbleClick();
        window.Repaint();
    }
}
function on_mouse_rbtn_up(x, y){
	draw_controls_menu(x,y);
	return true;
}

function on_mouse_move(x,y,m){ 
	if(g_cursor.x==x && g_cursor.y==y) return;
	g_cursor.onMouse("move", x, y, m);

	repaint = false;
	
	g_resizing.on_mouse("move", x, y, m);
	
	//Volume
	if(!is_over_panel){
		is_over_panel = true;
		if(layout_state.isEqual(1)) repaint = true;
	}
	if(!progress_vars.drag){
		if((is_hover_volume(x,y))){
			if(timers.hideVolume!==false) {clearTimeout(timers.hideVolume);timers.hideVolume=false;}
			hoovervolume=true; 		
			if(is_hover_volume_slider(x,y)) {		
				g_cursor.setCursor(IDC_HAND,"volume");		
				if(!repaint_volume) {
					repaint_volume = true;
					calculate_volume_ellipse_vars(true);
					volume_vars.height=volume_vars.height_hover;
					repaint = true;
				}			
			}
			else if(!volume_vars.drag){ResetVolume();}
		} else if(hoovervolume && !volume_vars.drag){
			ResetVolume();
			g_cursor.setCursor(IDC_ARROW);		
			if(!timers.hideVolume) showVolumeSlider(false);
		} else if(!timers.hideVolume && !volume_vars.drag && VolumeSliderActive) {
			showVolumeSlider(false);
		}
		
		if(is_hover_volume_btn(x,y) && layout_state.isEqual(0) && !VolumeSliderActive) {showVolumeSlider(true);repaint = true;}
		
		if(volume_vars.drag){
			setVolume(x);
		}
	}
	if(is_hover_time_elapsed(x,y)){
		if(g_cursor.getCursor!=IDC_HAND){
			g_cursor.setCursor(IDC_HAND,"time");
		}		
	} else if(g_cursor.getActiveZone()=='time'){
		g_cursor.setCursor(IDC_ARROW);
	}
	
	if(is_hover_title(x,y)){
		if(g_cursor.getCursor!=IDC_HAND){
			g_cursor.setCursor(IDC_HAND,"title");
		}
		if(showTitleTooltip && g_tooltip.activeZone != 'track_title' && !progress_vars.drag){
			new_tooltip_text=scheduler_string+g_text_title+" - "+g_text_artist;	
			g_tooltip.ActivateDelay(new_tooltip_text, x+10, y+20, globalProperties.tooltip_delay, 0, false, 'track_title');
		}
	} else if(g_cursor.getActiveZone()=='title'){
		g_cursor.setCursor(IDC_ARROW);
	}
	//Progress
	m_pos_progress = clamp(x-progress_margin_left, 0, ww_progress);	
	if(is_hover_progress(x,y)){
		g_cursor.setCursor(IDC_HAND,"progress");
		hooverprogress=true;        
		if(!repaint_progress) {
			repaint_progress = true;            
			progress_vars.height=progress_vars.height_hover;calculate_progress_ellipse_vars(true);repaint = true;
		}				 
           
	} else if(hooverprogress && !progress_vars.drag){
		g_cursor.setCursor(IDC_ARROW);
		ResetProgress();
	}
  
	if (progress_vars.drag) {
		g_pos_progress = m_pos_progress;
		repaint = true;
		if(!drag_timer){
			drag_timer = setTimeout(function() {
				seek_time= g_length_progress * g_pos_progress / ww_progress;
				if(seek_time<(g_length_progress-2) && (fb.PlaybackTime>seek_time+2 || fb.PlaybackTime<seek_time)) fb.PlaybackTime =seek_time; 
				else if(seek_time>(g_length_progress-2)) fb.PlaybackTime=seek_time-1;  
				
				if (x != g_tooltip.x || y != g_tooltip.y) {               
					t = g_length_progress * m_pos_progress / ww_progress;
					h = Math.floor(t / 3600);
					m = Math.floor((t -= h * 3600) / 60);
					s = Math.floor(t -= m * 60);
					new_text = (h > 0 ? h + ":" + (m < 10 ? "0" + m : m) : m) + ":" + (s < 10 ? "0" + s : s);            
					g_tooltip.Activate(new_text, Math.min(Math.max(x-17,progress_margin_left),progress_margin_left+ww_progress), progress_margin_top-35, 0, false, 'progress');          
				} 				
				
				repaint = true;
				drag_timer && clearTimeout(drag_timer);
				drag_timer = false;				
			},50)
		}
	}    
	
	g_tooltip.onMouse("move", x, y, m);
	
	//Buttons
	if(!progress_vars.drag && !volume_vars.drag){
		var old = cur_btn;
		cur_btn = chooseButton(x, y);
		
		if (old == cur_btn) {
		   // if (btn_down) return;
		} else if (btn_down && cur_btn && cur_btn.state != ButtonStates.down) {
			cur_btn.changeState(ButtonStates.down);
			repaint = true;
			return;
		} else {        
			if(old){
				old.changeState(ButtonStates.normal);		
			}
			if(cur_btn){
				cur_btn.changeState(ButtonStates.hover);		
			}
			repaint = true;			
		}
	}
	if(repaint) window.Repaint();
}

function on_mouse_leave() {
	is_over_panel = false;
	ResetVolume();
	if(!timers.hideVolume) showVolumeSlider(false);
    ResetProgress();
	g_tooltip.onMouse("leave");
    btn_down = false;    
    if (cur_btn) {
        cur_btn.changeState(ButtonStates.normal);
		repaint=true;
        cur_btn=null;
    }	
	window.Repaint();
}

function on_mouse_wheel(step, stepstrait, delta){
	
	if(typeof(stepstrait) == "undefined" || typeof(delta) == "undefined") intern_step = step;
	else intern_step = stepstrait/delta;	
	
    if(!hooverprogress){
		fb.Volume=fb.Volume + Math.pow((120+fb.Volume)/100,1/1000)*intern_step*2;
		showVolumeSliderTemp();
	}    
    if(hooverprogress){    
        fb.PlaybackTime = fb.PlaybackTime + (stepstrait/delta) * 2;
    }	
}
function on_volume_change(val) {
    if(!volume_vars.drag) showVolumeSliderTemp();
	calculateVolumeSize();
	window.Repaint();    
}
function calculateVolumeSize(){
	volume_vars.gradvolume = Math.pow((100+fb.Volume)/100,2);
	volume_vars.volumesize = Math.round((volume_vars.width*volume_vars.gradvolume>volume_vars.width_min) ? volume_vars.width*volume_vars.gradvolume :volume_vars.width_min);
	return volume_vars.volumesize;	
}
function on_playlist_switch() {
	if(!wait_for_randomization)
		Randomize=true;
}
function on_playlist_items_reordered(playlist) {
	if(!wait_for_randomization)	
		Randomize=true;
}
function on_playlists_changed() {
	if(!wait_for_randomization)	
		Randomize=true;
}
function on_playlist_items_added(playlist) {	
	items_added=true;
	if(!items_removed){	
		if(playlist==plman.ActivePlaylist) {
			setSchedulerText();			
		}  
	}
	items_added=false;		
}

function on_playlist_items_removed(playlist) {
	items_removed=true;	
	if(!items_added){	
		if(playlist==plman.ActivePlaylist) {
			setSchedulerText();
		}
	}
	items_removed=false;	
}
function on_playback_seek(time) {
	evalTimeDisplayed(time,false);
	g_length_progress = fb.PlaybackLength;	
    if (!progress_vars.drag) {
        if (g_length_progress > 0) g_pos_progress = Math.round(ww_progress * time / g_length_progress);
    }	
    window.Repaint();
}
function on_playback_time(time) {
	evalTimeDisplayed(time,false);	
    if (!progress_vars.drag) {
        if (g_length_progress > 0) g_pos_progress = Math.round(ww_progress * time / g_length_progress);
        window.Repaint();
    }
}
function on_playback_pause(){
    window.Repaint();
}
function on_playback_edited() {
	old_artist=g_text_artist;
	old_title=g_text_title;
	get_text();
	if(old_artist!=g_text_artist || old_title!=g_text_title) window.Repaint();        
}
function on_playback_new_track(metadb) {
	setSchedulerText();
	evalTimeDisplayed();
	g_length_progress = fb.PlaybackLength;
	g_pos_progress = 0;
	progress_vars.drag = false;
	current_played_track = metadb;
	get_text();	
	if(properties.showwallpaper && properties.wallpapermode == 0) {
		old_cachekey = nowplaying_cachekey;
		nowplaying_cachekey = process_cachekey(metadb);
		if(old_cachekey!=nowplaying_cachekey) {
			if(!globalProperties.loaded_covers2memory) g_image_cache.resetAll();			
			g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, metadb);
		}		
	};
	window.Repaint();
}
function on_playback_stop(reason) {	
	// reason: 0 user, 1 eof, 2 starting_another.
	if((scheduler.shutdown_after_current || scheduler.hibernate_after_current || scheduler.shutdown_after_playlist || scheduler.hibernate_after_playlist) && reason!=0 && reason!=2){
		if(!scheduler_timer) {
			setSchedulerText();window.Repaint();
			scheduler_timer = setTimeout(function() {
				if(scheduler.hibernate_after_current && !fb.IsPlaying) {
					setScheduler(0);
					window.Repaint();
					hibernate_computer(); 
				} else if(scheduler.shutdown_after_current && !fb.IsPlaying) {
					setScheduler(0);
					window.Repaint();			
					shutdown_computer(); 
				} else if(scheduler.shutdown_after_playlist && !fb.IsPlaying) {
					setScheduler(0);	
					window.Repaint();
					shutdown_computer(); 
				} else if(scheduler.hibernate_after_playlist && !fb.IsPlaying) {
					setScheduler(0);		
					window.Repaint();					
					hibernate_computer(); 
				}				
				scheduler_timer && clearTimeout(scheduler_timer);
				scheduler_timer = false;
			}, 2000);
		}	
	} else {
		setSchedulerText();
	}

    g_length_progress = 0;
    g_pos_progress = 0;
    progress_vars.drag = false;
	switch(reason) {
	case 0: // user stop
	case 1: // eof (e.g. end of playlist)
		g_wallpaperImg = null;
		nowplaying_cachekey = null;
		evalTimeDisplayed();
		get_text();		
		break;
	case 2: // starting_another (only called on user action, i.e. click on next button)
		break;
	};		

    window.Repaint();
}
function Scheduler(callBackName){
	if((scheduler.shutdown_after_current || scheduler.hibernate_after_current || scheduler.shutdown_after_playlist || scheduler.hibernate_after_playlist) && callBackName!="on_playback_stop0" && callBackName!="on_playback_stop2"){
		if(!scheduler_timer) {
			setSchedulerText();window.Repaint();
			scheduler_timer = setTimeout(function() {
				if(scheduler.hibernate_after_current) {
					setScheduler(0);
					window.Repaint();
					hibernate_computer(); 
				} else if(scheduler.shutdown_after_current) {
					setScheduler(0);
					window.Repaint();			
					shutdown_computer(); 
				} else if(scheduler.shutdown_after_playlist && !fb.IsPlaying) {
					setScheduler(0);	
					window.Repaint();
					shutdown_computer(); 
				} else if(scheduler.hibernate_after_playlist && !fb.IsPlaying) {
					setScheduler(0);		
					window.Repaint();					
					hibernate_computer(); 
				}				
				scheduler_timer && clearTimeout(scheduler_timer);
				scheduler_timer = false;
			}, 2000);
		}	
	} else {
		setSchedulerText();
	}	
}
function oPanel(){
	this.title_length = -1;
	this.artist_length = -1;
	this.time_length = -1;
	this.fullTitle_length = -1;	
	this.title_txt = '';
	this.artist_txt = '';
	this.time_txt = '';
	this.on_size_changed = function(){
	}
	this.set_title_text = function(title_txt){
		this.title_txt = title_txt;
		this.title_length = -1;
	}	
	this.get_title_length = function(gr){
		if(this.title_length<0){				
			this.title_length = gr.CalcTextWidth(this.scheduler_txt+this.title_txt, font_adjusted);	
		}			
		return this.title_length;		
	}
	this.set_fullTitle_length = function(gr){		
		this.fullTitle_length =  this.get_title_length(gr)+this.get_artist_length(gr);		
	}	
	this.get_fullTitle_length = function(){		
		return this.fullTitle_length;		
	}		
	this.set_artist_text = function(artist_txt){
		this.artist_txt = artist_txt;		
		this.artist_length = -1;
	}
	this.get_artist_length = function(gr){
		if(this.artist_length<0){	
			this.artist_length = gr.CalcTextWidth(" -  "+this.artist_txt, font_adjusted_italic);
		}			
		return this.artist_length;
	}
	this.set_time_text = function(time_txt){
		this.time_txt = time_txt;
		this.time_length = -1;
	}	
	this.get_time_length = function(gr){
		if(this.time_length<0){			
			this.time_length = gr.CalcTextWidth(this.time_txt, g_font.plus1) + 10;
		}
		return this.time_length;		
	}		
	this.set_scheduler_text = function(scheduler_txt){
		this.scheduler_txt = scheduler_txt;
		this.title_length = -1;
	}		
}
//=================================================// Drag'n'Drop Callbacks
function on_drag_enter() {
};

function on_drag_leave() {  
	g_resizing.on_drag("leave", 0, 0, null);	
}

function on_drag_over(action, x, y, mask) {
    if(x == g_dragndrop_x && y == g_dragndrop_y) return true;

	try{
		if(fb.IsPlaying || fb.IsPaused) action.Text = "Play next";
		else action.Text = "Play";	
	} catch(e){}
	
    g_dragndrop_x = x;
    g_dragndrop_y = y;
};

function on_drag_drop(action, x, y, mask) {
	action.Effect = 1;
	if(fb.IsPlaying || fb.IsPaused) {
		g_dragndrop_targetPlaylistId = plman.PlayingPlaylist;
		let playing_item_location = plman.GetPlayingItemLocation();
		if (playing_item_location.IsValid) {
			var target_index = playing_item_location.PlaylistItemIndex+1;
		} else var target_index = plman.PlaylistItemCount(g_dragndrop_targetPlaylistId);
		action.Playlist = g_dragndrop_targetPlaylistId;
		action.Base = target_index;		
		action.ToSelect = false;
	} else {
		g_dragndrop_targetPlaylistId = getPlaybackPlaylist();
		plman.PlayingPlaylist = g_dragndrop_targetPlaylistId;
		plman.ClearPlaylist(g_dragndrop_targetPlaylistId);
		plman.PlayingPlaylist=g_dragndrop_targetPlaylistId;		
		var target_index = plman.PlaylistItemCount(g_dragndrop_targetPlaylistId);
		action.Playlist = g_dragndrop_targetPlaylistId;
		action.Base = target_index;		
		action.ToSelect = false;
		g_dragndrop_timer = setTimeout(function(){
			plman.ExecutePlaylistDefaultAction(g_dragndrop_targetPlaylistId, 0);
			fb.Stop();fb.Play();
			clearTimeout(g_dragndrop_timer);
			g_dragndrop_timer = false;
        },50);			
	}
};

function evalTimeDisplayed(time,first_eval){
	first_eval = typeof first_eval !== 'undefined' ? first_eval : true;	
    if(first_eval) {
		TimeTotalSeconds = time_t.Eval();
		if(TimeTotalSeconds!="") TimeTotal = TimeTotalSeconds.toHHMMSS();
		else TimeTotal = "";
	}
	if(typeof time !== 'undefined' && time!=''){
		TimeElapsed = time.toHHMMSS();
		if(TimeTotalSeconds=="ON AIR") {
			TimeRemaining = TimeElapsed;	
		} else {
			TimeRemaining = TimeTotalSeconds - time; 
			TimeRemaining = "-"+TimeRemaining.toHHMMSS();	
		}		
	} else {	
		TimeElapsed = time_e.Eval();	
		TimeRemaining = time_r.Eval();	
	}
	
	if(TimeRemaining == "") TimeRemaining="-0.00";
	if(TimeElapsed== "") TimeElapsed="0.00";	
	if(TimeTotal=="") TimeTotal = TimeElapsed
	
    if(properties.remaining_time)  {
		if(TimeTotal!="") text_length = TimeElapsed+" / "+TimeTotal;	
		else text_length = TimeElapsed;
		if(first_eval) g_panel.set_time_text(TimeTotal+" / "+TimeTotal);
    } else {
		if(TimeTotal!="") text_length = TimeRemaining+" / "+TimeTotal;	
		else text_length = TimeElapsed;		
		if(first_eval) g_panel.set_time_text("-"+TimeTotal+" / "+TimeTotal);		
	}

}
function ResetProgress(){
	repaint_progress=false;
    //g_tooltip.Deactivate();     
    hooverprogress=false;
    progress_vars.height=progress_vars.height_start;
	progress_vars.hover_slider = false;
    calculate_progress_ellipse_vars(false);
	window.Repaint();
}
function ResetVolume(){  
	repaint_volume = false;
    hoovervolume=false;
    volume_vars.height=volume_vars.height_start;
	volume_vars.hover_slider = false;
	calculate_volume_ellipse_vars(false);
}
function on_key_down(vkey) {
	switch (vkey) {
	case VK_ESCAPE:
		if(g_uihacks.getFullscreenState()) g_uihacks.setFullscreenState(false);
		break;
	};	
}	
function on_notify_data(name, info) {
    switch(name) {	
		case "MemSolicitation":
			globalProperties.mem_solicitation = info;
			window.SetProperty("GLOBAL memory solicitation", globalProperties.mem_solicitation);	
			window.Reload();			
		break; 	
		case "thumbnailWidthMax":
			globalProperties.thumbnailWidthMax = Number(info);			
			window.SetProperty("GLOBAL thumbnail width max", globalProperties.thumbnailWidthMax);	
		break; 		
		case "coverCacheWidthMax":
			globalProperties.coverCacheWidthMax = Number(info);				
			window.SetProperty("GLOBAL cover cache width max", globalProperties.coverCacheWidthMax);
		break; 			
		case "DiskCacheState":
			globalProperties.enableDiskCache = info;
			window.SetProperty("COVER Disk Cache", globalProperties.enableDiskCache);			
			window.Repaint();
		break; 
		case "enable_screensaver":		
			globalProperties.enable_screensaver = info;
			window.SetProperty("GLOBAL enable screensaver", globalProperties.enable_screensaver);	
		break;			
		case "screensaver_state":		
			screensaver_state.value=info;
		break;	
		case "screensaver_dark_theme":
			properties.screensaver_dark_theme=info;
			window.SetProperty("SCREENSAVER dark theme", properties.screensaver_dark_theme);
			window.Repaint();	
		break;			
		case "rating_updated": 
			if(current_played_track && info.Compare(current_played_track)){
				setRatingBtn(info);
				window.Repaint();
			}
		break;		
		case "set_font":
			properties.globalFontAdjustement = info;
			window.SetProperty("MAINPANEL: Global Font Adjustement", properties.globalFontAdjustement),
			get_font();adapt_display_to_layout();
			window.Repaint();
		break; 			
		case "cover_cache_finalized": 
			//g_image_cache.cachelist = cloneImgs(info);
			window.Repaint();
		break;		
		case "SetRandom":
			properties.random_function = info;
			window.SetProperty("Random function", properties.random_function);
		break;   
	   case "Randomsetfocus":
			Randomsetfocus = info;
			if(Randomsetfocus) showNowPlaying();
		break; 
	   case "layout_state":
			layout_state.value = info;
			if(layout_state.isEqual(1)){
				properties.showTrackInfo = showtrackinfo_small.isActive();
			} else {
				properties.showTrackInfo = showtrackinfo_big.isActive();		
			}				
			get_colors();	
			on_size();				
			window.Repaint(); 
		break;	 
		case "nowplayinglib_state":
			nowplayinglib_state.value=info;
		break; 
		case "nowplayingplaylist_state":
			nowplayingplaylist_state.value=info;
		break; 
		case "nowplayingbio_state":
			nowplayingbio_state.value=info;
		break; 
		case "nowplayingvisu_state":
			nowplayingvisu_state.value=info;
		break; 			
	   case "coverpanel_state":
			coverpanel_state.value = info;			
			window.Repaint(); 
		break;		
		case "bio_dark_theme":
			properties.bio_dark_theme = info;
			window.SetProperty("BIO dark theme", properties.bio_dark_theme);	
			window.Repaint();
		break;	
		case "bio_stick_to_dark_theme":
			properties.bio_stick_to_dark_theme = info;
			window.SetProperty("BIO stick to dark theme", properties.bio_stick_to_dark_theme);	
			window.Repaint();
		break;		
		case "library_dark_theme":
			properties.library_dark_theme = info;
			window.SetProperty("LIBRARY dark theme", properties.library_dark_theme);	
			window.Repaint();
		break;		  
		case "playlists_dark_theme":
			properties.playlists_dark_theme = info;
			window.SetProperty("PLAYLISTS dark theme", properties.playlists_dark_theme);	
			window.Repaint();
		break;			
	   case "main_panel_state":
			if(main_panel_state!=info) {
				main_panel_state.value = info;
				window.Repaint();
			}
		break;	
	   case "schedulerState":
			setScheduler(info,true);
			window.Repaint();	
		break;	
	   case "minimode_dark_theme":
			if(layout_state.isEqual(1)) {
				properties.minimode_dark_theme=info;
				window.SetProperty("MINIMODE dark theme", properties.minimode_dark_theme);
				window.Repaint();		
			}
		break;	
	   case "AdjustVolume":
			showVolumeSliderTemp();
		break;       
	   case "WSH_panels_reload":
			window.Reload();
		break;   
	   case "hereIsGenreList":   
			g_genre_cache=info;
		break;        
	   case "giveMeGenreList":
			if(!g_genre_cache.isEmpty()){
				window.NotifyOthers("hereIsGenreList",JSON_stringify(g_genre_cache));			
			}
		break;
	}	
}
function setScheduler(schedulerState,dontNotify){
	dontNotify = typeof dontNotify !== 'undefined' ? dontNotify : false;		
	if(!dontNotify) window.NotifyOthers("schedulerState",schedulerState);	
	switch (true) {		
		case (schedulerState == 0):
			scheduler.hibernate_after_current = false;
			scheduler.shutdown_after_current = false;
			scheduler.hibernate_after_playlist = false;
			scheduler.shutdown_after_playlist = false;						
			fb.StopAfterCurrent=false;	
			break; 
		case (schedulerState == 1):
			scheduler.hibernate_after_current = false;
			scheduler.shutdown_after_current = false;	
			scheduler.hibernate_after_playlist = false;
			scheduler.shutdown_after_playlist = false;						
			fb.StopAfterCurrent=true;			
			break; 				
		case (schedulerState == 2):
			scheduler.hibernate_after_current = true;
			scheduler.shutdown_after_current = false;	
			scheduler.hibernate_after_playlist = false;
			scheduler.shutdown_after_playlist = false;						
			fb.StopAfterCurrent=true;		
			break; 			
		case (schedulerState == 3):
			scheduler.hibernate_after_current = false;
			scheduler.shutdown_after_current = true;
			scheduler.hibernate_after_playlist = false;
			scheduler.shutdown_after_playlist = false;						
			fb.StopAfterCurrent=true;			
			break; 	
		case (schedulerState == 4):
			scheduler.hibernate_after_current = false;
			scheduler.shutdown_after_current = false;	
			scheduler.hibernate_after_playlist = true;
			scheduler.shutdown_after_playlist = false;
			fb.StopAfterCurrent=false;						
			break; 
		case (schedulerState == 5):
			scheduler.hibernate_after_current = false;
			scheduler.shutdown_after_current = false;				
			scheduler.hibernate_after_playlist = false;
			scheduler.shutdown_after_playlist = true;	
			fb.StopAfterCurrent=false;				
			break;			
	}
	setSchedulerText();
}
function setSchedulerText(){
	switch (true) {			
		case (scheduler.hibernate_after_current):
			scheduler_string="HIBERNATE AFTER  :  ";
			if(properties.displayRepeat && !properties.displayScheduler) {
				buttons_right.Scheduler.state = ButtonStates.normal;
				buttons_right.Repeat.state = ButtonStates.hide;	
				buttons_right.Scheduler.x = buttons_right.Repeat.x;	
			}
			buttons_right.Scheduler.N_img = hibernate_img;
			buttons_right.Scheduler.H_img = hibernate_img_hover;
			buttons_right.Scheduler.D_img = hibernate_img_hover;
			break; 					
		case (scheduler.shutdown_after_current):
			scheduler_string="SHUTDOWN AFTER  :  ";
			if(properties.displayRepeat && !properties.displayScheduler) {
				buttons_right.Scheduler.state = ButtonStates.normal;
				buttons_right.Repeat.state = ButtonStates.hide;	
				buttons_right.Scheduler.x = buttons_right.Repeat.x;	
			}
			buttons_right.Scheduler.N_img = shutdown_img;
			buttons_right.Scheduler.H_img = shutdown_img_hover;
			buttons_right.Scheduler.D_img = shutdown_img_hover;
			break;  
		case (scheduler.hibernate_after_playlist):
			var playing_item_location = plman.GetPlayingItemLocation();
			if (playing_item_location.IsValid && (scheduler.shutdown_after_playlist || scheduler.hibernate_after_playlist)) {
				remaining_playlist_tracks_count = plman.PlaylistItemCount(plman.PlayingPlaylist)-playing_item_location.PlaylistItemIndex;
				remaining_playlist_tracks_txt = remaining_playlist_tracks_count + " Tracks Remaining  -  ";
			} else {
				remaining_playlist_tracks_count = 0
				remaining_playlist_tracks_txt = remaining_playlist_tracks_count + " Tracks Remaining  -  ";		
			}		
			scheduler_string="HIBERNATE  -  "+remaining_playlist_tracks_txt
			if(properties.displayRepeat && !properties.displayScheduler) {
				buttons_right.Scheduler.state = ButtonStates.normal;
				buttons_right.Repeat.state = ButtonStates.hide;	
				buttons_right.Scheduler.x = buttons_right.Repeat.x;	
			}
			buttons_right.Scheduler.N_img = hibernate_img;
			buttons_right.Scheduler.H_img = hibernate_img_hover;
			buttons_right.Scheduler.D_img = hibernate_img_hover;			
			
			if(plman.PlaybackOrder>2 ) plman.PlaybackOrder = 0;	
			if(remaining_playlist_tracks_count == 1) fb.StopAfterCurrent = true;
			else fb.StopAfterCurrent = false;			
			break;  
		case (scheduler.shutdown_after_playlist):
			var playing_item_location = plman.GetPlayingItemLocation();
			if (playing_item_location.IsValid && (scheduler.shutdown_after_playlist || scheduler.hibernate_after_playlist)) {
				remaining_playlist_tracks_count = plman.PlaylistItemCount(plman.PlayingPlaylist)-playing_item_location.PlaylistItemIndex;
				remaining_playlist_tracks_txt = remaining_playlist_tracks_count + " Tracks Remaining  -  ";
			} else {
				remaining_playlist_tracks_count = 0
				remaining_playlist_tracks_txt = remaining_playlist_tracks_count + " Tracks Remaining  -  ";
			}
			scheduler_string="SHUTDOWN  -  "+remaining_playlist_tracks_txt
			if(properties.displayRepeat && !properties.displayScheduler) {
				buttons_right.Scheduler.state = ButtonStates.normal;
				buttons_right.Repeat.state = ButtonStates.hide;	
				buttons_right.Scheduler.x = buttons_right.Repeat.x;	
			}
			buttons_right.Scheduler.N_img = shutdown_img;
			buttons_right.Scheduler.H_img = shutdown_img_hover;
			buttons_right.Scheduler.D_img = shutdown_img_hover;			
			if(plman.PlaybackOrder>2 ) plman.PlaybackOrder = 0;	
			if(remaining_playlist_tracks_count == 1) fb.StopAfterCurrent = true;
			else fb.StopAfterCurrent = false;
			break;  					
		case (fb.StopAfterCurrent):
			scheduler_string="STOP AFTER  :  "
			if(properties.displayRepeat && !properties.displayScheduler) {
				buttons_right.Scheduler.state = ButtonStates.normal;
				buttons_right.Repeat.state = ButtonStates.hide;	
				buttons_right.Scheduler.x = buttons_right.Repeat.x;	
			}
			buttons_right.Scheduler.N_img = scheduler_stop_img;
			buttons_right.Scheduler.H_img = scheduler_stop_img_hover;
			buttons_right.Scheduler.D_img = scheduler_stop_img_hover;			
			break;  					
		default:
			if(!properties.displayScheduler) buttons_right.Scheduler.state = ButtonStates.hide;
			else buttons_right.Scheduler.state = ButtonStates.normal;
			if(properties.displayRepeat) buttons_right.Repeat.state = ButtonStates.normal;	
			buttons_right.Scheduler.N_img = scheduler_donothing_img;
			buttons_right.Scheduler.H_img = scheduler_donothing_img_hover;
			buttons_right.Scheduler.D_img = scheduler_donothing_img_hover;			
			scheduler_string=""
			break;				
	}	
	if(layout_state.isEqual(1)){
			buttons_right.Scheduler.state = ButtonStates.hide;
			buttons_right.Repeat.state = ButtonStates.hide;	
	}
	g_panel.set_scheduler_text(scheduler_string);
}

function draw_menu() {

    var basemenu = window.CreatePopupMenu();
    var contextman = fb.CreateContextMenuManager();

    contextman.InitNowPlaying();
    
    var child1 = window.CreatePopupMenu(); //File
    var child2 = window.CreatePopupMenu(); //Edit
    var child3 = window.CreatePopupMenu(); //View
    var child4 = window.CreatePopupMenu(); //Playback
    var child5 = window.CreatePopupMenu(); //Library
    var child6 = window.CreatePopupMenu(); //Help
    var child7 = window.CreatePopupMenu(); //Now playing

    var menuman1 = fb.CreateMainMenuManager();
    var menuman2 = fb.CreateMainMenuManager();
    var menuman3 = fb.CreateMainMenuManager();
    var menuman4 = fb.CreateMainMenuManager();
    var menuman5 = fb.CreateMainMenuManager();
    var menuman6 = fb.CreateMainMenuManager();

    child1.AppendTo(basemenu, MF_STRING, "File");
    child2.AppendTo(basemenu, MF_STRING, "Edit");
    child3.AppendTo(basemenu, MF_STRING, "View");
    child4.AppendTo(basemenu, MF_STRING, "Playback");
    child5.AppendTo(basemenu, MF_STRING, "Library");
    child6.AppendTo(basemenu, MF_STRING, "Help");
    child7.AppendTo(basemenu, MF_STRING, "Now Playing"); 

	basemenu.AppendMenuSeparator();
	var _schedulerMenu = window.CreatePopupMenu();
	_schedulerMenu.AppendMenuItem(MF_STRING, 3018, "Do nothing");
	_schedulerMenu.AppendMenuSeparator();		
	_schedulerMenu.AppendMenuItem(MF_STRING, 3019, "Stop after current");
	_schedulerMenu.AppendMenuItem(MF_STRING, 3020, "Hibernate after current");		
	_schedulerMenu.AppendMenuItem(MF_STRING, 3021, "Shutdown after current");
	_schedulerMenu.AppendMenuSeparator();
	_schedulerMenu.AppendMenuItem(MF_STRING, 3022, "Hibernate after playlist");		
	_schedulerMenu.AppendMenuItem(MF_STRING, 3023, "Shutdown after playlist");		
	checked_item=0;
	switch (true) {			
		case (scheduler.hibernate_after_current):
			checked_item=3020
			break; 					
		case (scheduler.shutdown_after_current):
			checked_item=3021
			break;  
		case (scheduler.hibernate_after_playlist):
			checked_item=3022
			break;  
		case (scheduler.shutdown_after_playlist):
			checked_item=3023
			break;  					
		case (fb.StopAfterCurrent):
			checked_item=3019
			break;  					
		default:
			checked_item=3018
			break;				
	}		
	_schedulerMenu.CheckMenuRadioItem(3018, 3023, checked_item);		
	_schedulerMenu.AppendTo(basemenu, MF_STRING, "Scheduler");		
	
	library_menu = window.CreatePopupMenu();
	playlists_menu = window.CreatePopupMenu();
	bio_menu = window.CreatePopupMenu();	
	visu_menu = window.CreatePopupMenu();
	
	wallpaper_visibility = window.CreatePopupMenu();
	wallpaper_visibility.AppendMenuItem(MF_STRING, 4005, "Enable");	
	wallpaper_visibility.AppendMenuItem(MF_STRING, 4006, "Disable");	
	wallpaper_blur = window.CreatePopupMenu();
	wallpaper_blur.AppendMenuItem(MF_STRING, 4007, "Enable");	
	wallpaper_blur.AppendMenuItem(MF_STRING, 4008, "Disable");		
	
	if(main_panel_state.isEqual(0)){
		basemenu.AppendMenuSeparator();
		library_menu.AppendTo(basemenu,MF_STRING, "Current panel settings");		
		library_menu.AppendMenuItem(MF_STRING, 4000, "Enable Dark theme");	
		library_menu.CheckMenuItem(4000, properties.library_dark_theme);
		wallpaper_visibility.AppendTo(library_menu,MF_STRING, "Wallpapers visibility");			
		wallpaper_blur.AppendTo(library_menu,MF_STRING, "Wallpapers blur");					
	} else if(main_panel_state.isEqual(1)){
		basemenu.AppendMenuSeparator();
		playlists_menu.AppendTo(basemenu,MF_STRING, "Current panel settings");		
		playlists_menu.AppendMenuItem(MF_STRING, 4001, "Enable Dark theme");	
		playlists_menu.CheckMenuItem(4001, properties.playlists_dark_theme);
		wallpaper_visibility.AppendTo(playlists_menu,MF_STRING, "Wallpapers visibility");			
		wallpaper_blur.AppendTo(playlists_menu,MF_STRING, "Wallpapers blur");			
	} else if(main_panel_state.isEqual(2)){
		basemenu.AppendMenuSeparator();
		bio_menu.AppendTo(basemenu,MF_STRING, "Current panel settings");			
		bio_menu.AppendMenuItem(MF_STRING, 4002, "Enable Dark theme");
		bio_menu.CheckMenuItem(4002, properties.bio_dark_theme); 			
		wallpaper_visibility.AppendTo(bio_menu,MF_STRING, "Wallpapers visibility");			
		wallpaper_blur.AppendTo(bio_menu,MF_STRING, "Wallpapers blur");			
	} else if(main_panel_state.isEqual(3)){
		basemenu.AppendMenuSeparator();
		visu_menu.AppendTo(basemenu,MF_STRING, "Current panel settings");			
		visu_menu.AppendMenuItem(MF_STRING, 4003, "Enable Dark theme");
		visu_menu.CheckMenuItem(4003, properties.visualization_dark_theme);	
	}
		
    menuman1.Init("file");
    menuman2.Init("edit");
    menuman3.Init("View");
    menuman4.Init("playback");
    menuman5.Init("library");
    menuman6.Init("help");

    menuman1.BuildMenu(child1, 1001, 200);
    menuman2.BuildMenu(child2, 1201, 200);
    menuman3.BuildMenu(child3, 1401, 200);
    menuman4.BuildMenu(child4, 1601, 300);
    menuman5.BuildMenu(child5, 1901, 300);
    menuman6.BuildMenu(child6, 2201, 100);

    contextman.InitNowPlaying();
    contextman.BuildMenu(child7, 2301, -1);
    idx = 0;

    idx = basemenu.TrackPopupMenu(window.Width-120-button_right_m, 15,0x0020);
	
    switch (true) {       
    case(idx >= 1001 && idx < 1201):
        menuman1.ExecuteByID(idx - 1001);
        break;

    case (idx >= 1201 && idx < 1401):
        menuman2.ExecuteByID(idx - 1201);
        break;

    case (idx >= 1401 && idx < 1601):
        menuman3.ExecuteByID(idx - 1401);
        break;

    case (idx >= 1601 && idx < 1901):
        menuman4.ExecuteByID(idx - 1601);
        break;

    case (idx >= 1901 && idx < 2201):
        menuman5.ExecuteByID(idx - 1901);
        break;

    case (idx >= 2201 && idx < 2301):
        menuman6.ExecuteByID(idx - 2201);
        break;

    case (idx >= 2301 && idx < 3000):
        contextman.ExecuteByID(idx - 2301);
        break;
	case (idx == 3018):
		setScheduler(0);		
		break; 
	case (idx == 3019):
		setScheduler(1);		
		break; 				
	case (idx == 3020):
		setScheduler(2);		
		break; 			
	case (idx == 3021):
		setScheduler(3);	
		break; 	
	case (idx == 3022):
		setScheduler(4);					
		break; 
	case (idx == 3023):
		setScheduler(5);			
		break;		
   case (idx == 4000):
		properties.library_dark_theme=!properties.library_dark_theme;   
        window.NotifyOthers("library_dark_theme",properties.library_dark_theme);
		window.SetProperty("LIBRARY dark theme", properties.library_dark_theme);	
        window.Repaint();
        break;		
   case (idx == 4001):
		properties.playlists_dark_theme=!properties.playlists_dark_theme;   
        window.NotifyOthers("playlists_dark_theme",properties.playlists_dark_theme);
		window.SetProperty("PLAYLISTS dark theme", properties.playlists_dark_theme);			
		fb.RunMainMenuCommand("View/ElPlaylist/Refresh");
        window.Repaint();
        break;		
   case (idx == 4002):
		properties.bio_dark_theme=!properties.bio_dark_theme;   
        window.NotifyOthers("bio_dark_theme",properties.bio_dark_theme);
		window.SetProperty("BIO dark theme", properties.bio_dark_theme);	
        window.Repaint();
        break;
   case (idx == 4003):
		properties.visualization_dark_theme=!properties.visualization_dark_theme;   
        window.NotifyOthers("visualization_dark_theme",properties.visualization_dark_theme);
		window.SetProperty("VISUALIZATION dark theme", properties.visualization_dark_theme);	
        break;		
   case (idx == 4005):  
        window.NotifyOthers("wallpaperVisibility",true);
        break;		
   case (idx == 4006):  
        window.NotifyOthers("wallpaperVisibility",false);
        break;		
   case (idx == 4007):  
        window.NotifyOthers("wallpaperBlur",true);
        break;		
   case (idx == 4008):  
        window.NotifyOthers("wallpaperBlur",false);
        break;			
    }

    basemenu = undefined;
    contextman = undefined;
    menuman1 = undefined;
    menuman2 = undefined;
    menuman3 = undefined;
    menuman4 = undefined;
    menuman5 = undefined;
    menuman6 = undefined;
	_schedulerMenu = undefined;
    library_menu = undefined;
    playlists_menu = undefined;	
    bio_menu = undefined;	
    wallpaper_visibility = undefined;	
    wallpaper_blur = undefined;		
}
function randomPlayMenu(x, y){
		
        var _menu = window.CreatePopupMenu();	
        var idx;
	
		var checked_item_menu=3;
		_menu.AppendMenuItem(MF_DISABLED, 0, "Play randomly :");
		_menu.AppendMenuSeparator();
        _menu.AppendMenuItem(MF_STRING, 3, "Tracks");
			if(properties.random_function=='200_tracks') checked_item_menu=3;
        _menu.AppendMenuItem(MF_STRING, 2, "Albums");
			if(properties.random_function=='20_albums') checked_item_menu=2;         
        _menu.AppendMenuItem(MF_STRING, 5, "Artist");
			if(properties.random_function=='1_artist') checked_item_menu=5;   			
		var genreValue=parseInt(properties.random_function);
			_menu.AppendMenuItem(MF_STRING, 4, "Genre");
			if((genreValue >= 1000 && genreValue < 2001) || properties.random_function=='1_genre')	checked_item_menu=4;
		
		_menu.CheckMenuRadioItem(2, 5, checked_item_menu);
				
		var genrePopupMenu = window.CreatePopupMenu();	
		try {
			if(!g_genre_cache.initialized) g_genre_cache.build_from_library();
		} catch (e) {
			g_genre_cache = new oGenreCache();
			g_genre_cache.build_from_library();
		}		
		createGenrePopupMenu(false, -1, genrePopupMenu);
		
		genrePopupMenu.AppendTo(_menu, MF_STRING, "A specific genre");	

        idx = _menu.TrackPopupMenu(x,y,0x0020);
        switch(true) {		              
            case (idx == 2):
                properties.random_function = '20_albums';
                window.SetProperty("Random function", properties.random_function);
				window.NotifyOthers("playRandom", properties.random_function);
				//play_random(true,properties.random_function);                 
                break;
            case (idx == 3):
                properties.random_function = '200_tracks';
                window.SetProperty("Random function", properties.random_function);
				window.NotifyOthers("playRandom", properties.random_function);
				//play_random(true,properties.random_function);                 
                break;
            case (idx == 4):
                properties.random_function = '1_genre';
                window.SetProperty("Random function", properties.random_function);
				window.NotifyOthers("playRandom", properties.random_function);
				//play_random(true,properties.random_function);                
                break;	
            case (idx == 5):
                properties.random_function = '1_artist';
                window.SetProperty("Random function", properties.random_function);
				window.NotifyOthers("playRandom", properties.random_function);             
                break;					
			case (idx >= 1000 && idx < 2001):
                properties.random_function = '1_genre';
                window.SetProperty("Random function", properties.random_function);
                window.NotifyOthers("playRandom", idx);                
				//play_random(true,idx);
				break;                 
            case (idx == 6):
                properties.random_function = 'default';
                window.SetProperty("Random function", properties.random_function);
				window.NotifyOthers("playRandom", properties.random_function);
				//play_random(true,properties.random_function);                 
                break;					
            default:
				return true;
                break;  				
        }
		
        genrePopupMenu = undefined;		
        _menu = undefined;
        return true;
}

function moreMenu(x, y){
		
        var idx;
	
		var _moreMenu = window.CreatePopupMenu();
		if(fb.IsPlaying) {
			_moreMenu.AppendMenuItem(MF_STRING, 1, "Show now playing");
			if(!properties.displayRating) {
				var _ratingMenu = window.CreatePopupMenu();			
				_ratingMenu.AppendMenuItem(MF_STRING, 2001, "0 / Not set");
				_ratingMenu.AppendMenuItem(MF_STRING, 2002, "1");		
				_ratingMenu.AppendMenuItem(MF_STRING, 2003, "2");
				_ratingMenu.AppendMenuItem(MF_STRING, 2004, "3");		
				_ratingMenu.AppendMenuItem(MF_STRING, 2005, "4");
				_ratingMenu.AppendMenuItem(MF_STRING, 2006, "5");
				if(g_rating!=0)
					_ratingMenu.CheckMenuRadioItem(2001, 2006, 2000+Number(g_rating)+1);
				else
					_ratingMenu.CheckMenuRadioItem(2001, 2006, 2000+1);
				_ratingMenu.AppendTo(_moreMenu, MF_STRING, "Rating");				
			}			
			var quickSearchMenu = window.CreatePopupMenu();	
			quickSearchMenu.AppendMenuItem(MF_STRING, 34,"Same title");				
			quickSearchMenu.AppendMenuItem(MF_STRING, 30,"Same artist");
			quickSearchMenu.AppendMenuItem(MF_STRING, 31,"Same album");	
			quickSearchMenu.AppendMenuItem(MF_STRING, 32,"Same genre");		
			quickSearchMenu.AppendMenuItem(MF_STRING, 33,"Same date");		
			quickSearchMenu.AppendTo(_moreMenu, MF_STRING, "Quick search for..."); 					
			_moreMenu.AppendMenuSeparator();		
		}		
		

		
		var _controlsMenu = window.CreatePopupMenu();		
		_controlsMenu.AppendMenuItem(MF_STRING, 3000, "Stop");
		if (!fb.IsPlaying) _controlsMenu.CheckMenuItem(3000, true);
		if (fb.IsPlaying && !fb.IsPaused) _controlsMenu.AppendMenuItem(MF_STRING, 3001, "Pause");	
		else _controlsMenu.AppendMenuItem(MF_STRING, 3001, "Play");			
		_controlsMenu.AppendMenuItem(MF_STRING, 3003, "Previous");	
		_controlsMenu.AppendMenuItem(MF_STRING, 3004, "Next");	
		_controlsMenu.AppendMenuItem(MF_STRING, 3005, "Random");	
		_controlsMenu.AppendMenuSeparator();
			var _playbackOrder = window.CreatePopupMenu();
			_playbackOrder.AppendMenuItem(MF_STRING, 3007, "Default");		
			_playbackOrder.AppendMenuItem(MF_STRING, 3008, "Repeat (playlist)");
			_playbackOrder.AppendMenuItem(MF_STRING, 3009, "Repeat (track)");
			_playbackOrder.AppendMenuItem(MF_STRING, 3010, "Random");
			_playbackOrder.AppendMenuItem(MF_STRING, 3011, "Shuffle (tracks)");
			_playbackOrder.AppendMenuItem(MF_STRING, 3012, "Shuffle (albums)");
			_playbackOrder.AppendMenuItem(MF_STRING, 3013, "Shuffle (folders)");
			if(plman.PlaybackOrder==0) _playbackOrder.CheckMenuItem(3007, true);		
			else if(plman.PlaybackOrder==1) _playbackOrder.CheckMenuItem(3008, true);
			else if(plman.PlaybackOrder==2) _playbackOrder.CheckMenuItem(3009, true);
			else if(plman.PlaybackOrder==3) _playbackOrder.CheckMenuItem(3010, true);		 
			else if(plman.PlaybackOrder==4) _playbackOrder.CheckMenuItem(3011, true);
			else if(plman.PlaybackOrder==5) _playbackOrder.CheckMenuItem(3012, true);
			else if(plman.PlaybackOrder==6) _playbackOrder.CheckMenuItem(3013, true);
			_playbackOrder.AppendMenuSeparator();
			_playbackOrder.AppendMenuItem(MF_STRING, 3024, "Randomize playing playlist");	
			_playbackOrder.AppendTo(_controlsMenu, MF_STRING, "Order");
		_controlsMenu.AppendTo(_moreMenu, MF_STRING, "Playback");
		
		if(!properties.displayOpen || !properties.displayPlayRandom) _moreMenu.AppendMenuSeparator();
		
		if(!properties.displayOpen) {
			var _openMenu = window.CreatePopupMenu();
			_openMenu.AppendMenuItem(MF_STRING, 3025, "Open files...");
			_openMenu.AppendMenuItem(MF_STRING, 3026, "Open audio CD...");			
			_openMenu.AppendMenuSeparator();		
			_openMenu.AppendMenuItem(MF_STRING, 3027, "Add files...");
			_openMenu.AppendMenuItem(MF_STRING, 3028, "Add folders...");		
			_openMenu.AppendMenuItem(MF_STRING, 3029, "Add location...");
			_openMenu.AppendTo(_moreMenu, MF_STRING, "Open");	
		}			
		
		if(!properties.displayPlayRandom) {
			var _playRandom = window.CreatePopupMenu();
			var checked_item_menu=503;
			_playRandom.AppendMenuItem(MF_STRING, 503, "Tracks");
				if(properties.random_function=='200_tracks') checked_item_menu=503;
			_playRandom.AppendMenuItem(MF_STRING, 502, "Albums");
				if(properties.random_function=='20_albums') checked_item_menu=502;            
			_playRandom.AppendMenuItem(MF_STRING, 505, "Artist");
				if(properties.random_function=='1_artist') checked_item_menu=505; 

			var genreValue=parseInt(properties.random_function);
				_playRandom.AppendMenuItem(MF_STRING, 504, "Genre");
			if((genreValue >= 1000 && genreValue < 2001) || properties.random_function=='1_genre')	checked_item_menu=504;
			
			//_playRandom.CheckMenuRadioItem(502, 505, checked_item_menu);
					
			var genrePopupMenu = window.CreatePopupMenu();	
			createGenrePopupMenu(false, -1, genrePopupMenu);
			genrePopupMenu.AppendTo(_playRandom, MF_STRING, "A specific genre");
			
			_playRandom.AppendTo(_moreMenu, MF_STRING, "Play randomly");				
		}		
		
		if(!properties.displayScheduler || !properties.displayEqualizer) _moreMenu.AppendMenuSeparator();
		
		if(!properties.displayScheduler) {
			var _schedulerMenu = window.CreatePopupMenu();
			_schedulerMenu.AppendMenuItem(MF_STRING, 3018, "Do nothing");
			_schedulerMenu.AppendMenuSeparator();		
			_schedulerMenu.AppendMenuItem(MF_STRING, 3019, "Stop after current");
			_schedulerMenu.AppendMenuItem(MF_STRING, 3020, "Hibernate after current");		
			_schedulerMenu.AppendMenuItem(MF_STRING, 3021, "Shutdown after current");
			_schedulerMenu.AppendMenuSeparator();
			_schedulerMenu.AppendMenuItem(MF_STRING, 3022, "Hibernate after playlist");		
			_schedulerMenu.AppendMenuItem(MF_STRING, 3023, "Shutdown after playlist");		
			checked_item=0;
			switch (true) {			
				case (scheduler.hibernate_after_current):
					checked_item=3020
					break; 					
				case (scheduler.shutdown_after_current):
					checked_item=3021
					break;  
				case (scheduler.hibernate_after_playlist):
					checked_item=3022
					break;  
				case (scheduler.shutdown_after_playlist):
					checked_item=3023
					break;  					
				case (fb.StopAfterCurrent):
					checked_item=3019
					break;  					
				default:
					checked_item=3018
					break;				
			}		
			_schedulerMenu.CheckMenuRadioItem(3018, 3023, checked_item);		
			_schedulerMenu.AppendTo(_moreMenu, MF_STRING, "Scheduler");	
		}
		
		if(!properties.displayEqualizer)
			_moreMenu.AppendMenuItem(MF_STRING, 3017, "Equalizer");
		
        idx = _moreMenu.TrackPopupMenu(x,y,0x0008 | 0x0020);
		
        switch(true) {	
			case (idx == 1):
				showNowPlaying();	
				break; 	
            case (idx == 30):
				if(!main_panel_state.isEqual(0) && !main_panel_state.isEqual(1)) {
					main_panel_state.setValue(0)
				}	
				quickSearch(fb.GetNowPlaying(),"artist");
                break;	
            case (idx == 31):
				if(!main_panel_state.isEqual(0) && !main_panel_state.isEqual(1)) {
					main_panel_state.setValue(0)
				}
				quickSearch(fb.GetNowPlaying(),"album");		
                break;			
            case (idx == 32):
				if(!main_panel_state.isEqual(0) && !main_panel_state.isEqual(1)) {
					main_panel_state.setValue(0)
				}				
				quickSearch(fb.GetNowPlaying(),"genre");		
                break;		
            case (idx == 33):
				if(!main_panel_state.isEqual(0) && !main_panel_state.isEqual(1)) {
					main_panel_state.setValue(0)
				}				
				quickSearch(fb.GetNowPlaying(),"date");		
                break;	
            case (idx == 34):
				if(!main_panel_state.isEqual(0) && !main_panel_state.isEqual(1)) {
					main_panel_state.setValue(0)
				}				
				quickSearch(fb.GetNowPlaying(),"title");		
                break;				
            case (idx == 502):
                properties.random_function = '20_albums';
                window.SetProperty("Random function", properties.random_function);
                window.NotifyOthers("SetRandom", properties.random_function);                
				play_random(true,properties.random_function);
                break;
            case (idx == 503):
                properties.random_function = '200_tracks';
                window.SetProperty("Random function", properties.random_function);
                window.NotifyOthers("SetRandom", properties.random_function);                
				play_random(true,properties.random_function);
                break;
            case (idx == 504):
                properties.random_function = '1_genre';
                window.SetProperty("Random function", properties.random_function);
                window.NotifyOthers("SetRandom", properties.random_function);                
				play_random(true,properties.random_function);
                break;	   
            case (idx == 505):
                properties.random_function = '1_artist';
                window.SetProperty("Random function", properties.random_function);
				window.NotifyOthers("playRandom", properties.random_function); 
				play_random(true,properties.random_function);				
                break;						
			case (idx >= 1000 && idx < 2001):
                properties.random_function = '1_genre';
                window.SetProperty("Random function", properties.random_function);
                window.NotifyOthers("SetRandom", properties.random_function);                
				play_random(true,idx);
				break;  				
            case (idx == 507):
                properties.random_function = 'default';
                window.SetProperty("Random function", properties.random_function);
                window.NotifyOthers("SetRandom", properties.random_function);
				play_random(true,properties.random_function);
                break;				
            case (idx == 2001):
				if(g_rating!=0)
                g_rating = rateSong(0, g_rating, current_played_track);
                break;  		
            case (idx == 2002):
				if(g_rating!=1)			
                g_rating = rateSong(1, g_rating, current_played_track);
                break; 
            case (idx == 2003):	
				if(g_rating!=2)			
                g_rating = rateSong(2, g_rating, current_played_track);			
                break; 
            case (idx == 2004):
				if(g_rating!=3)			
                g_rating = rateSong(3, g_rating, current_played_track);
                break; 
            case (idx == 2005):
				if(g_rating!=4)			
                g_rating = rateSong(4, g_rating, current_played_track);
                break; 
            case (idx == 2006):
				if(g_rating!=5)			
                g_rating = rateSong(5, g_rating, current_played_track);
                break; 				
            case (idx == 3000):
                fb.Stop();
                break;  		
            case (idx == 3001):
                fb.PlayOrPause();
                break; 
            case (idx == 3003):
                fb.Prev();
                break; 
            case (idx == 3004):
                fb.Next();
                break; 
            case (idx == 3005):
                fb.Random();
                break; 							
            case (idx >= 3007 && idx <= 3013):
                plman.PlaybackOrder=idx-3007;				
                break; 	

			case (idx == 3017):
				fb.RunMainMenuCommand("View/DSP/Equalizer");
				break; 
			case (idx == 3018):
				setScheduler(0);		
				break; 
			case (idx == 3019):
				setScheduler(1);		
				break; 				
			case (idx == 3020):
				setScheduler(2);		
				break; 			
			case (idx == 3021):
				setScheduler(3);	
				break; 	
			case (idx == 3022):
				setScheduler(4);					
				break; 
			case (idx == 3023):
				setScheduler(5);			
				break;
            case (idx == 3024):
				plman.SortByFormat(plman.ActivePlaylist,"");
                break; 	
            case (idx == 3025):
				fb.RunMainMenuCommand("File/Open...");
                break; 	
            case (idx == 3026):
				fb.RunMainMenuCommand("File/Open audio CD...");
                break; 	
            case (idx == 3027):
				fb.RunMainMenuCommand("File/Add files...");
                break; 	
            case (idx == 3028):
				fb.RunMainMenuCommand("File/Add folder...");
                break; 	
            case (idx == 3029):
				fb.RunMainMenuCommand("File/Add location...");
                break; 					
            case (idx == 100):
                window.ShowProperties();
                break;  
            case (idx == 101):
                window.ShowConfigure();
                break;
            case (idx == 102):
                window.Reload();
                break;  
			case (idx == 10000):
				g_genre_cache.build_from_library();	
				break;						
            default:
				return true;
                break; 				
        }
		
        _moreMenu = undefined;
		_ratingMenu = undefined;
		_playRandom = undefined;
		_playbackOrder = undefined;
		_controlsMenu = undefined;	
		_openMenu = undefined;			
        _schedulerMenu = undefined;
        return true;
}	
function schedulerMenu(x, y){
		
        var idx;
	
		var _schedulerMenu = window.CreatePopupMenu();
		_schedulerMenu.AppendMenuItem(MF_DISABLED, 0, "Scheduler :");
		_schedulerMenu.AppendMenuSeparator();				
		_schedulerMenu.AppendMenuItem(MF_STRING, 3018, "Do nothing");
		_schedulerMenu.AppendMenuSeparator();		
		_schedulerMenu.AppendMenuItem(MF_STRING, 3019, "Stop after current");
		_schedulerMenu.AppendMenuItem(MF_STRING, 3020, "Hibernate after current");		
		_schedulerMenu.AppendMenuItem(MF_STRING, 3021, "Shutdown after current");
		_schedulerMenu.AppendMenuSeparator();
		_schedulerMenu.AppendMenuItem(MF_STRING, 3022, "Hibernate after playlist");		
		_schedulerMenu.AppendMenuItem(MF_STRING, 3023, "Shutdown after playlist");		
			checked_item=0;
			switch (true) {			
				case (scheduler.hibernate_after_current):
					checked_item=3020
					break; 					
				case (scheduler.shutdown_after_current):
					checked_item=3021
					break;  
				case (scheduler.hibernate_after_playlist):
					checked_item=3022
					break;  
				case (scheduler.shutdown_after_playlist):
					checked_item=3023
					break;  					
				case (fb.StopAfterCurrent):
					checked_item=3019
					break;  					
				default:
					checked_item=3018
					break;				
			}		
		_schedulerMenu.CheckMenuRadioItem(3018, 3023, checked_item);		
		
        idx = _schedulerMenu.TrackPopupMenu(x,y,0x0020);
		
        switch(true) {	
			case (idx == 3018):
				setScheduler(0);		
				break; 
			case (idx == 3019):
				setScheduler(1);		
				break; 				
			case (idx == 3020):
				setScheduler(2);		
				break; 			
			case (idx == 3021):
				setScheduler(3);	
				break; 	
			case (idx == 3022):
				setScheduler(4);					
				break; 
			case (idx == 3023):
				setScheduler(5);			
				break;			
            default:
				return true;
                break;  				
        }
		
        _schedulerMenu = undefined;		
        return true;
}
function draw_rating_menu(x,y){
        var _menu = window.CreatePopupMenu();
        var idx;
		_menu.AppendMenuItem(MF_DISABLED, 0, "Rating:");
		_menu.AppendMenuSeparator();		
		
		_menu.AppendMenuItem(MF_STRING, 1, "0 / Not set");
		_menu.AppendMenuItem(MF_STRING, 2, "1");		
		_menu.AppendMenuItem(MF_STRING, 3, "2");
		_menu.AppendMenuItem(MF_STRING, 4, "3");		
		_menu.AppendMenuItem(MF_STRING, 5, "4");
		_menu.AppendMenuItem(MF_STRING, 6, "5");			
		_menu.CheckMenuRadioItem(1, 6, Number(g_rating)+1);		

        idx = _menu.TrackPopupMenu(x,y,0x0020);
        switch(true) {				
            case (idx == 1):
				if(g_rating!=0)
                g_rating = rateSong(0, g_rating, current_played_track);
                break;  		
            case (idx == 2):
				if(g_rating!=1)			
                g_rating = rateSong(1, g_rating, current_played_track);
                break; 
            case (idx == 3):	
				if(g_rating!=2)			
                g_rating = rateSong(2, g_rating, current_played_track);			
                break; 
            case (idx == 4):
				if(g_rating!=3)			
                g_rating = rateSong(3, g_rating, current_played_track);
                break; 
            case (idx == 5):
				if(g_rating!=4)			
                g_rating = rateSong(4, g_rating, current_played_track);
                break; 
            case (idx == 6):
				if(g_rating!=5)			
                g_rating = rateSong(5, g_rating, current_played_track);
                break; 					
            default:
				return true;
                break;  				
        }
        _menu = undefined;
        return true;	
}
function draw_controls_menu(x,y){
        var _menu = window.CreatePopupMenu();
		var _menu3 = window.CreatePopupMenu();	
		var _menu3A = window.CreatePopupMenu();
        var idx;
		
		_menu.AppendMenuItem(MF_STRING, 1, "Settings...");
		_menu.AppendMenuSeparator();
		
		_menu.AppendMenuItem(MF_STRING, 3000, "Stop");		
		if (fb.IsPlaying && !fb.IsPaused) _menu.AppendMenuItem(MF_STRING, 3001, "Pause");	
		else _menu.AppendMenuItem(MF_STRING, 3001, "Play");			
		_menu.AppendMenuItem(MF_STRING, 3003, "Previous");	
		_menu.AppendMenuItem(MF_STRING, 3004, "Next");	
		_menu.AppendMenuItem(MF_STRING, 3005, "Random");	
		_menu.AppendMenuSeparator();
		
		_menu.AppendMenuItem(MF_STRING, 3024, "Randomize playing playlist");	
		_menu.AppendMenuSeparator();
		
		var _playbackOrder = window.CreatePopupMenu();
		_playbackOrder.AppendMenuItem(MF_STRING, 3007, "Default");		
		_playbackOrder.AppendMenuItem(MF_STRING, 3008, "Repeat (playlist)");
		_playbackOrder.AppendMenuItem(MF_STRING, 3009, "Repeat (track)");
		_playbackOrder.AppendMenuItem(MF_STRING, 3010, "Random");
		_playbackOrder.AppendMenuItem(MF_STRING, 3011, "Shuffle (tracks)");
		_playbackOrder.AppendMenuItem(MF_STRING, 3012, "Shuffle (albums)");
		_playbackOrder.AppendMenuItem(MF_STRING, 3013, "Shuffle (folders)");
		if(plman.PlaybackOrder==0) _playbackOrder.CheckMenuItem(3007, true);		
		else if(plman.PlaybackOrder==1) _playbackOrder.CheckMenuItem(3008, true);
		else if(plman.PlaybackOrder==2) _playbackOrder.CheckMenuItem(3009, true);
		else if(plman.PlaybackOrder==3) _playbackOrder.CheckMenuItem(3010, true);		 
		else if(plman.PlaybackOrder==4) _playbackOrder.CheckMenuItem(3011, true);
		else if(plman.PlaybackOrder==5) _playbackOrder.CheckMenuItem(3012, true);
		else if(plman.PlaybackOrder==6) _playbackOrder.CheckMenuItem(3013, true);
		_playbackOrder.AppendTo(_menu, MF_STRING, "Playback order");	
		_menu.AppendMenuSeparator();	
		
		var _schedulerMenu = window.CreatePopupMenu();
		_schedulerMenu.AppendMenuItem(MF_STRING, 3018, "Do nothing");
		_schedulerMenu.AppendMenuSeparator();		
		_schedulerMenu.AppendMenuItem(MF_STRING, 3019, "Stop after current");
		_schedulerMenu.AppendMenuItem(MF_STRING, 3020, "Hibernate after current");		
		_schedulerMenu.AppendMenuItem(MF_STRING, 3021, "Shutdown after current");
		_schedulerMenu.AppendMenuSeparator();
		_schedulerMenu.AppendMenuItem(MF_STRING, 3022, "Hibernate after playlist");		
		_schedulerMenu.AppendMenuItem(MF_STRING, 3023, "Shutdown after playlist");		
			checked_item=0;
			switch (true) {			
				case (scheduler.hibernate_after_current):
					checked_item=3020
					break; 					
				case (scheduler.shutdown_after_current):
					checked_item=3021
					break;  
				case (scheduler.hibernate_after_playlist):
					checked_item=3022
					break;  
				case (scheduler.shutdown_after_playlist):
					checked_item=3023
					break;  					
				case (fb.StopAfterCurrent):
					checked_item=3019
					break;  					
				default:
					checked_item=3018
					break;				
			}		
		_schedulerMenu.CheckMenuRadioItem(3018, 3023, checked_item);		
		_schedulerMenu.AppendTo(_menu, MF_STRING, "Scheduler");	 
		
		if(utils.IsKeyPressed(VK_SHIFT)) {
			_menu.AppendMenuSeparator();		
			_menu.AppendMenuItem(MF_STRING, 100, "Properties ");
			_menu.AppendMenuItem(MF_STRING, 101, "Configure...");	
            _menu.AppendMenuSeparator();                  
			_menu.AppendMenuItem(MF_STRING, 102, "Reload");            
		}
        idx = _menu.TrackPopupMenu(x,y,0x0020);
        switch(true) {
			case (idx == 1):	
				draw_settings_menu(x,y);
                break;  				
            case (idx == 3000):
                fb.Stop();
                break;  		
            case (idx == 3001):
                fb.PlayOrPause();
                break; 
            case (idx == 3003):
                fb.Prev();
                break; 
            case (idx == 3004):
                fb.Next();
                break; 
            case (idx == 3005):
                fb.Random();
                break; 							
            case (idx >= 3007 && idx <= 3013):
                plman.PlaybackOrder=idx-3007;				
                break; 	
            case (idx == 3024):
				plman.SortByFormat(plman.PlayingPlaylist,"");
                break; 				
			case (idx == 3018):
				setScheduler(0);		
				break; 
			case (idx == 3019):
				setScheduler(1);		
				break; 				
			case (idx == 3020):
				setScheduler(2);		
				break; 			
			case (idx == 3021):
				setScheduler(3);	
				break; 	
			case (idx == 3022):
				setScheduler(4);					
				break; 
			case (idx == 3023):
				setScheduler(5);			
				break;					
            case (idx == 100):
                window.ShowProperties();
                break;  
            case (idx == 101):
                window.ShowConfigure();
                break;
            case (idx == 102):
                window.Reload();
                break;                				
            default:
				return true;
                break;  				
        }
        _menu = undefined;
		_playbackOrder = undefined;	
        _schedulerMenu = undefined;		
        return true;	
}
function draw_settings_menu(x,y){
        var _menu = window.CreatePopupMenu();
		var _menu3 = window.CreatePopupMenu();	
		var _menu3A = window.CreatePopupMenu();
		var _menu_button = window.CreatePopupMenu();		
		var _menu_slider = window.CreatePopupMenu();			
        var idx;
		
		_menu.AppendMenuItem(MF_STRING, 3014, "Dark theme");
		_menu.CheckMenuItem(3014, properties.darklayout);
		_menu.AppendMenuItem(MF_STRING, 3027, "Compact controls");
		_menu.CheckMenuItem(3027, mini_controlbar.isActive());		
		_menu.AppendMenuItem(MF_STRING, 3015, "Show track name");
		_menu.CheckMenuItem(3015, properties.showTrackInfo);
		_menu.AppendMenuItem(MF_STRING, 3016, "Show now playing artwork");
		_menu.CheckMenuItem(3016, coverpanel_state.isActive());		

		_menu.AppendMenuSeparator();
		
		_menu_button.AppendMenuItem(MF_STRING, 3022, "Repeat");
		_menu_button.CheckMenuItem(3022, properties.displayRepeat);		
		_menu_button.AppendMenuItem(MF_STRING, 3021, "Shuffle");
		_menu_button.CheckMenuItem(3021, properties.displayShuffle);	
		_menu_button.AppendMenuItem(MF_STRING, 3023, "Open");
		_menu_button.CheckMenuItem(3023, properties.displayOpen);			
		_menu_button.AppendMenuItem(MF_STRING, 3020, "Play randomly");
		_menu_button.CheckMenuItem(3020, properties.displayPlayRandom);			
		_menu_button.AppendMenuItem(MF_STRING, 3017, "Equalizer");
		_menu_button.CheckMenuItem(3017, properties.displayEqualizer);	
		_menu_button.AppendMenuItem(MF_STRING, 3018, "Rating");
		_menu_button.CheckMenuItem(3018, properties.displayRating);		
		_menu_button.AppendMenuItem(MF_STRING, 3019, "Scheduler");
		_menu_button.CheckMenuItem(3019, properties.displayScheduler);		
		
		_menu_button.AppendTo(_menu,MF_STRING, "Buttons");	
		
		_menu3.AppendMenuItem(MF_STRING, 200, "Enable");
		_menu3.CheckMenuItem(200, properties.showwallpaper);
		_menu3.AppendMenuItem(MF_STRING, 220, "Blur");
		_menu3.CheckMenuItem(220, properties.wallpaperblurred);
		
		_menu3A.AppendMenuItem(MF_STRING, 221, "Filling");
		_menu3A.CheckMenuItem(221, properties.wallpaperdisplay==0);	
		_menu3A.AppendMenuItem(MF_STRING, 222, "Adjust");
		_menu3A.CheckMenuItem(222, properties.wallpaperdisplay==1);
		_menu3A.AppendMenuItem(MF_STRING, 223, "Stretch");
		_menu3A.CheckMenuItem(223, properties.wallpaperdisplay==2);
		_menu3A.AppendTo(_menu3,MF_STRING, "Wallpaper size");		
		
		_menu3.AppendTo(_menu,MF_STRING, "Background Wallpaper");	

		_menu_slider.AppendMenuItem(MF_STRING, 3024, "Circle");
		_menu_slider.CheckMenuItem(3024, properties.cursor_style==0);		
		_menu_slider.AppendMenuItem(MF_STRING, 3025, "Plain disk");
		_menu_slider.CheckMenuItem(3025, properties.cursor_style==1);
		_menu_slider.AppendMenuItem(MF_STRING, 3026, "Plain disk only on hover");
		_menu_slider.CheckMenuItem(3026, properties.cursor_style==2);
		_menu_slider.AppendTo(_menu,MF_STRING, "Sliders cursor");

		idx = _menu.TrackPopupMenu(x,y,0x0020);
        switch(true) {
			case (idx == 200):
				properties.showwallpaper = !properties.showwallpaper;
				window.SetProperty("_DISPLAY: Show Wallpaper", properties.showwallpaper);
				get_colors();				
				if(properties.showwallpaper) {
					g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.IsPlaying ? fb.GetNowPlaying() : null);
				};
				window.Repaint();
				break;
			case (idx == 210):
				properties.wallpapermode = 99;
				window.SetProperty("_SYSTEM: Wallpaper Mode", properties.wallpapermode);
				if(fb.IsPlaying) g_wallpaperImg = setWallpaperImg(globalglobalProperties.default_wallpaper, fb.GetNowPlaying());
				window.Repaint();
				break;
			case (idx == 211):
				properties.wallpapermode = 0;
				window.SetProperty("_SYSTEM: Wallpaper Mode", properties.wallpapermode);
				if(fb.IsPlaying) g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
				window.Repaint();
				break;
			case (idx == 220):
				properties.wallpaperblurred = !properties.wallpaperblurred;
				window.SetProperty("_DISPLAY: Wallpaper Blurred", properties.wallpaperblurred);
				g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
				window.Repaint();
				break;		
			case (idx == 221):
				properties.wallpaperdisplay = 0;
				window.SetProperty("_DISPLAY: Wallpaper 0=Filling 1=Adjust 2=Stretch", properties.wallpaperdisplay);
				g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
				window.Repaint();
				break;	
			case (idx == 222):
				properties.wallpaperdisplay = 1;
				window.SetProperty("_DISPLAY: Wallpaper 0=Filling 1=Adjust 2=Stretch", properties.wallpaperdisplay);
				g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
				window.Repaint();
				break;		
			case (idx == 223):
				properties.wallpaperdisplay = 2;
				window.SetProperty("_DISPLAY: Wallpaper 0=Filling 1=Adjust 2=Stretch", properties.wallpaperdisplay);
				g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
				window.Repaint();
				break;					 		
            case (idx == 3014):
				if(layout_state.isEqual(0)) {
					properties.maindarklayout=!properties.maindarklayout;
					window.SetProperty("_DISPLAY: Main layout:Dark", properties.maindarklayout); 
					window.NotifyOthers("controls_main_dark_layout", properties.maindarklayout);						
				} else {
					properties.minidarklayout=!properties.minidarklayout;
					window.SetProperty("_DISPLAY: Mini layout:Dark", properties.minidarklayout); 	
					window.NotifyOthers("controls_mini_dark_layout", properties.minidarklayout);					
				}
				get_colors();
				window.Repaint();
                break;
            case (idx == 3015):
				if(layout_state.isEqual(0)){
					showtrackinfo_big.toggleValue();
					properties.showTrackInfo = showtrackinfo_big.isActive();
				} else {
					showtrackinfo_small.toggleValue();
					properties.showTrackInfo = showtrackinfo_small.isActive();
				}
				build_buttons();				
				get_colors();	
				on_size();				
				window.Repaint(); 
                break; 	
            case (idx == 3016):
				coverpanel_state.toggleValue();
                break;			
            case (idx == 3017):
				properties.displayEqualizer = !properties.displayEqualizer;
				window.SetProperty("_DISPLAY equalizer", properties.displayEqualizer);
				build_buttons();
				adapt_display_to_layout();
				on_size();					
				window.Repaint();				
                break;			
            case (idx == 3018):
				properties.displayRating = !properties.displayRating;
				window.SetProperty("_DISPLAY rating", properties.displayRating);
				build_buttons();
				adapt_display_to_layout();
				on_size();					
				window.Repaint();				
                break;		
            case (idx == 3019):
				properties.displayScheduler = !properties.displayScheduler;
				window.SetProperty("_DISPLAY scheduler", properties.displayScheduler);
				build_buttons();
				adapt_display_to_layout();
				on_size();					
				window.Repaint();				
                break;	  
            case (idx == 3020):
				properties.displayPlayRandom = !properties.displayPlayRandom;
				window.SetProperty("_DISPLAY play random btn", properties.displayPlayRandom);
				build_buttons();
				adapt_display_to_layout();
				on_size();					
				window.Repaint();				
                break;	
            case (idx == 3021):
				properties.displayShuffle = !properties.displayShuffle;
				window.SetProperty("_DISPLAY shuffle btn", properties.displayShuffle);
				build_buttons();
				adapt_display_to_layout();
				on_size();					
				window.Repaint();				
                break;			
            case (idx == 3022):
				properties.displayRepeat = !properties.displayRepeat;
				window.SetProperty("_DISPLAY repeat btn", properties.displayRepeat);
				build_buttons();
				adapt_display_to_layout();
				on_size();					
				window.Repaint();				
                break;			
            case (idx == 3023):
				properties.displayOpen = !properties.displayOpen;
				window.SetProperty("_DISPLAY open btn", properties.displayOpen);
				build_buttons();
				adapt_display_to_layout();
				on_size();					
				window.Repaint();				
                break;	
            case (idx == 3024):
				properties.cursor_style = 0;
				window.SetProperty("_DISPLAY slider cursor style", properties.cursor_style);
				build_images();				
				window.Repaint();				
                break;		
            case (idx == 3025):
				properties.cursor_style = 1;
				window.SetProperty("_DISPLAY slider cursor style", properties.cursor_style);	
				build_images();							
				window.Repaint();				
                break;	
            case (idx == 3026):
				properties.cursor_style = 2;
				window.SetProperty("_DISPLAY slider cursor style", properties.cursor_style);	
				build_images();							
				window.Repaint();				
                break;		
            case (idx == 3027):
				mini_controlbar.toggleValue(1);
				build_buttons();
				adapt_display_to_layout();
				on_size();					
				window.Repaint();			
                break;								
            default: 
				return true;
        }
						
        _menu = undefined;
		_menu3 = undefined;
		_menu3A = undefined;	
		_menu_button = undefined;
        return true;	
}
// ===================================================== // Buttons standard function

function SimpleButton(x, y, w, h, text, fonDown, fonUp, fonDbleClick, N_img, H_img, state) {
    this.state = state ? state : ButtonStates.normal;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.hide = false;	
    this.text = text;
    this.fonDown = fonDown;
    this.fonUp = fonUp;		
    this.fonDbleClick = fonDbleClick;
    this.N_img = N_img;
    this.H_img = H_img;   
    this.D_img = H_img; 
    
    this.containXY = function (x, y) {
		if(this.x<0) return (window.Width+this.x <= x) && (x <= window.Width + this.x + this.w) && (this.y <= y) && (y <= this.y + this.h);
        else return (this.x <= x) && (x <= this.x + this.w) && (this.y <= y) && (y <= this.y + this.h);
    }    
    this.changeState = function (state) {
        var old_state = this.state;
        this.state = state;
		if(old_state!=ButtonStates.hover && this.state==ButtonStates.hover) g_cursor.setCursor(IDC_HAND,this.text);	
		else g_cursor.setCursor(IDC_ARROW);					
        return old_state;
    }    
    this.Togglehide = function () {
		this.hide = !this.hide;	
    }   	
    this.draw = function (gr) {
		
		if(this.x<0) var real_x_position = window.Width+this.x;
		else var real_x_position = +this.x;
		
        if (this.state == ButtonStates.hide || this.hide) return;
        b_img=this.N_img;
        if(this.text=="Repeat"){
            if(plman.PlaybackOrder==1){
				this.N_img=repeat_all;
				this.H_img=repeat_all_hover;				
			} else if(plman.PlaybackOrder==2) {
				this.N_img=repeat_track;
				this.H_img=repeat_track_hover;				
			} else {
				this.N_img=repeat_img;
				this.H_img=repeat_img_hover;				
			}	
            this.D_img=this.H_img;                   
        }    
        else if(this.text=="Shuffle"){
            if(plman.PlaybackOrder==3 || plman.PlaybackOrder==4 || plman.PlaybackOrder==5 || plman.PlaybackOrder==6) {
				this.N_img=shuffle_img;           
				this.H_img=shuffle_img_hover; 
			}
            else {
				this.N_img=shuffle_off;
				this.H_img=shuffle_off_hover; 
			}
            this.D_img=this.H_img;         
        } 
        else if(this.text=="Play" && (layout_state.isEqual(0) || showtrackinfo_small.isActive())){
            if(!fb.IsPaused && fb.IsPlaying){
                this.N_img=pause_img;
                this.H_img=pause_img_hover;             
                this.D_img=pause_img_hover; 				
            } else {
                this.N_img=play_img;
                this.H_img=play_img_hover;         
                this.D_img=play_img_hover;     				
            }
        } 		
        else if(this.text=="Play"){
            if(!fb.IsPaused && fb.IsPlaying){
                this.N_img=mini_pause_img;
                this.H_img=mini_pause_img_hover;             
                this.D_img=mini_pause_img_hover; 				
            }else{
                this.N_img=mini_play_img;
                this.H_img=mini_play_img_hover;         
                this.D_img=mini_play_img_hover;     				
            }
        }    
        else if(this.text=="Playmini"){
            if(!fb.IsPaused && fb.IsPlaying){
                this.N_img=mini_pause_img;
                this.H_img=mini_pause_img_hover;             
                this.D_img=mini_pause_img_hover; 				
            }else{
                this.N_img=mini_play_img;
                this.H_img=mini_play_img_hover;         
                this.D_img=mini_play_img_hover;     				
            }
        }		
        else if(this.text=="Volume"){		
			if (volume_vars.gradvolume<=0.1) {
				this.N_img=mute_img;
				this.H_img=mute_img_hover;                 
				this.D_img=mute_img_hover; 				
			} else if (volume_vars.gradvolume<=0.3) {
				this.N_img=volume1_img;
				this.H_img=volume1_img_hover;               
				this.D_img=volume1_img_hover;  					
			} else if (volume_vars.gradvolume<=0.5) {
				this.N_img=volume2_img;
				this.H_img=volume2_img_hover;               
				this.D_img=volume2_img_hover;  					
			} else if (volume_vars.gradvolume<=0.8) {
				this.N_img=volume3_img;
				this.H_img=volume3_img_hover;               
				this.D_img=volume3_img_hover;  										
			} else {
				this.N_img=volume4_img;
				this.H_img=volume4_img_hover;               
				this.D_img=volume4_img_hover;   					
			}		
            
        } 
				
        switch (this.state) {
			case ButtonStates.normal:
				b_img=this.N_img;
				break;
				
			case ButtonStates.hover:
				b_img=this.H_img;
				break;

			case ButtonStates.hoverinactive:
				b_img=this.N_img;
				break;

			case ButtonStates.down:
				b_img=this.D_img;       
				break;
				
			case ButtonStates.hide:
				return;
        }
        switch (this.state) {    
			case ButtonStates.normal:            
				gr.DrawImage(b_img, real_x_position, this.y, this.w, this.h, 0, 0, b_img.Width, b_img.Height,0,255);
				break;
			default:            
				gr.DrawImage(b_img, real_x_position, this.y, this.w, this.h, 0, 0, b_img.Width, b_img.Height,0,255);
				break;            
        }            
    }

    this.onClick = function () {        
        this.fonDown && this.fonDown();
    }
    this.onDbleClick = function () {
		if(this.fonDbleClick) {this.fonDbleClick();}
		else {
			this.fonDown && this.fonDown();
			this.changeState(ButtonStates.down);					
		}	
    }    
    this.onMouse = function (state,x,y) {    
		switch(state){
			case 'lbtn_down':
				this.fonDown && this.fonDown();
			break;				
			case 'lbtn_up':
				this.fonUp && this.fonUp();
				if (this.containXY(x, y) && this.state != ButtonStates.hide && !this.hide) {
					this.changeState(ButtonStates.hover);
				}
			break;
			case 'dble_click':
				if(this.fonDbleClick) {this.fonDbleClick && this.fonDbleClick();}
			break;
		}
        
    }  	
}

function drawAllButtons(gr) {
    for (var i in buttons) {
        buttons[i].draw(gr);
    }
    for (var i in buttons_right) {
        buttons_right[i].draw(gr);
    }
	if(is_over_panel && layout_state.isEqual(1)){
		for (var i in buttons_mini) {
			buttons_mini[i].draw(gr);
		}		
	}
}

function chooseButton(x, y) {
    for (var i in buttons) {
        if (buttons[i].containXY(x, y) && buttons[i].state != ButtonStates.hide && !buttons[i].hide) return buttons[i];
    }
    for (var i in buttons_right) {
        if (buttons_right[i].containXY(x, y) && buttons_right[i].state != ButtonStates.hide && !buttons_right[i].hide) return buttons_right[i];
    }
    for (var i in buttons_mini) {
        if (buttons_mini[i].containXY(x, y) && buttons_mini[i].state != ButtonStates.hide && !buttons_mini[i].hide) return buttons_mini[i];
    }	
    return null;
}

oSlider = function(parentObjectName, min, max) {
    this.parentObjName = parentObjectName;
	this.cursorHeight=0;
    this.buttons = Array(null, null, null);
	this.min = min;
	this.max = max;
    this.draw = function(gr, x, y) {
        // draw cursor
        this.buttons[cScrollBar.ButtonType.cursor].draw(gr, this.x, this.cursorPos, 255);
    }
	this.setSize = function(){
	}
	this.setPos = function(value){
		
	}
	this.setCursor = function(h_vis, h_tot, offset) {
		if(!ww || !wh || wh < 100) {
			return true;
		}		
		
		h_vis = this.get_h_vis();
		h_tot = this.get_h_tot();
		
		if((h_tot > h_vis) && this.w > 2) {
			this.isVisible=true;
			this.cursorWidth = this.w;
			this.cursorWidthNormal = this.wnormal;
			// calc cursor height
			prevCursorHeight = this.cursorHeight
			this.cursorHeight = Math.round((h_vis / h_tot) * this.area_h);
			if(this.cursorHeight < cScrollBar.minHeight) this.cursorHeight = cScrollBar.minHeight;
			// cursor pos
			var ratio = offset / (h_tot - h_vis);
			this.cursorPos = this.area_y + Math.round((this.area_h - this.cursorHeight) * ratio);			
			if (typeof this.buttons[0] === 'undefined' || this.buttons[0] == null || prevCursorHeight!=this.cursorHeight) {
				this.setCursorButton();
			}
		} else if(brw.finishLoading) {
			this.isVisible=false;
			scroll = 0;
		}
	}
    this.setButtons = function() {
        // normal cursor Image
        this.cursorImage_normal = gdi.CreateImage(this.cursorWidth, this.cursorHeight+2);
        var gb = this.cursorImage_normal.GetGraphics();
			gb.FillSolidRect(this.cursorWidth-this.cursorWidthNormal-1, cScrollBar.marginTop-1, this.cursorWidthNormal, this.cursorHeight-cScrollBar.marginTop-cScrollBar.marginBottom+3, scrollbar_cursor_outline);
			gb.FillSolidRect(this.cursorWidth-this.cursorWidthNormal, cScrollBar.marginTop, this.cursorWidthNormal-2, this.cursorHeight-cScrollBar.marginTop-cScrollBar.marginBottom+1, scrollbar_normal_cursor_color);	
        this.cursorImage_normal.ReleaseGraphics(gb);
        
        // hover cursor Image
        this.cursorImage_hover = gdi.CreateImage(this.cursorWidth, this.cursorHeight+2);
        gb = this.cursorImage_hover.GetGraphics();
			gb.FillSolidRect(this.cursorWidth-cScrollBar.hoverWidth-1,0, cScrollBar.hoverWidth+2,this.cursorHeight+2,scrollbar_cursor_outline);		
			gb.FillSolidRect(this.cursorWidth-cScrollBar.hoverWidth,1, cScrollBar.hoverWidth,this.cursorHeight,scrollbar_hover_cursor_color);
        this.cursorImage_hover.ReleaseGraphics(gb);
		
        // down cursor Image
        this.cursorImage_down = gdi.CreateImage(this.cursorWidth, this.cursorHeight+2);
        gb = this.cursorImage_down.GetGraphics();
			gb.FillSolidRect(this.cursorWidth-cScrollBar.downWidth-1,0, cScrollBar.downWidth+2,this.cursorHeight+2,scrollbar_cursor_outline);			
			gb.FillSolidRect(this.cursorWidth-cScrollBar.downWidth,1, cScrollBar.downWidth,this.cursorHeight,scrollbar_down_cursor_color);
        this.cursorImage_down.ReleaseGraphics(gb);
		
        // create/refresh cursor Button in buttons array
        this.buttons[cScrollBar.ButtonType.cursor] = new button(this.cursorImage_normal, this.cursorImage_hover, this.cursorImage_down, "sliderCursor");
    }
    
    this.setSize = function(x, y, whover, h, wnormal) {
		this.x = x;
		this.y = y + (brw.headerBarHeight-g_headerbar.white_space);
		this.w = cScrollBar.activeWidth;
		this.wnormal = wnormal;		
		this.h = h - (brw.headerBarHeight-g_headerbar.white_space);
		// scrollbar area for the cursor (<=> scrollbar height minus up & down buttons height)
		this.area_y = this.y;
		this.area_h = this.h;
        this.setButtons();
    }
	
   
    this.cursorCheck = function(event, x, y) {
				
        this.ishover = (x >= this.x && x <= this.x + this.w && y >= this.cursorPos && y <= (this.cursorPos + this.cursorHeight));
		
		if(!this.buttons[0]) return;
		
        switch(event) {
        case "down":
			this.buttons[0].checkstate(event, x, y);
            if(this.ishover) {
                this.cursorClickX = x;
                this.cursorClickY = y;
                this.cursorDrag = true;
                this.cursorDragDelta = y - this.cursorPos;
				this.cursorPrevY = y;
            }
            break;
        case "up":
			this.buttons[0].checkstate(event, x, y);
            if(this.cursorDrag) {
				if(g_showlist.y<0 && g_showlist.idx>-1) {
					if(((scroll-g_showlist.h)%brw.rowHeight)/brw.rowHeight<0.5)
						scroll = scroll - (scroll-g_showlist.h)%brw.rowHeight;
					else
						scroll = scroll + (brw.rowHeight-(scroll-g_showlist.h)%brw.rowHeight);						
				}
				else  {
					if((scroll%brw.rowHeight)/brw.rowHeight<0.5)
						scroll = scroll - scroll%brw.rowHeight;
					else scroll = scroll + (brw.rowHeight-scroll%brw.rowHeight);
				}
            }
            this.cursorClickX = 0;
            this.cursorClickY = 0;
			this.cursorPrevY = 0;
			this.cursorDragDelta = 0;
            this.cursorDrag = false;
			this.repaint();
            break;			
        case "move":
			
			this.buttons[0].checkstate(event, x, y);
			
            if(this.cursorDrag) {
				scroll += (y - this.cursorPrevY)*((brw.rowsCount/brw.totalRowsVis<1)?1:brw.rowsCount/brw.totalRowsVis);
				scroll = g_scrollbar.check_scroll(scroll);		
				this.setCursor(brw.totalRowsVis*brw.rowHeight, brw.rowHeight*brw.rowsCount, scroll_);
				this.cursorPrevY = y				
            }
            break;
		case "leave":
			this.buttons[0].checkstate(event, x, y);
			break;
		default:
			//
        }
    }

	this.check = function(event, x, y) {
		this.hover = (x >= this.x && x <= this.x + this.w && y > this.area_y && y < this.area_y + this.area_h);

		// check cursor
		this.cursorCheck(event, x, y);
		
		// check other buttons
		var totalButtonToCheck = 1;
		for(var i = 1; i < totalButtonToCheck; i++) {
			switch(event) {
				case "dblclk":
					switch(i) {
						case 1: // up button
							if(this.buttons[i].checkstate(event, x, y) == ButtonStates.hover) {
								brw.buttonclicked = true;
								this.buttons[i].checkstate("down", x, y);
                                on_mouse_wheel(1);
							}
							break;
						case 2: // down button
							if(this.buttons[i].checkstate(event, x, y) == ButtonStates.hover) {
								brw.buttonclicked = true;
								this.buttons[i].checkstate("down", x, y);
                                on_mouse_wheel(-1);
							}
							break;
					}
					break;
				case "down":
					switch(i) {
						case 1: // up button
							if(this.buttons[i].checkstate(event, x, y) == ButtonStates.down) {
								brw.buttonclicked = true;
                                on_mouse_wheel(1);

							}
							break;
						case 2: // down button
							if(this.buttons[i].checkstate(event, x, y) == ButtonStates.down) {
								brw.buttonclicked = true;
                                on_mouse_wheel(-1);

							}
							break;
					}
					break;
				case "up":
					this.buttons[i].checkstate(event, x, y);
					break;
				default:
					this.buttons[i].checkstate(event, x, y);
			}
		}
	}

    this.repaint = function() {
		eval(this.parentObjName+".repaint()");
    }
}
//=================================================// Cover Tools


function on_init(){		
	g_cursor = new oCursor();	
	g_panel = new oPanel();	
	get_font();	
	get_colors();
	get_text();
	g_tooltip = new oTooltip('g_tooltip');
	g_genre_cache = new oGenreCache();	
	g_image_cache = new oImageCache();	
	g_resizing = new Resizing();
	evalTimeDisplayed();
	fb.StopAfterCurrent = false;
	setSchedulerText();
}
on_init();

