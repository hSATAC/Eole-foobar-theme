var found=false;
var imgFolderPath = theme_img_path + "\\graphic_browser\\";
var doubleClick=false;
var now_playing_img1 = gdi.Image(theme_img_path + "\\graphic_browser\\now_playing_track1.png");
var now_playing_img0 = gdi.Image(theme_img_path + "\\graphic_browser\\now_playing_track0.png");
var now_playing_progress1 = gdi.Image(theme_img_path + "\\graphic_browser\\now_playing_progress1.png");
var now_playing_progress0 = gdi.Image(theme_img_path + "\\graphic_browser\\now_playing_progress0.png");
var FocusOnNowPlaying=false;
var Update_Required_function="";
var randomStartTime = 0;

var g_showlist = null;

var g_genre_cache = null;
var g_seconds = 0;

var g_avoid_on_playlists_changed = false;
var g_avoid_on_playlist_switch = false;
var g_avoid_on_mouse_leave=false;
var g_avoid_history = false;
var g_avoid_on_items_added=false;
var g_avoid_on_items_removed=false;
var g_avoid_settings_button = false;
var g_rating_updated = false;
var g_avoid_on_metadb_changed = false;
var repaintforced = false;
var isScrolling = false;
var update_size = true;
var first_on_size = true;
var brw_populate_callID = 0;
var brw_populate_force_sorting = false;
var brw_populate_keep_showlist = false;
var ww = 0, wh = 0;
var drag_x = 0, drag_y = 0;
var g_dragndrop_x, g_dragndrop_y = 0;
var cur_btn = cur_btn_down = btn_down = false;
var g_ishover = false;
var brw = null;
var g_scrollbar = null;
var repaint_main = true,repaint_main1 = true,repaint_main2 = true;
var scroll_ = 0, scroll = 0;
var g_end = 0;
var g_last = 0;
var rowSelection = null;
var g_dragA = false, g_dragR = false, g_dragC = false;
var g_dragA_idx = -1;
// playlist panel variables
var g_drag_timer = false;
var g_dragup_timer = false;
var g_dragup_flash = false;
var g_dragup_flashescounter = 0;
var g_flash_idx = -1;
var gTime_covers = null;
var g_image_cache = false;

// wallpaper infos
var g_wallpaperImg = null;
var update_wallpaper = false;
var update_headerbar = false;
var g_hiddenLoadTimer = false;
var LibraryItems_counter = 0;
var WshShell = new ActiveXObject("WScript.Shell")
var paint_scrollbar = true;
var get_albums_timer = [];
var cover_load_timer = [];
var populate_covers_timer = [];
var playing_track_playcount = 0;

var g_plmanager;

var covers_loading_progress = 101;
var prev_covers_loading_progress = 101;
var gradient_w = 30;
var gradient_m = 14;
var track_gradient_size = 13;
var x_previous_lbtn_up=0;
var y_previous_lbtn_up=0;
var already_saved=false;

//=================================================// Properties
var properties = {
	panelName: 'WSHgraphicbrowser',		
    thumbnailWidthMin: window.GetProperty("COVER Width Minimal", 50),
    thumbnailWidth: window.GetProperty("COVER Width", 100),	
	showCoverResizer: window.GetProperty("_DISPLAY: Cover resizer", true),
	showCoverShadow: window.GetProperty("COVER show shadow", false),
    default_CoverShadowOpacity: window.GetProperty("COVER Shadow Opacity", 0),		
    showdateOverCover: window.GetProperty("COVER Show Date over album art", false),	
    showDiscNbOverCover: window.GetProperty("COVER Show Disc number over album art", false),	
    leftFilterState: window.GetProperty("MAINPANEL Left filter state", "genre"),	
	circleMode: window.GetProperty("COVER Circle artwork", false),	
	centerText: window.GetProperty("COVER Center text", true),	
	animateShowNowPlaying: window.GetProperty("COVER animate on show now playing", false),		
    DragToPlaylist: window.GetProperty("MAINPANEL Enable dragging to a playlist", true), 	
    showscrollbar: window.GetProperty("MAINPANEL Scrollbar - Visible", true),
    showheaderbar: window.GetProperty("MAINPANEL Show Header Bar", true),	
    showFilterBox_filter_active: window.GetProperty("MAINPANEL Show filter box (filter active)", false),		
    showFilterBox_filter_inactive: window.GetProperty("MAINPANEL Show filter box (filter inactive)", false),	
    followNowPlaying: window.GetProperty("TRACKLIST Always Follow Now Playing", true),
    refreshRate: window.GetProperty("MAINPANEL Repaint rate", 35),
    expandInPlace: window.GetProperty("TRACKLIST Expand in place", true), 
    expandOnHover: window.GetProperty("TRACKLIST Expand on hover", true), 	
    showListColoredOneColor: window.GetProperty("TRACKLIST Color according to albumart (main color)", false),
    showListColoredBlurred: window.GetProperty("TRACKLIST Color according to albumart (blurred)", false),	
    showListColoredMixedColor: window.GetProperty("TRACKLIST Color according to albumart (mix of both)", false),		
    drawProgressBar: window.GetProperty("TRACKLIST Draw a progress bar under song title", true),	
    AlbumArtProgressbar: window.GetProperty("TRACKLIST Blurred album art progress bar", false),		
    showPlaycount: window.GetProperty("TRACKLIST Show playcount", true),
    showBitrate: window.GetProperty("TRACKLIST Show bitrate", false),
    showCodec: window.GetProperty("TRACKLIST Show codec", false),
    showArtistName: window.GetProperty("TRACKLIST Show artist name", false),
    showRating: window.GetProperty("TRACKLIST Show rating in Track Row", false),
    showRatingSelected: window.GetProperty("TRACKLIST Show rating in Selected Track Row", false),	
    showRatingRated: window.GetProperty("TRACKLIST Show rating in Rated Track Row", false),		
	showlistShowCover: window.GetProperty("TRACKLIST Show cover", true),		
    SortBy: window.GetProperty("MAINPANEL Sort albums by", "standard"),		
    SortDescending: window.GetProperty("MAINPANEL sort descending", false),	
    SingleMultiDisc: window.GetProperty("_SYSTEM: Display one thumbnail for multi discs", false),	
    TFgrouping: window.GetProperty("MAINPANEL Library Group TitleFormat", ""),
    TFgrouping_default_filterbox: "%album artist% ^^ %album%[' - Disc '%discnumber%] ^^ %genre% ^^ %date% ^^ %title%",	
    TFgrouping_default: "%album artist% ^^ %album%[' - Disc '%discnumber%]",	
    TFgrouping_singlemultidisc_filterbox: "%album artist% ^^ %album% ^^ %genre% ^^ %date% ^^ %title%",	
    TFgrouping_singlemultidisc: "%album artist% ^^ %album%",		
    TFgrouping_populate: "%album artist% ^^ %album%",			
    TFsorting: "",	
    TFsorting_default: window.GetProperty("MAINPANEL Library Default Sort TitleFormat", ""),		
    TFtitle: "%artist% ^^ [%discnumber%.] ^^ $if(%tracknumber%,%tracknumber%,'0') ^^ %title% ^^ $if2(%rating%,0) ^^ $if(%length%,%length_seconds%,'ON AIR')",	
    TFbitrate: "$if2(%bitrate% kbit,'')",	
    TFcodec: "$if2(%codec%,'')",	
    TFplaycount: "$if2(%play_counter%,$if2(%play_count%,0))",			
    TFshowlist: "%album artist% ^^ %album% ^^ [' - Disc '%discnumber%] ^^ %date% ^^ %genre%",
	TFshowlistReduced: "[%discnumber%]",
    TFgroupinfos: "%genre% ^^ %date% ^^ %discnumber%",	
    tf_crc_artist: fb.TitleFormat("$crc32('artists'$meta(artist,0))"),	
    smooth_scroll_value: window.GetProperty("MAINPANEL Smooth Scroll value (0 to disable)", 0.5),
    smooth_expand_value: window.GetProperty("TRACKLIST Smooth Expand value (0 to disable)", 0.3),
	smooth_expand_default_value:0.3,
    globalFontAdjustement: window.GetProperty("MAINPANEL: Global Font Adjustement", 0),
	panelFontAdjustement: -1,
    enableDiskCache: window.GetProperty("COVER Disk Cache", true),
	deleteSpecificImageCache : window.GetProperty("COVER cachekey of covers to delete on next startup", ""),	
	darklayout: window.GetProperty("_DISPLAY: Dark layout", false),	
	showwallpaper: window.GetProperty("_DISPLAY: Show Wallpaper", false),	
    wallpaperblurred: window.GetProperty("_DISPLAY: Wallpaper Blurred", true),
	displayToggleBtns: window.GetProperty("_DISPLAY: Toggle buttons", true),		
    wallpaperblurvalue: window.GetProperty("_DISPLAY: Wallpaper Blur Value", 1.05),
    wallpapermode: window.GetProperty("_SYSTEM: Wallpaper Mode", 0),
    wallpaperdisplay: window.GetProperty("_DISPLAY: Wallpaper 0=Filling 1=Adjust 2=Stretch", 0),			
	show_covers_progress: window.GetProperty("COVER Show loading progress", true),
	showToolTip: window.GetProperty("MAINPANEL Show tooltips", true),
    lockOnPlaylistNamed: window.GetProperty("MAINPANEL lock on specific playlist name", ""),	
    lockOnFullLibrary: window.GetProperty("MAINPANEL Always display full library", false),		
    followActivePlaylist: window.GetProperty("MAINPANEL Follow active playlist", true),  
	enableAutoSwitchPlaylistMode: window.GetProperty("MAINPANEL Automatically change displayed playlist", false),
	showTotalTime: window.GetProperty("_DISPLAY: Total time", true),
	fullPlaylistHistory:false,	
	marginLR: 12,	
	showlistWidthMax:1300,	
	CoverHoverExtendRect:2,		
	showlistRowWidthMin:100,
	showlistRowWidthMax:800,	
	showlistMaxColumns: 0,	
	showlistScrollbar: true,	
	showlistheightMin:147,
	showlistheightMinCover:147,
	showlistCoverMaxSize:232,
	showlistCoverMinSize:132,	
	showlistCoverMargin:28,	
	load_image_from_cache_direct:true,
	veryTighCoverActiveZone : true,	
}
properties.smooth_scroll_value = properties.smooth_scroll_value < 0 ? 0 : properties.smooth_scroll_value > 0.9 ? 0.9 : properties.smooth_scroll_value;
properties.smooth_expand_value = properties.smooth_expand_value < 0 ? 0 : properties.smooth_expand_value > 0.9 ? 0.9 : properties.smooth_expand_value;
if(libraryfilter_state.isActive()){
	properties.showFilterBox = properties.showFilterBox_filter_active;
} else {
	properties.showFilterBox = properties.showFilterBox_filter_inactive;
}	
var TF = {
	grouping: fb.TitleFormat(properties.TFgrouping),
	grouping_default_filterbox: fb.TitleFormat(properties.TFgrouping_default_filterbox),		
	grouping_default : fb.TitleFormat(properties.TFgrouping_default),		
	grouping_singlemultidisc_filterbox : fb.TitleFormat(properties.TFgrouping_singlemultidisc_filterbox),	
	grouping_singlemultidisc : fb.TitleFormat(properties.TFgrouping_singlemultidisc),		
	grouping_populate : fb.TitleFormat(properties.TFgrouping_populate),		
	groupinfos: fb.TitleFormat(properties.TFgroupinfos+" ^^ "+globalProperties.crc),			
	albumartist: fb.TitleFormat("%album artist%"),	
	album: fb.TitleFormat("%album%"),
	genre: fb.TitleFormat("%genre%"),
	date: fb.TitleFormat("%date%"),
	play_count: fb.TitleFormat("%play_count%"),
	title: fb.TitleFormat(properties.TFtitle),
	titleC: fb.TitleFormat(properties.TFtitle+' ^^ '+properties.TFcodec),
	titleB: fb.TitleFormat(properties.TFtitle+' ^^ '+properties.TFbitrate),
	titleP: fb.TitleFormat(properties.TFtitle+' ^^ '+properties.TFplaycount),
	titleCB: fb.TitleFormat(properties.TFtitle+' ^^ '+properties.TFcodec+' - '+properties.TFbitrate),
	titlePC: fb.TitleFormat(properties.TFtitle+' ^^ '+properties.TFplaycount+' - '+properties.TFcodec),
	titlePB: fb.TitleFormat(properties.TFtitle+' ^^ '+properties.TFplaycount+' - '+properties.TFbitrate),
	titlePCB: fb.TitleFormat(properties.TFtitle+' ^^ '+properties.TFplaycount+' - '+properties.TFcodec+' - '+properties.TFbitrate),	
	showlist: fb.TitleFormat(properties.TFshowlistReduced),	
	showlistReduced: fb.TitleFormat(properties.TFshowlistReduced),
	playback_time_seconds: fb.TitleFormat("%playback_time_seconds%"),
	meta_changed: fb.TitleFormat("$if2(%album artist%,'Unknown artist(s)') ^^ $if2(%album%,'Single(s)')")
}

black_images = {
	filter_off_icon : gdi.Image(theme_img_path + "\\icons\\library_filter_off.png"),   
	filter_off_hover_icon : gdi.Image(theme_img_path + "\\icons\\library_filter_off_hover.png"),  
	filter_on_icon : gdi.Image(theme_img_path + "\\icons\\library_filter_on.png"),
	filter_on_hover_icon : gdi.Image(theme_img_path + "\\icons\\library_filter_on_hover.png"),
	nowplaying_off_icon : gdi.Image(theme_img_path + "\\icons\\nowplaying_off.png"),
	nowplaying_off_hover_icon : gdi.Image(theme_img_path + "\\icons\\nowplaying_off_hover.png"),  
	nowplaying_on_icon : gdi.Image(theme_img_path + "\\icons\\nowplaying_on.png"),
	nowplaying_on_hover_icon : gdi.Image(theme_img_path + "\\icons\\nowplaying_on_hover.png"),	
} 
white_images = {
	filter_off_icon : gdi.Image(theme_img_path + "\\icons\\white\\library_filter_off.png"),   
	filter_off_hover_icon : gdi.Image(theme_img_path + "\\icons\\white\\library_filter_off_hover.png"),  
	filter_on_icon : gdi.Image(theme_img_path + "\\icons\\white\\library_filter_on.png"),
	filter_on_hover_icon : gdi.Image(theme_img_path + "\\icons\\white\\library_filter_on_hover.png"),
	nowplaying_off_icon : gdi.Image(theme_img_path + "\\icons\\white\\nowplaying_off.png"),
	nowplaying_off_hover_icon : gdi.Image(theme_img_path + "\\icons\\white\\nowplaying_off_hover.png"),  
	nowplaying_on_icon : gdi.Image(theme_img_path + "\\icons\\white\\nowplaying_on.png"),
	nowplaying_on_hover_icon : gdi.Image(theme_img_path + "\\icons\\white\\nowplaying_on_hover.png"),
}  

cFilterBox = {
    x: 50,
    y: 0,
    w: 340,
    h: 40,
	paddingInboxCursor: 7
};
timers = {
    coverLoad: false,
    coverDone: false,
    saveCover: false,
	delayForDoubleClick: false,
	showItem: false,
	updateHeaderText: false,
	CreateFolder: false,
	seekTrack: false,
	returnGenre: false,
	gScrollPlaylist: false,
	avoidCallbacks: false,
	firstPopulate: false,
	afterDoubleClick: false,
	showToolTip: false,
	ratingUpdate: false,
	generic: false,
	avoidShowNowPlaying : false,
};
cNowPlaying = {
    flashEnable: false,
    flashescounter: 0,
    flash: false,
    flashCover: false,	
	flashescountermax:40
}
if(globalProperties.deleteDiskCache) {
	delete_full_cache();
}
if(properties.deleteSpecificImageCache!="") {
	crc_array = properties.deleteSpecificImageCache.split("|");
	for(var i = 0; i < crc_array.length; i++) {
		delete_file_cache(null, -1, crc_array[i],true);
	}
	properties.deleteSpecificImageCache = "";
	window.SetProperty("COVER cachekey of covers to delete on next startup", "");		
}
var cover = {
    margin: 0,
    max_w: 0,
    type: 0,
    image_cache_max_width: 350,	
    load_img: gdi.Image(imgFolderPath+"load.png"),
    extend_img: gdi.Image(imgFolderPath+"cover_extend2.png"),
    retract_img: gdi.Image(imgFolderPath+"cover_retract2.png"),	
    btn_play: gdi.Image(imgFolderPath+"btn_play.png"),	
    nocover_img: gdi.Image(theme_img_path+"\\no_cover.png"),	
    stream_img: gdi.Image(theme_img_path+"\\stream_icon.png"),
	marginSide:5,
	marginBottom:30,
    masks: window.GetProperty("COVER album art masks (for disk cache)","*front*.*;*cover*.*;*folder*.*;*.*"),	
};
var cover_path = new RegExp("(artwork)|(cover)|(scan)|(image)");
var cover_img = cover.masks.split(";");  
var avoidShowNowPlaying = false;
// ---------------------------------------------------------------------- // Objects
var g_filterbox = null;

oPlaylistHistory = function() {
	this.history = Array();
	this.trace = function() {	
		for(i = 1; i < this.history.length; i++) {
			console.log('history '+i+':'+plman.getPlaylistName(this.history[i]));
		}
	}
	this.saveCurrent = function() {
		if(g_avoid_history){
			g_avoid_history = false;
			return;
		}
		if(properties.fullPlaylistHistory){
			if(!(plman.getPlaylistName(this.history[this.history.length-1]) == globalProperties.playing_playlist && plman.getPlaylistName(brw.SourcePlaylistIdx)==globalProperties.playing_playlist)){
				this.history.push(brw.SourcePlaylistIdx);
			}
		} else if(this.history[this.history.length-1] != brw.SourcePlaylistIdx){
			this.history.push(brw.SourcePlaylistIdx);
		}
	}
	this.getLastElem = function(){
		this.history.pop();
		return this.history[this.history.length-1];
	}
	this.restoreLastElem = function(){	
		g_avoid_history = true;
		var previous_playlist = this.getLastElem();					
		if (previous_playlist !== undefined){
			if(properties.fullPlaylistHistory) {
				if(previous_playlist == brw.SourcePlaylistIdx && brw.SourcePlaylistIdx!=plman.PlayingPlaylist){
					fb.RunMainMenuCommand('Edit/Undo');
				} else plman.ActivePlaylist = previous_playlist;
			} else plman.ActivePlaylist = previous_playlist;
		} else {
			var whole_library_index = brw.getWholeLibraryPlaylist();
			plman.ActivePlaylist = whole_library_index;				
		}
		g_avoid_settings_button = true;
		if(window.IsVisible && !timers.generic){
			timers.generic = setTimeout(function(){
				g_avoid_settings_button = false;
				clearTimeout(timers.generic);
				timers.generic=false;
			}, 200); 
		}		
	}			
	this.fullLibrary = function(){	
		var whole_library_index = brw.getWholeLibraryPlaylist();
		g_avoid_on_playlist_switch = false;
		plman.ActivePlaylist = whole_library_index;	
		g_avoid_settings_button = true;
		if(window.IsVisible && !timers.generic){
			timers.generic = setTimeout(function(){
				g_avoid_settings_button = false;
				clearTimeout(timers.generic);
				timers.generic=false;
			}, 200); 
		}
		if(!brw.followActivePlaylist) brw.populate(45,false,false,whole_library_index);
	}
	this.reset = function() {
		this.history = Array();
	}
}
oFilterBox = function() {
	// inputbox variables
	var g_timer_cursor = false;
	var g_cursor_state = true;
	this.w = 0;
	this.h = 0;	
	this.paddingLeft = 30;	
	this.paddingTop = 2;
	this.paddingBottom = 2;
	
	this.images = {
		search_icon: null,
        resetIcon_off: null,
        resetIcon_ov: null
	}
    
	this.getImages = function() {
		var gb;
		
        var w = 18;
		
		if(properties.darklayout) icon_theme_subfolder = "\\white";
		else icon_theme_subfolder = "";				
		
		this.images.search_icon = gdi.Image(theme_img_path + "\\icons"+icon_theme_subfolder+"\\search_icon.png");		
		this.search_bt = new button(this.images.search_icon, this.images.search_icon, this.images.search_icon,"search_bt");
		
        this.images.resetIcon_off = gdi.CreateImage(w, w);
        gb = this.images.resetIcon_off.GetGraphics();
            gb.SetSmoothingMode(2);
            gb.DrawLine(5, 5, w-5, w-5, 1.0, colors.normal_txt);
            gb.DrawLine(5, w-5, w-5, 5, 1.0, colors.normal_txt);
            gb.SetSmoothingMode(0);
        this.images.resetIcon_off.ReleaseGraphics(gb);

        this.images.resetIcon_ov = gdi.CreateImage(w, w);
        gb = this.images.resetIcon_ov.GetGraphics();
            gb.SetSmoothingMode(2);
            gb.DrawLine(4, 4, w-4, w-4, 1.0, colors.normal_txt);
            gb.DrawLine(4, w-4, w-4, 4, 1.0, colors.normal_txt);
            gb.SetSmoothingMode(0);
        this.images.resetIcon_ov.ReleaseGraphics(gb);

        this.images.resetIcon_dn = gdi.CreateImage(w, w);
        gb = this.images.resetIcon_dn.GetGraphics();
            gb.SetSmoothingMode(2);
            gb.DrawLine(4, 4, w-4, w-4, 1.0, colors.reseticon_down);
            gb.DrawLine(4, w-4, w-4, 4, 1.0, colors.reseticon_down);
            gb.SetSmoothingMode(0);
        this.images.resetIcon_dn.ReleaseGraphics(gb);
                
        if(typeof(this.reset_bt) == "undefined") {
            this.reset_bt = new button(this.images.resetIcon_off, this.images.resetIcon_ov, this.images.resetIcon_dn,"reset_bt");
        } else {
            this.reset_bt.img[0] = this.images.resetIcon_off;
            this.reset_bt.img[1] = this.images.resetIcon_ov;
            this.reset_bt.img[2] = this.images.resetIcon_dn;
        }
	}
 
	this.on_init = function() {
		this.inputbox = new oInputbox(cFilterBox.w, cFilterBox.h, "", "Filter groups below ...", colors.normal_txt, 0, 0, colors.selected_bg, g_sendResponse, "brw", g_fsize+1+properties.globalFontAdjustement, g_font.italicplus2);
        this.inputbox.autovalidation = true;
		this.inputbox.visible = true;
		this.getImages();
    }
	this.on_init();
    
	this.draw = function(gr, x , y) {
		this.x = x;
		this.y = y;		
        //gr.FillSolidRect(this.x, this.y, this.w, this.h, RGB(255,255,255));
        //gr.FillSolidRect(this.x-2, this.y, this.w+2, 20, blendColors(brw.bgColor, brw.fgColor, 0.2));
        /*if(this.inputbox.edit) {
            gr.DrawRect(this.x, this.y, this.w, this.h, 1.0, GetGrey(0));
        } else {
            gr.DrawRect(this.x, this.y, this.w, this.h, 1.0, colors.border);
        }*/
		if(brw.playlistName != globalProperties.whole_library && !libraryfilter_state.isActive()) {
			this.btn_left_margin = 0;
		} else {
			this.btn_left_margin = -7;			
		}		
        if(this.inputbox.text.length > 0) {
            this.reset_bt.draw(gr, this.x+2+this.btn_left_margin, this.y+10, 255);
        } else {
			this.search_bt.draw(gr, this.x+this.btn_left_margin, this.y+Math.round(this.h/2-this.images.search_icon.Height/2)-1, 255);			
			//gr.DrawImage(this.images.search_icon, this.x+this.btn_left_margin, this.y+Math.round(this.h/2-this.images.search_icon.Height/2), this.images.search_icon.Width, this.images.search_icon.Height, 0, 0, this.images.search_icon.Width, this.images.search_icon.Height, 0, 255);
		}
        //gr.DrawImage(this.images.search_icon, this.x+1, this.y+2, 16, 16, 0, 0, 16, 16, 0, 255);
		this.inputbox.draw(gr, this.x+this.paddingLeft+this.btn_left_margin, this.y+this.paddingTop, 0, 0);
       // if(this.inputbox.text.length > 0) this.reset_bt.draw(gr, this.x+this.inputbox.w+3+20, this.y+1, 255);
    }
    this.clearInputbox = function(){
		if(this.inputbox.text.length > 0) {
			this.inputbox.text = "";
			this.inputbox.offset = 0;
			g_sendResponse();	
		}
		this.inputbox.check("down", -1, -1);
	}
    this.setSize = function(w, h, font_size) {
		this.w = w;
		this.h = h;
		this.inputbox.paddingVertical = cFilterBox.paddingInboxCursor;
        this.inputbox.setSize(w-this.paddingLeft, h-this.paddingTop-this.paddingBottom, font_size);
    };
    this.on_mouse = function(event, x, y, delta) {
        switch(event) {
            case "lbtn_down":
				var force_activate = (x>this.x && x<this.x+this.w && y>this.y && y<this.y+this.h);
				this.inputbox.check("down", x, y, force_activate);
                if(this.inputbox.text.length > 0) this.reset_bt.checkstate("down", x, y);
				else this.search_bt.checkstate("down", x, y);				
                break;
            case "lbtn_up":
				if(this.reset_bt.checkstate("up", x, y) == ButtonStates.hover && this.inputbox.text.length > 0) {
					this.clearInputbox();
                } 
				this.search_bt.checkstate("up", x, y)
				/*if(this.search_bt.checkstate("up", x, y) == ButtonStates.hover && !this.inputbox.drag) {
					this.inputbox.activate(x,y);
					this.inputbox.repaint();				
				}*/
				this.inputbox.check("up", x, y);				
                break;
            case "lbtn_dblclk":
				this.inputbox.check("dblclk", x, y);
                break;
            case "rbtn_down":
				this.inputbox.check("right", x, y);
                break;
            case "move":
				this.inputbox.check("move", x, y);
				this.search_bt.checkstate("move", x, y);				
                if(this.inputbox.text.length > 0) this.reset_bt.checkstate("move", x, y);
                break;
        }
    }
    
    this.on_key = function(event, vkey) {
        switch(event) {
            case "down":
				this.inputbox.on_key_down(vkey);
                break;
        }
    }
    
    this.on_char = function(code) {
        this.inputbox.on_char(code);
    }
    
	this.on_focus = function(is_focused) {
		this.inputbox.on_focus(is_focused);
	}
	this.search = function(string) {
		str = process_string(string);
		brw.groups_draw.splice(0, brw.groups_draw.length);
		var back_s = -1.5;
		//var row_count = brw.totalColumns;
		var row_count = brw.totalRows;
		for(var i in brw.groups){
			for(var j in brw.groups[i].tr){
				if(match(brw.groups[i].tr[j], str) || string.length == 0){
					back_s = brw.groups_draw.length;
					brw.groups_draw.push(i);
					(brw.groups[i].i - back_s > row_count)?(brw.groups[i].i = back_s + row_count):0;
					(brw.groups[i].i - back_s < -row_count)?(brw.groups[i].i = back_s - row_count):0;
					break;
				}
				else
					brw.groups[i].i = (back_s - i < row_count)?(back_s + 0.5):i-row_count;
			}
		}
		scroll && (scroll_ = brw.rowHeight*2);
		scroll = 0;
		
		brw.rowsCount = Math.ceil(brw.groups_draw.length / brw.totalColumns);
		g_scrollbar.setCursor(brw.totalRowsVis*brw.rowHeight, brw.rowHeight*brw.rowsCount + g_showlist.h, scroll_);
		brw.repaint();
	}	
}

function g_sendResponse() {
    g_hiddenLoadTimer && clearTimeout(g_hiddenLoadTimer);
    g_hiddenLoadTimer = false;

	if(g_filterbox.inputbox.text.length == 0) {
        filter_text = "";
    } else {
	    filter_text = g_filterbox.inputbox.text;
    }
	g_showlist.close();
    g_filterbox.search(filter_text);
}

function oTimers() {
    var timer_arr = ["populate"];
    for (var i = 0; i < timer_arr.length; i++) this[timer_arr[i]] = false;
    this.reset = function(timer, n) {
        if (timer) clearTimeout(timer);
        this[timer_arr[n]] = false;
    }
    this.brw_populate = function(callID, force_sorting,keep_showlist) {
		brw_populate_callID = callID;
		brw_populate_force_sorting = force_sorting;
		brw_populate_keep_showlist = keep_showlist;
        this.reset(this.populate, 0);
        this.populate = setTimeout(function() {
            brw.populate(brw_populate_callID, brw_populate_force_sorting, brw_populate_keep_showlist);
			brw_populate_callID = '';
            timer.reset(timer.populate, 6);
        }, 500);
    }
}

oPlaylistManager = function (parentObjName) {
    this.parentObjName = parentObjName;
    this.isOpened = false;
    this.delta = 0;
    this.x = 0;
    this.y = 5;
    this.h = wh;
    this.w = 250;
    this.headerHeight = 50;
    this.side = "right";
    this.scrollStep = 50;
    this.playlists = Array();
    this.scrollOffset = 0;
    this.totalPlaylistsVis = 0;
    this.rowHeight = g_fsize*3;
	this.refresh_required = false;
    this.setPlaylistList = function() {
        this.totalPlaylists = plman.PlaylistCount;
        this.playlists.splice(0, this.playlists.length);
        this.totalPlaylistsVis = 0;
        for(var i = 0; i < this.totalPlaylists; i++) {
			this.playlists.push(new oPlaylistItem(i, plman.GetPlaylistName(i), "g_plmanager"));
            this.playlists[i].setSize(this.x, 0, this.w, g_fsize*3);		
        }
        this.totalVisibleRows = Math.floor((wh - this.headerHeight) / this.rowHeight);				
    }
    this.close = function(){
		this.isOpened = false;		
	}
    this.draw = function(gr) {
		
		if(this.refresh_required) this.setPlaylistList();	
		
        if(this.side=="right") {
            this.x = ww - this.delta;
        } else {
            this.x = 0 - this.w + this.delta;
        }
        this.h = wh
		
		gr.FillSolidRect(brw.x, 0, brw.w, wh, colors.pm_overlay);
        gr.FillSolidRect(this.x, 0, this.w, this.h, colors.pm_bg);

        if(this.side=="right") {
            gr.DrawLine(this.x, 0, this.x-0, this.y + this.h, 1.0, colors.pm_border);
        } else {
            gr.DrawLine(this.x+this.w, 0, this.x+0+this.w, this.y + this.h, 1.0, colors.pm_border);
        }
		//gr.FillGradRect(this.x, 0, this.w, colors.fading_bottom_height-30, 90,colors.pm_bgtopstart,  colors.pm_bgtopend,1);

        gr.DrawLine(this.x+20, this.y + this.headerHeight-6, this.x+this.w-25, this.y+this.headerHeight-6, 1.0, colors.pm_item_separator_line);		
		
		if(this.ishoverHeader)
			gr.GdiDrawText("Create New Playlist", g_font.normal, colors.normal_txt, this.x+20, this.y+17, this.w-20, this.headerHeight, DT_VCENTER | DT_NOPREFIX);
		else
			gr.GdiDrawText("Send to ...", g_font.italicplus1, colors.normal_txt, this.x+20, this.y+17, this.w-20, this.headerHeight, DT_VCENTER | DT_NOPREFIX);
		
        // if drag over playlist header => add items to a new playlist
         if((g_dragA || g_dragR) && this.ishoverHeader) {
			gr.FillSolidRect(this.x+1, this.y+6, this.w-2, g_fsize*3, colors.pm_hover_row_bg);
        } else if(g_dragup_flash && g_flash_idx == -99) {
           gr.FillSolidRect(this.x+1, this.y, this.w-2, g_fsize*3, colors.pm_hover_row_bg);
        } 
        // draw playlists items (rows)
        var count = 0;
        for(var i = 0; i < this.totalPlaylists; i++) {
            if(this.playlists[i].type==2) {
                this.playlists[i].draw(gr, count);
                count++;
            }
        }
    }

    this.checkstate = function(event, x, y, delta) {

        this.ishover = (x > this.x && x < this.x + this.w && y >= this.y && y < this.y + this.h);
        this.ishoverHeader = (x > this.x && x < this.x + this.w && y >= this.y && y < this.y + this.headerHeight);
        
        switch (event) {
        case "up":
            if(this.ishoverHeader) {
                if(g_dragA) {
                    g_drag_timer = false;
                    g_dragup_flashescounter = 0;
                    g_dragup_timer = true;
                    g_flash_idx = -99;
                    // add dragged tracks to the target playlist
                    var new_pl_idx = plman.PlaylistCount;
                    plman.CreatePlaylist(new_pl_idx, "");
                    plman.InsertPlaylistItems(new_pl_idx, 0, brw.groups[g_dragA_idx].pl, false);
                    g_dragA = false;
                    g_dragA_idx = -1;
					this.setPlaylistList();
                }
                if(g_dragR) {
                    g_drag_timer = false;
                    g_dragup_flashescounter = 0;
                    g_dragup_timer = true;
                    g_flash_idx = -99;
                    // add dragged tracks to the target playlist
                    var new_pl_idx = plman.PlaylistCount;
                    plman.CreatePlaylist(new_pl_idx, "");
                    plman.InsertPlaylistItems(new_pl_idx, 0, plman.GetPlaylistSelectedItems(brw.getSourcePlaylist()), false);
                    g_dragR = false;
                    g_dragR_metadb = null;
					this.setPlaylistList();
                }
            }
			return this.ishoverHeader;
            break;
		case "wheel":
			var scroll_prev = this.scrollOffset;;
			this.scrollOffset -= delta;		
			if(this.scrollOffset > this.totalPlaylistsVis - this.totalVisibleRows) this.scrollOffset = this.totalPlaylistsVis - this.totalVisibleRows;
			if(this.scrollOffset < 0) this.scrollOffset = 0;			
			if(this.scrollOffset != scroll_prev) {
				this.checkstate("move", g_cursor.x, g_cursor.y);
				brw.repaint();
			};
			break;			
        case "move":
            if(this.ishover) {
                var area_h = this.h - this.headerHeight;
                if(y > (this.y + this.headerHeight + area_h - this.rowHeight) && (this.totalPlaylistsVis - this.scrollOffset) * this.rowHeight > area_h) {
                    if(!timers.gScrollPlaylist) {
                        timers.gScrollPlaylist = setTimeout(function(){
                            if(properties.DragToPlaylist) g_plmanager.scrollOffset++;
                            clearTimeout(timers.gScrollPlaylist);
                            timers.gScrollPlaylist = false;
							brw.repaint();
                            if(properties.DragToPlaylist) g_plmanager.checkstate("move", g_cursor.x, g_cursor.y);
                        },50);
                    }
                } else if(y < this.y + this.headerHeight + 10 && this.scrollOffset > 0) {
                    if(!timers.gScrollPlaylist) {
                        timers.gScrollPlaylist = setTimeout(function(){
                            if(properties.DragToPlaylist) g_plmanager.scrollOffset--;
                            clearTimeout(timers.gScrollPlaylist);
                            timers.gScrollPlaylist = false;
							brw.repaint();
                            if(properties.DragToPlaylist) g_plmanager.checkstate("move", g_cursor.x, g_cursor.y);
                        },50);
                    }  
                } else {
                    clearTimeout(timers.gScrollPlaylist);
                    timers.gScrollPlaylist = false;
                }
            }
            break;
            
        case "leave":

            break;
        };
    };
}

oPlaylistItem = function (id, name, parentObjName) {
    this.parentObjName = parentObjName;
    this.id = id;
    this.name = name;
    this.x = 0;
    this.y = 0;
    this.w = 260;
    this.h = g_fsize*3;
    this.flash = false;
    // type (start at 0 : library, work, normal, autoplaylist)
    switch(name) {
        case globalProperties.selection_playlist:
            this.type = 0;
            break;
        case "Album Library Selection":
            this.type = 1;
            break;
        case "Queue Content":
            this.type = 4;
            break;
        default:
            if(plman.IsAutoPlaylist(id)) {
                this.type = 3;
            } else {
                this.type = 2;
                g_plmanager.totalPlaylistsVis++;
            }
            break;
    }
    this.setSize = function(x, y, w, h){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}		
    this.draw = function(gr, drawIdx) {
        this.x = g_plmanager.x;
        this.y = g_plmanager.y + g_plmanager.headerHeight + (drawIdx*this.h) - (g_plmanager.scrollOffset*this.h);
        this.ishover = (g_cursor.x > this.x && g_cursor.x < this.x + this.w && g_cursor.y >= this.y && g_cursor.y < this.y + this.h);

        if(this.y >= g_plmanager.y + g_plmanager.headerHeight && this.y < wh) {
            if((g_dragA || g_dragR) && this.ishover) {
                gr.FillSolidRect(this.x+1, this.y, this.w-2, this.h-1, colors.pm_hover_row_bg);
            } else {
                if(g_dragup_timer && this.id==g_flash_idx) {
                    if(g_dragup_flash) {
                        gr.FillSolidRect(this.x+1, this.y, this.w-2, this.h-1, colors.pm_hover_row_bg);
                    }
                }
            }
		
			if(fb.IsPlaying && plman.PlayingPlaylist==this.id) {
				gr.DrawImage(image_playing_playlist, this.x+13, this.y+Math.round((this.h -image_playing_playlist.Height)/2)-1, image_playing_playlist.Width, image_playing_playlist.Height, 0, 0, image_playing_playlist.Width, image_playing_playlist.Height,0,255);
				gr.GdiDrawText(this.name, g_font.normal, colors.normal_txt, this.x+38, this.y, this.w-88, this.h, DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_END_ELLIPSIS);
			} else gr.GdiDrawText(this.name, g_font.normal, colors.normal_txt, this.x+20, this.y, this.w-70, this.h, DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_END_ELLIPSIS);

			gr.GdiDrawText(plman.PlaylistItemCount(this.id), g_font.min2, colors.faded_txt, this.x+20, this.y, this.w-45, this.h, DT_RIGHT| DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_END_ELLIPSIS);
        }
    }

    this.checkstate = function(event, x, y, id) {

        this.ishover = (x > this.x && x < this.x + this.w && y >= this.y && y < this.y + this.h);

        switch (event) {
            
        case "up":
            if(this.ishover) {
                if(g_dragA) {
                    g_drag_timer = false;
                    g_flash_idx = this.id;
                    g_dragup_flashescounter = 0;
                    g_dragup_timer = true;
                    // add dragged tracks to the target playlist
                    plman.InsertPlaylistItems(this.id, plman.PlaylistItemCount(this.id),brw.groups[g_dragA_idx].pl, false);
                    g_dragA = false;
                    g_dragA_idx = -1;
                }
                if(g_dragR) {
                    g_drag_timer = false;
                    g_flash_idx = this.id;
                    g_dragup_flashescounter = 0;
                    g_dragup_timer = true;
                    // add dragged tracks to the target playlist
                    plman.InsertPlaylistItems(this.id, plman.PlaylistItemCount(this.id),plman.GetPlaylistSelectedItems(brw.getSourcePlaylist()), false);
                    g_dragR = false;
                    g_dragR_metadb = null;
                }
            }
            break;
            
        };
        return this.ishover;
    };

}

oRow = function(metadb,itemIndex) {
    this.metadb = metadb;
    this.itemIndex = itemIndex;	
	this.showToolTip = false;
    this.h = g_showlist.textHeight;
    this.g_wallpaperImg = null;
	this.isSelected = false;
	this.select_on_mouse_up = false;
	this.hover_rating = -1;
	this.tracknumber_w = 0;		
	this.title_length = 0;
	this.playcount_length = 0;	
	this.cursorHand = false;
	this.getTags = function(){
		
		if(properties.showPlaycount) {
			if(properties.showCodec) {
				if(properties.showBitrate) 
					var TagsString = TF.titlePCB.EvalWithMetadb(metadb);
				else
					var TagsString = TF.titlePC.EvalWithMetadb(metadb);
			} else if(properties.showBitrate)
				var TagsString = TF.titlePB.EvalWithMetadb(metadb)				
			else
				var TagsString = TF.titleP.EvalWithMetadb(metadb)					
		} else if(properties.showCodec) {
			if(properties.showBitrate)
				var TagsString = TF.titleCB.EvalWithMetadb(metadb);
			else
				var TagsString = TF.titleC.EvalWithMetadb(metadb);				
		} else if(properties.showBitrate){
			var TagsString = TF.titleB.EvalWithMetadb(metadb);	
		} else
			var TagsString = TF.title.EvalWithMetadb(metadb);
		Tags = TagsString.split(" ^^ ");
		this.artist = Tags[0];
		if(this.artist=="?") this.artist="Unknown artist";
		this.discnumber = Tags[1];
		this.tracknumber = Tags[2];
		this.tracknumber = parseInt(this.tracknumber, 10);
		if(isNaN(this.tracknumber)) this.tracknumber="?";
		this.title = Tags[3];
		this.rating = Tags[4];	
		if(this.rating < 0 || this.rating > 5) {
			this.rating = 0;
		};
		this.length_seconds = Tags[5];		
		this.length = Tags[5].toHHMMSS();

		this.playcount = Tags[6];
	} 
	this.getTags();
	this.repaint = function() {
		window.RepaintRect(this.x,this.y,this.w,this.h);
	}
	this.refresh = function() {
		this.getTags();
	}	
    this.draw = function(gr, x, y, w) {
        this.x = x;
        this.y = y-3;
        this.w = w;	
        var tracknumber_w = 28;
        var length_w = 55;
		
		if(this.tracknumber>9) var select_start=4;
		else var select_start=0;
        
		if(properties.showArtistName || (properties.TFgrouping!="" && properties.TFgrouping.indexOf("artist%")==-1)) this.title_text = this.title+" - "+this.artist;
		else this.title_text = this.title;		
		
        var duration = this.length;
        var isPlaying = false;
				
		if(fb.IsPlaying && fb.GetNowPlaying()!=null && this.metadb.Compare(fb.GetNowPlaying())) {//&& (nowplayinglib_state.isActive() || plman.ActivePlaylist==plman.PlayingPlaylist || brw.playlistName==globalProperties.whole_library)) {
			isPlaying = true;
			
			TimeElapsed = g_seconds.toHHMMSS();
			TimeRemaining = this.length_seconds - g_seconds; 
			TimeRemaining = "-"+TimeRemaining.toHHMMSS();	
			duration = TimeRemaining;
			
			g_showlist.playing_row_x = this.x;
			g_showlist.playing_row_y = this.y-3;
			g_showlist.playing_row_w = this.w+10;
			g_showlist.playing_row_h = this.h;
			
			var total_size=this.w-3+select_start-track_gradient_size;
			var elapsed_seconds = g_seconds;
			var ratio = elapsed_seconds/this.length_seconds;
			if(this.length=="ON AIR") {
				var current_size = track_gradient_size+total_size;
				duration = 'ON AIR';
			} else var current_size = track_gradient_size+Math.round(total_size*ratio);			
			if(isNaN(current_size) || current_size<0) current_size = track_gradient_size+total_size;
		}		
		if(!g_showlist.light_bg){
			image0 = now_playing_progress0;
			image1 = now_playing_progress1;
		} else {
			image0 = now_playing_img0;
			image1 = now_playing_img1;					
		}			
		if(isPlaying && !(properties.AlbumArtProgressbar) && properties.drawProgressBar) var color_selected = g_showlist.showlist_selected_grad2_play;
		else var color_selected = g_showlist.showlist_selected_grad2;
        if(this.isSelected) {
				if(!(g_showlist.rows_[this.itemIndex-1] && g_showlist.rows_[this.itemIndex-1].isSelected)) {				
					//top
					gr.FillGradRect(this.x+20-track_gradient_size, this.y, track_gradient_size, 1, 0, g_showlist.showlist_selected_grad1,  color_selected, 1.0);
					gr.FillGradRect(this.x+20+this.w+5-(track_gradient_size*2), this.y, track_gradient_size, 1, 0, color_selected, g_showlist.showlist_selected_grad1, 1.0);	
					gr.FillSolidRect(this.x+20, this.y, this.w+5-(track_gradient_size*2), 1, color_selected);	
				}				
				//bottom				
				gr.FillGradRect(this.x+20-track_gradient_size, this.y+this.h-1, track_gradient_size, 1, 0, g_showlist.showlist_selected_grad1, color_selected, 1.0);
				gr.FillGradRect(this.x+20+this.w+5-(track_gradient_size*2), this.y+this.h-1, track_gradient_size, 1, 0, color_selected, g_showlist.showlist_selected_grad1, 1.0);					
				gr.FillSolidRect(this.x+20, this.y+this.h-1, this.w+5-(track_gradient_size*2), 1, color_selected);					

        }
		if(isPlaying && cNowPlaying.flashEnable && cNowPlaying.flash){
			gr.FillSolidRect(this.x+10, y-2, this.w, this.h-2, g_showlist.g_color_flash_bg);
			gr.DrawRect(this.x+9, y-3, this.w+1, this.h-1, 1.0, g_showlist.g_color_flash_rectline);
		}            
        if(isPlaying && properties.drawProgressBar && !(properties.AlbumArtProgressbar) && (cNowPlaying.flashescounter<5 || !cNowPlaying.flashEnable)) {
				gr.FillGradRect(this.x+20-track_gradient_size, y-3, (track_gradient_size>current_size+6)?current_size+6:track_gradient_size, this.h, 0, g_showlist.progressbar_color_bg_off, g_showlist.progressbar_color_bg_on, 1.0); //grad bg
				gr.FillSolidRect(this.x+20, y-3, current_size-7, this.h, g_showlist.progressbar_color_bg_on); //solid bg
				
				gr.FillGradRect(this.x+20-track_gradient_size, y-3, (track_gradient_size>current_size+6)?current_size+6:track_gradient_size, 1, 0, g_showlist.progressbar_linecolor2, g_showlist.progressbar_linecolor1, 1.0); //grad top
				gr.FillSolidRect(this.x+20, y-3, current_size-7, 1, g_showlist.progressbar_linecolor1); //line top
				if(!g_showlist.light_bg) gr.FillSolidRect(this.x+20-track_gradient_size, y-4, current_size-5+track_gradient_size, 1, g_showlist.progressbar_color_shadow); //horizontal top shadow			

				
				gr.FillGradRect(this.x+20-track_gradient_size, y-4+this.h, (track_gradient_size>current_size+6)?current_size+6:track_gradient_size, 1, 0, g_showlist.progressbar_linecolor2, g_showlist.progressbar_linecolor1, 1.0); //grad bottom
				gr.FillSolidRect(this.x+20, y-4+this.h, current_size-7, 1, g_showlist.progressbar_linecolor1); //line bottom		
				gr.FillSolidRect(this.x+current_size+12, y-2, 1, this.h-2, g_showlist.progressbar_linecolor1);	//vertical line	
				gr.FillSolidRect(this.x+current_size+13, y-4, 2, this.h+1, g_showlist.progressbar_color_shadow);	//vertical shadow		
				gr.FillSolidRect(this.x+20-track_gradient_size, y-3+this.h, current_size-5+track_gradient_size, 2, g_showlist.progressbar_color_shadow);	//horizontal bottom shadow								
        } 
		if(isPlaying) {	
            if(elapsed_seconds%2==0)
				gr.DrawImage(image0, this.x+12,  this.y+Math.ceil((this.h-image0.Height)/2)-1, image0.Width, image0.Height, 0, 0, image0.Width, image0.Height,0,255);
			else
				gr.DrawImage(image1, this.x+12,  this.y+Math.ceil((this.h-image1.Height)/2)-1, image1.Width, image1.Height, 0, 0, image1.Width, image1.Height,0,255);	
		}
		
		if(properties.showRating && (!properties.showRatingSelected || this.isSelected || (properties.showRatingRated && this.rating>0))) {
			rating_vpadding = 4;
			if(typeof this.rating_length == 'undefined' || this.rating_length==0) this.rating_length = gr.CalcTextWidth("HHHHH", g_font.plus6);
			if(!g_showlist.ratingImages) {
				g_showlist.SetRatingImages(this.rating_length, this.h-rating_vpadding*2, g_showlist.rating_icon_on, g_showlist.rating_icon_off, g_showlist.rating_icon_border, typeof(this.light_bg!=='undefined'));	
			}
			this.rating_x = this.x + this.w - length_w - this.rating_length + 15;
		} else {
			this.rating_length = 0;
			this.rating_x = 0;
		};			
		
		if(this.tracknumber=="NaN") this.tracknumber="?";

		if(this.tracknumber_w==0) this.tracknumber_w = gr.CalcTextWidth(this.discnumber+this.tracknumber, g_font.normal)+22;
		if(!isPlaying)  gr.GdiDrawText(this.discnumber+this.tracknumber, g_font.normal, g_showlist.colorSchemeTextFaded, this.x-2, this.y, this.tracknumber_w, this.h, DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
				
        gr.GdiDrawText(this.title_text, g_font.normal, g_showlist.colorSchemeText, (this.x + this.tracknumber_w + 10), this.y, this.w - this.tracknumber_w - length_w - (this.rating_length==0?0:this.rating_length+10), this.h, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
		if(this.title_length==0) this.title_length = gr.CalcTextWidth(this.title_text, g_font.normal);
		

		if(properties.showPlaycount || properties.showCodec || properties.showBitrate){	
			this.playcount_text = "  ("+this.playcount+")";
			if(this.playcount_length==0) this.playcount_length = gr.CalcTextWidth(this.playcount_text, g_font.min2);
			gr.GdiDrawText(this.playcount_text, g_font.min2, g_showlist.colorSchemeTextFaded, (this.x + this.tracknumber_w + 10 + this.title_length), this.y, this.w - this.tracknumber_w - length_w - (this.rating_length==0?0:this.rating_length+10) - this.title_length, this.h, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);		
		}
		
		if(properties.showToolTip && (this.title_length + this.playcount_length) > (this.w - this.tracknumber_w - length_w - 10 - this.rating_length)) {
			this.showToolTip = true;
			this.ToolTipText = this.title_text + this.playcount_text;
		}
		

        gr.GdiDrawText(duration, g_font.normal, g_showlist.colorSchemeText, this.x + this.w - length_w, this.y, length_w, this.h, DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);

        if(isPlaying && properties.AlbumArtProgressbar && properties.drawProgressBar && (cNowPlaying.flashescounter<5 || !cNowPlaying.flashEnable)) {
				var playingText = gdi.CreateImage(this.w+10, this.h);
				pt = playingText.GetGraphics();
					pt.SetTextRenderingHint(5);
					if(typeof(g_showlist.g_wallpaperImg) == "undefined" || !g_showlist.g_wallpaperImg) {		
						g_showlist.g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, g_showlist.pl[0], true, this.w, this.h*16,properties.wallpaperblurvalue,false);
					};						
					pt.DrawImage(g_showlist.g_wallpaperImg, 10, 0, this.w,  this.h, 0, 0, g_showlist.g_wallpaperImg.Width, this.h);
					pt.FillSolidRect(10, 0, this.w, this.h, g_showlist.progressbar_color_bg_on); //solid bg
					if(elapsed_seconds%2==0)
						pt.DrawImage(now_playing_progress0, 12, Math.round(this.h/2-now_playing_progress0.Height/2), now_playing_progress0.Width, now_playing_progress0.Height, 0, 0, now_playing_progress0.Width, now_playing_progress0.Height,0,255);
					else
						pt.DrawImage(now_playing_progress1, 12, Math.round(this.h/2-now_playing_progress0.Height/2), now_playing_progress1.Width, now_playing_progress1.Height, 0, 0, now_playing_progress1.Width, now_playing_progress1.Height,0,255);										
					pt.DrawString(duration, g_font.normal, colors.albumartprogressbar_txt, 0 + this.w - length_w, 1, length_w, g_showlist.textHeight-g_showlist.textBot, 554696704);
				playingText.ReleaseGraphics(pt);
				gr.DrawImage(playingText, this.x, this.y, current_size+12, this.h, 0, 0, current_size+12, this.h, 0, 255);
				gr.DrawRect(this.x+10, this.y, Math.min(current_size+1,this.w), this.h-1,1,g_showlist.albumartprogressbar_color_rectline)
				if(this.rating_x>0) var title_w = Math.min(current_size-this.tracknumber_w+2,(this.rating_x - this.x - this.tracknumber_w - 20));
				else var title_w = current_size-this.tracknumber_w+2;
				gr.GdiDrawText(this.title_text, g_font.normal, colors.albumartprogressbar_txt, (this.x + this.tracknumber_w + 10), this.y, title_w, this.h, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX);
				if((properties.showPlaycount || properties.showCodec || properties.showBitrate) && ((this.x + this.tracknumber_w + 10 + this.title_length+this.playcount_length+5)<this.rating_x) || this.rating_x<=0){	
					gr.GdiDrawText(this.playcount_text, g_font.min2, colors.albumartprogressbar_txt, (this.x + this.tracknumber_w + 10 + this.title_length), this.y, current_size-this.tracknumber_w+2 - this.title_length, this.h, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX);	
				}
        } 
		// rating Stars
		if(properties.showRating && g_showlist.ratingImages && (!properties.showRatingSelected || this.isSelected || (properties.showRatingRated && this.rating>0))) {
			if(this.ishover_rating && this.hover_rating>-1) {
				var rating = this.hover_rating;
			} else
				var rating = this.rating;
			gr.DrawImage(g_showlist.ratingImages[rating], this.rating_x, this.y+rating_vpadding, g_showlist.ratingImages[rating].Width, g_showlist.ratingImages[rating].Height, 0, 0, g_showlist.ratingImages[rating].Width, g_showlist.ratingImages[rating].Height, 0, 255);
		};
    }
    this.check = function(event, x, y) {
        this.ishover = (x > this.x+10 && x < this.x + 10 + this.w - 5 && y >= this.y && y < this.y + this.h - 1);
		
        this.ishover_rating = properties.showRating && this.ishover && (x > this.rating_x-this.rating_length/5 && x < this.rating_x + this.rating_length) && (!properties.showRatingSelected || this.isSelected || (properties.showRatingRated && this.rating>0));
		
        switch(event) {
            case "down":
                if(this.ishover && y > brw.y) {
					this.metadblist_selection = plman.GetPlaylistSelectedItems(brw.getSourcePlaylist());					
                    this.sourceX = x;
                    this.sourceY = y;
                    this.clicked = true;
					brw.dragEnable = true;
									
					plman.SetPlaylistFocusItemByHandle(brw.getSourcePlaylist(),this.metadb);
					playlistTrackId = plman.GetPlaylistFocusItemIndex(brw.getSourcePlaylist());
					var focusTrackIndex = g_showlist.last_click_row_index;
					if(utils.IsKeyPressed(VK_SHIFT) && focusTrackIndex>-1) {
						var affectedItems = Array();
						if(focusTrackIndex < this.itemIndex) {
							var deb = focusTrackIndex;
							var fin = this.itemIndex;
						} else {
							var deb = this.itemIndex;
							var fin = focusTrackIndex;        
						};
						for(var i = deb; i <= fin ;i++) {
							plman.SetPlaylistFocusItemByHandle(brw.getSourcePlaylist(),g_showlist.rows_[i].metadb);
							plman.SetPlaylistSelectionSingle(brw.getSourcePlaylist(), plman.GetPlaylistFocusItemIndex(brw.getSourcePlaylist()), true);
							g_showlist.rows_[i].isSelected = true;
						};
						plman.SetPlaylistFocusItem(brw.getSourcePlaylist(), playlistTrackId);
					} else if(utils.IsKeyPressed(VK_CONTROL)) {
						if(plman.IsPlaylistItemSelected(brw.getSourcePlaylist(), playlistTrackId)) {
							plman.SetPlaylistSelectionSingle(brw.getSourcePlaylist(), playlistTrackId, false);
							this.isSelected = false;
						} else {
							plman.SetPlaylistSelectionSingle(brw.getSourcePlaylist(), playlistTrackId, true);
							this.isSelected = true;
						};
					} else {
						if(plman.IsPlaylistItemSelected(brw.getSourcePlaylist(), playlistTrackId)) {
							this.select_on_mouse_up = true;
						} else {
							g_showlist.clearSelection();
							plman.SetPlaylistSelectionSingle(brw.getSourcePlaylist(), playlistTrackId, true);
							plman.SetPlaylistFocusItem(brw.getSourcePlaylist(), playlistTrackId);
							this.isSelected = true;
						};
						// check if rating to update ?
						if(!g_dragR && this.ishover_rating) {
							// calc new rating
							var l_rating = Math.ceil((x - this.rating_x) / (this.rating_length / 5) + 0.1);
							if(l_rating > 5) l_rating = 5;
							else if(l_rating < 0) l_rating = 0;
							// update if new rating <> current track rating
							g_rating_updated = true;
							brw.dragEnable = false;
							g_rating_rowId = this.itemIndex;
							if(l_rating!=this.rating) this.rating = rateSong(l_rating,this.rating, this.metadb);
							g_showlist.track_rated = true;
						};							
					}
					brw.repaint();					
					
					g_showlist.last_click_row_index = this.itemIndex;
					
                    g_showlist.selected_row = this.metadb;
					if(brw.followActivePlaylist) plman.SetPlaylistFocusItemByHandle(plman.ActivePlaylist,this.metadb);
                    rowSelection = this;
                } else {
                    this.clicked = false;
                }
				return this.ishover;
                break;
            case "up":			
                this.clicked = false;
				brw.dragEnable = false;

                if(!g_dragR && this.select_on_mouse_up) {
					plman.SetPlaylistFocusItemByHandle(brw.getSourcePlaylist(),this.metadb);
					playlistTrackId = plman.GetPlaylistFocusItemIndex(brw.getSourcePlaylist());						
					if(!utils.IsKeyPressed(VK_SHIFT) && !utils.IsKeyPressed(VK_CONTROL) && !g_showlist.track_rated) {
						if(plman.IsPlaylistItemSelected(brw.getSourcePlaylist(), playlistTrackId)) {
							g_showlist.clearSelection();
							plman.SetPlaylistSelectionSingle(brw.getSourcePlaylist(), playlistTrackId, true);
							plman.SetPlaylistFocusItem(brw.getSourcePlaylist(), playlistTrackId);
							this.isSelected = true;
						};
					};				
				}				
				this.select_on_mouse_up = false;
				return this.ishover;
                break;
            case "dblclk":
                if(this.ishover) {
					if(!nowplayinglib_state.isActive()){
						if(!brw.followActivePlaylist){
							plman.ActivePlaylist = brw.SourcePlaylistIdx;
							plman.PlayingPlaylist = brw.SourcePlaylistIdx;
						}					
						var a = g_showlist.idx;
						plman.SetPlaylistFocusItemByHandle(plman.ActivePlaylist, this.metadb);
						if(fb.IsPaused) fb.Stop();
						plman.FlushPlaybackQueue();
						fb.RunContextCommandWithMetadb("Add to playback queue", this.metadb);
						fb.Play();						
					} else {
						var PlaybackPlaylist = brw.getPlaybackPlaylist();
						
						plman.ClearPlaylist(PlaybackPlaylist);
						plman.InsertPlaylistItems(PlaybackPlaylist, 0, brw.groups[g_showlist.idx].pl);
						plman.PlayingPlaylist = PlaybackPlaylist;
						plman.ActivePlaylist = PlaybackPlaylist;
						plman.SetPlaylistFocusItemByHandle(PlaybackPlaylist, this.metadb);
						if(fb.IsPaused) fb.Stop();
						plman.FlushPlaybackQueue();
						fb.RunContextCommandWithMetadb("Add to playback queue", this.metadb);
						fb.Play();
					}					
                }
                break;
            case "right":
                if(this.ishover) {	
					plman.SetPlaylistFocusItemByHandle(brw.getSourcePlaylist(),this.metadb);
					var playlistTrackId = plman.GetPlaylistFocusItemIndex(brw.getSourcePlaylist());					
					if(!plman.IsPlaylistItemSelected(brw.getSourcePlaylist(), playlistTrackId)) {
						g_showlist.clearSelection();
						plman.SetPlaylistSelectionSingle(brw.getSourcePlaylist(), playlistTrackId, true);
						this.isSelected = true;
					}					
                    return true;
                }
                break;
            case "move":
                if(this.ishover_rating && !g_dragR) {
                    if(!this.cursorHand) {
						g_cursor.setCursor(IDC_HAND,"rating");
						this.cursorHand = true;
					}
					if(brw.TooltipRow==this.itemIndex) {
						brw.TooltipRow = -1;
						g_tooltip.Deactivate();	
					}	
					this.hover_rating_old = this.hover_rating;
					this.hover_rating = Math.ceil((x - this.rating_x) / (this.rating_length / 5) + 0.1);					
					if(this.hover_rating > 5) this.hover_rating = 5;
					else if(this.hover_rating < 0) this.hover_rating = 0;
					if(this.hover_rating_old != this.hover_rating) this.repaint();
                } else if(!g_dragR){
                    if(this.cursorHand) {
						g_cursor.setCursor(IDC_ARROW);
						this.cursorHand = false;
						this.hover_rating = -1;
						this.repaint();
					}
					if(properties.showToolTip && this.showToolTip && !(g_dragA || g_dragR || g_scrollbar.cursorDrag)){					
						if(this.ishover && brw.TooltipRow!=this.itemIndex && !this.ishover_rating) {
							brw.TooltipRow=this.itemIndex;	
							new_tooltip_text=this.ToolTipText;//+"\n"+this.artist;
							g_tooltip.ActivateDelay(new_tooltip_text, x+10, y+20, globalProperties.tooltip_delay);		
						}
						if(brw.TooltipRow==this.itemIndex && !this.ishover) {
							brw.TooltipRow = -1;
							g_tooltip.Deactivate();	
						}
					}
                };				
				if(properties.DragToPlaylist) {
					if(!g_dragR && this.clicked && brw.dragEnable && (Math.abs(x - this.sourceX) > 10 || Math.abs(y - this.sourceY) > 10)) {
						g_dragR = true;
						g_tooltip.Deactivate();
						g_dragR_metadb = g_showlist.selected_row;
						g_plmanager.isOpened = true;
						// rebuild playlists list
						g_plmanager.setPlaylistList();
						if(this.sourceX > this.x + Math.round(this.w/2)) {
							g_plmanager.side = "right";
						} else {
							g_plmanager.side = "right";
						}
						g_drag_timer = true;

						brw.repaint();
					}
				}					
                break;
        }
		return this.ishover;
    }

}

oColumn = function() {
   this.rows = [];  
}

oShowList = function(parentPanelName) {
    this.parentPanelName = parentPanelName;
    this.y = 0;
    this.h = 0;
    this.heightMin = properties.showlistheightMin;
    this.heightMax = window.Height-brw.rowHeight*2;
	if(this.heightMin>this.heightMax) this.heightMax=this.heightMin;
    this.totalHeight = 0;
    this.idx = -1;
    this.rowIdx = -1;
    this.nbRows = 0;
    this.delta = 0;
    this.delta_ = 0;
    this.marginTop = 20;
    this.marginBot = 15;
    this.coverMarginTop = 35;
	this.click_down_scrollbar = false;
    this.paddingTop = g_fsize*6+30;
	this.paddingBot = 0;
	this.isPlaying = false;
    this.MarginLeft = 8;
    this.MarginRightStandard = 32;
    this.MarginRightFromCover = 10;	
    this.CoverSize = properties.showlistCoverMaxSize;
	this.coverRealSize = this.CoverSize;
	this.marginCover = properties.showlistCoverMargin;	
	this.cover_shadow = null;
    this.columns = [];
    this.rows_ = [];
    this.textBot = 4;	
    this.textHeight = Math.ceil(g_fsize * 1.8)+this.textBot;	
    this.columnWidthMin = 230;
    this.columnWidth = 0;
    this.columnsOffset = 0;
    
    this.playing_row_x = 0;
    this.playing_row_y = 0;
    this.playing_row_w = 0;
    this.playing_row_h = 0;

    this.playing_row_x = 0;
    this.playing_row_y = 0;
    this.playing_row_w = 0;
    this.playing_row_h = 0;	

	this.hscr_height = 20;
	this.hscr_vpadding = 9;
	this.hscr_vpadding_hover = 6;	
	this.hscr_btn_w = 30;
	this.hscr_btn_h = this.hscr_height+2;
	this.drag_showlist_hscrollbar = false;
	this.drag_start_x = 0;	
	this.drag_old_x = 0;		
	this.drag_x = 0;	
	this.last_click_row_index = -1;
	this.getColorSchemeFromImageDone = false;
	this.ratingImgsLight = false;
	this.ratingImgsDark = false;
	this.tooltipActivated = false;
	this.selected_row = false;
	this.track_rated = false;
	this.genre = '';
	this.cursor = IDC_ARROW;
	this.links = {
		album : new SimpleButton(0, 0, 0, 0, "albumLink", function () {
			quickSearch(g_showlist.pl[0],"album");
		},false,false,false,ButtonStates.normal,255),		
		artist : new SimpleButton(0, 0, 0, 0, "artistLink", function () {
			quickSearch(g_showlist.pl[0],"artist");
		},false,false,false,ButtonStates.normal,255),
		genre : new SimpleButton(0, 0, 0, 0, "genreLink", function () {
			quickSearch(g_showlist.pl[0],"genre");
		},false,false,false,ButtonStates.normal,255),		
	}
	this.setCover = function(){
		if(!isImage(brw.groups[this.idx].cover_img_full)) {
			brw.GetAlbumCover(this.idx);
		}
		this.cover_img = FormatCover(brw.groups[this.idx].cover_img_full, this.coverRealSize, this.coverRealSize, false, "showlistShowCover");

		this.setShowListArrow();
		this.setColumnsButtons(false);
		this.setCloseButton(false);						
	}	
	this.getColorSchemeFromImage = function() {	
        if(!isImage(this.cover_img)) this.setCover();
		if(!isImage(this.cover_img)) return;

		if(properties.circleMode)
			image = brw.groups[this.idx].cover_img_full; 
		else
			image = brw.groups[this.idx].cover_img; 
		
		image = this.cover_img;
		
		var colorScheme_array = image.GetColourScheme(1);
		
		var tmp_HSL_colour = RGB2HSL(colorScheme_array[0]);

		if(tmp_HSL_colour.S>70 && tmp_HSL_colour.L>40){
			this.light_bg = true;
			var new_H = tmp_HSL_colour.H;
			var new_S = Math.min(85,tmp_HSL_colour.S);
			var new_L = Math.min(96,tmp_HSL_colour.L+(100-tmp_HSL_colour.L)/3);			
			this.colorSchemeBack = HSL2RGB(new_H, new_S, new_L, "RGB");
		} else if(tmp_HSL_colour.L>60) {
			this.light_bg = true;
			var new_H = tmp_HSL_colour.H;
			var new_S = Math.min(85,tmp_HSL_colour.S);			
			var new_L = Math.min(96,tmp_HSL_colour.L);				
			this.colorSchemeBack = HSL2RGB(new_H, new_S, new_L, "RGB");			
		} else {
			this.light_bg = false;	
			var new_H = tmp_HSL_colour.H;
			var new_S = Math.min(70,tmp_HSL_colour.S);			
			var new_L = Math.min(30,tmp_HSL_colour.L);				
			this.colorSchemeBack = HSL2RGB(new_H, new_S, new_L, "RGB");						
		}	
		this.setColors();	
		if(properties.AlbumArtProgressbar && this.light_bg){
			this.progressbar_color_bg_on = setAlpha(HSL2RGB(new_H, Math.min(new_S*0.45,100), Math.min(40,new_L*0.75), "RGB"),200);
		} else if(properties.AlbumArtProgressbar){
			this.progressbar_color_bg_on = setAlpha(HSL2RGB(new_H, Math.min(new_S*0.75,100), Math.min(50,Math.max(35,new_L*1.6)), "RGB"),200);	
		} else if(new_L<10 && (properties.showListColoredOneColor || properties.showListColoredMixedColor)) {
			this.progressbar_color_bg_on = HSL2RGB(new_H, Math.min(new_S*0.35,100), new_L+13, "RGB");				
		}
		if(this.light_bg) {
			this.colorSchemeTextFaded = HSL2RGB(new_H, Math.min(new_S*0.55,50), Math.min(30,new_L), "RGB");
		} else {
			this.colorSchemeTextFaded = HSL2RGB(new_H, (new_L<10?Math.min(new_S*new_L/100,30):Math.min(new_S*0.65,15)), Math.max(70,new_L), "RGB");
			//Math.min(new_S*new_L/100,30)
		}
		this.getColorSchemeFromImageDone = true;
    }
	this.setImages = function () {
		this.setShowListArrow();
		this.setCloseButton(false);
		this.setColumnsButtons(false);
		this.cover_shadow = null;
		this.reset();
	}
    this.setShowListArrow = function () {			
        var gb;
        this.showListArrow = gdi.CreateImage(27, 17);
        gb = this.showListArrow.GetGraphics();
        gb.SetSmoothingMode(1);
        var pts1 = Array(2,12, 13,1, 24,12);
        gb.FillPolygon(this.colorSchemeBack, 0, pts1);
        gb.DrawLine(2,12, 12,2, 1.0, this.border_color);
        gb.DrawLine(13,2, 23,12, 1.0, this.border_color);
        this.showListArrow.ReleaseGraphics(gb);
    }
	this.SetRatingImages = function(width, height, on_color, off_color, border_color,save_imgs){		
		if(typeof(on_color) == "undefined" || typeof(off_color) == "undefined"|| typeof(border_color) == "undefined") return false;
		if(typeof(save_imgs) == "undefined") var save_imgs = true;
		
		if(this.light_bg) this.ratingImages = this.ratingImgsLight;
		else this.ratingImages = this.ratingImgsDark;		
		
		if(!this.ratingImages) {
			var star_padding =-1;
			var star_indent = 2;
			var star_size = height;	
			var star_height = height;
			while(star_padding<0) {
				star_size = star_height;
				star_padding = Math.round((width-5*star_size)/4);
				star_height--;
			}
			if(star_height < height) var star_vpadding = Math.floor((height - star_height)/2);

			this.ratingImages = Array();
			for (var rating = 0; rating <= 5; rating++) {
				var img = gdi.CreateImage(width, height);
				var gb = img.GetGraphics();
				for (var i = 0; i < 5; i++) {
					DrawPolyStar(gb, i*(star_size+star_padding), star_vpadding, star_size, star_indent, 10, 0, colors.border, ((i<rating) ? on_color : off_color));
				}
				img.ReleaseGraphics(gb);
				this.ratingImages[rating] = img;
			}
			if(this.light_bg && save_imgs) this.ratingImgsLight = this.ratingImages;
			else if(save_imgs) this.ratingImgsDark = this.ratingImages;
		}		
	}
    this.setCloseButton = function (save_btns) {
		if(typeof(save_btns) == "undefined") var save_btns = true;
		
		if(this.light_bg) this.close_bt = this.close_btLight;
		else this.close_bt = this.close_btDark;
		
		if(!this.close_bt) {
			var gb;								
			// *** Close button ***
			this.big_CloseButton = false;
			this.closeTracklist_off = gdi.CreateImage(18, 18);
			gb = this.closeTracklist_off.GetGraphics();
				gb.SetSmoothingMode(2);
				if(this.big_CloseButton){
					gb.DrawLine(4,4, 12, 12, 1.0, this.showlist_close_icon);
					gb.DrawLine(4,12, 12, 4, 1.0, this.showlist_close_icon);
				} else {
					gb.DrawLine(5,6, 11, 12, 1.0,  this.showlist_close_icon);
					gb.DrawLine(5,12, 11, 6, 1.0,  this.showlist_close_icon);		
				}			
			this.closeTracklist_off.ReleaseGraphics(gb);

			this.closeTracklist_ov = gdi.CreateImage(18, 18);
			gb = this.closeTracklist_ov.GetGraphics();
				if(this.big_CloseButton) gb.FillSolidRect(0, 0, 17, 17, this.showlist_close_bg);
				else gb.FillSolidRect(1, 2, 15, 15, this.showlist_close_bg);
				gb.SetSmoothingMode(2);
				if(this.big_CloseButton){			
					gb.DrawLine(4,4, 12, 12, 1.0, this.showlist_close_iconhv);
					gb.DrawLine(4,12, 12, 4, 1.0, this.showlist_close_iconhv);
				} else {
					gb.DrawLine(5,6, 11, 12, 1.0,  this.showlist_close_iconhv);
					gb.DrawLine(5,12, 11, 6, 1.0,  this.showlist_close_iconhv);		
				}				
			this.closeTracklist_ov.ReleaseGraphics(gb);
					
			if(typeof(this.close_bt) == "undefined") {
				this.close_bt = new button(this.closeTracklist_off, this.closeTracklist_ov, this.closeTracklist_ov,"showlist_close");
			} else {
				this.close_bt.img[0] = this.closeTracklist_off;
				this.close_bt.img[1] = this.closeTracklist_ov;
				this.close_bt.img[2] = this.closeTracklist_ov;
			}
			
			if(this.light_bg && save_btns) this.close_btLight = this.close_bt;
			else if(save_btns) this.close_btDark = this.close_bt;			
		}	
    }
    
    this.setColumnsButtons = function (save_btns) {	
		if(typeof(save_btns) == "undefined") var save_btns = true;
		
		if(this.light_bg) {
			this.prev_bt = this.prev_btLight;
			this.next_bt = this.next_btLight;				
		} else {
			this.prev_bt = this.prev_btDark;
			this.next_bt = this.next_btDark;			
		}
		if(!this.next_bt || !this.prev_bt) {
			var gb;
			var xpts_mtop = Math.ceil((this.hscr_btn_h-9)/2);
			var xpts_mright_prev = Math.floor((this.hscr_btn_w-5)/2);		
			var xpts_mright_next = Math.ceil((this.hscr_btn_w-5)/2)+1;							
			this.nextColumn_off = gdi.CreateImage(this.hscr_btn_w, this.hscr_btn_h);
			gb = this.nextColumn_off.GetGraphics();
				var xpts1 = Array(1+xpts_mright_next,xpts_mtop, 5+xpts_mright_next,4+xpts_mtop, 1+xpts_mright_next,8+xpts_mtop, xpts_mright_next,7+xpts_mtop, 3+xpts_mright_next,4+xpts_mtop, xpts_mright_next,1+xpts_mtop);
				var xpts2 = Array(1+xpts_mright_next,1+xpts_mtop, 4+xpts_mright_next,4+xpts_mtop, 1+xpts_mright_next,7+xpts_mtop, 4+xpts_mright_next,4+xpts_mtop);
				gb.FillPolygon(this.colorSchemeText, 0, xpts1);
				gb.FillPolygon(this.colorSchemeText, 0, xpts2);
			this.nextColumn_off.ReleaseGraphics(gb);
			
			this.nextColumn_ov = gdi.CreateImage(this.hscr_btn_w, this.hscr_btn_h);
			gb = this.nextColumn_ov.GetGraphics();
				gb.FillSolidRect(0, 0, 1, 25,  this.showlist_scroll_btns_line);
				gb.FillSolidRect(1, 0, 39, 1,  this.showlist_scroll_btns_line);
				gb.FillSolidRect(1, 1, 39, 24,  this.showlist_scroll_btns_bg);
				var xpts1 = Array(1+xpts_mright_next,xpts_mtop, 5+xpts_mright_next,4+xpts_mtop, 1+xpts_mright_next,8+xpts_mtop, xpts_mright_next,7+xpts_mtop, 3+xpts_mright_next,4+xpts_mtop, xpts_mright_next,1+xpts_mtop);
				var xpts2 = Array(1+xpts_mright_next,1+xpts_mtop, 4+xpts_mright_next,4+xpts_mtop, 1+xpts_mright_next,7+xpts_mtop, 4+xpts_mright_next,4+xpts_mtop);
				gb.FillPolygon(this.colorSchemeText, 0, xpts1);
				gb.FillPolygon(this.colorSchemeText, 0, xpts2);
			this.nextColumn_ov.ReleaseGraphics(gb);
			
			this.prevColumn_off = gdi.CreateImage(this.hscr_btn_w, this.hscr_btn_h);
			gb = this.prevColumn_off.GetGraphics();          
				var xpts3 = Array(4+xpts_mright_prev,xpts_mtop, xpts_mright_prev,4+xpts_mtop, 4+xpts_mright_prev,8+xpts_mtop, 5+xpts_mright_prev,7+xpts_mtop, 2+xpts_mright_prev,4+xpts_mtop, 5+xpts_mright_prev,1+xpts_mtop);
				var xpts4 = Array(4+xpts_mright_prev,1+xpts_mtop, 1+xpts_mright_prev,4+xpts_mtop, 4+xpts_mright_prev,7+xpts_mtop, 1+xpts_mright_prev,4+xpts_mtop);
				gb.FillPolygon(this.colorSchemeText, 0, xpts3);
				gb.FillPolygon(this.colorSchemeText, 0, xpts4);
			this.prevColumn_off.ReleaseGraphics(gb);

			this.prevColumn_ov = gdi.CreateImage(this.hscr_btn_w, this.hscr_btn_h);
			gb = this.prevColumn_ov.GetGraphics();
				gb.FillSolidRect(39, 1, 1, 25,  this.showlist_scroll_btns_line);
				gb.FillSolidRect(0, 0, 40, 1,  this.showlist_scroll_btns_line);
				gb.FillSolidRect(0, 1, 39, 24,  this.showlist_scroll_btns_bg);
				
				var xpts3 = Array(4+xpts_mright_prev,xpts_mtop, xpts_mright_prev,4+xpts_mtop, 4+xpts_mright_prev,8+xpts_mtop, 5+xpts_mright_prev,7+xpts_mtop, 2+xpts_mright_prev,4+xpts_mtop, 5+xpts_mright_prev,1+xpts_mtop);
				var xpts4 = Array(4+xpts_mright_prev,1+xpts_mtop, 1+xpts_mright_prev,4+xpts_mtop, 4+xpts_mright_prev,7+xpts_mtop, 1+xpts_mright_prev,4+xpts_mtop);
				gb.FillPolygon(this.colorSchemeText, 0, xpts3);
				gb.FillPolygon(this.colorSchemeText, 0, xpts4);
			this.prevColumn_ov.ReleaseGraphics(gb);

			if(typeof(this.prev_bt) == "undefined") {
				this.prev_bt = new button(this.prevColumn_off, this.prevColumn_ov, this.prevColumn_ov,"showlist_prev");
			} else {
				this.prev_bt.img[0] = this.prevColumn_off;
				this.prev_bt.img[1] = this.prevColumn_ov;
				this.prev_bt.img[2] = this.prevColumn_ov;
			}

			if(typeof(this.next_bt) == "undefined") {
				this.next_bt = new button(this.nextColumn_off, this.nextColumn_ov, this.nextColumn_ov,"showlist_next");
			} else {
				this.next_bt.img[0] = this.nextColumn_off;
				this.next_bt.img[1] = this.nextColumn_ov;
				this.next_bt.img[2] = this.nextColumn_ov;
			}
			if(this.light_bg && save_btns) {
				this.prev_btLight = this.prev_bt;
				this.next_btLight = this.next_bt;			
			} else if(save_btns) {
				this.prev_btDark = this.prev_bt;
				this.next_btDark = this.next_bt;			
			}			
		}
    }

    this.check = function(event, x, y) {
        this.ishover = (x > this.x && x < this.x + this.w && y >= this.y + 20 && y < this.y - 13 + this.h);
		this.ishoverTextTop = (x > this.x + this.MarginLeft && x < this.x + this.MarginLeft + this.text_w) && (y >= this.TopInfoY && y < this.TopInfoY + this.TopInfoHeight);			
		var isHoverBtn = false
        switch(event) {
            case "right":
                if(this.ishover) {
                    return true;
                }
                break;
            case "down":
				if(this.ishover || brw.activeIndex < 0) changed = this.clearSelection();
				for (var i in this.links) {
					if (this.links[i].state == ButtonStates.hover) {
						
						this.links[i].onClick();
					}
				}
                break;	
            case "up":
				if(this.cursor!=IDC_ARROW && !this.scrollbar_cursor_hover) {
					this.cursor = IDC_ARROW;
					g_cursor.setCursor(IDC_ARROW);																			
				}			
                break;	
            case "leave":
				for (var i in this.links) {
					this.links[i].changeState(ButtonStates.normal);
				}			
                break;					
            case "move":
				this.close_bt.checkstate("move", x, y);
				for (var i in this.links) {
					if (this.links[i].containXY(x, y) && this.links[i].state != ButtonStates.hide && !this.links[i].hide) {
						isHoverBtn = true;
						this.links[i].changeState(ButtonStates.hover);
					} else this.links[i].changeState(ButtonStates.normal);
				}
				if(properties.showToolTip && !(g_dragA || g_dragR)){
					if(!this.ishoverTextTop && this.tooltipActivated) {
						g_tooltip.Deactivate();	
						this.tooltipActivated = false;
					}						
					if(this.ishoverTextTop && this.showToolTip && !g_scrollbar.cursorDrag){
						this.tooltipActivated = true;
						new_tooltip_text=this.firstRow+'\n'+this.secondRow;
						g_tooltip.ActivateDelay(new_tooltip_text, x+10, y+20, globalProperties.tooltip_delay,1200);		
					}
				}			
				if(this.totalCols > this.totalColsVis) {
					(this.columnsOffset > 0) && this.prev_bt.checkstate("move", x, y);
					(this.columnsOffset < this.totalCols - this.totalColsVis) && this.next_bt.checkstate("move", x, y);
				}		
				for(var c = this.columnsOffset; c < this.columnsOffset + this.totalColsVis; c++) {
					if(this.columns[c]) {
						for(var r = 0; r < this.columns[c].rows.length; r++) {
							this.columns[c].rows[r].check("move", x, y);
						}
					}
				}		
				// Enable showlist drag scrollbar
				if(this.hscr_visible){
					var scrollbar_cursor_hover_old = this.scrollbar_cursor_hover;
					this.isHover_hscrollbar(x , y);
					if(scrollbar_cursor_hover_old!=this.scrollbar_cursor_hover) brw.repaint();
					if(!this.drag_showlist_hscrollbar && this.click_down_scrollbar && this.scrollbar_hover){
						this.drag_showlist_hscrollbar = true;
						this.click_down_scrollbar = false;
					}	
					if(g_showlist.drag_showlist_hscrollbar){
						this.drag_x = x;
						if(this.cursor!=IDC_HAND){						
							g_cursor.setCursor(IDC_HAND,"showlist_scrollbar");
							this.cursor = IDC_HAND;			
						}						
					} else if(this.scrollbar_cursor_hover && this.cursor!=IDC_HAND) {
						if(this.cursor!=IDC_HAND){						
							g_cursor.setCursor(IDC_HAND,"showlist_scrollbar");
							this.cursor = IDC_HAND;			
						}									
					} else if(!this.scrollbar_cursor_hover && this.cursor!=IDC_ARROW) {
						this.cursor = IDC_ARROW;
						g_cursor.setCursor(IDC_ARROW);																			
					}
				}				
                break;								
        }
    }	
    this.getHeaderInfos = function(EvalWithMetadb) {			
		EvalWithMetadb = typeof EvalWithMetadb !== 'undefined' ? EvalWithMetadb : false;
        // TF
		var pl_count = this.pl.Count;
		//if(EvalWithMetadb){
			TagsString = TF.showlist.EvalWithMetadb(this.pl[0]);
			Tags = TagsString.split(" ^^ ");
			this.artist = Tags[0];
			this.album = Tags[1];
			this.discnumber = Tags[2];
			this.date = Tags[3];
			this.genre = Tags[4];
			this.total_tracks = pl_count+(pl_count>1?" tracks":" track");					
		//} else {
			//TagsString = TF.showlistReduced.EvalWithMetadb(this.pl[0]);
			//Tags = TagsString.split(" ^^ ");			
			this.artist = brw.groups[this.idx].artist;
			this.album = brw.groups[this.idx].album;
			//this.discnumber = (Tags[0]=='')?'':' - Disc '+Tags[0];
			this.discnumber = '';
			if(brw.groups[this.idx].date!="?") this.date = ' ('+brw.groups[this.idx].date+')';
			else this.date = '';
			this.genre = brw.groups[this.idx].genre;
			this.total_tracks = pl_count+(pl_count>1?" tracks":" track");		
		//}

		this.firstRow = this.album+this.discnumber+this.date;
		this.secondRow = this.artist;
		
		if(properties.TFgrouping!=""){
			if(properties.TFgrouping.indexOf("%album%")==-1) this.firstRow = TF.grouping.EvalWithMetadb(this.pl[0]);
			if(properties.TFgrouping.indexOf("artist%")==-1) this.secondRow = this.total_tracks;			
		}
    }
	this.setColors = function(){		
		if(this.light_bg) {
			this.colorSchemeText = light.normal_txt;
			this.colorSchemeTextFaded = light.faded_txt;	
			this.rating_icon_on = light.rating_icon_on;
			this.rating_icon_off = light.rating_icon_off;				
			this.rating_icon_border = light.rating_icon_border;
			
			if(properties.showListColoredOneColor || properties.showListColoredMixedColor){
				if(properties.darklayout) this.border_color = light.border_color_colored_darklayout; 	
				else this.border_color = light.border_color_colored; 
			} else				
				this.border_color = colors.showlist_border_color;
			
			this.scrollbar_cursor_color = this.colorSchemeText;
			this.showlist_scroll_btns_bg = GetGrey(0,30); //this.colorSchemeText;
			this.showlist_scroll_btns_line = GetGrey(0,20);
			this.showlist_scroll_btns_icon = GetGrey(255);
			this.scrollbar_border_color = colors.border_dark;
			
			this.progressbar_linecolor1 = light.progressbar_linecolor1;
			this.progressbar_linecolor2 = light.progressbar_linecolor2;	
			this.progressbar_color_bg_off = light.progressbar_color_bg_off;
			this.progressbar_color_bg_on = light.progressbar_color_bg_on;		
			this.progressbar_color_shadow = light.progressbar_color_shadow;
			this.albumartprogressbar_color_rectline = light.albumartprogressbar_color_rectline;
			this.albumartprogressbar_color_overlay = light.albumartprogressbar_color_overlay;			
			this.showlist_selected_grad1 = light.showlist_selected_grad1;
			this.showlist_selected_grad2 = light.showlist_selected_grad2;
			this.g_color_flash_bg = light.g_color_flash_bg;
			this.g_color_flash_rectline = light.g_color_flash_rectline;
			this.showlist_close_bg = light.showlist_close_bg;
			this.showlist_close_icon = light.showlist_close_icon;			
			this.showlist_close_iconhv = light.showlist_close_iconhv;
			this.showlist_selected_grad2_play = light.showlist_selected_grad2_play;				
		} else {
			this.colorSchemeText = dark.normal_txt;
			this.colorSchemeTextFaded = dark.faded_txt;	
			this.rating_icon_on = dark.rating_icon_on;
			this.rating_icon_off = dark.rating_icon_off;	
			this.rating_icon_border = dark.rating_icon_border;
			
			this.border_color = dark.border_color;
			
			this.scrollbar_cursor_color = this.colorSchemeText;		
			this.showlist_scroll_btns_bg = GetGrey(255,80); //this.colorSchemeText;
			this.showlist_scroll_btns_line = GetGrey(255,50);
			this.showlist_scroll_btns_icon = GetGrey(0);
			this.scrollbar_border_color = colors.border_light;		
			
			this.progressbar_linecolor1 = dark.progressbar_linecolor1;
			this.progressbar_linecolor2 = dark.progressbar_linecolor2;	
			this.progressbar_color_bg_off = dark.progressbar_color_bg_off;
			this.progressbar_color_bg_on = dark.progressbar_color_bg_on;		
			this.progressbar_color_shadow = dark.progressbar_color_shadow;
			this.albumartprogressbar_color_rectline = dark.albumartprogressbar_color_rectline;		
			this.albumartprogressbar_color_overlay = dark.albumartprogressbar_color_overlay;			
			this.showlist_selected_grad1 = dark.showlist_selected_grad1;
			this.showlist_selected_grad2 = dark.showlist_selected_grad2;
			this.g_color_flash_bg = dark.g_color_flash_bg;
			this.g_color_flash_rectline = dark.g_color_flash_rectline;	
			this.showlist_close_bg = dark.showlist_close_bg;
			this.showlist_close_icon = dark.showlist_close_icon;			
			this.showlist_close_iconhv = dark.showlist_close_iconhv;			
			this.showlist_selected_grad2_play = dark.showlist_selected_grad2_play;				
		}
		if(properties.showListColoredMixedColor) {
			this.colorSchemeOverlay = setAlpha(this.colorSchemeBack,180);
			this.colorSchemeBgScrollbar = setAlpha(this.colorSchemeBack,50);			
		} else {
			this.colorSchemeBgScrollbar = this.colorSchemeBack;				
		}
        this.setShowListArrow();
        this.setColumnsButtons();
        this.setCloseButton();			
	}
    this.close = function() {	
		this.drawn_idx = -1;
		this.idx = -1;
		this.h = 0;
		this.rowIdx = -1;
		this.delta = 0;
		this.delta_ = 0;		
	}	
    this.reset = function(idx, rowIdx) {	
	    idx = typeof idx !== 'undefined' ? idx : -1;			
	    rowIdx = typeof rowIdx !== 'undefined' ? rowIdx : -1;						
		
		nbRows = Math.round(this.h / brw.rowHeight * 100) / 100;
		height = Math.round(nbRows * brw.rowHeight);		
		
		delete this.firstRowLength;
		delete this.secondRowLength;		
		delete this.cover_img;
		for (var i in this.links) {
			this.links[i].positioned = false;
			this.links[i].changeState(ButtonStates.normal);			
		}	
		
		if(this.idx<0 && idx<0) return;		
		
		if(idx!=-1) this.idx = idx;
		if(rowIdx!=-1) this.rowIdx = rowIdx;
		if(nbRows!=-1) this.nbRows = nbRows;
		if(nbRows!=-1) this.delta = nbRows;
		this.hscr_visible = false;
		this.getColorSchemeFromImageDone = false;
		//this.clearSelection();
		this.w = brw.w;
		this.x = brw.x;
		this.y = Math.round(brw.y + ((this.rowIdx + 1) * brw.rowHeight) + brw.marginTop - scroll_)

		this.genreTextLenght = 0;
		this.timeTextLenght = 0;
		
		this.playing_row_x = 0;
		this.playing_row_y = 0;
		this.playing_row_w = 0;
		this.playing_row_h = 0;
		this.selected_row = false;
		this.last_click_row_index = -1;
		if(!isImage(this.cover_img)){
			this.setCover();
		}
		if(properties.showListColoredOneColor) {
			this.getColorSchemeFromImage();	
		} else if(properties.showListColoredMixedColor) {
			this.getColorSchemeFromImage();			
			if(typeof(this.g_wallpaperImg) == "undefined" || !this.g_wallpaperImg) {
				this.g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, this.pl[0], true, this.w + g_scrollbar.w, this.h+100, 0.8, false, 2);
			}			
		} else if(properties.showListColoredBlurred) {
			this.light_bg = false;
			if(typeof(this.g_wallpaperImg) == "undefined" || !this.g_wallpaperImg) {
				this.g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, this.pl[0], true, this.w + g_scrollbar.w, this.h+100, 0.8, false, 2);
				try{
					g_wallpaperImg_main_color = this.g_wallpaperImg.GetColourScheme(1);
					this.colorSchemeBack = blendColors(g_wallpaperImg_main_color[0],RGB(0,0,0),0.4);	
					this.colorSchemeOverlay = setAlpha(blendColors(this.colorSchemeBack,RGB(0,0,0),0.4),140);			
				} catch(e){
					this.colorSchemeBack = GetGrey(0);
				}
			}
			this.setColors();			
		} else {
			if(properties.darklayout) this.light_bg = false;
			else this.light_bg = true;			
			this.colorSchemeBack = colors.showlist_bg;
			this.setColors();
		}
		
		if(this.light_bg) this.ratingImages = this.ratingImgsLight;
		else this.ratingImages = this.ratingImgsDark;
		
		this.getHeaderInfos();
		
		time = brw.groups[this.idx].length;
		
		if(time>0) this.length = brw.FormatTime(time);
		else this.length = 'ON AIR';		
		
		this.hscr_width = this.w - 65 - (this.hscr_btn_w*2);
		this.hscr_step_width = this.hscr_width / this.totalCols;							
		this.hscr_cursor_width = this.hscr_step_width * this.totalColsVis + 41;													
		this.hscr_cursor_pos = this.columnsOffset * this.hscr_step_width;			
    }
	this.CheckIfPlaying = function() {			
		if(this.idx<0) this.isPlaying = false;
		
		else {		
			for(var i = 0; i < this.totaltracks; i++) {
				if(fb.IsPlaying && fb.GetNowPlaying()!=null && this.pl[i].Compare(fb.GetNowPlaying())) {
					this.isPlaying = true; 
					brw.groups[this.idx].isPlaying = true; 
				}
			}
		}		
	}
	this.haveSelectedRows = function() {		
		for(var i = 0; i < this.rows_.length; i++) {
			if(this.rows_[i].isSelected){
				return true
			}
		}	    
		return false;
	}		
	this.getFirstSelectedRow = function() {		
		for(var i = 0; i < this.rows_.length; i++) {
			if(this.rows_[i].isSelected){
				return this.rows_[i];
			}
		}	    
		return this.rows_[0];
	}		
	this.selectAll = function() {
		var listIndex = [];
		var IndexStart=brw.groups[this.idx].trackIndex;
		var IndexEnd=IndexStart+brw.groups[this.idx].pl.Count-1;
		for (var i = IndexStart; i <= IndexEnd; i++) {
			listIndex.push(i);
		}		
		for(var i = 0; i < this.rows_.length; i++) {
			this.rows_[i].isSelected = true;
		}
		plman.SetPlaylistSelection(brw.getSourcePlaylist(), listIndex, true);
	}	
	this.clearSelection = function() {	
		plman.ClearPlaylistSelection(brw.getSourcePlaylist());
		changed = false;		
		for(var i = 0; i < this.rows_.length; i++) {
			if(this.rows_[i].isSelected){
				this.rows_[i].isSelected = false;
				changed = true;
			}
		}	    
		return changed;
	}	
	this.resetSelection = function() {		
		for(var i = 0; i < this.rows_.length; i++) {
			this.rows_[i].isSelected = false;
		}	    
	}		
	this.removeSelectedItems = function() {			
		for(var i = this.rows_.length; i--;) {
			if(this.rows_[i].isSelected){
				this.rows_.splice(i, 1);	
			}
		}    
	}		
	this.setMarginRight = function(){		
		if(properties.showlistShowCover){
			this.MarginRight = this.MarginRightFromCover + this.CoverSize;
		} else {
			this.MarginRight = this.MarginRightStandard;
		}
		if((brw.w - this.MarginLeft - this.MarginRight)>properties.showlistWidthMax){
			this.MarginRight -= properties.showlistWidthMax - (brw.w - this.MarginLeft - this.MarginRight)
		}
	}
	this.saveCurrent = function(){	
		this.saved_idx = this.idx;
		this.saved_columnsOffset = this.columnsOffset;
		this.saved_rowIdx = this.rowIdx;
	}	
	this.restore = function(){	
		this.idx = this.saved_idx;
		this.columnsOffset = this.saved_columnsOffset;
		this.rowIdx = this.saved_rowIdx;
		this.refresh();		
	}	
	this.refresh = function(){				
		if(this.idx>=0){
			playlist = brw.groups[this.idx].pl;
			this.calcHeight(playlist, this.idx,this.columnsOffset);
			this.reset(this.idx, this.rowIdx);
		}
	}
	this.refreshRows = function(){				
		for(var i = this.rows_.length; i--;) {
			this.rows_[i].refresh();
		} 
	}	
    this.calcHeight = function(playlist, drawn_idx, columnsOffset) {		
		columnsOffset = typeof columnsOffset !== 'undefined' ? columnsOffset : 0;		
		
		var playlist = brw.groups[brw.groups_draw[drawn_idx]].pl;		
		this.drawn_idx = drawn_idx;
		
		try{
			if(this.pl[0].RawPath!=playlist[0].RawPath) this.g_wallpaperImg = null;
		}catch(e){this.g_wallpaperImg = null}
		
        this.pl = playlist;	

		this.isPlaying = false;		
		if(brw.followActivePlaylist && window.IsVisible) {
			plman.SetPlaylistFocusItemByHandle(plman.ActivePlaylist,this.pl[0]);
		}		
		
		if(properties.showlistShowCover){
			this.heightMin = properties.showlistheightMinCover;	
		} else {
			this.heightMin = properties.showlistheightMin;	
		}		
		
		this.CoverSize = properties.showlistCoverMaxSize;
		this.totalColsVisMax=1;
		var decrement_count = 1;
		while(this.CoverSize > properties.showlistCoverMinSize && this.totalColsVisMax==1){
			this.setMarginRight();
			// how many columns visibles?
			this.totalColsVisMax = Math.floor((brw.w - this.MarginLeft - this.MarginRight) / this.columnWidthMin);
			if(this.totalColsVisMax > 2) this.totalColsVisMax = 2;
			else if(this.totalColsVisMax < 1) this.totalColsVisMax = 1;
			this.CoverSize -= decrement_count;			
			decrement_count++;
		}
		if(properties.showlistScrollbar)
			this.heightMax = window.Height-brw.rowHeight-100;
		else
			this.heightMax = 100000;
		
		if(this.heightMin>this.heightMax) this.heightMax=this.heightMin;
        this.totaltracks = this.pl.Count;
        this.rows_.splice(0, this.rows_.length);
        this.totalHeight = 0;
		var playing_track = fb.GetNowPlaying();
        for(var i = 0; i < this.totaltracks; i++) {
            this.rows_.push(new oRow(this.pl[i],i));
            this.totalHeight += this.textHeight;
			if(!this.isPlaying && playing_track!=null && this.pl[i].Compare(playing_track)) {
				this.isPlaying = true;
				brw.groups[brw.groups_draw[drawn_idx]].isPlaying = true; 
				brw.isPlayingIdx = brw.groups_draw[drawn_idx];
			}
        }

        if(this.totalColsVisMax > properties.showlistMaxColumns && properties.showlistMaxColumns>0) this.totalColsVisMax = properties.showlistMaxColumns;		

		if(this.pl.Count%2==1 && this.totalColsVisMax>1)
			this.totalHeight += this.textHeight;		
		
        var a = Math.ceil(this.totalHeight / this.totalColsVisMax);
		if(this.totaltracks%2==1) {a+=this.textHeight;}
        switch(true) {
        case (this.totalHeight < this.heightMin - this.paddingTop - this.paddingBot - (this.marginTop+this.marginBot)) :
            this.h = this.heightMin;
            this.totalColsVis = 1;
            this.totalCols = 1;
            break;
        case (a <= this.heightMin - this.paddingTop - this.paddingBot - (this.marginTop+this.marginBot)) :
            this.h = this.heightMin;
            this.totalColsVis = this.totalColsVisMax;
            this.totalCols = this.totalColsVisMax;
            break;
        default:
            if(a > this.heightMax - this.paddingTop - this.paddingBot - (this.marginTop+this.marginBot)) {
                this.h = this.heightMax - ((this.pl.Count%2==1)?this.textHeight:0);
				this.h = this.h - this.h%this.textHeight;
            } else {
                this.h = a + this.paddingTop + this.paddingBot + (this.marginTop+this.marginBot) - ((this.pl.Count%2==1)?this.textHeight:0);
            }
            this.totalColsVis = this.totalColsVisMax;
            this.totalCols = Math.ceil(this.totalHeight / a);
        }
		
		if(this.CoverSize>this.h-this.marginCover-10) this.CoverSize=this.h-this.marginCover-10;
		this.coverRealSize = this.CoverSize-2*this.marginCover;
		this.setMarginRight();	
		
        // calc columnWidth to use for drawing
		if(this.totalColsVis==0) this.totalColsVis=1;
		if(properties.showlistMaxColumns<this.totalColsVis && properties.showlistMaxColumns>0) this.totalColsVis=properties.showlistMaxColumns;
        this.columnWidth = Math.floor(brw.w - this.MarginLeft - this.MarginRight) / this.totalColsVis;		
				
		this.setColumns(columnsOffset);	
    }
    
    this.setColumns = function(columnsOffset) {		
        this.columnsOffset = columnsOffset;
        this.columns.splice(0, this.columns.length);
        this.totaltracks = this.rows_.length;
		
		var h_max = this.h - this.paddingTop - this.paddingBot - (this.marginTop+this.marginBot);
		
        if(this.totalHeight > h_max) {
            var a = Math.ceil((this.totalHeight + (15 + 8)) / this.totalColsVisMax) + 8;
        } else {
            var a = h_max;
        }

        var colHeight = 0;
        var k = 0;
		
        // check rows height to get # of colums
        for(var i = 0; i < this.totaltracks; i++) {
            if(i == 0) this.columns.push(new oColumn());
            colHeight += this.textHeight;
            if(colHeight <= h_max && colHeight <= a && Math.ceil(this.totaltracks/this.totalColsVis)>this.columns[k].rows.length) {
                this.columns[k].rows.push((this.rows_[i]));
            } else {
                this.columns.push(new oColumn());
                k++;
                this.columns[k].rows.push((this.rows_[i]));
                colHeight = this.textHeight;
            }
        }       
        this.totalCols = this.columns.length;
		
		/*if(this.totalCols>this.totalColsVis) {
			this.h += this.hscr_height-20;
		}*/
    }
	this.isHover_hscrollbar = function(x,y){	
		if(!this.hscr_visible) {
			this.scrollbar_hover = false;
			this.scrollbar_cursor_hover = false;
			return false;	
		}
		this.scrollbar_hover = (y > this.hscr_y && y < this.hscr_y + this.hscr_height && x > this.x+this.prev_bt.w && x < this.x+this.w-this.next_bt.w);	
		this.scrollbar_cursor_hover = (this.scrollbar_hover && x > this.hscr_x && x < this.hscr_x+this.hscr_cursor_width);
		return this.scrollbar_hover;
	}
	this.setColumnsOffset = function(offset_value){
		this.columnsOffset = offset_value;
		this.hscr_cursor_pos = this.columnsOffset * this.hscr_step_width;
	}
    this.draw = function(gr) {
	
		if(this.idx < 0) return;
		if(!isImage(this.cover_img)){
			this.setCover();
		}		
		if((properties.showListColoredMixedColor || properties.showListColoredOneColor) && !this.getColorSchemeFromImageDone){
			this.getColorSchemeFromImage();	
		}
        if(this.delta > 0) {
            this.y = Math.round(eval(this.parentPanelName+".y") + ((this.rowIdx + 1) * eval(this.parentPanelName+".rowHeight")) + eval(this.parentPanelName+".marginTop") - scroll_);
            if(this.y > 0 - (eval(this.parentPanelName+".h") + this.h) && this.y < eval(this.parentPanelName+".y") + eval(this.parentPanelName+".h")) {

                var slh = Math.floor(this.delta_ < (this.marginTop+this.marginBot) ? 0 : this.delta_ - (this.marginTop+this.marginBot));
				
				if(properties.showListColoredBlurred) {
					try {
						gr.DrawImage(this.g_wallpaperImg, this.x, this.y + this.marginTop, this.w + g_scrollbar.w, slh+1, 0, 0, this.g_wallpaperImg.Width, this.g_wallpaperImg.Height);
						gr.FillSolidRect(this.x, this.y + this.marginTop, this.w + g_scrollbar.w, slh+1, this.colorSchemeOverlay);
					} catch(e) {
						gr.FillSolidRect(this.x, this.y + this.marginTop, this.w + g_scrollbar.w, slh+1, this.colorSchemeBack);
					}
				}
				else if(properties.showListColoredMixedColor) {
					try {
						if((this.h-this.delta_)<40) {
							gr.DrawImage(this.g_wallpaperImg, this.x, this.y + this.marginTop, this.w + g_scrollbar.w, slh+1, 0, 0, this.g_wallpaperImg.Width, this.g_wallpaperImg.Height);
							gr.FillSolidRect(this.x, this.y + this.marginTop, this.w + g_scrollbar.w, slh+1, this.colorSchemeOverlay);
						} else gr.FillSolidRect(this.x, this.y + this.marginTop, this.w + g_scrollbar.w, slh+1, this.colorSchemeBack);
					} catch(e) {
						gr.FillSolidRect(this.x, this.y + this.marginTop, this.w + g_scrollbar.w, slh+1, this.colorSchemeBack);
					}
				} else gr.FillSolidRect(this.x, this.y + this.marginTop, this.w + g_scrollbar.w, slh+1, this.colorSchemeBack);
								                
                if(slh > 0) {
                    // draw Album Selected Arrow
                    var arrowItemIdx = (this.drawn_idx % brw.totalColumns) + 1;
                    var arrow_x = brw.marginLR + (arrowItemIdx * brw.thumbnailWidth) - Math.round((brw.thumbnailWidth) / 2) - 13;
                    var arrow_y = this.y - 4;
                    var arrow_offsetY = Math.floor((this.delta_ / (this.delta*brw.rowHeight)) * 19);
                    if(arrow_offsetY > 16) arrow_offsetY = 17;
                    gr.DrawImage(this.showListArrow, arrow_x, arrow_y + (9 - arrow_offsetY)+this.marginTop, 27, arrow_offsetY, 0, 0, 27, 17, 0, 255);
					             
					//top
					gr.FillSolidRect(this.x, this.y+this.marginTop, arrow_x-this.x+2, 1, this.border_color);
					gr.FillSolidRect(this.x+arrow_x-this.x+24, this.y+this.marginTop, this.w-arrow_x-25, 1, this.border_color);
					
					// draw horizontal scrollbar for multi columns album
					if(slh > this.paddingBot*2 && this.totalCols > this.totalColsVis) {	
						this.hscr_visible = true;
	
						//this.hscr_cursor_pos = this.columnsOffset * this.hscr_step_width;	
						this.hscr_y = this.y + this.marginTop + slh - this.hscr_height;
						this.hscr_x = this.x+12+(this.prev_bt.w)+this.hscr_cursor_pos;	
						
						if(this.scrollbar_cursor_hover) var vpadding = this.hscr_vpadding_hover;
						else var vpadding = this.hscr_vpadding;
						
						if(this.drag_showlist_hscrollbar) {
							var vpadding = this.hscr_vpadding_hover;
							this.drag_Offset = this.drag_x - this.drag_start_x;
							if(this.hscr_x+this.drag_Offset<this.x+12+this.prev_bt.w) this.drag_Offset = this.x+12+this.prev_bt.w-this.hscr_x;
							else if(this.hscr_x+this.drag_Offset+this.hscr_cursor_width>this.x+this.hscr_width+this.prev_bt.w+52) this.drag_Offset = this.x+this.hscr_width+this.prev_bt.w+52-this.hscr_x-this.hscr_cursor_width;
						} else this.drag_Offset = 0							
						
						//BG						
						//if(!properties.showListColoredBlurred) gr.FillSolidRect(this.x, this.hscr_y-1, this.w, 24, this.colorSchemeBgScrollbar);		
						
						//Bottom line									
						gr.FillSolidRect(this.x, this.hscr_y +this.hscr_height, this.w, 1, this.border_color);								
						
						//Cursor
						gr.FillSolidRect(this.hscr_x+this.drag_Offset, this.hscr_y+vpadding, this.hscr_cursor_width, this.hscr_height-vpadding*2, this.scrollbar_cursor_color);
						
						//Prev / next column buttons
						gr.FillSolidRect(this.x+this.prev_bt.w-1, this.hscr_y, 1, this.hscr_height+1, this.scrollbar_border_color);
						gr.FillSolidRect(this.x+50+(this.prev_bt.w+15) + this.hscr_width, this.hscr_y, 1, this.hscr_height+1, this.scrollbar_border_color);
						//Line above scrollbar
						gr.FillGradRect(this.x, this.hscr_y-1, this.w, 1, 0, this.scrollbar_border_color, this.scrollbar_border_color, 1.0);									
						this.prev_bt.draw(gr, this.x, this.hscr_y-1, this.columnsOffset > 0 ? 255 : 55);
						this.next_bt.draw(gr, this.x+50+(this.prev_bt.w+15) + this.hscr_width, this.hscr_y-1, this.columnsOffset < this.totalCols - this.totalColsVis ? 255 : 55);						
					} else {
						//bottom line
						gr.FillSolidRect(this.x, this.y+this.marginTop+slh, this.w, 1, this.border_color);
					}						                   
                }
				
                // Text Info / Album opened
                var tx = this.x + 17 + this.MarginLeft;
                var ty = this.y + 34 + g_fsize;
                if(ty < this.y + slh) {
                    var nb_cols_drawn = this.totalCols > this.totalColsVisMax ? this.totalColsVisMax : this.totalCols;
                    this.text_w = Math.floor(brw.w - this.MarginLeft - this.MarginRight) + 5;
					
					rowWidth = (this.totalColsVis == 1) ? this.columnWidth + 10 : this.columnWidth;
					rightfix = 0;
					if(this.totalCols==1){
						if(rowWidth<properties.showlistRowWidthMin) {
							rowWidth=properties.showlistRowWidthMin;
							if(rowWidth>=this.text_w) rowWidth=this.text_w+3;
						}
						if(rowWidth>properties.showlistRowWidthMax){
							rightfix = rowWidth - properties.showlistRowWidthMax;							
							this.text_w = this.text_w - (rightfix)
							rowWidth=properties.showlistRowWidthMax;

						}
					}
					var item_height = 5+g_fsize;
					var genreText = this.genre.replace(/\s+/g, " ");
					if(this.genreTextLenght==0) this.genreTextLenght = gr.CalcTextWidth(genreText,g_font.normal);
					if(this.timeTextLenght==0) this.timeTextLenght = gr.CalcTextWidth(this.length+',  '+this.total_tracks,g_font.normal);
					
					if (this.links.album.state == ButtonStates.hover) {
						var first_row_color = this.colorSchemeTextFaded;
						var first_row_font = g_font.italicplus5;
					} else {
						var first_row_color = this.colorSchemeText;			
						var first_row_font = g_font.italicplus5;						
					}					
					
					if (this.links.artist.state == ButtonStates.hover) {
						var second_row_color = this.colorSchemeText;
						var second_row_font = g_font.plus2;
					} else {
						var second_row_color = this.colorSchemeTextFaded;
						var second_row_font = g_font.plus2;						
					}
					
					if (this.links.genre.state == ButtonStates.hover) {
						var genre_color = this.colorSchemeText;
						var genre_font = g_font.normal;
					} else {
						var genre_color = this.colorSchemeTextFaded;
						var genre_font = g_font.normal;						
					}				
					
                    gr.GdiDrawText(this.firstRow, first_row_font, first_row_color, tx+4, ty, this.w - this.MarginRight - 40 - this.timeTextLenght, item_height, DT_LEFT | DT_BOTTOM | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);					
                    gr.GdiDrawText(this.secondRow, second_row_font, second_row_color, tx+4, ty + 8+g_fsize, this.w - this.MarginRight - 25 - this.genreTextLenght, item_height, DT_LEFT | DT_BOTTOM | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
                    gr.GdiDrawText(this.length+',  '+this.total_tracks, g_font.normal, this.colorSchemeTextFaded, (brw.groups_draw.length>1) ? tx-32 : tx-13, ty-2, this.text_w, item_height, DT_RIGHT | DT_BOTTOM | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
                    gr.GdiDrawText(genreText, genre_font, genre_color, tx-13, ty + item_height, this.text_w, item_height, DT_RIGHT | DT_BOTTOM | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
					
					if(typeof this.firstRowLength == 'undefined') this.firstRowLength = gr.CalcTextWidth(this.firstRow,g_font.italicplus5);		
					if(typeof this.secondRowLength == 'undefined') this.secondRowLength = gr.CalcTextWidth(this.secondRow,g_font.plus2);							

					if(properties.TFgrouping==""){
						this.links.album.setPosition( tx+4, ty,this.firstRowLength,item_height);			
						this.links.artist.setPosition( tx+4, ty + 8+g_fsize,this.secondRowLength,item_height);
						this.links.genre.setPosition( tx-13+this.text_w-this.genreTextLenght, ty + item_height,this.genreTextLenght,item_height);
					} else {
						this.links.album.changeState(ButtonStates.hide);			
						this.links.artist.changeState(ButtonStates.hide);			
						this.links.genre.setPosition( tx-13+this.text_w-this.genreTextLenght, ty + item_height,this.genreTextLenght,item_height);
					}
					
					this.TopInfoY = ty;
					this.TopInfoHeight = 18+g_fsize*3;					
					
					this.showToolTip = (this.firstRowLength > (this.w - this.MarginRight - 40 - this.timeTextLenght) || this.secondRowLength > (this.w - this.MarginRight - 40 - this.timeTextLenght))
                }
				
				//draw album cover								
				if(properties.showlistShowCover && this.idx > -1 && isImage(this.cover_img) && (this.h-this.delta_)<40){
					if(properties.showCoverShadow && properties.CoverShadowOpacity>0) {
						if(!this.cover_shadow || this.cover_shadow==null) this.cover_shadow = createCoverShadowStack(this.coverRealSize, this.coverRealSize, colors.cover_shadow,10);
						gr.DrawImage(this.cover_shadow, this.x+this.w-this.CoverSize+this.marginCover-8, this.y+this.marginTop+this.marginCover-8, this.coverRealSize+20, this.coverRealSize+20, 0, 0, this.cover_shadow.Width, this.cover_shadow.Height);
					}
					gr.DrawImage(this.cover_img, this.x+this.w-this.CoverSize+this.marginCover, this.y+this.marginTop+this.marginCover, this.coverRealSize, this.coverRealSize, 0, 0, this.cover_img.Width, this.cover_img.Height);					
				}
				
                // draw columns & tracks
                if(this.idx > -1) {
                    var k = 0;
                    var cx = 0, cy = this.y + this.paddingTop;
					
                    for(var c = this.columnsOffset; c < this.columnsOffset + this.totalColsVis; c++) {
                        if(this.columns[c]) {
                            cx = this.MarginLeft + (k*this.columnWidth) + (k*10);
                            for(var r = 0; r < this.columns[c].rows.length; r++) {
                                if(cy < this.y + slh) {
                                    this.columns[c].rows[r].draw(gr, Math.floor(cx), cy, rowWidth);
                                }
                                cy += this.columns[c].rows[r].h;
                            }
                            k++;
                            cy = this.y + this.paddingTop;
                        }
                    }
                }
                
                // close button
                if(slh > this.paddingBot*2 && brw.groups_draw.length>1) {
                    this.close_bt.draw(gr, this.x+this.w-this.MarginRight-4-rightfix, ty +17-this.close_bt.img[0].Height, 255);
                }				
            }
        } else {
            this.y = -1;
        } 
    }
}


oHeaderBar = function(name) {
	this.mainTxt="";
	this.timeTxt="";
	this.itemsTxt="";
	this.rightpadding=140;
	this.MarginLeft=23;
	this.MarginRight=28;	
	this.padding_top = 9;
	this.btn_left_margin = 25;	
	this.white_space = 4;
	this.RightTextLength = 0;
	this.mainTxtLength = 0;
	this.mainTxtX = 0;
	this.mainTxtSpace = 0;				
	this.showToolTip = false;	
	this.h = 0;
	this.tooltipActivated = false;	
	this.setSize = function(x, y, w, h) {
		this.x=x;
		this.y=y;	
		this.w = ww;
		this.h = brw.headerBarHeight-this.white_space;
	}
    this.setButtons = function () {
		var gb;
		
		this.full_library_off = gdi.CreateImage(23, 23);
		gb = this.full_library_off.GetGraphics();
			gb.SetSmoothingMode(2);
			gb.DrawLine(7, 12, 12, 8, 1.0, colors.normal_txt);
			gb.DrawLine(7, 12, 12, 16, 1.0, colors.normal_txt);
			gb.SetSmoothingMode(0);
			gb.FillSolidRect(7,12,10,1,colors.normal_txt);
		this.full_library_off.ReleaseGraphics(gb);

		this.full_library_hover = gdi.CreateImage(23, 23);
		gb = this.full_library_hover.GetGraphics();
			gb.SetSmoothingMode(2);
			gb.FillEllipse(0,0,23,23,colors.headerbar_settings_bghv);
			gb.DrawLine(7, 12, 12, 8, 1.0, colors.normal_txt);
			gb.DrawLine(7, 12, 12, 16, 1.0, colors.normal_txt);
			gb.SetSmoothingMode(0);
			gb.FillSolidRect(7,12,10,1,colors.normal_txt);			
		this.full_library_hover.ReleaseGraphics(gb);
				
		if(typeof(this.FullLibraryButton) == "undefined") {
			this.FullLibraryButton = new button(this.full_library_off, this.full_library_hover, this.full_library_off,"fulllibrary");
		} else {
			this.FullLibraryButton.img[0] = this.full_library_off;
			this.FullLibraryButton.img[1] = this.full_library_hover;
			this.FullLibraryButton.img[2] = this.full_library_off;
		}
		
		this.settings_off = gdi.CreateImage(23, 23);
		gb = this.settings_off.GetGraphics();
			gb.SetSmoothingMode(0);
			/*gb.FillSolidRect(7,7,10,1,colors.normal_txt);
			gb.FillSolidRect(7,10,10,1,colors.normal_txt);
			gb.FillSolidRect(7,13,10,1,colors.normal_txt);
			gb.FillSolidRect(7,16,10,1,colors.normal_txt);*/
			gb.FillSolidRect(6,11,2,2,colors.faded_txt);
			gb.FillSolidRect(11,11,2,2,colors.faded_txt);
			gb.FillSolidRect(16,11,2,2,colors.faded_txt);		
		this.settings_off.ReleaseGraphics(gb);

		this.settings_hover = gdi.CreateImage(23, 23);
		gb = this.settings_hover.GetGraphics();
			gb.SetSmoothingMode(2);
			gb.FillEllipse(0,0,23,23,colors.headerbar_settings_bghv);
			gb.SetSmoothingMode(0);
			/*gb.FillSolidRect(7,7,10,1,colors.normal_txt);
			gb.FillSolidRect(7,10,10,1,colors.normal_txt);
			gb.FillSolidRect(7,13,10,1,colors.normal_txt);
			gb.FillSolidRect(7,16,10,1,colors.normal_txt);*/
			gb.FillSolidRect(6,11,2,2,colors.normal_txt);
			gb.FillSolidRect(11,11,2,2,colors.normal_txt);
			gb.FillSolidRect(16,11,2,2,colors.normal_txt);		
		this.settings_hover.ReleaseGraphics(gb);
				
		if(typeof(this.SettingsButton) == "undefined") {
			this.SettingsButton = new button(this.settings_off, this.settings_hover, this.settings_off,"settings_bt");
		} else {
			this.SettingsButton.img[0] = this.settings_off;
			this.SettingsButton.img[1] = this.settings_hover;
			this.SettingsButton.img[2] = this.settings_off;
		}		

		this.SettingsButton.y = this.padding_top-1;
    }	
	this.setButtons();
    this.draw = function(gr) {
		gr.FillSolidRect(0, 0, ww, this.h,colors.headerbar_bg);

		//bottom line
		gr.FillSolidRect(0, this.h, ww, 1,colors.headerbar_line);	
		if(brw.playlistName != globalProperties.whole_library && !libraryfilter_state.isActive()) {
			this.FullLibraryButton.hide = false;	
			this.FullLibraryButton.draw(gr,this.MarginLeft-3,this.padding_top-1,255);
			this.btn_left_margin = 25;
		} else {
			this.FullLibraryButton.hide = true;			
			this.btn_left_margin = 4;			
		}
		if(properties.displayToggleBtns) {
			this.rightpadding=140;
		} else {
			this.rightpadding=105;			
		}
		
		this.SettingsButton.x = ww-47;
		this.SettingsButton.draw(gr,this.SettingsButton.x,this.SettingsButton.y,255);
		
		if(properties.showCoverResizer) {
			brw.drawResizeButton(gr,ww-this.rightpadding-5-this.MarginRight,Math.round((this.h-brw.resize_bt.img[0].Height)/2));
			this.resize_bt_w = brw.resize_bt.w+34;
		} else this.resize_bt_w = 0;
		
		this.mainTxtX = this.MarginLeft+this.btn_left_margin;
		
		if(this.RightTextLength<0) {
			this.RightTextLength = gr.CalcTextWidth(this.itemsTxt+this.timeTxt,g_font.italicmin2);		
			if(brw.showFilterBox) g_filterbox.setSize(ww-this.resize_bt_w-this.rightpadding-this.RightTextLength-this.MarginRight-this.mainTxtX+20, cFilterBox.h, g_fsize+2);					
		}
		
		if(!brw.showFilterBox) {
			this.mainTxtX = this.MarginLeft+this.btn_left_margin;
			this.mainTxtSpace = ww-this.resize_bt_w-this.rightpadding-this.RightTextLength-this.MarginRight-this.mainTxtX;				
			if(this.mainTxtLength<0){
				this.mainTxtLength = gr.CalcTextWidth(this.mainTxt,g_font.italicplus2);	
			}
			this.showToolTip = (this.mainTxtLength > this.mainTxtSpace);			
			gr.GdiDrawText(this.mainTxt, g_font.italicplus2, colors.normal_txt, this.mainTxtX, 1, this.mainTxtSpace, this.h-2, DT_VCENTER | DT_END_ELLIPSIS | DT_CALCRECT | DT_NOPREFIX);    
		}
		if(covers_loading_progress<101 && properties.show_covers_progress)
			gr.GdiDrawText("Cover loading progress: "+covers_loading_progress+"%", g_font.italicmin1, colors.faded_txt, this.mainTxtX, 0, ww + 39-this.resize_bt_w-this.rightpadding-this.MarginRight, this.h, DT_VCENTER | DT_RIGHT | DT_WORDBREAK | DT_CALCRECT | DT_NOPREFIX);
		else 
			gr.GdiDrawText(this.timeTxt+this.itemsTxt, g_font.italicmin1, colors.faded_txt, this.mainTxtX, 0, ww+60-this.resize_bt_w-this.rightpadding-this.MarginRight-this.mainTxtX, this.h, DT_VCENTER | DT_RIGHT | DT_WORDBREAK | DT_CALCRECT | DT_NOPREFIX);				
	}	
	this.isHover_Settings = function(x,y){
		if(x>this.MarginLeft-7 && x<this.MarginLeft+23 && y>this.padding_top && y<this.padding_top+23) return true;
		return false;
	}
	this.setDisplayedInfo = function() {
		this.timeTxt="";
		if(brw.finishLoading) {
			if(brw.playlistItemCount) {
				if(!properties.showTotalTime) this.timeTxt = '';	
				else if(brw.totalTime>0) this.timeTxt = brw.FormatTime(brw.totalTime);
				else this.timeTxt = 'ON AIR';					
			
				this.itemsTxt=((properties.showTotalTime)?',  ':'')+brw.playlistItemCount+' track'+((brw.playlistItemCount>1)?"s":"")+',  '+brw.groups_draw.length+' group'+((brw.groups_draw.length>1)?"s":"");				
				
				// Main Text, Left justified
				if(brw.playlistName==globalProperties.whole_library){
					this.mainTxt='Whole Library';
				} else if(brw.playlistName!=globalProperties.selection_playlist && brw.playlistName!=globalProperties.playing_playlist){
					this.mainTxt='Playlist : '+brw.playlistName;
				} else if(brw.albumName!="" && brw.albumName!="?") {
					if(brw.date!="" && brw.date!="?") var albumName = brw.albumName + ' (' + brw.date + ')';
					else var albumName = brw.albumName
					if(brw.artistName!="") this.mainTxt = albumName+' - '+brw.artistName;			
					else this.mainTxt = albumName;       					
				} else if(brw.artistName!="" && brw.artistName!="?") {
					this.mainTxt=brw.artistName;        
				} else if(brw.genreName!="" && brw.artistName!="?") {
					this.mainTxt=brw.genreName;        				
				} else if(brw.playlistName==globalProperties.selection_playlist || brw.playlistName==globalProperties.playing_playlist){
					if(brw.date!="" && brw.date!="?") {
						this.mainTxt='Date : '+brw.date;        		
					} else this.mainTxt='Mixed selection';        
				}        
				else {
					this.mainTxt='Playlist : '+brw.playlistName;      
				} 		
			} else if(brw.playlistName==globalProperties.selection_playlist || brw.playlistName==globalProperties.playing_playlist) {            
				this.mainTxt=''+brw.playlistName;
				this.itemsTxt='Empty selection';        
			} else {            
				this.mainTxt='Playlist : '+brw.playlistName;
				this.itemsTxt='Empty Playlist';        
			}  	
			if(brw.SourcePlaylistIdx==plman.PlayingPlaylist) this.mainTxt+= ' (playing)';
		} else {            
				this.mainTxt='Loading ...';
				this.itemsTxt='';        
		}
		g_filterbox.inputbox.empty_text = ''+this.mainTxt+'';
		this.RightTextLength = -1;
		this.mainTxtLength = -1;		
		update_headerbar = false;
	}	
    this.on_mouse = function(event, x, y) {
        this.ishover = (x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h);
        this.ishoverMainText = this.ishover && (x >= this.mainTxtX && x <= this.mainTxtX+this.mainTxtSpace);
        switch(event) {
            case "lbtn_up":
				if((!this.SettingsButton.hide) && this.SettingsButton.state == ButtonStates.hover) {
					if(!g_avoid_settings_button){
						this.SettingsButton.state = ButtonStates.normal;
						window.RepaintRect(this.x,this.y,this.w,this.h);
						this.draw_header_menu(this.SettingsButton.x+30, this.SettingsButton.y+25,true);
					}
				}
				if((!this.FullLibraryButton.hide)  && this.FullLibraryButton.state == ButtonStates.hover) {
					window.RepaintRect(this.x,this.y,this.w,this.h);
					//g_history.restoreLastElem();
					g_history.fullLibrary();
					//if(plman.GetPlaylistName(plman.ActivePlaylist) == globalProperties.whole_library) FocusOnNowPlaying = true;
					window.NotifyOthers("history_previous",true);
				}
                break;	
            case "lbtn_dblclk":
				if((brw.playlistName != globalProperties.whole_library && !libraryfilter_state.isActive())  && this.FullLibraryButton.state == ButtonStates.hover) {
					//g_avoid_on_playlist_switch = true;
					g_history.fullLibrary();
					g_history.reset();
					//brw.populate(33)
					//FocusOnNowPlaying = true;
					window.NotifyOthers("history_previous",true);
				}
                break;				
            case "move":
				if(typeof(this.SettingsButton) !== "undefined") this.SettingsButton.checkstate("move", x, y);
				if(typeof(this.FullLibraryButton) !== "undefined") this.FullLibraryButton.checkstate("move", x, y);
				if(properties.showToolTip && this.showToolTip && this.ishoverMainText && !(g_dragA || g_dragR || g_scrollbar.cursorDrag)){	
					new_tooltip_text=this.mainTxt;
					g_tooltip.ActivateDelay(new_tooltip_text, x+10, y+20, globalProperties.tooltip_delay);	
					this.tooltipActivated = true;
				} else if(this.tooltipActivated) {
					g_tooltip.Deactivate();	
					this.tooltipActivated = false;
				}				
                break;
            case "rbtn_up":
				this.draw_header_menu(x, y,false);				
                break;					
            case "leave":
				if(typeof(this.SettingsButton) !== "undefined") this.SettingsButton.checkstate("move", x, y);
				if(typeof(this.FullLibraryButton) !== "undefined") this.FullLibraryButton.checkstate("move", x, y);
                break;
        }
    }
	this.append_sort_menu = function(basemenu,actions){
		if(!plman.IsAutoPlaylist(plman.ActivePlaylist)){
			var SortMenu = window.CreatePopupMenu(); //Custom Entries
			SortMenu.AppendTo(basemenu, MF_STRING, "Sort By");

			SortMenu.AppendMenuItem(MF_STRING, 3000, "Don't sort (Playing order)");		
			SortMenu.AppendMenuSeparator();			
			SortMenu.AppendMenuItem(MF_STRING, 3001, "Artist / Album / Tracknumber");					
			SortMenu.AppendMenuItem(MF_STRING, 3002, "Title");
			SortMenu.AppendMenuItem(MF_STRING, 3003, "Tracknumber");		
			SortMenu.AppendMenuItem(MF_STRING, 3004, "Date");	
			SortMenu.AppendMenuItem(MF_STRING, 3005, "Date added to library (Newest first)");	
			SortMenu.AppendMenuItem(MF_STRING, 3006, "Custom titleformat...");	
			
			checked_item=0;
			switch (true) {			
				case (brw.currentSorting.indexOf(sort_by_album_artist) > -1):
					checked_item=3001
					break; 					
				case (brw.currentSorting.indexOf(sort_by_title) > -1):
					checked_item=3002
					break;  	
				case (brw.currentSorting.indexOf(sort_by_tracknumber) > -1):
					checked_item=3003
					break;  
				case (brw.currentSorting.indexOf(sort_by_date) > -1):
					checked_item=3004
					break;  
				case (brw.currentSorting.indexOf(sort_by_date_added) > -1):
					checked_item=3005
					break;
				case (brw.currentSorting=="" || !brw.currently_sorted):
					checked_item=3000
					break; 						
				default:
					checked_item=3006
					break;				
			}
			SortMenu.CheckMenuRadioItem(3000, 3006, checked_item);	
			SortMenu.AppendMenuSeparator();			
	
			SortMenu.AppendMenuItem(MF_STRING, 3007, "Randomize");		
			SortMenu.AppendMenuSeparator();						
			SortMenu.AppendMenuItem(MF_STRING, 3008, "Reverse sort order");		
			SortMenu.CheckMenuItem(3008, properties.SortDescending);			
			SortMenu.AppendMenuSeparator();			
			SortMenu.AppendMenuItem(MF_STRING, 3009, "Set current sorting as default");
			SortMenu.CheckMenuItem(3009, (brw.currentSorting==properties.TFsorting_default));	

			actions[3000] = function(){	
				properties.TFsorting = "";
				window.SetProperty("MAINPANEL Library Sort TitleFormat", properties.TFsorting);		
				g_showlist.close();
				brw.populate(4,true);	
			}				
			actions[3001] = function(){	
				properties.TFsorting = sort_by_album_artist+"#1";
				window.SetProperty("MAINPANEL Library Sort TitleFormat", properties.TFsorting);		
				g_showlist.close();
				brw.populate(5,true);				
			}	   
			actions[3002] = function(){	
				properties.TFsorting = sort_by_title+"#1";
				window.SetProperty("MAINPANEL Library Sort TitleFormat", properties.TFsorting);		
				g_showlist.close();
				brw.populate(6,true);				
			}	    
			actions[3003] = function(){	
				properties.TFsorting = sort_by_tracknumber+"#1";
				window.SetProperty("MAINPANEL Library Sort TitleFormat", properties.TFsorting);	
				g_showlist.close();
				brw.populate(7,true);				
			}	
			actions[3004] = function(){	
				properties.TFsorting = sort_by_date+"#1";
				window.SetProperty("MAINPANEL Library Sort TitleFormat", properties.TFsorting);		
				g_showlist.close();
				brw.populate(8,true);				
			}		
			actions[3005] = function(){	
				properties.TFsorting = sort_by_date_added+"#-1";
				window.SetProperty("MAINPANEL Library Sort TitleFormat", properties.TFsorting);	
				g_showlist.close();
				brw.populate(9,true);				
			}		
			actions[3006] = function(){			
				try {
					new_TFsorting = utils.InputBox(window.ID, "Enter a title formatting script.\nYou can use the full foobar2000 title formatting syntax here.\n\nSee http://tinyurl.com/lwhay6f\nfor informations about foobar title formatting.", "Custom Sort Order", brw.currentSorting, true);
					if (!(new_TFsorting == "" || typeof new_TFsorting == 'undefined')) {
						properties.TFsorting = new_TFsorting;
						window.SetProperty("MAINPANEL Library Sort TitleFormat", properties.TFsorting);	
						g_showlist.close();
						brw.populate(5,true);	
					}			   
				} catch(e) {
				}				
			}					
			actions[3007] = function(){	
				brw.dont_sort_on_next_populate = true;			
				plman.SortByFormat(brw.SourcePlaylistIdx,"");
				g_showlist.close();
				brw.populate("randomize",true);
			}			
			actions[3008] = function(){	
                properties.SortDescending = !properties.SortDescending;	
                window.SetProperty("MAINPANEL sort descending", properties.SortDescending);
				g_showlist.close();
				brw.populate(11,true);				
			}	
			actions[3009] = function(){	
				if(properties.TFsorting_default != properties.TFsorting){
					properties.TFsorting_default = properties.TFsorting;
					window.SetProperty("MAINPANEL Library Default Sort TitleFormat", properties.TFsorting_default);					
				} else {
					properties.TFsorting_default = "";
					window.SetProperty("MAINPANEL Default library Sort TitleFormat", "");						
				}
			}			
		}	
	}
	this.append_group_menu = function(basemenu,actions){
		var GroupMenu = window.CreatePopupMenu(); //Custom Entries
		GroupMenu.AppendTo(basemenu, MF_STRING, "Group By");

		GroupMenu.AppendMenuItem(MF_STRING, 4000, "Default (Album, artist)");				
		GroupMenu.AppendMenuItem(MF_STRING, 4001, "Custom titleformat...");	    
		GroupMenu.AppendMenuSeparator();			
		GroupMenu.AppendMenuItem(MF_STRING, 4002, "Combine all tracks of a multi-disc album");	
		GroupMenu.CheckMenuItem(4002, properties.SingleMultiDisc);	
		checked_item=0;
		switch (true) {
			case (properties.TFgrouping.length == 0):
				checked_item=4000
				break; 				
			default:
				checked_item=4001
				break;				
			
		}
		GroupMenu.CheckMenuRadioItem(4000, 4001, checked_item);

		actions[4000] = function(){	
			properties.TFgrouping = ""
			TF.grouping = fb.TitleFormat("");
			window.SetProperty("MAINPANEL Library Group TitleFormat", properties.TFgrouping);	
			g_showlist.close();
			brw.populate(5,false);	
		}
		actions[4001] = function(){	
			try {
			   new_TFgrouping = utils.InputBox(window.ID, "Enter a title formatting script.\nYou can use the full foobar2000 title formatting syntax here.\n\nSee http://tinyurl.com/lwhay6f\nfor informations about foobar title formatting.\n\n", "Custom grouping", brw.current_grouping, true);
				if (!(new_TFgrouping == "" || typeof new_TFgrouping == 'undefined')) {
					properties.TFgrouping = new_TFgrouping;
					TF.grouping = fb.TitleFormat(properties.TFgrouping);
					window.SetProperty("MAINPANEL Library Group TitleFormat", properties.TFgrouping);	
					g_showlist.close();
					brw.populate(5,false);	
				}				   
			} catch(e) {
			}
		}
		actions[4002] = function(){	
			properties.SingleMultiDisc = !properties.SingleMultiDisc;
			window.SetProperty("_SYSTEM: Display one thumbnail for multi discs", properties.SingleMultiDisc);
			g_showlist.close();
			brw.populate("MultiDisc",false);		
		}				
	}
	this.append_properties_menu = function(basemenu,actions){
		basemenu.AppendMenuSeparator();        
		basemenu.AppendMenuItem(MF_STRING, 801, "Tracks properties");
		if(fb.IsPlaying) basemenu.AppendMenuItem(MF_STRING, 802, "Show now playing");

		actions[801] = function(){	
			fb.RunContextCommandWithMetadb("Properties", plman.GetPlaylistItems(brw.getSourcePlaylist()), 0);
		}
		actions[802] = function(){	
			brw.focus_on_now_playing(fb.GetNowPlaying());
		}			
	}	
	this.draw_header_menu = function(x,y,right_align){
		var basemenu = window.CreatePopupMenu();
		var actions = Array();
		
		if (typeof x == "undefined") x=this.MarginLeft-7;
		if (typeof y == "undefined") y=this.padding_top+28;
		
		basemenu.AppendMenuItem(MF_STRING, 1, "Settings...");
		basemenu.AppendMenuSeparator();

		this.append_sort_menu(basemenu, actions);
		this.append_group_menu(basemenu, actions);
		this.append_properties_menu(basemenu, actions);
		
		var menu_settings = window.CreatePopupMenu();	

		if(utils.IsKeyPressed(VK_SHIFT)) {
			basemenu.AppendMenuSeparator();
			basemenu.AppendMenuItem(MF_STRING, 3100, "Properties ");
			basemenu.AppendMenuItem(MF_STRING, 3101, "Configure...");
			basemenu.AppendMenuSeparator();            
			basemenu.AppendMenuItem(MF_STRING, 3102, "Reload");            
		}	
		
		idx = 0;
		if(right_align)
			idx = basemenu.TrackPopupMenu(x, y, 0x0008);
		else
			idx = basemenu.TrackPopupMenu(x, y);
		
		if(properties.SortDescending) sort_order=-1
		else sort_order=1
		
		switch (true) {
            case (idx == 1):
                draw_settings_menu(x,y,right_align,false);
                break;  		
            case (idx == 5):
                window.Reload();
                break;  			
            case (idx == 6):
                window.ShowConfigure();
                break;  
            case (idx == 7):
                window.ShowProperties();
                break;
            case (idx == 8):
                scroll = scroll_ = 0;
                brw.populate(0);
                break;										
			case (idx >= 1000 && idx < 2001):
				SetGenre(idx-1000,plman.GetPlaylistItems(plman.ActivePlaylist));
				break;							
			case (idx == 3100):
				window.ShowProperties();
				break;			
			case (idx == 3101):
				window.ShowConfigure();
				break;	
			case (idx == 3102):
				window.Reload();
				break;		
		}
		if(actions[idx]) actions[idx]();
		
		basemenu = undefined;
		menu_settings = undefined;
		if (typeof SortMenu != "undefined") SortMenu = undefined;		
		if (typeof GroupMenu != "undefined") GroupMenu = undefined;			
	}
}	
function draw_settings_menu(x,y,right_align,sort_group){
	var _menu = window.CreatePopupMenu();	
	var _menu2 = window.CreatePopupMenu();
	var _menu2A = window.CreatePopupMenu();	 
	var _menuGroupDisplay = window.CreatePopupMenu();	
	var _menuCoverShadow = window.CreatePopupMenu();	
	var _menuFilters = window.CreatePopupMenu();		
	var _menuTracklist = window.CreatePopupMenu();	 
	var _menuProgressBar = window.CreatePopupMenu();	
	var _menuBackground = window.CreatePopupMenu(); 
	var _menuRating = window.CreatePopupMenu();
	var _menuHeaderBar = window.CreatePopupMenu();
	var _additionalInfos = window.CreatePopupMenu();
	var actions = Array();
	
	if(sort_group){
		g_headerbar.append_sort_menu(_menu, actions);
		g_headerbar.append_group_menu(_menu, actions);
		_menu.AppendMenuSeparator();		
	}
	_menu.AppendMenuItem(MF_STRING, 10, "Always follow playback");
	_menu.CheckMenuItem(10, properties.followNowPlaying);		
	_menu.AppendMenuItem(MF_STRING, 31, "Show tooltips");
	_menu.CheckMenuItem(31, properties.showToolTip);		
	
	_menu.AppendMenuSeparator();		
	_menuHeaderBar.AppendMenuItem(MF_STRING, 27, "Show");
	_menuHeaderBar.CheckMenuItem(27, properties.showheaderbar);		
	_menuHeaderBar.AppendMenuSeparator();
	_menuHeaderBar.AppendMenuItem((!properties.showheaderbar)?MF_DISABLED:MF_STRING, 30, "Show filter field");
	_menuHeaderBar.CheckMenuItem(30, properties.showFilterBox);		
	_menuHeaderBar.AppendMenuItem((!properties.showheaderbar)?MF_DISABLED:MF_STRING, 41, "Show total time");
	_menuHeaderBar.CheckMenuItem(41, properties.showTotalTime);		
	_menuHeaderBar.AppendMenuItem((!properties.showheaderbar)?MF_DISABLED:MF_STRING, 42, "Show cover resizer");
	_menuHeaderBar.CheckMenuItem(42, properties.showCoverResizer);			
	_menuHeaderBar.AppendTo(_menu,MF_STRING, "Header bar");
	
	_menuFilters.AppendMenuItem(MF_STRING, 40, (!libraryfilter_state.isActive())?"Show":"Hide");
	
	_menuFilters.AppendMenuItem(MF_STRING, 39, "Show toggle button");
	_menuFilters.CheckMenuItem(39, properties.displayToggleBtns);	
	_menuFilters.AppendTo(_menu,MF_STRING, "Left menu");
	
	_menuGroupDisplay.AppendMenuItem(MF_STRING, 25, "Show date over album art");
	_menuGroupDisplay.CheckMenuItem(25, properties.showdateOverCover);	
	_menuGroupDisplay.AppendMenuItem(MF_STRING, 26, "Show disc number over album art");
	_menuGroupDisplay.CheckMenuItem(26, properties.showDiscNbOverCover);	
	_menuGroupDisplay.AppendMenuItem(MF_STRING, 46, "Animate while showing now playing");
	_menuGroupDisplay.CheckMenuItem(46, properties.animateShowNowPlaying);		
	_menuGroupDisplay.AppendMenuItem(MF_STRING, 37, "Circle Artwork");
	_menuGroupDisplay.CheckMenuItem(37, properties.circleMode);	
	_menuGroupDisplay.AppendMenuItem(MF_STRING, 38, "Center text");
	_menuGroupDisplay.CheckMenuItem(38, properties.centerText);	
	_menuCoverShadow.AppendMenuItem(MF_STRING, 47, "Show a shadow under artwork");
	_menuCoverShadow.CheckMenuItem(47, properties.showCoverShadow);	
	_menuCoverShadow.AppendMenuItem(MF_STRING, 48, "Set shadow opacity (current:"+properties.default_CoverShadowOpacity+")");	
	_menuCoverShadow.AppendTo(_menuGroupDisplay,MF_STRING, "Covers shadow");
	
	_menuGroupDisplay.AppendTo(_menu,MF_STRING, "Covers");
		
	_menuTracklist.AppendMenuItem(MF_STRING, 11, "Activate tracklist");
	_menuTracklist.CheckMenuItem(11, properties.expandInPlace);	
	/*_menuTracklist.AppendMenuItem(MF_STRING, 45, "Expand on hover cover");
	_menuTracklist.CheckMenuItem(45, properties.expandOnHover);	*/	
	_menuTracklist.AppendMenuItem(MF_STRING, 13, "Animate opening");
	_menuTracklist.CheckMenuItem(13, properties.smooth_expand_value>0);
	_menuTracklist.AppendMenuItem(MF_STRING, 29, "Show the cover on the right");
	_menuTracklist.CheckMenuItem(29, properties.showlistShowCover);		

	_menuTracklist.AppendMenuSeparator();

	_additionalInfos.AppendMenuItem(MF_STRING, 28, "Show artist name for each track");
	_additionalInfos.CheckMenuItem(28, properties.showArtistName);	
	_additionalInfos.AppendMenuItem(MF_STRING, 36, "Show play count");
	_additionalInfos.CheckMenuItem(36, properties.showPlaycount);		
	_additionalInfos.AppendMenuItem(MF_STRING, 44, "Show codec");
	_additionalInfos.CheckMenuItem(44, properties.showCodec);		
	_additionalInfos.AppendMenuItem(MF_STRING, 43, "Show bitrate");
	_additionalInfos.CheckMenuItem(43, properties.showBitrate);		
	_additionalInfos.AppendMenuSeparator();	
	_additionalInfos.AppendMenuItem(MF_GRAYED, 0, "Displayed in this order:");
	_additionalInfos.AppendMenuItem(MF_GRAYED, 0, "[Artist name] ([Playcount] - [Codec] - [Bitrate])");	
	_additionalInfos.AppendTo(_menuTracklist,MF_STRING, "Additional track infos");

	_menuTracklist.AppendMenuSeparator();	
	
	_menuProgressBar.AppendMenuItem(MF_STRING, 21, "No progress bar");
	_menuProgressBar.AppendMenuItem(MF_STRING, 24, "White Progress bar");			
	_menuProgressBar.AppendMenuItem(MF_STRING, 23, "Progress bar according to the album art");
	_menuProgressBar.CheckMenuRadioItem(21, 24, (!properties.drawProgressBar) ? 21 : (properties.AlbumArtProgressbar) ? 23 : 24);	
	_menuProgressBar.AppendTo(_menuTracklist,MF_STRING, "Progress bar");		
	
	_menuTracklist.AppendMenuSeparator();

	_menuRating.AppendMenuItem(MF_STRING, 32, "Show rating for each track");
	_menuRating.AppendMenuItem(MF_STRING, 33, "Show rating for selected tracks");	
	_menuRating.AppendMenuItem(MF_STRING, 34, "Show rating for selected and rated tracks");		
	_menuRating.AppendMenuItem(MF_STRING, 35, "Don't show rating");
	_menuRating.CheckMenuRadioItem(32, 35, (properties.showRating && !properties.showRatingSelected) ? 32 : (properties.showRating && properties.showRatingSelected && !properties.showRatingRated) ? 33 : (properties.showRating && properties.showRatingRated) ? 34 : 35);	
	_menuRating.AppendTo(_menuTracklist,MF_STRING, "Rating");	
	
	_menuTracklist.AppendMenuSeparator();		
	
	_menuBackground.AppendMenuItem(MF_STRING, 15, "Background according to album art (main color)");
	_menuBackground.AppendMenuItem(MF_STRING, 16, "Background according to album art (blurred)");		
	_menuBackground.AppendMenuItem(MF_STRING, 17, "Background according to album art (mix of both)");	
	_menuBackground.AppendMenuItem(MF_STRING, 18, "Transparent background");		
	_menuBackground.CheckMenuRadioItem(15, 18, (properties.showListColoredOneColor) ? 15 : (properties.showListColoredBlurred) ? 16 :  (properties.showListColoredMixedColor) ? 17 : 18);	
	_menuBackground.AppendTo(_menuTracklist,MF_STRING, "Background");	
	
	_menuTracklist.AppendTo(_menu,MF_STRING, "Tracklist");
	
	_menu2.AppendMenuItem(MF_STRING, 200, "Enable");
	_menu2.CheckMenuItem(200, properties.showwallpaper);
	_menu2.AppendMenuItem(MF_STRING, 220, "Blur");
	_menu2.CheckMenuItem(220, properties.wallpaperblurred);
	
	_menu2A.AppendMenuItem(MF_STRING, 221, "Filling");
	_menu2A.CheckMenuItem(221, properties.wallpaperdisplay==0);	
	_menu2A.AppendMenuItem(MF_STRING, 222, "Adjust");
	_menu2A.CheckMenuItem(222, properties.wallpaperdisplay==1);
	_menu2A.AppendMenuItem(MF_STRING, 223, "Stretch");
	_menu2A.CheckMenuItem(223, properties.wallpaperdisplay==2);
	_menu2A.AppendTo(_menu2,MF_STRING, "Wallpaper size");	
	
	_menu2.AppendTo(_menu,MF_STRING, "Background Wallpaper");	
	
	_menu.AppendMenuSeparator();		
	_menu.AppendMenuItem(MF_STRING, 9, "Refresh images cache");	

	idx = 0;
	if(right_align)
		idx = _menu.TrackPopupMenu(x, y, 0x0008);
	else
		idx = _menu.TrackPopupMenu(x, y);
	
	switch (true) {
		case (idx == 5):
			window.Reload();
			break;  			
		case (idx == 6):
			window.ShowConfigure();
			break;  
		case (idx == 7):
			window.ShowProperties();
			break;
		case (idx == 8):
			scroll = scroll_ = 0;
			brw.populate(0);
			break;
		case (idx == 9):       
			delete_full_cache();
			break;
		case (idx == 10):
			properties.followNowPlaying = !properties.followNowPlaying;
			window.SetProperty("TRACKLIST Always Follow Now Playing", properties.followNowPlaying);
			break;
		case (idx == 11):
			properties.expandInPlace = !properties.expandInPlace;
			window.SetProperty("TRACKLIST expand in place", properties.expandInPlace);
			if(!properties.expandInPlace){
				g_showlist.close();
			}
			brw.repaint();
			break;
		case (idx == 45):
			properties.expandOnHover = !properties.expandOnHover;
			window.SetProperty("TRACKLIST expand on hover", properties.expandOnHover);
			if(!properties.expandOnHover){
				g_showlist.close();
			}
			brw.repaint();
			break;		
		case (idx == 46):
			properties.animateShowNowPlaying = !properties.animateShowNowPlaying;
			window.SetProperty("COVER animate on show now playing", properties.animateShowNowPlaying);
			break;					
		case (idx == 12):
			enableCoversAtStartupGlobally();
			break;	
		case (idx == 13):
			properties.smooth_expand_value = properties.smooth_expand_value > 0 ? 0 : properties.smooth_expand_default_value;
			window.SetProperty("TRACKLIST Smooth Expand value (0 to disable)", properties.smooth_expand_value);
			break;
		case (idx == 14):
			enableDiskCacheGlobally();
			brw.populate(0);			
			break;			
		case (idx == 15):
			properties.showListColoredBlurred = false;
			properties.showListColoredOneColor = true;	
			properties.showListColoredMixedColor = false;				
			get_colors();
			window.SetProperty("TRACKLIST Color according to albumart (main color)", properties.showListColoredOneColor);			
			window.SetProperty("TRACKLIST Color according to albumart (blurred)", properties.showListColoredBlurred);
			window.SetProperty("TRACKLIST Color according to albumart (mix of both)", properties.showListColoredMixedColor);			
			g_showlist.reset();
			brw.repaint();
			break;		
		case (idx == 16):
			properties.showListColoredBlurred = true;
			properties.showListColoredOneColor = false;		
			properties.showListColoredMixedColor = false;				
			get_colors();
			window.SetProperty("TRACKLIST Color according to albumart (main color)", properties.showListColoredOneColor);			
			window.SetProperty("TRACKLIST Color according to albumart (blurred)", properties.showListColoredBlurred);
			window.SetProperty("TRACKLIST Color according to albumart (mix of both)", properties.showListColoredMixedColor);
			g_showlist.g_wallpaperImg = null;			
			g_showlist.reset();
			brw.repaint();
			break;	
		case (idx == 17):
			properties.showListColoredBlurred = false;
			properties.showListColoredOneColor = false;	
			properties.showListColoredMixedColor = true;				
			get_colors();			
			window.SetProperty("TRACKLIST Color according to albumart (main color)", properties.showListColoredOneColor);			
			window.SetProperty("TRACKLIST Color according to albumart (blurred)", properties.showListColoredBlurred);
			window.SetProperty("TRACKLIST Color according to albumart (mix of both)", properties.showListColoredMixedColor);
			g_showlist.g_wallpaperImg = null;
			g_showlist.reset();
			brw.repaint();
			break;				
		case (idx == 18):
			properties.showListColoredBlurred = false;
			properties.showListColoredOneColor = false;	
			properties.showListColoredMixedColor = false;			
			get_colors();			
			window.SetProperty("TRACKLIST Color according to albumart (main color)", properties.showListColoredOneColor);			
			window.SetProperty("TRACKLIST Color according to albumart (blurred)", properties.showListColoredBlurred);
			window.SetProperty("TRACKLIST Color according to albumart (mix of both)", properties.showListColoredMixedColor);			
			g_showlist.reset();
			brw.repaint();
			break;			
		case (idx == 29):
			properties.showlistShowCover = !properties.showlistShowCover;
			window.SetProperty("TRACKLIST Show cover", properties.showlistShowCover);
			g_showlist.refresh();
			brw.refresh_browser_thumbnails();
			brw.repaint();			
			break;
		case (idx == 26):
			properties.showDiscNbOverCover = !properties.showDiscNbOverCover;
			window.SetProperty("COVER Show Disc number over album art", properties.showDiscNbOverCover);
			brw.repaint();
			break;			
		case (idx == 27):
			properties.showheaderbar = !properties.showheaderbar;
			window.SetProperty("MAINPANEL Show Header Bar", properties.showheaderbar);
			brw.showheaderbar();
			break;	
		case (idx == 30):		
			properties.showFilterBox = !properties.showFilterBox;
			if(libraryfilter_state.isActive()){
				window.SetProperty("MAINPANEL Show filter box (filter active)", properties.showFilterBox);
				properties.showFilterBox_filter_active = properties.showFilterBox;
			} else {
				window.SetProperty("MAINPANEL Show filter box (filter inactive)", properties.showFilterBox);
				properties.showFilterBox_filter_inactive = properties.showFilterBox;
			}
			window.SetProperty("MAINPANEL Show filter box", properties.showFilterBox);
			brw.showFilterBox = properties.showFilterBox;
			g_headerbar.RightTextLength = -1;
			g_filterbox.on_init();
			brw.repaint();
			break;			
		case (idx == 21):
			properties.drawProgressBar = false;
			window.SetProperty("TRACKLIST Draw a progress bar under song title", properties.drawProgressBar);
			brw.repaint();
			break;			
		case (idx == 23):
			properties.AlbumArtProgressbar = true;		
			properties.drawProgressBar = true;				
			window.SetProperty("TRACKLIST Draw a progress bar under song title", properties.drawProgressBar);						
			window.SetProperty("TRACKLIST Blurred album art progress bar", properties.AlbumArtProgressbar);	
			get_colors();
			g_showlist.g_wallpaperImg = null;			
			g_showlist.reset();				
			brw.repaint();
			break;				
		case (idx == 24):
			properties.AlbumArtProgressbar = false;		
			properties.drawProgressBar = true;				
			window.SetProperty("TRACKLIST Draw a progress bar under song title", properties.drawProgressBar);						
			window.SetProperty("TRACKLIST Blurred album art progress bar", properties.AlbumArtProgressbar);		
			get_colors();
			g_showlist.g_wallpaperImg = null;			
			g_showlist.reset();				
			brw.repaint();
			break;						
		case (idx == 25):
			properties.showdateOverCover = !properties.showdateOverCover;
			window.SetProperty("COVER Show Date over album art", properties.showdateOverCover);
			brw.repaint();
			break;		
		case (idx == 28):
			properties.showArtistName = !properties.showArtistName;
			window.SetProperty("TRACKLIST Show artist name", properties.showArtistName);
			g_showlist.refresh();
			brw.repaint();
			break;
		case (idx == 36):
			properties.showPlaycount = !properties.showPlaycount;
			window.SetProperty("TRACKLIST Show playcount", properties.showPlaycount);
			g_showlist.refresh();
			brw.repaint();
			break;		
		case (idx == 44):
			properties.showCodec = !properties.showCodec;
			window.SetProperty("TRACKLIST Show codec", properties.showCodec);
			g_showlist.refresh();
			brw.repaint();
			break;			
		case (idx == 43):
			properties.showBitrate = !properties.showBitrate;
			window.SetProperty("TRACKLIST Show bitrate", properties.showBitrate);
			g_showlist.refresh();
			brw.repaint();
			break;			
		case (idx == 31):
			properties.showToolTip = !properties.showToolTip;
			window.SetProperty("MAINPANEL Show tooltips", properties.showToolTip);
			brw.repaint();
			break;	
		case (idx == 32):
			properties.showRating = true;
			properties.showRatingSelected = false;	
			properties.showRatingRated = false;			
			window.SetProperty("TRACKLIST Show rating in Track Row", properties.showRating);
			window.SetProperty("TRACKLIST Show rating in Selected Track Row", properties.showRatingSelected);	
			window.SetProperty("TRACKLIST Show rating in Rated Track Row", properties.showRatingRated);				
			g_showlist.refresh();
			brw.repaint();
			break;				
		case (idx == 33):
			properties.showRating = true;
			properties.showRatingSelected = true;		
			properties.showRatingRated = false;				
			window.SetProperty("TRACKLIST Show rating in Track Row", properties.showRating);
			window.SetProperty("TRACKLIST Show rating in Selected Track Row", properties.showRatingSelected);	
			window.SetProperty("TRACKLIST Show rating in Rated Track Row", properties.showRatingRated);				
			g_showlist.refresh();
			brw.repaint();
			break;	
		case (idx == 34):
			properties.showRating = true;
			properties.showRatingSelected = true;			
			properties.showRatingRated = true;			
			window.SetProperty("TRACKLIST Show rating in Track Row", properties.showRating);
			window.SetProperty("TRACKLIST Show rating in Selected Track Row", properties.showRatingSelected);	
			window.SetProperty("TRACKLIST Show rating in Rated Track Row", properties.showRatingRated);				
			g_showlist.refresh();
			brw.repaint();
			break;				
		case (idx == 35):
			properties.showRating = false;
			properties.showRatingSelected = false;			
			properties.showRatingRated = false;				
			window.SetProperty("TRACKLIST Show rating in Track Row", properties.showRating);
			window.SetProperty("TRACKLIST Show rating in Selected Track Row", properties.showRatingSelected);	
			window.SetProperty("TRACKLIST Show rating in Rated Track Row", properties.showRatingRated);	
			g_showlist.refresh();
			brw.repaint();
			break;
		case (idx == 37):		
			properties.circleMode = !properties.circleMode;
			window.SetProperty("COVER Circle artwork", properties.circleMode);
			if(properties.circleMode){
				properties.centerText = true;
				window.SetProperty("COVER Center text", properties.centerText);
			} else {
				properties.centerText = false;
				window.SetProperty("COVER Center text", properties.centerText);				
			}
			brw.refresh_shadows();
			brw.refresh_browser_thumbnails();
			brw.repaint();
			break;		
		case (idx == 38):		
			properties.centerText = !properties.centerText;
			window.SetProperty("COVER Center text", properties.centerText);
			brw.repaint();
			break;
		case (idx == 39):		
			properties.displayToggleBtns = !properties.displayToggleBtns;
			window.SetProperty("_DISPLAY: Toggle buttons", properties.displayToggleBtns);
			if(properties.displayToggleBtns) buttons.filterToggle.changeState(ButtonStates.normal);		
			positionButtons();			
			brw.repaint();
			break;			
		case (idx == 40):		
			toggleLibraryFilterState();
			break;	
		case (idx == 41):		
			properties.showTotalTime = !properties.showTotalTime;
			window.SetProperty("_DISPLAY: Total time", properties.showTotalTime);
			g_headerbar.setDisplayedInfo();
			positionButtons();
			brw.repaint();
			break;			
		case (idx == 42):		
			properties.showCoverResizer = !properties.showCoverResizer;
			window.SetProperty("_DISPLAY: Cover resizer", properties.showCoverResizer);
			g_headerbar.setDisplayedInfo();
			positionButtons();
			brw.repaint();
			break;			
		case (idx == 47):		
			properties.showCoverShadow = !properties.showCoverShadow;
			window.SetProperty("COVER show shadow", properties.showCoverShadow);
			brw.repaint();
			break;				
		case (idx == 48):		
			try {
				new_value = utils.InputBox(window.ID, "Enter the desired opacity, between 0 (full transparency) to 255 (full opacity).", "Covers shadow opacity", properties.default_CoverShadowOpacity, true);
				if (!(new_value == "" || typeof new_value == 'undefined')) {
					properties.default_CoverShadowOpacity = Math.min(255,Math.max(0,Number(new_value)));
					window.SetProperty("COVER Shadow Opacity", properties.default_CoverShadowOpacity);
					get_colors();
					brw.refresh_shadows();		
					brw.repaint();					
				}			   
			} catch(e) {
			}			
			break;			
		case (idx == 200):
			toggleWallpaper();
			break;
		case (idx == 210):
			properties.wallpapermode = 99;
			on_colours_changed();		
			window.SetProperty("_SYSTEM: Wallpaper Mode", properties.wallpapermode);
			if(fb.IsPlaying) g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
			brw.repaint();
			break;
		case (idx == 211):
			properties.wallpapermode = 0;
			on_colours_changed();		
			window.SetProperty("_SYSTEM: Wallpaper Mode", properties.wallpapermode);
			if(fb.IsPlaying) g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
			brw.repaint();
			break;
		case (idx == 220):
			properties.wallpaperblurred = !properties.wallpaperblurred;
			on_colours_changed();		
			window.SetProperty("_DISPLAY: Wallpaper Blurred", properties.wallpaperblurred);
			g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
			brw.repaint();
			break;		
		case (idx == 221):
			properties.wallpaperdisplay = 0;
			window.SetProperty("_DISPLAY: Wallpaper 0=Filling 1=Adjust 2=Stretch", properties.wallpaperdisplay);
			g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
			brw.repaint();
			break;	
		case (idx == 222):
			properties.wallpaperdisplay = 1;
			window.SetProperty("_DISPLAY: Wallpaper 0=Filling 1=Adjust 2=Stretch", properties.wallpaperdisplay);
			g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
			brw.repaint();
			break;		
		case (idx == 223):
			properties.wallpaperdisplay = 2;
			window.SetProperty("_DISPLAY: Wallpaper 0=Filling 1=Adjust 2=Stretch", properties.wallpaperdisplay);
			g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
			brw.repaint();
			break;				
		case (idx == 328):
			properties.enableAutoSwitchPlaylistMode = !properties.enableAutoSwitchPlaylistMode;
			window.SetProperty("MAINPANEL Automatically change displayed playlist", properties.enableAutoSwitchPlaylistMode);
			brw.populate(0);			
			break;		
		case (idx == 329):
			properties.lockOnPlaylistNamed="";
			properties.lockOnFullLibrary=false;
			properties.followActivePlaylist=true;	
			window.SetProperty("MAINPANEL Follow active playlist", properties.followActivePlaylist);	
			window.SetProperty("MAINPANEL Always display full library", properties.lockOnFullLibrary);			
			window.SetProperty("MAINPANEL lock on specific playlist name", properties.lockOnPlaylistNamed);	
			brw.populate(0);
			break;	
		case (idx == 330):
			properties.lockOnPlaylistNamed="";
			properties.lockOnFullLibrary=true;
			properties.followActivePlaylist=false;	
			window.SetProperty("MAINPANEL Follow active playlist", properties.followActivePlaylist);	
			window.SetProperty("MAINPANEL Always display full library", properties.lockOnFullLibrary);			
			window.SetProperty("MAINPANEL lock on specific playlist name", properties.lockOnPlaylistNamed);	
			brw.populate(0);
			break;	
		case (idx > 331):
			properties.lockOnPlaylistNamed=plman.GetPlaylistName(idx-331);
			properties.lockOnFullLibrary=false;
			properties.followActivePlaylist=false;	
			window.SetProperty("MAINPANEL Follow active playlist", properties.followActivePlaylist);	
			window.SetProperty("MAINPANEL Always display full library", properties.lockOnFullLibrary);			
			window.SetProperty("MAINPANEL lock on specific playlist name", properties.lockOnPlaylistNamed);	
			brw.populate(0);
			break;				
	}	
	if(actions[idx]) actions[idx]();	
	
	_menu = undefined;
	_menu2 = undefined;
	_menu2A = undefined;	
	//_menuDisplayedPlaylist = undefined;
	_menuTracklist = undefined;
	_menuProgressBar = undefined;	
	_menuRating = undefined;	
	_menuHeaderBar = undefined;
	_menuBackground = undefined;
	_additionalInfos = undefined;
}

oScrollbar = function(parentObjectName) {
    this.parentObjName = parentObjectName;
	this.isVisible=false;
	this.cursorHeight=0;
    this.buttons = Array(null, null, null);
    this.draw = function(gr, x, y) {
        // draw background and buttons up & down

        // draw up & down buttons
		//this.buttons[cScrollBar.ButtonType.up].draw(gr, this.x, this.y, 255);
		//this.buttons[cScrollBar.ButtonType.down].draw(gr, this.x, this.y + this.h - this.w, 255);
		
        // draw cursor
        this.buttons[cScrollBar.ButtonType.cursor].draw(gr, this.x, this.cursorPos, 255);
    }
	this.get_h_tot = function(){
		if(g_showlist.idx>-1) {
			if((window.Height-brw.headerBarHeight)%brw.rowHeight<colors.fading_bottom_height*0.50){
				return brw.rowHeight*brw.rowsCount + g_showlist.h - g_showlist.h%brw.rowHeight + brw.rowHeight;	
			} else {
				if(g_showlist.h%brw.rowHeight<20)
					return brw.rowHeight*brw.rowsCount + g_showlist.h - g_showlist.h%brw.rowHeight;
				else		
					return brw.rowHeight*brw.rowsCount + g_showlist.h					
			}
		} else {
			if((window.Height-brw.headerBarHeight)%brw.rowHeight<colors.fading_bottom_height*0.60){
				return brw.rowHeight*brw.rowsCount + brw.rowHeight;	
			} else {
				return brw.rowHeight*brw.rowsCount;
			}			
		}			
	}
	this.get_h_vis = function(){
		return brw.totalRowsVis*brw.rowHeight;
		//return window.Height-brw.headerBarHeight -brw.y;
	}	
	this.check_scroll = function(scroll_to_check){	
		h_vis = this.get_h_vis();
		h_tot = this.get_h_tot();

		if(scroll_to_check!=0 && scroll_to_check > h_tot - h_vis) {		
			scroll_to_check = h_tot - h_vis;
		}
		if(scroll_to_check < 0) scroll_to_check =  0;
		return scroll_to_check;
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
	this.cursor_total_height = function() {
		try{
			if(g_showlist.idx>-1){
				if((window.Height-brw.headerBarHeight)%brw.rowHeight+g_showlist.h<colors.fading_bottom_height*0.66) {
					return g_showlist.h + (brw.headerBarHeight)-(brw.headerBarHeight)%brw.rowHeight - g_showlist.h%brw.rowHeight + brw.rowHeight;
				} else {			
					return g_showlist.h + (brw.headerBarHeight)-(brw.headerBarHeight)%brw.rowHeight
				}				
				/*if(((brw.y + brw.marginTop +g_showlist.h)%brw.rowHeight)<colors.fading_bottom_height*0.66) {
					return g_showlist.h + brw.rowHeight - g_showlist.h%brw.rowHeight+(brw.headerBarHeight)-(brw.headerBarHeight)%brw.rowHeight;
				} else {
					return g_showlist.h - g_showlist.h%brw.rowHeight+(brw.headerBarHeight)-(brw.headerBarHeight)%brw.rowHeight;				
				}*/
			} else {			
				if((window.Height-brw.headerBarHeight)%brw.rowHeight<colors.fading_bottom_height*0.66){
					return (brw.headerBarHeight)-(brw.headerBarHeight)%brw.rowHeight+brw.rowHeight;	
				} else {
					return (brw.headerBarHeight)-(brw.headerBarHeight)%brw.rowHeight;
				}
			}
		} catch (e){}		
	}

    this.setCursorButton = function() {
        // normal cursor Image
        this.cursorImage_normal = gdi.CreateImage(this.cursorWidth, this.cursorHeight+2);
        var gb = this.cursorImage_normal.GetGraphics();
			gb.FillSolidRect(this.cursorWidth-this.cursorWidthNormal-1, cScrollBar.marginTop-1, this.cursorWidthNormal, this.cursorHeight-cScrollBar.marginTop-cScrollBar.marginBottom+3, colors.scrollbar_cursor_outline);
			gb.FillSolidRect(this.cursorWidth-this.cursorWidthNormal, cScrollBar.marginTop, this.cursorWidthNormal-2, this.cursorHeight-cScrollBar.marginTop-cScrollBar.marginBottom+1, colors.scrollbar_normal_cursor);	
        this.cursorImage_normal.ReleaseGraphics(gb);
        
        // hover cursor Image
        this.cursorImage_hover = gdi.CreateImage(this.cursorWidth, this.cursorHeight+2);
        gb = this.cursorImage_hover.GetGraphics();
			gb.FillSolidRect(this.cursorWidth-cScrollBar.hoverWidth-1,0, cScrollBar.hoverWidth+2,this.cursorHeight+2,colors.scrollbar_cursor_outline);		
			gb.FillSolidRect(this.cursorWidth-cScrollBar.hoverWidth,1, cScrollBar.hoverWidth,this.cursorHeight,colors.scrollbar_hover_cursor);
        this.cursorImage_hover.ReleaseGraphics(gb);
		
        // down cursor Image
        this.cursorImage_down = gdi.CreateImage(this.cursorWidth, this.cursorHeight+2);
        gb = this.cursorImage_down.GetGraphics();
			gb.FillSolidRect(this.cursorWidth-cScrollBar.downWidth-1,0, cScrollBar.downWidth+2,this.cursorHeight+2,colors.scrollbar_cursor_outline);			
			gb.FillSolidRect(this.cursorWidth-cScrollBar.downWidth,1, cScrollBar.downWidth,this.cursorHeight,colors.scrollbar_down_cursor);
        this.cursorImage_down.ReleaseGraphics(gb);
		
        // create/refresh cursor Button in buttons array
        this.buttons[cScrollBar.ButtonType.cursor] = new button(this.cursorImage_normal, this.cursorImage_hover, this.cursorImage_down,"scrollbarcursor");
    }
    
    this.setButtons = function() {
        // normal scroll_up Image
        this.upImage_normal = gdi.CreateImage(this.w, this.w);
        var gb = this.upImage_normal.GetGraphics();
        // Draw Themed Scrollbar (lg/col)
		gb.SetSmoothingMode(2);
		var mid_x = Math.round(this.w / 2);
		gb.DrawLine(mid_x - 5, 10, mid_x - 1, 05, 2.0, colors.scrollbar_normal_cursor);
		gb.DrawLine(mid_x - 1, 06, mid_x + 2, 10, 2.0, colors.scrollbar_normal_cursor);

        this.upImage_normal.ReleaseGraphics(gb);

        // hover scroll_up Image
        this.upImage_hover = gdi.CreateImage(this.w, this.w);
        gb = this.upImage_hover.GetGraphics();
        // Draw Themed Scrollbar (lg/col)
		gb.SetSmoothingMode(2);
		var mid_x = Math.round(this.w / 2);
		gb.DrawLine(mid_x - 5, 10, mid_x - 1, 05, 2.0, colors.scrollbar_normal_cursor);
		gb.DrawLine(mid_x - 1, 06, mid_x + 2, 10, 2.0, colors.scrollbar_normal_cursor);

        this.upImage_hover.ReleaseGraphics(gb);

        // down scroll_up Image
        this.upImage_down = gdi.CreateImage(this.w, this.w);
        gb = this.upImage_down.GetGraphics();
        // Draw Themed Scrollbar (lg/col)
		gb.SetSmoothingMode(2);
		var mid_x = Math.round(this.w / 2);
		gb.DrawLine(mid_x - 5, 10, mid_x - 1, 05, 2.0, colors.scrollbar_normal_cursor);
		gb.DrawLine(mid_x - 1, 06, mid_x + 2, 10, 2.0, colors.scrollbar_normal_cursor);

        this.upImage_down.ReleaseGraphics(gb);

        // normal scroll_down Image
        this.downImage_normal = gdi.CreateImage(this.w, this.w);
        gb = this.downImage_normal.GetGraphics();
        // Draw Themed Scrollbar (lg/col)
		gb.SetSmoothingMode(2);
		var mid_x = Math.round(this.w / 2);
		gb.DrawLine(mid_x - 5, this.w - 11, mid_x - 1, this.w - 06, 2.0, colors.scrollbar_normal_cursor);
		gb.DrawLine(mid_x - 1, this.w - 07, mid_x + 2, this.w - 11, 2.0, colors.scrollbar_normal_cursor);

        this.downImage_normal.ReleaseGraphics(gb);

        // hover scroll_down Image
        this.downImage_hover = gdi.CreateImage(this.w, this.w);
        gb = this.downImage_hover.GetGraphics();
        // Draw Themed Scrollbar (lg/col)
		gb.SetSmoothingMode(2);
		var mid_x = Math.round(this.w / 2);
		gb.DrawLine(mid_x - 5, this.w - 11, mid_x - 1, this.w - 06, 2.0, colors.scrollbar_normal_cursor);
		gb.DrawLine(mid_x - 1, this.w - 07, mid_x + 2, this.w - 11, 2.0, colors.scrollbar_normal_cursor);

        this.downImage_hover.ReleaseGraphics(gb);

        // down scroll_down Image
        this.downImage_down = gdi.CreateImage(this.w, this.w);
        gb = this.downImage_down.GetGraphics();
        // Draw Themed Scrollbar (lg/col)
		gb.SetSmoothingMode(2);
		var mid_x = Math.round(this.w / 2);
		gb.DrawLine(mid_x - 5, this.w - 11, mid_x - 1, this.w - 06, 2.0, colors.scrollbar_normal_cursor);
		gb.DrawLine(mid_x - 1, this.w - 07, mid_x + 2, this.w - 11, 2.0, colors.scrollbar_normal_cursor);

        this.downImage_down.ReleaseGraphics(gb);

        for(i = 1; i < this.buttons.length; i++) {
            switch(i) {
            case cScrollBar.ButtonType.cursor:
                this.buttons[cScrollBar.ButtonType.cursor] = new button(this.cursorImage_normal, this.cursorImage_hover, this.cursorImage_down,"scrollbarcursor");
                break;
            case cScrollBar.ButtonType.up:
                this.buttons[cScrollBar.ButtonType.up] = new button(this.upImage_normal, this.upImage_hover, this.upImage_down,"scrollbarup");
                break;
            case cScrollBar.ButtonType.down:
                this.buttons[cScrollBar.ButtonType.down] = new button(this.downImage_normal, this.downImage_hover, this.downImage_down,"scrollbardown");
                break;
            };
        };
    };
    
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

	this.setOffsetFromCursorPos = function() {
        // calc ratio of the scroll cursor to calc the equivalent item for the full playlist (with gh)
        var ratio = (this.cursorPos - this.area_y) / (this.area_h - this.cursorHeight);
        // calc idx of the item (of the full playlist with gh) to display at top of the panel list (visible)
        var newOffset = Math.round(((brw.rowsCount +  Math.round(g_showlist.delta)) - brw.totalRowsVis) * ratio);
        return newOffset;
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
				/*if(((scroll+g_showlist.h)%brw.rowHeight)/brw.rowHeight<0.5)
					scroll = scroll - scroll%brw.rowHeight;
				else scroll = scroll + (brw.rowHeight-scroll%brw.rowHeight);*/
				
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

oBrowser = function(name) {
    this.name = name;
    this.groups = [];
	this.groups_draw = [];
	this.activeRow=0;
	this.activeIndexSaved = -1;
	this.album_Rclicked_index = -1;
    this.rows = [];
    this.rowHeight = 0;
    this.thumbnailWidth = properties.thumbnailWidth;
    this.scroll = 0;
    this.scroll_ = 0;
    this.scrollTimer = false;
    var collect_counter = 0;
	this.TooltipRow = -1;	
	this.TooltipAlbum = -1;
    this.resize_drag = false;
	this.forceActivePlaylist = false;
    this.resize_click = false;
    this.resize_sourceX = 0;
    this.resize_sourceY = 0;
	this.finishLoading = false;
	this.firstInitialisation = true;
	this.currently_sorted=false;
	this.dragEnable=false;	
	this.gTime = fb.CreateProfiler();
	this.SourcePlaylistIdx = 0;
	this.dontFlashNowPlaying = true;
	this.dont_sort_on_next_populate = false;
	this.click_down = false;	
	this.custom_firstRow = false;
	this.custom_secondRow = false;	
	this.force_sorted = false;		
	this.currentSorting = "";	
	this.get_metrics_called = false;
	this.searched_track = null;
	this.found_albumIdx = -1
	this.previousPlaylistIdx = -1;
	this.found_searched_track = false;
	this.setSizeFirstCall = false;
	this.fontDate = gdi.Font("Arial", g_fsize-1+properties.globalFontAdjustement, 2);
    this.cover_img_mask = null;	
	this.coverMask = false;
	this.dateCircleBG = false;
	this.drawRightLine = false;
	this.external_dragging = false;
	this.cover_shadow = null;
	this.cover_shadow_hover = null;
	this.isPlayingIdx = -1;
	
	if(properties.showheaderbar)	
		this.headerBarHeight = 43;
	else
		this.headerBarHeight = 4;	       
      
   timers.firstPopulate = setTimeout(function(){
		if(!brw.finishLoading && brw.firstInitialisation) eval(name+".populate(13)");
        clearTimeout(timers.firstPopulate);
        timers.firstPopulate = false;
    }, 10);
    this.repaint = function() {
        repaint_main1 = repaint_main2;
    }
	this.FormatTime = function(time){
		time_txt="";
		timetodraw=time;
		
		totalMth=Math.floor((timetodraw)/2592000); r_timetodraw=timetodraw-totalMth*2592000; 
		totalW=Math.floor(r_timetodraw/604800);      
		totalD=Math.floor((r_timetodraw%604800)/86400);    
		totalH=Math.floor((r_timetodraw%86400)/3600);
		totalM=Math.floor((r_timetodraw%3600)/60);
		totalS=Math.round((r_timetodraw%60));
		totalS=(totalS>9) ? totalS:'0'+totalS;
		
		txt_month=(totalMth>1)?totalMth+' months, ':totalMth+' month, ';
		txt_week=(totalW>1)?totalW+' weeks, ':totalW+' week, ';if(totalW==0) txt_week='';   
		txt_day=(totalD>1)?totalD+' days, ':totalD+' day, '; if(totalD==0) txt_day='';
		txt_hour=(totalH>1)?totalH+' h':totalH+' h'; if(totalH==0) txt_hour='';      
		if(totalMth>0) time_txt=txt_month+txt_week+txt_day+txt_hour+totalM+' min';
		else if (totalW>0) time_txt=txt_week+txt_day+txt_hour+totalM+' min';
		else if (totalD>0) time_txt=txt_day+((totalH>0)?""+totalH+' h, ':'')+totalM+' min';
		else if (totalH>0) time_txt=txt_hour+((totalM>0)?", "+totalM+' min':'');
		else time_txt=totalM+' min';
		
		return time_txt;
	}
	this.showheaderbar = function(){
		if(properties.showheaderbar)	
			this.headerBarHeight = 43;
		else
			this.headerBarHeight = 4;
		g_headerbar.setDisplayedInfo();
		g_headerbar.setSize(0,0,this.w,this.headerBarHeight)
		on_size();
		//brw.setSize(0, brw.headerBarHeight, ww, wh-brw.headerBarHeight);			
	}
    this.setSize = function(x, y, w, h) {	
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.marginLR = properties.marginLR;
        // set margins betweens album stamps
        this.marginTop = 0;
        this.marginBot = 2;
		this.CoverMarginTop = 15;
        // Collapse Album List even if open
        //g_showlist.close();
		
		this.setSizeFirstCall = true;
		
        // Adjust Column 
        this.totalColumns = Math.floor((this.w - this.marginLR * 2) / properties.thumbnailWidth);

        var gapeWidth = (this.w - this.marginLR * 2) - (this.totalColumns * properties.thumbnailWidth);
        var deltaToAdd = Math.round(gapeWidth / this.totalColumns);
        this.thumbnailWidth = properties.thumbnailWidth + deltaToAdd;
		
		this.marginSide = Math.round(this.thumbnailWidth/10 + deltaToAdd/10);		
		
		if(properties.showheaderbar) {
			g_headerbar.setSize(0,0,this.w,this.headerBarHeight);
			if(this.showFilterBox) g_filterbox.setSize(ww-g_headerbar.resize_bt_w-g_headerbar.rightpadding-g_headerbar.RightTextLength-g_headerbar.MarginRight-g_headerbar.mainTxtX +20, cFilterBox.h, g_fsize+2);
		}
        // calc size of the cover art
        //this.coverRealWith = (this.thumbnailWidth - (this.marginSide * 2));		
		this.coverRealWith = (this.thumbnailWidth - deltaToAdd)-Math.round(properties.thumbnailWidth*0.16);	
		this.coverHalfWidth = Math.round(this.coverRealWith/2);
        // Adjust Row & showList bloc Height
        this.rowHeight = g_fsize*2 + this.coverRealWith + cover.marginBottom;
		
        this.totalRows = Math.ceil(this.h / this.rowHeight);
        this.totalRowsVis = Math.floor(this.h / this.rowHeight);
        // count total of rows for the whole library
        this.rowsCount = Math.ceil(this.groups_draw.length / this.totalColumns);

        repaint_main1 = repaint_main2;		
		
        if(properties.expandInPlace) {
            if(g_showlist.idx > -1) {
					g_showlist.rowIdx = Math.floor(g_showlist.idx / brw.totalColumns);
					// set size of new showList of the selected album
					var playlist = this.groups_draw[g_showlist.idx].pl;
					g_showlist.calcHeight(playlist, g_showlist.idx);
					g_showlist.reset(g_showlist.idx, g_showlist.rowIdx);
                    					
                    this.repaint();
            }
        }
    }
   this.get_metrics = function(gr){
		this.get_metrics_called = true;
	   	this.firstRowHeight = gr.CalcTextHeight("Wcgregor", g_font.plus2);
	   	this.secondRowHeight = gr.CalcTextHeight("Wcgregor", g_font.italic);		
	}
	
    this.get_albums = function(start, str_comp){
        if(start == null){
            scroll = 0;
            start = 0;
            this.found_searched_track = false;
            this.groups.splice(0, this.groups.length);
            this.groups_draw.splice(0, this.groups_draw.length);	
            str_comp = "123456789123456789";
			this.totalTime = 0;
			this.finishLoading = false;
			this.found_albumIdx = -1;
			this.isPlayingIdx = -1;
			if(this.showFilterBox) g_filterbox.clearInputbox();
			if(properties.TFgrouping!=""){
					this.custom_firstRow = true;
					this.custom_secondRow = true;			
			} else {
				this.custom_firstRow = false;
				this.custom_secondRow = false;				
			}	
			this.get_metrics_called	= false;
			this.totalTracks = this.list.Count;
			this.ellipse_size = 0;
			//gTime_covers = fb.CreateProfiler();			
			//gTime_covers.Reset();
			//console.log("get albums started time:"+gTime_covers.Time);		
        }
		
        var i = this.groups.length, k = start, temp = "", string_compare = str_comp;
             
        this.gTime.Reset();
        var trackinfos = "", arr = [], group = "";
				
        while(k < this.totalTracks){
            if(properties.TFgrouping.length > 0) {
                group_string = TF.grouping.EvalWithMetadb(this.list[k]);
				this.current_grouping = properties.TFgrouping;
            } else {
				if(this.showFilterBox){
					if(properties.SingleMultiDisc) {
						trackinfos = TF.grouping_singlemultidisc_filterbox.EvalWithMetadb(this.list[k]);
						this.current_grouping = properties.TFgrouping_singlemultidisc;
					} else {
						trackinfos = TF.grouping_default_filterbox.EvalWithMetadb(this.list[k]);
						this.current_grouping = properties.TFgrouping_default;
					}						
					arr = trackinfos.split(" ^^ ");
					group_string = arr[0]+arr[1];		
				} else {
					if(properties.SingleMultiDisc) {
						trackinfos = TF.grouping_singlemultidisc.EvalWithMetadb(this.list[k]);
						this.current_grouping = properties.TFgrouping_singlemultidisc;
					} else {
						trackinfos = TF.grouping_default.EvalWithMetadb(this.list[k]);
						this.current_grouping = properties.TFgrouping_default;
					}
					group_string = trackinfos;
				}
            }
						
            temp = group_string.toUpperCase();
						
            if(string_compare != temp){
                string_compare = temp;
							
				if(i>0) {
					if(this.custom_firstRow) this.groups[i-1].firstRow = TF.grouping.EvalWithMetadb(this.groups[i-1].pl[0]);
					else this.groups[i-1].firstRow = this.groups[i-1].artist
					if(this.custom_secondRow) this.groups[i-1].secondRow = this.groups[i-1].pl.Count+(this.groups[this.groups.length-1].pl.Count>1?" tracks":" track");	
					else this.groups[i-1].secondRow = this.groups[i-1].album;
					
					this.totalTime += this.groups[i-1].length;
				}
								
                this.groups[i] = {};
                this.groups[i].trackIndex = k;
				this.groups[i].tracktype = TrackType(this.list[k].RawPath.substring(0, 4));
				
				if(properties.TFgrouping.length > 0) {
					this.groups[i].artist = TF.albumartist.EvalWithMetadb(this.list[k]);
					this.groups[i].album = TF.album.EvalWithMetadb(this.list[k]);
					this.groups[i].genre = TF.genre.EvalWithMetadb(this.list[k]);
					this.groups[i].date = TF.date.EvalWithMetadb(this.list[k]);
					this.groups[i].cachekey = process_cachekey(this.list[k]);					
				} else {
					if(!this.showFilterBox) arr = trackinfos.split(" ^^ ");			
					groupinfos = TF.groupinfos.EvalWithMetadb(this.list[k]);
					groupinfos = groupinfos.split(" ^^ ");						
					this.groups[i].artist = arr[0];
					this.groups[i].album = arr[1];
					this.groups[i].genre = groupinfos[0];					
					this.groups[i].date = groupinfos[1];	
					this.groups[i].discnb = groupinfos[2];						
					this.groups[i].cachekey = process_cachekey(this.list[k],'',groupinfos[3]);					
				}
				if(this.groups[i].album=="?") this.groups[i].album="Single(s)";	
				if(this.groups[i].artist=="?") this.groups[i].artist="Unknown artist(s)";
				if(this.groups[i].genre=="?") this.groups[i].genre="";
				
                this.groups[i].pl = plman.GetPlaylistItems(-1);
                this.groups[i].pl.Add(this.list[k]);
                this.groups[i].tr = [];
                this.groups[i].tr.push(trackinfos);				
                this.groups[i].length = this.list[k].Length;
				
                this.groups[i].metadb = this.list[k];  	
                this.groups[i].tid = -1;
				this.groups[i].mask_applied=false;				
                this.groups[i].idx = i; 				
				this.groups_draw.push(i);
				
				if(k==0){
					this.albumName = this.groups[i].album;
					this.artistName = this.groups[i].artist;
					this.genreName = this.groups[i].genre;	
					this.date = this.groups[i].date;						
				} else {
					if(this.albumName!= "" && this.albumName.toUpperCase()!=this.groups[i].album.toUpperCase()) this.albumName="";
					if(this.artistName!= "" && this.artistName.toUpperCase()!=this.groups[i].artist.toUpperCase()) this.artistName="";
					if(this.genreName!= "" && this.genreName.toUpperCase()!=this.groups[i].genre.toUpperCase()) this.genreName="";	
					if(this.date!= "" && this.date.toUpperCase()!=this.groups[i].date.toUpperCase()) this.date="";							
				}											
				this.groups[i].save_requested=false;
				this.groups[i].load_requested=0;
                i++; 
            } else {
                this.groups[i-1].pl.Add(this.list[k]);
                this.groups[i-1].length += this.list[k].Length;
                this.groups[i-1].tr.push(trackinfos);				
            }
			if(this.searched_track!=null && !this.found_searched_track)  {									
				this.found_searched_track = this.list[k].Compare(this.searched_track);
				if(this.found_searched_track) {
					this.found_albumIdx=this.groups_draw.length-1;				
				}
			}
            k++;			
			//Set a timer to avoid freezing on really big libraries
            if(k%500 == 0 && this.gTime.Time > 150){		
				string_compare_timeout=string_compare;
				if(this.firstInitialisation) this.get_albums(k, string_compare_timeout);
				else {
					get_albums_timer[get_albums_timer.length] = setTimeout(function(){
						clearTimeout(get_albums_timer[get_albums_timer.length-1]);
						brw.get_albums(k, string_compare_timeout);
					}, 30);
				}
                return;
            }    			
        }
		
		if(k==this.totalTracks) {
			//last group headers
			if(this.groups.length>0){
				if(this.custom_firstRow) this.groups[this.groups.length-1].firstRow = TF.grouping.EvalWithMetadb(this.groups[this.groups.length-1].pl[0]);
				else this.groups[this.groups.length-1].firstRow = this.groups[this.groups.length-1].artist				
				if(this.custom_secondRow) this.groups[this.groups.length-1].secondRow = this.groups[this.groups.length-1].pl.Count+(this.groups[this.groups.length-1].pl.Count>1?" tracks":" track");			
				else this.groups[this.groups.length-1].secondRow = this.groups[this.groups.length-1].album;
				this.totalTime += this.groups[this.groups.length-1].length;					
				if(this.searched_track!=null && this.found_albumIdx>-1) {	
					this.seek_track(this.searched_track, this.found_albumIdx);
					this.found_albumIdx=-1;
					this.searched_track=null;
				} else if(!this.found_searched_track){
					scroll = scroll_ = 0;
				}
			}			
					
			this.finishLoading = true; 
			this.get_metrics_called	= false;
			this.firstInitialisation=false; 
			if(properties.showheaderbar) g_headerbar.setDisplayedInfo(); 
			this.list = undefined;
			//console.log("get albums finished time:"+gTime_covers.Time);			
		}
        this.rowsCount = Math.ceil(this.groups.length / this.totalColumns);
        g_scrollbar.setCursor(brw.totalRowsVis*brw.rowHeight, brw.rowHeight*brw.rowsCount, scroll);
        repaint_main1 = repaint_main2;
		this.dontFlashNowPlaying=false;
		this.searched_track=null;
    }	
	this.getPlaybackPlaylist = function() {
		g_avoid_on_playlists_changed = true;
		var isPlaybackPlaylistFound = false;
		var total = plman.PlaylistCount;
		for (var i = 0; i < total; i++) {
			if(plman.GetPlaylistName(i) == globalProperties.playing_playlist) {
				var PlaybackPlaylistIndex = i;
				isPlaybackPlaylistFound = true;
				break;
			}		
		}
		if(!isPlaybackPlaylistFound) {
			plman.CreatePlaylist(total, globalProperties.playing_playlist);
			// Move it to the top
			plman.MovePlaylist(total, 0);
			PlaybackPlaylistIndex = 0;
		}
		g_avoid_on_playlists_changed = false;
		return PlaybackPlaylistIndex;
	}
	this.getSelectionPlaylist = function() {
		g_avoid_on_playlists_changed = true;
		var isSelectionPlaylistFound = false;
		var total = plman.PlaylistCount;
		for (var i = 0; i < total; i++) {
			if(plman.GetPlaylistName(i) == globalProperties.selection_playlist) {
				var SelectionPlaylistIndex = i;
				isSelectionPlaylistFound = true;
				break;
			}		
		}
		if(!isSelectionPlaylistFound) {
			plman.CreatePlaylist(total, globalProperties.selection_playlist);
			// Move it to the top
			plman.MovePlaylist(total, 0);
			SelectionPlaylistIndex = 0;
		}
		g_avoid_on_playlists_changed = false;
		return SelectionPlaylistIndex;
	}	
	this.getWholeLibraryPlaylist = function() {
		g_avoid_on_playlists_changed = true;
		var isWholeLibraryPlaylistFound = false;
		var total = plman.PlaylistCount;
		for (var i = 0; i < total; i++) {
			if(plman.GetPlaylistName(i) == globalProperties.whole_library) {
				var WholeLibraryPlaylistIndex = i;
				isWholeLibraryPlaylistFound = true;
				break;
			}		
		}
		if(!isWholeLibraryPlaylistFound) {
			plman.CreateAutoPlaylist(total, globalProperties.whole_library, "ALL ", "%artist% | %album% | $if(%album%,%date%,'9999') | %tracknumber% | %title%", 1);		
			plman.MovePlaylist(total, 0);
			WholeLibraryPlaylistIndex = 0;
		}
		g_avoid_on_playlists_changed = false;
		return WholeLibraryPlaylistIndex;
	}	
	this.setSourcePlaylist = function() {
		this.SourcePlaylistIdx = this.calculateSourcePlaylist();
	}		
	this.calculateSourcePlaylist = function() {
		var new_SourcePlaylistIdx = -1;
		var old_g_avoid_on_playlists_changed = g_avoid_on_playlists_changed;		
		g_avoid_on_playlists_changed = true;	
		if(!nowplayinglib_state.isActive()){
			new_SourcePlaylistIdx = plman.ActivePlaylist;
			this.followActivePlaylist = true;
		} else if(nowplayinglib_state.isActive() && !libraryfilter_state.isActive()){
			var active_playlist_name = plman.GetPlaylistName(plman.ActivePlaylist);
			if(active_playlist_name==globalProperties.whole_library) {
				new_SourcePlaylistIdx = plman.ActivePlaylist;
				this.followActivePlaylist = true;
			} else if(active_playlist_name==globalProperties.playing_playlist) {
				new_SourcePlaylistIdx = this.getWholeLibraryPlaylist();
				this.followActivePlaylist = true;					
			} else if(window.IsVisible){
				new_SourcePlaylistIdx = this.getSelectionPlaylist();
				this.followActivePlaylist = false; 
			} else {
				new_SourcePlaylistIdx = this.getWholeLibraryPlaylist();
				this.followActivePlaylist = true;					
			}
		} else if(nowplayinglib_state.isActive() && libraryfilter_state.isActive()){
			new_SourcePlaylistIdx = this.getSelectionPlaylist();
			this.followActivePlaylist = false;			
		} /*else if(properties.lockOnPlaylistNamed!=""){
			new_SourcePlaylistIdx = check_playlist(properties.lockOnPlaylistNamed);
			this.followActivePlaylist = false;
		}*/
		if (new_SourcePlaylistIdx<0 && properties.followActivePlaylist){
			this.followActivePlaylist = true;
		} else if(new_SourcePlaylistIdx<0 && properties.lockOnFullLibrary) {
			new_SourcePlaylistIdx = this.getWholeLibraryPlaylist();
			this.followActivePlaylist = false;			
		} else if(new_SourcePlaylistIdx<0){
			new_SourcePlaylistIdx = plman.ActivePlaylist;
		}
		g_avoid_on_playlists_changed = old_g_avoid_on_playlists_changed;	

		return new_SourcePlaylistIdx;  		
	}
	this.calculateSourcePlaylist_old = function() {
		var sourcePlaylistFound = false;
		g_avoid_on_playlists_changed = true;		
		
		this.SourcePlaylistIdx = plman.ActivePlaylist;
		this.followActivePlaylist = true;

		g_avoid_on_playlists_changed = false;	
		return this.SourcePlaylistIdx;  		
	}	
	this.getSourcePlaylist = function() {
		return this.SourcePlaylistIdx; 		
	}		
    this.populate = function(call_id, force_sorting, keep_showlist, playlistIdx) {	
		force_sorting = typeof force_sorting !== 'undefined' ? force_sorting : false;
		keep_showlist = typeof keep_showlist !== 'undefined' ? keep_showlist : false;	
		playlistIdx = typeof playlistIdx !== 'undefined' ? playlistIdx : -1;			
		this.force_sorted = force_sorting;
		this.currentSorting = "";
		this.currently_sorted=false;				
		
		if(!globalProperties.loaded_covers2memory) g_image_cache.resetAll();
	
        if(playlistIdx<0) {
			this.SourcePlaylistIdx = this.calculateSourcePlaylist();
		} else {
			this.SourcePlaylistIdx = playlistIdx;
			this.followActivePlaylist = true;
		}
		if(keep_showlist && g_showlist.rows_.length>0 && g_showlist.idx>-1 && !FocusOnNowPlaying){
			var first_selected_row = g_showlist.getFirstSelectedRow();
			this.searched_track = first_selected_row.metadb;
		} else if(this.SourcePlaylistIdx==plman.PlayingPlaylist || FocusOnNowPlaying){
			this.searched_track = fb.GetNowPlaying();
		} else {
			this.searched_track = null;
			scroll = scroll_ = 0;
		} 
		g_showlist.close();

		g_history.saveCurrent();			
	
        this.list = plman.GetPlaylistItems(this.SourcePlaylistIdx);	
		this.playlistName = plman.GetPlaylistName(this.SourcePlaylistIdx);
		this.playlistItemCount = this.list.Count;		
		//if(this.playlistName == globalProperties.whole_library)
			this.showFilterBox = true;
		//else
			this.showFilterBox = properties.showFilterBox;
        // sort if custom sorting is present in window properties		
		if((force_sorting || properties.TFsorting_default.length > 0) && !this.dont_sort_on_next_populate)
			 this.sortAccordingToProperties(force_sorting);
		console.log("--> populate GraphicBrowser sorted:"+this.currently_sorted+" call_id:"+call_id)			 
        this.get_albums();				
		this.dont_sort_on_next_populate = false;
		this.previousPlaylistIdx = this.SourcePlaylistIdx;		
    }
	this.sortAccordingToProperties = function(force_sorting) {
		if((properties.TFsorting!=properties.TFsorting_default && force_sorting) || properties.TFsorting_default==""){
			sort_order = properties.TFsorting.split("#");
			this.currentSorting = properties.TFsorting;	
		} else {
			sort_order = properties.TFsorting_default.split("#");
			this.currentSorting = properties.TFsorting_default;				
		}
		try{		
			if(sort_order[1] != parseInt(sort_order[1], 10)) sort_order[1]=1;				
		} catch (e){sort_order[1]=1}
		if(properties.SortDescending) sort_order[1]=sort_order[1]*-1
		try{
			this.list.OrderByFormat(fb.TitleFormat(sort_order[0]),sort_order[1]);
			this.currently_sorted=true;				
		} catch(e) {this.currently_sorted=false;}
	}
    this.refresh_browser_images = function () {
		this.coverMask = false;		
		this.dateCircleBG = false;		
		for(var i = 0;i < this.groups.length;i++){	
			this.groups[i].cover_img_full=null;
			g_showlist.cover_img=null;
			this.groups[i].cover_img=null;
			this.groups[i].mask_applied=false;			
			this.groups[i].tid=-1;
		}
	}	
    this.refresh_browser_thumbnails = function () {
		this.coverMask = false;
		this.dateCircleBG = false;	
		for(var i = 0;i < this.groups.length;i++){	
			this.groups[i].cover_img=null;
			this.groups[i].mask_applied=false;			
			this.groups[i].tid=-1;
		}
	}	
    this.refresh_shadows = function () {	
		g_showlist.cover_shadow = null;
		this.cover_shadow = null;		
		this.cover_shadow_hover = null;
	}
    this.refresh_one_image = function (albumIndex) {
		this.groups[albumIndex].cover_img_full=null;
		if(g_showlist.idx == albumIndex) g_showlist.cover_img=null;	
		this.groups[albumIndex].mask_applied=false;
		this.groups[albumIndex].cover_img=null;
		this.groups[albumIndex].tid=-1;
		this.groups[albumIndex].load_requested = 0;
		g_image_cache.cachelist[this.groups[albumIndex].cachekey] = null;
	}	
    this.refresh_all_images = function () {
		this.coverMask = false;
		this.dateCircleBG = false;			
		for(var i = 0;i < this.groups.length;i++){	
			this.groups[i].cover_img_full=null;
			g_showlist.cover_img=null;			
			this.groups[i].cover_img=null;
			this.groups[i].mask_applied=false;
			this.groups[i].tid=-1;
			g_image_cache.cachelist[this.groups[i].cachekey] = null;
		}
	}
	this.GetAlbumCover = function(idx){	
		//idx = this.groups_draw[idx];
		var img_final = null;
		var img_full = null;

		if (typeof this.groups[idx].cover_img_full == "object" && this.groups[idx].cover_img_full != null) {
			img_final = FormatCover(this.groups[idx].cover_img_full, this.coverRealWith, this.coverRealWith, false, "GetAlbumCover1");
		} else {		
			img_full = g_image_cache.hit(this.groups[idx].metadb, idx, false, this.groups[idx].cachekey, false);
			if (typeof img_full == "object" && img_full != null) {
				this.groups[idx].cover_img_full = img_full;
				img_final = FormatCover(this.groups[idx].cover_img_full, this.coverRealWith, this.coverRealWith, false, "GetAlbumCover2");
			}
		}
		this.groups[idx].cover_img = img_final;
	}		
	this.SetAlbumCoverColorScheme = function(idx){
		if (typeof this.groups[idx].cover_img !== "undefined" && this.groups[idx].cover_img!=null) {
			main_color = this.groups[idx].cover_img.GetColourScheme(1);

			var tmp_HSL_colour = RGB2HSL(main_color[0]);
			if(tmp_HSL_colour.L>30){
				var new_H = tmp_HSL_colour.H;
				var new_S = Math.min(85,tmp_HSL_colour.S);
				var new_L = Math.max(70,tmp_HSL_colour.L+(100-tmp_HSL_colour.L)/3);			
				this.groups[idx].CoverMainColor = HSL2RGB(new_H, new_S, 40, "RGB");
			} else {
				this.groups[idx].CoverMainColor = main_color[0];				
			}		
		} else {
			this.groups[idx].CoverMainColor = colors.cover_hoverOverlay;
		}			
	}
    this.DefineCircleMask = function(size){
		var Mimg = gdi.CreateImage(size, size);
		gb = Mimg.GetGraphics();		
		gb.FillSolidRect(0, 0, size, size, GetGrey(255));
		gb.SetSmoothingMode(2);
		gb.FillEllipse(1, 1, size-2, size-2, GetGrey(0));		
		Mimg.ReleaseGraphics(gb);
		this.coverMask = Mimg;	
		
		if(properties.showdateOverCover){			
			var dateCircleBG = gdi.CreateImage(size, size);
			gb = dateCircleBG.GetGraphics();
			//gb.FillSolidRect(0, 0, size, 18, colors.cover_date_bg);
			gb.SetSmoothingMode(2);
			gb.FillEllipse(-Math.round(size/3), -size+18, Math.round(size*5/3), size, colors.cover_date_bg);
			dateCircleBG.ReleaseGraphics(gb);
			
			dateCircleBG.ApplyMask(this.coverMask);	
			this.dateCircleBG = dateCircleBG;			
		}
	}		
    this.draw = function(gr) {        
        if(repaint_main || repaint_f || !repaintforced){
            repaint_main = false;
            repaint_f = false;
            repaintforced = false;
            gr.SetTextRenderingHint(globalProperties.TextRendering);
			
            var rowPosition = 0;
            var ax, ay, by, rowStart, row, coverTop;
            var aw = this.coverRealWith; 
			var awhalf = this.coverHalfWidth;
            var firstalbum_x = this.x + this.marginSide + this.marginLR;
            var firstalbum_y = Math.floor(this.y + this.marginTop - scroll_);
			
			//Force showlist if there is only one group
			if(this.groups_draw.length==1 && g_showlist.idx<0 && properties.expandInPlace) {
				g_showlist.calcHeight(this.groups[this.groups_draw[0]].pl, 0);
				g_showlist.reset(this.groups_draw[0], 0);				
			}
            if(this.groups_draw.length <= this.totalRowsVis*this.totalColumns) {
                var start_ = 0;
                var end_ = this.groups_draw.length;
            } else {
				if(g_showlist.idx>-1 && scroll_ > g_showlist.y+g_showlist.h){
					var start_ = Math.round((scroll_ - g_showlist.h)/this.rowHeight - 0.6) * this.totalColumns;
				} else {
					var start_ = Math.round(scroll_/this.rowHeight - 0.6) * this.totalColumns;	
				}						
                var end_ = Math.round((scroll_ + wh)/this.rowHeight) * this.totalColumns;
				//if(!properties.showheaderbar) 
					end_ = end_ + this.totalColumns;
                if(this.groups_draw.length < end_) end_ = this.groups_draw.length;
				if(start_ < 0) start_ = 0;
            }
                        
            // stamps
            if(g_showlist.idx > -1) { // expand showList
                g_showlist.delta = g_showlist.nbRows;
                rowStart = Math.floor(start_/this.totalColumns);
                if(rowStart > g_showlist.rowIdx + 1) start_ -= this.totalColumns*Math.floor(g_showlist.delta);
                if(start_ < 0) start_ = 0;
                g_showlist.delta_ = Math.ceil((g_showlist.delta_ < g_showlist.delta*this.rowHeight) ? g_showlist.delta_ + (g_showlist.delta*this.rowHeight - g_showlist.delta_) * (1-properties.smooth_expand_value) : g_showlist.delta*this.rowHeight);

            } else { // collapse showList
                g_showlist.delta_ = Math.ceil((g_showlist.delta_ > 5) ? g_showlist.delta_ - (g_showlist.delta_ * (1-properties.smooth_expand_value)) : 0);
                if(g_showlist.delta_ == 0) {
                    g_showlist.delta = 0;
                    g_showlist.rowIdx = -1;
                }
            }
			if(!this.get_metrics_called)
				this.get_metrics(gr);
			            
            g_end = end_;
			
			//Show now playing animation
			if(properties.animateShowNowPlaying && cNowPlaying.flashEnable && this.isPlayingIdx>-1) {
				if(this.ellipse_size==0){
					this.ellipse_size = this.coverRealWith;
				} else this.ellipse_size+=4*(cNowPlaying.flashCover?-1:1);
				var row = Math.floor(this.isPlayingIdx/this.totalColumns);
				var column = ((this.isPlayingIdx % this.totalColumns)) * this.thumbnailWidth;
		
				ax = firstalbum_x + column;
				ay = firstalbum_y + (row * this.rowHeight);
				coverTop = ay + this.CoverMarginTop;
				
				gr.FillEllipse(ax+1-(this.ellipse_size-this.coverRealWith)/2, coverTop+1-(this.ellipse_size-this.coverRealWith)/2, this.ellipse_size-2, this.ellipse_size-2, colors.nowplaying_animation_circle);
				//else gr.FillSolidRect(ax+1-(this.ellipse_size-this.coverRealWith)/2, coverTop+1-(this.ellipse_size-this.coverRealWith)/2, this.ellipse_size-2, this.ellipse_size-2, colors.nowplaying_animation_circle);
			}
						
            for(var i = start_;i < end_;i++){				
				row = Math.floor(i/this.totalColumns);

				ax = firstalbum_x + (rowPosition * this.thumbnailWidth);
				ay = firstalbum_y + (row * this.rowHeight);
				
				if(g_showlist.delta_ > 0) {
					if(row > g_showlist.rowIdx) {
						ay = ay + g_showlist.delta_;
					}           
				}

                // get cover
				if(this.groups[this.groups_draw[i]].cover_img==null) {
					this.GetAlbumCover(this.groups_draw[i]);
				}

				if(ay >= (0 - this.rowHeight) && ay < this.y + this.h) {
					// Calcs
					coverTop = ay + this.CoverMarginTop;

					// cover
					if(this.groups[this.groups_draw[i]].cover_img!=null && typeof this.groups[this.groups_draw[i]].cover_img != "string") {
						
						//Show now playing animation
						/*if(this.groups[this.groups_draw[i]].isPlaying){
							var animation_x = ax+1-(this.ellipse_size-this.coverRealWith)/2;
							var animation_y = coverTop+1-(this.ellipse_size-this.coverRealWith)/2;
						}
						if(cNowPlaying.flashEnable && this.groups[this.groups_draw[i]].isPlaying) {
							if(this.ellipse_size==0){
								this.ellipse_size = this.coverRealWith;
							} else this.ellipse_size+=5*(cNowPlaying.flashCover?-1:1);
							gr.FillEllipse(ax+1-(this.ellipse_size-this.coverRealWith)/2, coverTop+1-(this.ellipse_size-this.coverRealWith)/2, this.ellipse_size-2, this.ellipse_size-2, colors.nowplaying_animation_circle);							
							//gr.DrawEllipse(ax+1-(this.ellipse_size-this.coverRealWith)/2, coverTop+1-(this.ellipse_size-this.coverRealWith)/2, this.ellipse_size-2, this.ellipse_size-2, 1.0, colors.nowplaying_animation_line);
						}	*/					
						
						//Shadow
						if(properties.showCoverShadow && properties.CoverShadowOpacity>0) {

							if(!this.cover_shadow || this.cover_shadow==null) this.cover_shadow = createCoverShadowStack(this.coverRealWith, this.coverRealWith, colors.cover_shadow,10, properties.circleMode);
							if(!this.cover_shadow_hover || this.cover_shadow_hover==null) this.cover_shadow_hover = createCoverShadowStack(this.coverRealWith, this.coverRealWith, colors.cover_shadow_hover,10, properties.circleMode);	
							if(i == this.activeIndex && this.activeRow>-1) var drawn_cover_shadow = this.cover_shadow_hover;
							else var drawn_cover_shadow = this.cover_shadow;
							gr.DrawImage(drawn_cover_shadow, ax-8, coverTop-8, this.coverRealWith+20, this.coverRealWith+20, 0, 0, drawn_cover_shadow.Width, drawn_cover_shadow.Height);
	
						}
						
						if(!this.groups[this.groups_draw[i]].mask_applied && properties.circleMode){
							if(!this.coverMask) this.DefineCircleMask(this.coverRealWith);
							width = this.groups[this.groups_draw[i]].cover_img.Width;
							height = this.groups[this.groups_draw[i]].cover_img.Height;
							coverMask = this.coverMask.Resize(width, height, 7);
							this.groups[this.groups_draw[i]].cover_img.ApplyMask(coverMask);
							this.groups[this.groups_draw[i]].mask_applied = true;
							image_to_draw = this.groups[this.groups_draw[i]].cover_img;
						} else {
							image_to_draw = this.groups[this.groups_draw[i]].cover_img;
						}					
						
						gr.DrawImage(image_to_draw, ax, coverTop, this.coverRealWith, this.coverRealWith, 0, 0, image_to_draw.Width, image_to_draw.Height);
						
						if(!properties.circleMode)
							gr.DrawRect(ax, coverTop, this.coverRealWith-1, this.coverRealWith-1, 1.0, colors.cover_rectline);
						else
							gr.DrawEllipse(ax+1, coverTop+1, this.coverRealWith-2, this.coverRealWith-2, 1.0, colors.cover_rectline);

						//date drawing black
						var overlayTxt = "";
						if(properties.showDiscNbOverCover && this.groups[this.groups_draw[i]].discnb!="?") {
							if(this.groups[this.groups_draw[i]].discnb!="?") overlayTxt = this.groups[this.groups_draw[i]].discnb;
						} 
						if(properties.showdateOverCover && this.groups[this.groups_draw[i]].date!="?") overlayTxt += ((overlayTxt!="")?" - ":"")+this.groups[this.groups_draw[i]].date;
						if(overlayTxt!=""){
							if(properties.circleMode) {
								if(!this.dateCircleBG) this.DefineCircleMask(this.coverRealWith); {
									gr.DrawImage(this.dateCircleBG,ax,coverTop, this.dateCircleBG.Width, this.dateCircleBG.Height, 0, 0, this.dateCircleBG.Width, this.dateCircleBG.Height);
									gr.GdiDrawText(overlayTxt, this.fontDate, colors.cover_date_txt, ax, coverTop+2, this.coverRealWith, 18, DT_CENTER | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
								}
							}
							else {
								try{
									if(typeof this.groups[this.groups_draw[i]].dateWidth == 'undefined') {
										this.groups[this.groups_draw[i]].dateWidth=gr.CalcTextWidth(overlayTxt, this.fontDate)+10;
										if(this.groups[this.groups_draw[i]].dateWidth>this.coverRealWith) this.groups[this.groups_draw[i]].dateWidth=this.coverRealWith;
									}
								} catch(e){}								
								gr.FillSolidRect(ax, coverTop, this.groups[this.groups_draw[i]].dateWidth, 15, colors.cover_date_bg);
								gr.GdiDrawText(overlayTxt, this.fontDate, colors.cover_date_txt, ax, coverTop, this.groups[this.groups_draw[i]].dateWidth, 15, DT_CENTER | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
							}
						}		

						if((!properties.expandInPlace || this.groups_draw.length==1) && ((i == this.activeIndex && this.activeRow>-1) || i==this.album_Rclicked_index)) {
							if(!properties.circleMode){
								gr.FillGradRect(ax, coverTop, this.coverRealWith, this.coverRealWith, 91, colors.covergrad_hoverOverlay, GetGrey(0,0), 0);
								gr.DrawImage(cover.btn_play, ax + awhalf-20, coverTop+awhalf-20, 41, 41, 0, 0, 41, 41); 
							} else {
								gr.SetSmoothingMode(2);
								gr.FillEllipse(ax, coverTop, this.coverRealWith, this.coverRealWith, colors.cover_ellipse_hover);
								gr.SetSmoothingMode(0);
								gr.DrawImage(cover.btn_play, ax + awhalf-20, coverTop+awhalf-20, 41, 41, 0, 0, 41, 41); 
							}
						}							
						else if(((i == this.activeIndex && this.activeRow>-1) || i==this.album_Rclicked_index)) {
							if(!(g_cursor.getActiveZone()=="cover"+i)){
								g_cursor.setCursor(IDC_HAND,"cover"+i);
							} 
							if(!properties.circleMode){
								gr.FillGradRect(ax, coverTop, this.coverRealWith, this.coverRealWith, 91, colors.covergrad_hoverOverlay, GetGrey(0,0), 0);
								//gr.FillGradRect(ax, coverTop, this.coverRealWith, this.coverRealWith, 91, GetGrey(0,0), this.groups[this.groups_draw[i]].CoverMainColor, 1);
							} else {
								gr.SetSmoothingMode(2);
								gr.FillEllipse(ax, coverTop, this.coverRealWith-1, this.coverRealWith-1, colors.cover_hoverOverlay);
								//gr.FillEllipse(ax, coverTop, this.coverRealWith, this.coverRealWith, setAlpha(this.groups[this.groups_draw[i]].CoverMainColor,150));
								gr.SetSmoothingMode(0);
							}
							
							if(i == g_showlist.idx) 
								gr.DrawImage(cover.retract_img, ax + awhalf-11, coverTop+awhalf-11, 22, 22, 0, 0, 22, 22);
							else
								gr.DrawImage(cover.extend_img, ax + awhalf-11, coverTop+awhalf-11, 22, 22, 0, 0, 22, 22);								
						} else if(this.activeIndex<0 && g_cursor.getActiveZone()=="cover"+i) {
							g_cursor.setCursor(IDC_ARROW);
						}
		
					} else if (this.groups[this.groups_draw[i]].cover_img=="no_cover") {
						gr.DrawImage(cover.nocover_img, ax, coverTop, this.coverRealWith, this.coverRealWith, 0, 0, cover.nocover_img.Width, cover.nocover_img.Height);		
						if(!properties.circleMode)
							gr.DrawRect(ax, coverTop, this.coverRealWith-1, this.coverRealWith-1, 1.0, colors.cover_nocover_rectline);
						else
							gr.DrawEllipse(ax+1, coverTop+1, this.coverRealWith-2, this.coverRealWith-2, 1.0, colors.cover_nocover_rectline);						
					} else {		
						if(!properties.circleMode)
							gr.DrawRect(ax, coverTop, this.coverRealWith-1, this.coverRealWith-1, 1.0, colors.cover_nocover_rectline);
						else
							gr.DrawEllipse(ax+1, coverTop+1, this.coverRealWith-2, this.coverRealWith-2, 1.0, colors.cover_nocover_rectline);					
					}

					// text 
					try{
						this.groups[this.groups_draw[i]].text_y = coverTop + this.coverRealWith + 6;
						var space_between_lines = 2;
						this.groups[this.groups_draw[i]].showToolTip = ( (this.groups[this.groups_draw[i]].firstRowLength > this.coverRealWith) || (this.groups[this.groups_draw[i]].secondRowLength > this.coverRealWith) )
						
						/*if(this.groups[this.groups_draw[i]].text_y+this.firstRowHeight<g_headerbar.h || this.groups[this.groups_draw[i]].text_y>g_headerbar.h) 
							firstRow_color = colors.normal_txt;
						else
							firstRow_color = colors.superfaded_txt;	
						gr.GdiDrawText(this.groups[this.groups_draw[i]].firstRow, g_font.plus2, firstRow_color, ax, this.groups[this.groups_draw[i]].text_y, this.coverRealWith, 25, (properties.centerText?DT_CENTER:DT_LEFT) | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);

						if(this.groups[this.groups_draw[i]].text_y + this.firstRowHeight + space_between_lines + this.secondRowHeight<g_headerbar.h || this.groups[this.groups_draw[i]].text_y>g_headerbar.h)
							secondRow_color = colors.faded_txt;
						else
							secondRow_color = colors.superfaded_txt;
						gr.GdiDrawText(this.groups[this.groups_draw[i]].secondRow, g_font.italic, secondRow_color, ax, this.groups[this.groups_draw[i]].text_y + this.firstRowHeight + space_between_lines, this.coverRealWith, 25, (properties.centerText?DT_CENTER:DT_LEFT) | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);*/
						
						if(this.groups[this.groups_draw[i]].text_y+this.firstRowHeight<g_headerbar.h || this.groups[this.groups_draw[i]].text_y>g_headerbar.h) 
							gr.GdiDrawText(this.groups[this.groups_draw[i]].firstRow, g_font.plus2, colors.normal_txt, ax, this.groups[this.groups_draw[i]].text_y, this.coverRealWith, 50+g_fsize, (properties.centerText?DT_CENTER:DT_LEFT) | DT_TOP | DT_END_ELLIPSIS | DT_NOPREFIX);

						if(this.groups[this.groups_draw[i]].text_y + this.firstRowHeight + space_between_lines + this.secondRowHeight<g_headerbar.h || this.groups[this.groups_draw[i]].text_y>g_headerbar.h)  
							gr.GdiDrawText(this.groups[this.groups_draw[i]].secondRow, g_font.italic, colors.faded_txt, ax, this.groups[this.groups_draw[i]].text_y + this.firstRowHeight + space_between_lines, this.coverRealWith, 50+g_fsize, (properties.centerText?DT_CENTER:DT_LEFT) | DT_TOP | DT_END_ELLIPSIS | DT_NOPREFIX);
						
						if(typeof this.groups[this.groups_draw[i]].firstRowLength == 'undefined') this.groups[this.groups_draw[i]].firstRowLength = gr.CalcTextWidth(this.groups[this.groups_draw[i]].firstRow,g_font.plus2);
						if(typeof this.groups[this.groups_draw[i]].secondRowLength == 'undefined') this.groups[this.groups_draw[i]].secondRowLength = gr.CalcTextWidth(this.groups[this.groups_draw[i]].secondRow,g_font.normal);	
					} catch(e) {}
				}
				if(rowPosition == this.totalColumns - 1) {
					rowPosition = 0;
				} else {
					rowPosition++;
				}
                
            }
			
			//Show now playing animation
			/*if(cNowPlaying.flashEnable && this.isPlayingIdx>-1) {
				if(this.ellipse_size==0){
					this.ellipse_size = this.coverRealWith;
				} else this.ellipse_size+=5*(cNowPlaying.flashCover?-1:1);
				
				gr.FillEllipse(animation_x, animation_y, this.ellipse_size-2, this.ellipse_size-2, colors.nowplaying_animation_circle);							
				//gr.DrawEllipse(ax+1-(this.ellipse_size-this.coverRealWith)/2, coverTop+1-(this.ellipse_size-this.coverRealWith)/2, this.ellipse_size-2, this.ellipse_size-2, 1.0, colors.nowplaying_animation_line);
			}	*/
			
            // draw tracks of expanded album
            g_showlist.draw(gr);

            // draw header
			if(properties.showheaderbar) {
				g_headerbar.draw(gr);
				// inputBox
				if(this.showFilterBox && g_filterbox.inputbox.visible) {
					g_filterbox.draw(gr, g_headerbar.mainTxtX,cFilterBox.y);
				}	
				drawAllButtons(gr);
			}
			
			
			
            // panel playlist	
            if(properties.DragToPlaylist) {
                if(g_plmanager.isOpened) g_plmanager.draw(gr);
            }
			
			this.drawRightLine = nowplayinglib_state.isActive();
			if(this.drawRightLine) gr.FillSolidRect(ww-1, 0, 1, wh, colors.sidesline);

            if(this.groups_draw.length == 0) { // library empty
                var px = 0;
                var py = this.y + Math.floor(this.h / 2);
				if(this.firstInitialisation) {
					gr.GdiDrawText("Loading...",  g_font.plus10, colors.normal_txt, px, py - 80, this.w, 35, DT_CENTER | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
					gr.FillSolidRect(this.w/2 -125, py-46, 250, 1, colors.border);
					gr.GdiDrawText("Library browser", g_font.italicplus2, colors.faded_txt, px, py - 38, this.w, 20, DT_CENTER | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
				}
				else {
					var playlistname=plman.GetPlaylistName(this.SourcePlaylistIdx);
					if(LibraryItems_counter<1){						
						gr.GdiDrawText("No music found.",  g_font.plus10, colors.normal_txt, px, py - 80, this.w, 35, DT_CENTER | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);		
						gr.FillSolidRect(this.w/2 -125, py-46, 250, 1, colors.border);						
						gr.GdiDrawText("Click here to configure the Media Library.", g_font.italicplus2, colors.faded_txt, px, py - 38, this.w, 20, DT_CENTER | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
					} else if(playlistname==globalProperties.selection_playlist || playlistname==globalProperties.playing_playlist) {
						gr.FillSolidRect(this.w/2 -150, py-46, 300, 1, colors.border);	
						gr.GdiDrawText(playlistname+" :",  g_font.plus10, colors.normal_txt, px, py - 80, this.w, 35, DT_CENTER | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);			
						gr.GdiDrawText("Nothing to show.", g_font.italicplus2, colors.faded_txt, px, py - 38, this.w, 20, DT_CENTER | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);						
					} else {
						gr.GdiDrawText(playlistname+" :", g_font.plus10, colors.normal_txt, px, py - 80, this.w, 35, DT_CENTER | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);	
						gr.FillSolidRect(this.w/2 -125, py-46, 250, 1, colors.border);							
						gr.GdiDrawText("This playlist is empty.", g_font.italicplus2, colors.faded_txt, px, py - 38, this.w, 20, DT_CENTER | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);												
					}
				}                    
                
            }
            
        }
        
    }
	this.stopResizing = function() {		
		if(this.resize_click || this.resize_drag) {
			this.resize_click = false;
			this.resize_drag = false;
			this.resize_bt.checkstate("up", g_cursor.x, g_cursor.y);
			this.resize_bt.repaint();
		}	
	}	
	this.stopDragging = function(x,y) {		
		if(g_dragA) {
			g_dragA_idx = -1;
			g_dragA = false;
			g_drag_timer = true;
			//if(g_plmanager.isOpened) g_plmanager.close();
		}
		if(g_dragR) {
			g_dragR = false;
			g_drag_timer = true;
			rowSelection = null;
			//if(g_plmanager.isOpened) g_plmanager.close();			
		}	
		if(this.resize_click || this.resize_drag) {
			this.resize_click = false;
			this.resize_drag = false;
			this.resize_bt.checkstate("up", g_cursor.x, g_cursor.y);
			this.resize_bt.repaint();
		}
		this.dragEnable=false;	
		g_dragC = false;		
		this.setActiveRow(x,y);		
	}
	
    this.on_mouse = function(event, x, y) {
        this.ishover = (x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h);
        
        switch(event) {
            case "lbtn_down":
                this.album_Rclicked_index = -1;			
                if(this.resize_bt.checkstate("hover", x, y)) {
                    this.resize_click = true;
                    this.resize_sourceX = x;
                    this.resize_sourceY = y;
					this.resize_bt.checkstate("down", g_cursor.x, g_cursor.y);
					this.moveResizeBtn(x,y);
                    this.repaint();
                    return;
                } else {
                    this.resize_click = false;
                }
                
                if(this.ishover && this.rowsCount == 0 && LibraryItems_counter==0) {
                    fb.RunMainMenuCommand("Library/Configure");
                } else {
					this.sourceX = x;
					this.sourceY = y;		
					this.dragEnable = true;					
                    if(this.ishover && this.activeIndex > -1 && Math.abs(scroll - scroll_) < 2) {
                        this.clicked = true;
                        this.clicked_id = this.activeIndex;
                    } else {							
                        this.clicked = false;
                        this.clicked_id = -1;
                    }
					
					if(this.activeIndex > -1 && (!properties.expandInPlace || this.groups_draw.length==1)){
						//if(this.activeIndex > -1 && (!properties.expandInPlace)){
						plman.FlushPlaybackQueue();
						if(!this.followActivePlaylist){
							plman.ActivePlaylist = this.SourcePlaylistIdx;
							plman.PlayingPlaylist = this.SourcePlaylistIdx;						
						}
						plman.SetPlaylistFocusItemByHandle(plman.ActivePlaylist, this.groups[this.groups_draw[this.activeIndex]].pl[0]);
						if(fb.IsPaused) fb.Stop();
						plman.FlushPlaybackQueue();	
						fb.RunContextCommandWithMetadb("Add to playback queue", this.groups[this.groups_draw[this.activeIndex]].pl[0]);
						fb.Play();
					}						
                }
                break;
            case "lbtn_up":
                if(this.resize_click || this.resize_drag) {
					this.resize_bt.checkstate("up", g_cursor.x, g_cursor.y);
                    this.resize_click = false;
                    this.resize_drag = false;
                    this.resize_bt.repaint();
                }
                g_dragC = false;

                this.clicked = false;
                this.clicked_id = -1;
                if((g_dragA || g_dragR) && properties.DragToPlaylist) {
                    len = g_plmanager.playlists.length;							
                    for(var i = 0; i < len ; i++) {
                        if(g_plmanager.playlists[i].type==2) {
                            g_plmanager.playlists[i].checkstate("up", x, y, i);
                        }
                    }
					if(g_dragA || g_dragR) this.stopDragging(x, y);					
                    this.repaint();
                }			
                break;
            case "lbtn_dblclk":
                var a = this.activeIndexFirstClick;
                if(a > -1){
					plman.FlushPlaybackQueue();
					var PlaybackPlaylist = this.getPlaybackPlaylist();
					if(!nowplayinglib_state.isActive()){
						if(!this.followActivePlaylist){
							plman.ActivePlaylist = this.SourcePlaylistIdx;
							plman.PlayingPlaylist = this.SourcePlaylistIdx;						
						}
						plman.SetPlaylistFocusItemByHandle(plman.ActivePlaylist, this.groups[this.groups_draw[a]].pl[0]);
						if(fb.IsPaused) fb.Stop();
						plman.FlushPlaybackQueue();
						fb.RunContextCommandWithMetadb("Add to playback queue", this.groups[this.groups_draw[a]].pl[0]);
						fb.Play();
					} else {
						plman.ClearPlaylist(PlaybackPlaylist);
						plman.InsertPlaylistItems(PlaybackPlaylist, 0, this.groups[this.groups_draw[a]].pl);
						plman.PlayingPlaylist = PlaybackPlaylist;
						plman.ExecutePlaylistDefaultAction(PlaybackPlaylist,0);
						fb.Stop();fb.Play();
					}
                    //fb.RunContextCommandWithMetadb("Add to playlist and play", this.groups[this.groups_draw[a]].pl);
                }
                /*
                var a = this.activeIndex;
                apply_playlist(this.groups[this.groups_draw[a]].pl);
                fb.RunContextCommandWithMetadb("Play", this.groups[this.groups_draw[a]].metadb);
                */
                break;
            case "mbtn_down":
                if(this.activeIndex > -1){
					fb.RunContextCommandWithMetadb("Properties",this.groups[this.groups_draw[this.activeIndex]].pl);
                }
                break;				
            case "move":                
				this.setActiveRow(x,y);	
                this.resize_bt.checkstate("move", x, y);
                this.album_Rclicked_index = -1;
                if(this.resize_click) {
                    this.resize_drag = true;
                    g_dragC = true;
					this.moveResizeBtn(x,y);
                    return;
                }
				if(properties.showToolTip && !(g_dragA || g_dragR || g_scrollbar.cursorDrag)){
					if((this.TooltipAlbum!=this.activeIndex || (this.activeIndex>-1 && this.groups[this.groups_draw[this.activeIndex]].text_y > y)) && this.TooltipAlbum > -1) {
						this.TooltipAlbum = -1;
						g_tooltip.Deactivate();	
					}						
					if(this.activeIndex>-1 && this.TooltipAlbum!=this.activeIndex && this.groups[this.groups_draw[this.activeIndex]].showToolTip && this.groups[this.groups_draw[this.activeIndex]].text_y < y){
							this.TooltipAlbum=this.activeIndex;	
							new_tooltip_text=this.groups[this.groups_draw[this.activeIndex]].firstRow+'\n'+this.groups[this.groups_draw[this.activeIndex]].secondRow;
							g_tooltip.ActivateDelay(new_tooltip_text, x+10, y+20, globalProperties.tooltip_delay,1000);		
					}
				}				
                if(properties.DragToPlaylist && !g_dragA && this.clicked && brw.dragEnable && (Math.abs(x - this.sourceX) > 10 || Math.abs(y - this.sourceY) > 10) && this.finishLoading) {
                    g_dragA = true;
					g_tooltip.Deactivate();
                    g_dragA_idx = this.clicked_id;
                    g_plmanager.isOpened = true;
                    // rebuild playlists list
                    g_plmanager.setPlaylistList();
                    if(this.sourceX > this.x + Math.round(this.w/2)) {
                        g_plmanager.side = "right";
                    } else {
                        g_plmanager.side = "right";
                    }
                    g_drag_timer = true;

                    len = g_plmanager.playlists.length;
                    for(var i = 0; i < len ; i++) {
                        if(g_plmanager.playlists[i].type==2) {
                            g_plmanager.playlists[i].checkstate("move", x, y, i);
                        }
                    }
                    this.repaint();					
                } 
				
				if(properties.showheaderbar && ((y>0 && y<this.headerBarHeight) || g_headerbar.tooltipActivated)) g_headerbar.on_mouse("move", x, y);
				else g_headerbar.on_mouse("leave", x, y);
                break;
            case "leave":		
                this.activeIndex = -1;
				this.activeRow = -1;	
				this.repaint();
				if(properties.showToolTip) {
					brw.TooltipRow = -1;
					brw.TooltipAlbum = -1;					
					g_tooltip.Deactivate();				
				}
				g_headerbar.on_mouse("leave", x, y);
                break;
        }
    }
    this.setActiveRow = function(x,y){
        if(!g_dragA && !g_dragR && !g_dragC) {		
            if(g_showlist.idx > -1) {
                if(y > g_showlist.y) {
                    if(y < g_showlist.y + g_showlist.h + this.CoverMarginTop) {						
                        this.activeRow = -10;					
                    } else {
                        this.activeRow = Math.ceil((y + scroll_ - this.y - g_showlist.h  - this.CoverMarginTop) / this.rowHeight) - 1;
						if(this.activeRow*this.rowHeight + (g_showlist.h/2)-scroll_<g_showlist.y) {
							this.activeRow = -10;
						}
                    }
                } else {				
                    this.activeRow = Math.ceil((y + scroll_ - this.y - this.CoverMarginTop) / this.rowHeight) - 1;
                }
            } else {		
                this.activeRow = Math.ceil((y + scroll_ - this.y - this.CoverMarginTop) / this.rowHeight) - 1;
            }
            
            if(y > this.y && x > this.x && x < this.x + this.w - g_scrollbar.w && this.activeRow > -10) {
				if(properties.veryTighCoverActiveZone){
					if((y + scroll_ - this.y - this.CoverMarginTop-1 - ((y > g_showlist.y)?g_showlist.h:0))%this.rowHeight>this.coverRealWith){
						this.activeColumn = 0;
						this.activeIndex = -1;						
					} else if((x - this.x - this.marginLR)%this.thumbnailWidth < ((this.thumbnailWidth - this.coverRealWith-this.marginSide)/2) || (x - this.x - this.marginLR)%this.thumbnailWidth > this.coverRealWith+((this.thumbnailWidth - this.coverRealWith)/2))  {
						this.activeColumn = 0;
						this.activeIndex = -1;	
					} else {
						if(x < this.x + this.marginLR) this.activeColumn=0;
						else this.activeColumn = Math.ceil((x - this.x - this.marginLR) / this.thumbnailWidth) - 1;
						this.activeIndex = (this.activeRow * this.totalColumns) + this.activeColumn;
						this.activeIndex = this.activeIndex > this.groups_draw.length - 1 ? -1 : this.activeIndex;
					}				
				} else {
					if((x - this.x - this.marginLR)%this.thumbnailWidth < this.marginSide - properties.CoverHoverExtendRect || (x - this.x - this.marginLR)%this.thumbnailWidth > this.thumbnailWidth - this.marginSide +properties.CoverHoverExtendRect )  {
						this.activeColumn = 0;
						this.activeIndex = -1;	
					} else {
						if(x < this.x + this.marginLR) this.activeColumn=0;
						else this.activeColumn = Math.ceil((x - this.x - this.marginLR) / this.thumbnailWidth) - 1;
						this.activeIndex = (this.activeRow * this.totalColumns) + this.activeColumn;
						this.activeIndex = this.activeIndex > this.groups_draw.length - 1 ? -1 : this.activeIndex;
					}
				}
            } else {
                this.activeIndex = -1;	
            }
        }	
	}
	this.resetTimer = function(){
		if(this.g_time) {
			window.ClearInterval(this.g_time);
			this.g_time = false;
		};
	}
	this.startTimer = function(){
		this.resetTimer();
		try {
			this.timerStartTime = Date.now();
		} catch(e){}
		brw.timerCounter = 0;
		this.g_time = setInterval(function() {
			brw.timerCounter++;
			//Restart if the animation is desyncronised
			try{				
				if(Math.abs(brw.timerStartTime+brw.timerCounter*properties.refreshRate-Date.now())>500){
					brw.startTimer();
				}	
			}catch(e){}							
			brw.timerScript();
		}, properties.refreshRate);	
	}
    this.timerScript = function() {
		
		if(randomStartTime>0 && Date.now()-10000>randomStartTime){
			window.NotifyOthers("Randomsetfocus", false);
			randomStartTime=0;
		}		

        if(!window.IsVisible) return;

        var repaint_1 = false;
        var repaint_2 = false;               		  
		
        if(cNowPlaying.flashEnable) {
            cNowPlaying.flashescounter++;
            if(cNowPlaying.flashescounter%5 == 0 && cNowPlaying.flashescounter <= cNowPlaying.flashescountermax && cNowPlaying.flashescounter>0) {
                cNowPlaying.flash = !cNowPlaying.flash;
				if(cNowPlaying.flashescounter%(cNowPlaying.flashescountermax/4) == 0) cNowPlaying.flashCover = !cNowPlaying.flashCover;
            }
            if(cNowPlaying.flashescounter > cNowPlaying.flashescountermax) {
                this.stopFlashNowPlaying();
            }
            repaint_1 = true;
        }		
		
        if(g_drag_timer && properties.DragToPlaylist) {
            if(g_dragA || g_dragR) {			
                g_plmanager.delta += g_plmanager.scrollStep;
				if(g_plmanager.delta < Math.round(g_plmanager.w/3)){
					g_plmanager.delta = Math.round(g_plmanager.w/3)
				}				
                if(g_plmanager.delta > g_plmanager.w) {
                    g_plmanager.delta = g_plmanager.w;
                    g_drag_timer = false;
                }
            } else {
                g_plmanager.delta -= g_plmanager.scrollStep;				
                if(g_plmanager.delta < Math.round(g_plmanager.w/3)) {
                    g_plmanager.delta = 0;
                    g_drag_timer = false;
                    g_plmanager.isOpened = false;
                }
            }
            repaint_1 = true;
        }
        
        if(g_dragup_timer && properties.DragToPlaylist) {
            g_dragup_flashescounter++;
            if(g_dragup_flashescounter%5 == 0 && g_dragup_flashescounter <= 25) {
                g_dragup_flash = !g_dragup_flash;
            }
            if(g_dragup_flash && g_dragup_flashescounter > 25) {
                g_dragup_flash = false;
            }
            if(g_dragup_flashescounter > 40) {
                g_flash_idx = -1;
                g_drag_timer = true;
            }
            repaint_1 = true;
        }
        
		// showList Drag scrollBar
		if(g_showlist.hscr_cursor_width/2<20) var x_hover_cursor_fix = 0;
		else var x_hover_cursor_fix = 20;
		if(g_showlist.idx>-1 && g_showlist.drag_showlist_hscrollbar && g_showlist.drag_x!=g_showlist.drag_old_x && !(g_showlist.drag_x<=g_showlist.hscr_x+x_hover_cursor_fix && g_showlist.columnsOffset==0) && !(g_showlist.drag_x>g_showlist.hscr_x+g_showlist.hscr_cursor_width-x_hover_cursor_fix && g_showlist.columnsOffset == g_showlist.totalCols-g_showlist.totalColsVis)){
			g_showlist.drag_old_x = g_showlist.drag_x;	
			if(g_showlist.drag_x-g_showlist.drag_start_x>Math.round((g_showlist.hscr_step_width)*2/3)){
				g_showlist.setColumnsOffset(g_showlist.columnsOffset + Math.round((g_showlist.drag_x - g_showlist.drag_start_x)/g_showlist.hscr_step_width));
				if (g_showlist.columnsOffset > g_showlist.totalCols-g_showlist.totalColsVis) g_showlist.setColumnsOffset(g_showlist.totalCols-g_showlist.totalColsVis);
				g_showlist.drag_start_x = g_showlist.drag_x
			} else if((g_showlist.drag_x-g_showlist.drag_start_x)*-1 > Math.round((g_showlist.hscr_step_width)*2/3)){
				g_showlist.setColumnsOffset(g_showlist.columnsOffset + Math.round((g_showlist.drag_x - g_showlist.drag_start_x)/g_showlist.hscr_step_width));
				if(g_showlist.columnsOffset<0) g_showlist.setColumnsOffset(0);
				g_showlist.drag_start_x = g_showlist.drag_x;					
			}					
			repaint_1 = true;
		}
		if((g_dragA || g_dragR) && (g_cursor.x!=drag_x || g_cursor.y!=drag_y)) {
			drag_x = g_cursor.x;
			drag_y = g_cursor.y;			
			repaint_1 = true;
		}
			
        if(repaint_main1 == repaint_main2){
            repaint_main2 = !repaint_main1;
            repaint_1 = true;
        }
	
        if(Math.abs(scroll - scroll_) >= 5){
			if(brw.finishLoading) scroll = g_scrollbar.check_scroll(scroll);	
			scroll_ += (scroll - scroll_) * (properties.smooth_scroll_value);
            isScrolling = true;
            repaint_1 = true;
        } else {
            if(scroll_ != scroll) {
				scroll = g_scrollbar.check_scroll(scroll);
                scroll_ = scroll; // force to scroll_ value to fixe the 5.5 stop value for expanding album action
                repaint_1 = true;
				brw.setActiveRow(g_cursor.x,g_cursor.y);
            }
            if(g_showlist.delta_ > 0 && g_showlist.delta_ < g_showlist.delta * brw.rowHeight) {
                repaint_1 = true;
            } else {
                isScrolling = false;
            }
        }

		if(brw.activeIndex != brw.activeIndexSaved) {
			brw.activeIndexSaved = brw.activeIndex;
			repaint_1 = true;
		}
	   		
		if(properties.showheaderbar && brw.finishLoading && properties.show_covers_progress && covers_loading_progress!=prev_covers_loading_progress) {
			repaint_1 = true;
			prev_covers_loading_progress = covers_loading_progress;
		}
		
        if(repaint_1 && brw.finishLoading){
            repaintforced = true;
            repaint_main = true;
            window.Repaint();
        }
    }
	
    this.setResizeButton = function (w,h) {
        var gb;
        this.ResizeButton_off = gdi.CreateImage(w, h);
        gb = this.ResizeButton_off.GetGraphics();
			gb.FillSolidRect(0,Math.round(h/2)-1, w, 1, colors.headerbar_resize_btn);
        this.ResizeButton_off.ReleaseGraphics(gb);

        this.ResizeButton_hover = gdi.CreateImage(w, h);
        gb = this.ResizeButton_hover.GetGraphics();
			gb.FillSolidRect(0,Math.round(h/2)-1, w, 1, colors.headerbar_resize_btnhv);			
        this.ResizeButton_hover.ReleaseGraphics(gb);
                
        if(typeof(this.resize_bt) == "undefined") {
            this.resize_bt = new button(this.ResizeButton_off, this.ResizeButton_hover, this.ResizeButton_hover,"resize_bt");
        } else {
            this.resize_bt.img[0] = this.ResizeButton_off;
            this.resize_bt.img[1] = this.ResizeButton_hover;
            this.resize_bt.img[2] = this.ResizeButton_hover;
        }
		this.resize_bt.w=w;
		this.resize_bt.h=h;
    }	
	this.drawResizeButton = function (gr,x,y){
		 this.resize_bt.draw(gr,x,y,255);
		 resizeCursorPos=Math.round(this.resize_bt.w*(properties.thumbnailWidth-properties.thumbnailWidthMin)/(globalProperties.thumbnailWidthMax-properties.thumbnailWidthMin));
		 if(this.resize_bt.state==ButtonStates.hover || this.resize_bt.state==ButtonStates.down)
			gr.FillSolidRect(x+resizeCursorPos, y+Math.round(this.resize_bt.h/2)-6, 1, 10, colors.headerbar_resize_btnhv);
		 else
			gr.FillSolidRect(x+resizeCursorPos, y+Math.round(this.resize_bt.h/2)-6, 1, 10, colors.headerbar_resize_btn);
	}
	this.moveResizeBtn = function (x,y){
		properties.thumbnailWidth = Math.round((globalProperties.thumbnailWidthMax-properties.thumbnailWidthMin)*(Math.max(x-this.resize_bt.x,0)/(this.resize_bt.w))+properties.thumbnailWidthMin);
		if(properties.thumbnailWidth>globalProperties.thumbnailWidthMax) properties.thumbnailWidth=globalProperties.thumbnailWidthMax;
		else if(properties.thumbnailWidth<properties.thumbnailWidthMin) properties.thumbnailWidth=properties.thumbnailWidthMin;
		window.SetProperty("COVER Width", properties.thumbnailWidth);
		this.refresh_browser_thumbnails();
		this.refresh_shadows();				
		on_size();		
	}
    this.setResizeButton(65,14);
	this.stopFlashNowPlaying = function (){
		cNowPlaying.flashEnable = false;
		cNowPlaying.flashescounter = 0;
		cNowPlaying.flash = false;	
		this.ellipse_size = 0;
	}	
	this.seek_track = function (metadb, albumIdx){
		var total_albums = this.groups_draw.length;
		var total_tracks = 0;
		
		if(typeof(albumIdx) == "undefined") {
			found = false;
			for(var a = 0; a < total_albums; a++) {
				total_tracks = this.groups[this.groups_draw[a]].pl.Count;
				for(var t = 0; t < total_tracks; t++) {
					found = this.groups[this.groups_draw[a]].pl[t].Compare(metadb);
					if(found) break;
				}
				if(found) break;
			}
		} else {a=albumIdx;found=true;}
		if(found) { // scroll to album and open showlist
			FocusOnNowPlaying=false;
			if(typeof this.groups[this.groups_draw[a]] !== "undefined" && this.groups[this.groups_draw[a]].pl) {
				// set size of new showList of the selected album
				var playlist = this.groups[this.groups_draw[a]].pl;
				g_showlist.calcHeight(playlist, a);
				// check in which column is the track seeked if multi columns layout
				if(g_showlist.totalCols > g_showlist.totalColsVis) {
					for(var c=0; c < g_showlist.columns.length; c++) {
						for(var r=0; r < g_showlist.columns[c].rows.length; r++) {
							found = g_showlist.columns[c].rows[r].metadb.Compare(metadb);
							if(found) break;
						}
						if(found) break;
					}
					if(found) {
						g_showlist.setColumnsOffset(c < g_showlist.totalColsVis ? 0 : c - g_showlist.totalColsVis + 1);
					}
				}
				
				if(g_showlist.idx < 0) {
					if(g_showlist.close_bt) g_showlist.close_bt.state = ButtonStates.normal;
					if(properties.expandInPlace) g_showlist.reset(this.groups_draw[a], Math.floor(a / this.totalColumns));
				} else if(g_showlist.idx == a){
					
				} else {
					g_showlist.close_bt.state = ButtonStates.normal;
					g_showlist.delta_ = 0;
					g_showlist.reset(this.groups_draw[a], Math.floor(a / this.totalColumns));
				}

				g_showlist.selected_row = metadb;
				if(this.followActivePlaylist) {
					plman.SetPlaylistFocusItemByHandle(plman.ActivePlaylist,metadb);
				}
		
				scroll = Math.floor(a / this.totalColumns) * this.rowHeight;
				if(scroll > scroll_ && scroll - scroll_ > wh) {
					scroll_ = scroll - (Math.ceil(wh / this.rowHeight) * this.rowHeight);
				} else if(scroll < scroll_ && scroll_ - scroll > wh) {
					scroll_ = scroll + (Math.ceil(wh / this.rowHeight) * this.rowHeight);
				}			
				//scroll = g_scrollbar.check_scroll(scroll);			
				g_scrollbar.setCursor(this.totalRowsVis*this.rowHeight, this.rowHeight*this.rowsCount, scroll);						
			}

			this.repaint();
			
		}
		
		return found;
	}
	this.focus_on_now_playing = function (track){		
		FocusOnNowPlaying = true;
		if(this.getSourcePlaylist()!=plman.PlayingPlaylist && !(!this.followActivePlaylist && nowplayinglib_state.isActive() && this.isPlayingIdx>-1)){
			if(this.followActivePlaylist){
				plman.ActivePlaylist = plman.PlayingPlaylist;
				g_avoid_on_playlist_switch = true;
				brw.populate(29, false, false, plman.PlayingPlaylist);
			} else {
				if(!nowplayinglib_state.isActive()){
					plman.ClearPlaylist(this.getSourcePlaylist());
					plman.InsertPlaylistItems(this.getSourcePlaylist(), 0, plman.GetPlaylistItems(plman.PlayingPlaylist), false);			
					//brw.populate(29, false, false);		
				} else {		
					quickSearch(track,properties.leftFilterState);		
				}					
			}									
		} else {					
			var isFound = brw.seek_track(track);
			if(!isFound) { 
				if(fb.GetNowPlaying()!=null) {
					if(plman.ActivePlaylist!=plman.PlayingPlaylist && brw.followActivePlaylist){
						plman.ActivePlaylist = plman.PlayingPlaylist;
						//brw.populate(28);
					} else {
						if(!nowplayinglib_state.isActive()){
							brw.populate(26);
						} else {		
							quickSearch(track,properties.leftFilterState);		
						}				
					}
				} else {	
					timers.showItem = setTimeout(function(){
						brw.populate(27);
						clearTimeout(timers.showItem);
						timers.showItem=false;
					}, 30);                    
				}
			}
		}	
		if(!cNowPlaying.flashEnable && !brw.dontFlashNowPlaying) {
			cNowPlaying.flashEnable = true;
			cNowPlaying.flashescounter = -2;
			cNowPlaying.flash = false;
		} else brw.dontFlashNowPlaying=false;	
	}					
	this.Dispose = function (){	
		for(var i=0; i < this.groups.length; i++) {
			this.groups[i].pl = undefined;
		}
	}	
}
// ===================================================== Filter Toggle Button =============================================
buttons = { 
    filterToggle: new SimpleButton(27, 25, 31, 30, "filterToggle", function () {
		toggleLibraryFilterState()
    },false,black_images.filter_on_icon,black_images.filter_on_hover_icon,ButtonStates.normal,224) 		
}
function drawAllButtons(gr) {
    for (var i in buttons) {
        buttons[i].draw(gr);
    }
}
function positionButtons(){
	buttons.filterToggle.x = ww-88;
	buttons.filterToggle.y = 7;
	
	if(properties.darklayout){
		if(!libraryfilter_state.isActive()){
			buttons.filterToggle.N_img = white_images.nowplaying_on_icon
			buttons.filterToggle.H_img = white_images.nowplaying_on_hover_icon
		} else {
			buttons.filterToggle.N_img = white_images.nowplaying_off_icon
			buttons.filterToggle.H_img = white_images.nowplaying_off_hover_icon			
		}			
	} else {
		if(!libraryfilter_state.isActive()){
			buttons.filterToggle.N_img = black_images.nowplaying_on_icon
			buttons.filterToggle.H_img = black_images.nowplaying_on_hover_icon
		} else {
			buttons.filterToggle.N_img = black_images.nowplaying_off_icon
			buttons.filterToggle.H_img = black_images.nowplaying_off_hover_icon			
		}				
	}	
	if(!properties.displayToggleBtns){
		buttons.filterToggle.changeState(ButtonStates.hide);
	}
} 

function chooseButton(x, y) {
    for (var i in buttons) {
        if (buttons[i].containXY(x, y) && buttons[i].state != ButtonStates.hide) return buttons[i];
    }
    return false;
}
function SimpleButton(x, y, w, h, text, fonClick, fonDbleClick, N_img, H_img, state,opacity) {
    this.state = state ? state : ButtonStates.normal;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.text = text;
    this.fonClick = fonClick;
    this.fonDbleClick = fonDbleClick;
    this.N_img = N_img;
    this.H_img = H_img;  
	this.opacity = opacity;
	this.cursor = IDC_ARROW;
	if (typeof opacity == "undefined") this.opacity = 255;
	else this.opacity = opacity;
	
	this.setPosition = function(x,y,w,h){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;	
		this.positioned = true;		
	}
    this.containXY = function (x, y) {
        return (this.x <= x) && (x <= this.x + this.w) && (this.y <= y) && (y <= this.y + this.h);
    }    
    this.changeState = function (state) {
        var old_state = this.state;
        this.state = state;
		if(this.state==ButtonStates.hover && this.cursor != IDC_HAND) {
			g_cursor.setCursor(IDC_HAND,this.text);
			this.cursor = IDC_HAND;
		} else if(this.cursor != IDC_ARROW && this.state!=ButtonStates.hover && this.state!=ButtonStates.down){
			g_cursor.setCursor(IDC_ARROW);	
			this.cursor = IDC_ARROW;
		}			
        return old_state;
    }    
    this.draw = function (gr) {
        if (this.state == ButtonStates.hide) return;
        b_img=this.N_img;        
        switch (this.state)
        {
        case ButtonStates.normal:
            b_img=this.N_img;
            break;
        case ButtonStates.hover:
            b_img=this.H_img;
            break;
        case ButtonStates.down:
            break;
            
        case ButtonStates.hide:
            return;
        }
        switch (this.state)
        {    
        case ButtonStates.hover: 
        default:         
			gr.DrawImage(b_img, this.x, this.y, b_img.Width, b_img.Height, 0, 0, b_img.Width, b_img.Height,0,this.opacity);
            break;            
        }            

    }

    this.onClick = function () {        
        this.fonClick && this.fonClick();
    }
    this.onDbleClick = function () {
        if(this.fonDbleClick) {this.fonDbleClick && this.fonDbleClick();}
    }    
}

function toggleLibraryFilterState(){
	libraryfilter_state.toggleValue();
	if(libraryfilter_state.isActive()){
		properties.showFilterBox = properties.showFilterBox_filter_active;
		brw.showFilterBox = properties.showFilterBox;
	} else {
		properties.showFilterBox = properties.showFilterBox_filter_inactive;
		brw.showFilterBox = properties.showFilterBox;		
	}	
	g_history.reset();
	g_history.saveCurrent();
	positionButtons();	
	window.Repaint();
}
// ===================================================== Cover Images =====================================================
function on_get_album_art_done(metadb, art_id, image, image_path) {
    var i = art_id - 5;
    g_last = i;
	if(i<0){
		cachekey = process_cachekey(metadb);
		if(image) {							
			g_image_cache.cachelist[cachekey] = image;
			if(image.Width>globalProperties.thumbnailWidthMax || image.Height>globalProperties.thumbnailWidthMax) {
				g_image_cache.cachelist[cachekey].Resize(globalProperties.thumbnailWidthMax, globalProperties.thumbnailWidthMax,globalProperties.ResizeQLY);
			}
		} else {
			g_image_cache.cachelist[cachekey] = cover.nocover_img				
		}			
    } else if(i < brw.groups.length && i>=0) {
        if(brw.groups[i].metadb) {
				if(image) {							
					if(image.Width>globalProperties.thumbnailWidthMax || image.Height>globalProperties.thumbnailWidthMax) {
						g_image_cache.cachelist[brw.groups[i].cachekey] = image.Resize(globalProperties.thumbnailWidthMax, globalProperties.thumbnailWidthMax,globalProperties.ResizeQLY);
					} else g_image_cache.cachelist[brw.groups[i].cachekey] = image;									
				} else {
					if(brw.groups[i].tracktype == 3 ) {
						g_image_cache.cachelist[brw.groups[i].cachekey] = cover.stream_img;
					} else {
						g_image_cache.cachelist[brw.groups[i].cachekey] = cover.nocover_img;					
					}		
					brw.groups[i].save_requested = true;					
				}						
				// save img to cache
				if(globalProperties.enableDiskCache && !brw.groups[i].save_requested && typeof brw.groups[i].cover_img != "string" && image) {					
					if(!timers.saveCover) {
						brw.groups[i].save_requested = true;
						save_image_to_cache(image, i); 
						//timers.saveCover = setTimeout(function() {
							//clearTimeout(timers.saveCover);
							timers.saveCover = false;
						//}, 5);
					};
				}				
                if(i <= g_end) {
					if (!timers.coverDone) {				
						timers.coverDone = true;
						timers.coverDone = setTimeout(function () {
								brw.repaint();
								clearTimeout(timers.coverDone);
								timers.coverDone = false;
						}, 100);
					}																	
                }
        }
    } 
};

function on_load_image_done(tid, image){	
	for(var k = 0; k < brw.groups.length; k++) {
		if(brw.groups[k].metadb) {
			if(brw.groups[k].tid == tid && brw.groups[k].load_requested == 1) {
				
				brw.groups[k].load_requested = 2;

				if(image.Width>globalProperties.thumbnailWidthMax || image.Height>globalProperties.thumbnailWidthMax) {
					g_image_cache.cachelist[brw.groups[k].cachekey] = image.Resize(globalProperties.thumbnailWidthMax, globalProperties.thumbnailWidthMax,globalProperties.ResizeQLY);
				} else g_image_cache.cachelist[brw.groups[k].cachekey] = image;	
				
				if(k <= g_end) {
					if(!timers.coverDone) {
						timers.coverDone = setTimeout(function() {
							window.Repaint();
							timers.coverDone && clearTimeout(timers.coverDone);
							timers.coverDone = false;
						}, 5);
					};
				}
				break;
			}
		}
	}
};

//var gTime_covers_all = null;
function populate_with_library_covers(start_items, str_comp_items){	
	if(start_items == 0){
		covers_FullLibraryList = fb.GetLibraryItems(); start_items = 0;	
		covers_FullLibraryList.OrderByFormat(fb.TitleFormat(sort_by_default), 1);		
		covers_loading_progress = 0;	
		gTime_covers = fb.CreateProfiler();		
	}		
	var covers_current_item = start_items;
	var string_current_item = "";
	var string_compare_items = str_comp_items;
	gTime_covers.Reset();		
	var total = covers_FullLibraryList.Count;
	while(covers_current_item < total){
		string_current_item = TF.grouping_populate.EvalWithMetadb(covers_FullLibraryList[covers_current_item]);
		string_current_item = string_current_item.toUpperCase();		
		if(string_compare_items != string_current_item){
			covers_loading_progress = Math.round((covers_current_item/total)*100);
			string_compare_items = string_current_item;	
			if(globalProperties.load_covers_at_startup) cachekey_album = process_cachekey(covers_FullLibraryList[covers_current_item]);
			if(globalProperties.load_artist_img_at_startup) cachekey_artist = process_cachekey(covers_FullLibraryList[covers_current_item],properties.tf_crc_artist);
			if(globalProperties.enableDiskCache) {
				if(globalProperties.load_covers_at_startup && cachekey_album!='undefined') {
					current_item_filename_album = check_cacheV2(covers_FullLibraryList[covers_current_item], 0, cachekey_album);
					if(current_item_filename_album) {				
						g_image_cache.cachelist[cachekey_album] = load_image_from_cache_directV2(current_item_filename_album);		
					}	
				}	
				if(globalProperties.load_artist_img_at_startup && cachekey_artist!='undefined') {				
					current_item_filename_artist = check_cacheV2(covers_FullLibraryList[covers_current_item], 0, cachekey_artist);
					if(current_item_filename_artist) {				
						g_image_cache.cachelist[cachekey_artist] = load_image_from_cache_directV2(current_item_filename_artist);		
					}
				}
			} else {
				if(cachekey_album!='undefined') g_image_cache.hit(covers_FullLibraryList[covers_current_item], -1, true, cachekey_album, false);
			}		
		}
		covers_current_item++;
		//Set a timer to avoid freezing on really big libraries
		if(covers_current_item%250 == 0 && gTime_covers.Time > 100){	
			string_compare_items_timeout=string_compare_items;		
			populate_covers_timer[populate_covers_timer.length] = setTimeout(function(){
				clearTimeout(populate_covers_timer[populate_covers_timer.length-1]);
				populate_with_library_covers(covers_current_item,string_compare_items_timeout);
			}, 25);				
			return;
		} 				
	}
	if(covers_current_item==covers_FullLibraryList.Count) {
		//console.log("populate covers started time:"+gTime_covers_all.Time);
		covers_FullLibraryList = undefined;
		ClearCoversTimers();
		gTime_covers = null;
		covers_loading_progress = 101;
		//console.log("covers_array size: "+g_image_cache.cachelist.length);
		//window.NotifyOthers("cover_cache_finalized",g_image_cache.cachelist)
	}
}	

function ClearCoversTimers(){
	for(var i=0; i < cover_load_timer.length; i++) {
		window.ClearInterval(cover_load_timer[i]);
	}
	cover_load_timer = [];
	for(var i=0; i < populate_covers_timer.length; i++) {
		window.ClearInterval(populate_covers_timer[i]);
	}	
	populate_covers_timer = [];	
	for(var i=0; i < get_albums_timer.length; i++) {
		window.ClearInterval(get_albums_timer[i]);
	}	
	get_albums_timer = [];	
};


function createCoverShadowStack(cover_width, cover_height, color, radius, circleMode){
	var shadow = gdi.CreateImage(cover_width, cover_height);
    var gb = shadow.GetGraphics();
	var radius = Math.floor(Math.min(cover_width/2,cover_height/2,radius));
	
	if(circleMode) gb.FillEllipse(radius, radius, cover_width-radius*2, cover_height-radius*2, color);
    else gb.FillSolidRect(radius, radius, cover_width-radius*2, cover_height-radius*2, color);
	
	shadow.ReleaseGraphics(gb);
	shadow.StackBlur(radius);
	return shadow;
};
function createCoverShadow(cover_width, cover_height, color, circleMode){
	var shadow = gdi.CreateImage(cover_width, cover_height);
    var gb = shadow.GetGraphics();
    gb.FillSolidRect(10, 10, cover_width-20, cover_height-20, color);
	shadow.ReleaseGraphics(gb);

	shadow = shadow.Resize(cover_width*1/10,cover_height*1/10,2);
	shadow = shadow.Resize(cover_width, cover_height, 2);
	return shadow;
};

// ===================================================== // Wallpaper =====================================================
function toggleWallpaper(wallpaper_state){
	wallpaper_state = typeof wallpaper_state !== 'undefined' ? wallpaper_state : !properties.showwallpaper;	
	properties.showwallpaper = wallpaper_state;
	window.SetProperty("_DISPLAY: Show Wallpaper", properties.showwallpaper);
	on_colours_changed();			
	if(properties.showwallpaper || properties.darklayout) {
		g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.IsPlaying ? fb.GetNowPlaying() : null);
	}
	brw.repaint();
}
function toggleBlurWallpaper(wallpaper_blur_state){
	wallpaper_blur_state = typeof wallpaper_blur_state !== 'undefined' ? wallpaper_blur_state : !properties.wallpaperblurred;	
	properties.wallpaperblurred = wallpaper_blur_state; on_colours_changed();		
	window.SetProperty("_DISPLAY: Wallpaper Blurred", properties.wallpaperblurred);
	if(fb.IsPlaying) g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
	brw.repaint();
}


// ============================================= JScript Callbacks ===========================================================
function on_size() {   
    ww = Math.max(window.Width,globalProperties.fullMode_minwidth);
    wh = Math.max(window.Height,globalProperties.fullMode_minheight);  
	if(window.IsVisible || first_on_size){
		// set wallpaper
		if(properties.showwallpaper){
			//g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
		}
		
		// set Size of browser
		brw.setSize(0, brw.headerBarHeight, ww, wh-brw.headerBarHeight);
		g_scrollbar.setSize(ww - cScrollBar.activeWidth, brw.y-brw.headerBarHeight, cScrollBar.activeWidth, wh - brw.y+brw.headerBarHeight, cScrollBar.normalWidth);
		if(g_showlist.idx > -1) {
			scroll = Math.floor(g_showlist.idx / brw.totalColumns) * brw.rowHeight;
			if(scroll > scroll_ && scroll - scroll_ > wh) {
				scroll_ = scroll - (Math.ceil(wh / brw.rowHeight) * brw.rowHeight);
			} else if(scroll < scroll_ && scroll_ - scroll > wh) {
				scroll_ = scroll + (Math.ceil(wh / brw.rowHeight) * brw.rowHeight);
			}			
		} else {
			scroll = g_scrollbar.check_scroll(scroll);				
		}
		g_scrollbar.setCursor(brw.totalRowsVis*brw.rowHeight, brw.rowHeight*brw.rowsCount, scroll);				
		positionButtons();
		update_size = false;	
		first_on_size = false;		
	} else {
		update_size = true;
		/*brw.setSize(0, brw.headerBarHeight, ww, wh-brw.headerBarHeight);
		g_scrollbar.setSize(ww - cScrollBar.activeWidth, brw.y-brw.headerBarHeight, cScrollBar.activeWidth, wh - brw.y+brw.headerBarHeight, cScrollBar.normalWidth);
		g_scrollbar.setCursor(brw.totalRowsVis*brw.rowHeight, brw.rowHeight*brw.rowsCount, scroll);
		scroll = g_scrollbar.check_scroll(scroll);
		positionButtons();
		update_wallpaper = true;
		set_update_function("on_size()");*/
	}
}

function set_update_function(string){
	if(string=="") Update_Required_function=string;
	else if( Update_Required_function.indexOf("brw.populate(")!=-1) return;
	else Update_Required_function=string;
}

function on_paint(gr) {
	if(update_size) on_size();	
	if(Update_Required_function!="") {
		eval(Update_Required_function);
		Update_Required_function = "";
	}      
    if(properties.showwallpaper && (typeof(g_wallpaperImg) == "undefined" || !g_wallpaperImg || update_wallpaper)) {
        g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
    };	
	if(update_headerbar) g_headerbar.setDisplayedInfo();
	// draw background under playlist
	if(fb.IsPlaying && g_wallpaperImg && properties.showwallpaper) {
		gr.DrawImage(g_wallpaperImg, 0, 0, ww, wh, 0, 0, g_wallpaperImg.Width, g_wallpaperImg.Height);
		gr.FillSolidRect(0, 0, ww, wh, (properties.wallpaperblurred)?colors.wallpaper_overlay_blurred:colors.wallpaper_overlay);
	} else {
		if(g_wallpaperImg && properties.showwallpaper) {
			gr.DrawImage(g_wallpaperImg, 0, 0, ww, wh, 0, 0, g_wallpaperImg.Width, g_wallpaperImg.Height);
			gr.FillSolidRect(0, 0, ww, wh, (properties.wallpaperblurred)?colors.wallpaper_overlay_blurred:colors.wallpaper_overlay);
		} else {
			gr.FillSolidRect(0, 0, ww, wh, colors.normal_bg);
		}
	}
	
    brw && brw.draw(gr);
	gr.FillGradRect(0, wh-colors.fading_bottom_height, ww, colors.fading_bottom_height, 90, colors.grad_bottom_2,  colors.grad_bottom_1,1);	
	
	if(!properties.showheaderbar) gr.FillSolidRect(0, 0, ww-1, brw.marginTop+brw.headerBarHeight+4,colors.no_headerbar_top);	
	
	if(properties.DragToPlaylist){
		if(!g_plmanager.isOpened || g_plmanager.side == "left") paint_scrollbar=true;
		else paint_scrollbar=false;
	} else paint_scrollbar=true;
	
    if(paint_scrollbar && g_scrollbar.isVisible) {
        g_scrollbar.draw(gr);
    }
	

}
//=================================================// Mouse Callbacks =================================================
function on_mouse_mbtn_down(x, y, mask) {
	if(brw.activeIndex > -1) {
		brw.on_mouse("mbtn_down", x, y);
	}
}
function on_mouse_lbtn_down(x, y, m) {
	
	g_resizing.on_mouse("lbtn_down", x, y, m);
	if(g_cursor.x!=x || g_cursor.y!=y) on_mouse_move(x,y);	
	
    cur_btn_down = chooseButton(x, y);
    if (cur_btn_down) {
		btn_down = true;	
        cur_btn_down.changeState(ButtonStates.down);
        window.Repaint();
		return;
    }	

	doubleClick=false;
	brw.click_down = true;
    brw.on_mouse("lbtn_down", x, y);
	g_showlist.click_down_scrollbar = false;
	
    if(g_showlist.idx > -1) {
        if(g_showlist.close_bt.checkstate("down", x, y)){
			g_showlist.close_bt.state=ButtonStates.hide;
			g_showlist.close_bt.isdown = false;
			g_showlist.close();		
			g_cursor.setCursor(IDC_ARROW);
			g_showlist.close_bt.cursor = IDC_ARROW;				
		}
        if(g_showlist.totalCols > g_showlist.totalColsVis) {
            (g_showlist.columnsOffset > 0) && g_showlist.prev_bt.checkstate("down", x, y);
            (g_showlist.columnsOffset < g_showlist.totalCols - g_showlist.totalColsVis) && g_showlist.next_bt.checkstate("down", x, y);
        }
    }
    
    // check showList Tracks
    if(g_showlist.idx > -1) {
		isHover_Row = false;
        for(var c = g_showlist.columnsOffset; c < g_showlist.columnsOffset + g_showlist.totalColsVis; c++) {
            if(g_showlist.columns[c]) {
                for(var r = 0; r < g_showlist.columns[c].rows.length; r++) {
                    check_isHover_Row = g_showlist.columns[c].rows[r].check("down", x, y);
					if(check_isHover_Row) isHover_Row = true;
                }
            }
        }
		//Check showList scrollbar
		if(g_showlist.hscr_visible && g_showlist.isHover_hscrollbar(x,y)) {					
				g_showlist.drag_start_x = x;		
				g_showlist.drag_x = x;
				g_showlist.drag_old_x = x;		
				g_showlist.click_down_scrollbar = true;				
		} else if(!isHover_Row) g_showlist.check("down", x, y);
    }  

    // check scrollbar
    if(properties.showscrollbar && g_scrollbar && g_scrollbar.isVisible) {
        g_scrollbar.check("down", x, y);
    }
	
    // inputBox
    if(brw.showFilterBox && properties.showheaderbar && g_filterbox.inputbox.visible) {
        g_filterbox.on_mouse("lbtn_down", x, y);
    }	
	
}

function on_mouse_lbtn_up_delayed(x, y){
	var changed_showlist = false;
	if(!g_drag_up_action && !doubleClick) {
		// set new showlist from selected index to expand and scroll it!
		if(properties.expandInPlace && y > brw.headerBarHeight) {
			if(x < brw.x + brw.w && brw.activeIndex > -1) {
				if(brw.clicked_id == brw.activeIndex) {
					changed_showlist = true;
					if(brw.activeIndex != g_showlist.drawn_idx) {                       							
						// set size of new showList of the selected album
						var playlist = brw.groups[brw.groups_draw[brw.activeIndex]].pl;
						g_showlist.calcHeight(playlist, brw.activeIndex);
	
						// force to no scroll if only one line of items
						if(brw.groups_draw.length <= brw.totalColumns) {
							scroll = 0;
							scroll_ = 0;
						}							
					}
								
					if(g_showlist.idx < 0) {
						if(g_showlist.close_bt) g_showlist.close_bt.state = ButtonStates.normal;
						g_showlist.reset(brw.groups_draw[brw.activeIndex], brw.activeRow);
					} else if(g_showlist.idx == brw.groups_draw[brw.activeIndex]){
						g_showlist.close();
					} else {
						g_showlist.close_bt.state = ButtonStates.normal;
						g_showlist.delta_ = 0;
						g_showlist.reset(brw.groups_draw[brw.activeIndex], brw.activeRow);
					}
					if(g_showlist.y + g_showlist.h > window.Height-brw.rowHeight/2 || g_showlist.y - brw.rowHeight < 0){
						scroll = brw.activeRow*brw.rowHeight
						scroll = scroll - scroll%brw.rowHeight
					}
					scroll = g_scrollbar.check_scroll(scroll);						
					g_scrollbar.setCursor(brw.totalRowsVis*brw.rowHeight, brw.rowHeight*brw.rowsCount, scroll);
					
					brw.repaint();
					
				}
			}
		}         				
	} 
	
	// check showList Tracks
	isHover_Row = false;
	if(g_showlist.idx > -1 && !changed_showlist) {
		for(var c = g_showlist.columnsOffset; c < g_showlist.columnsOffset + g_showlist.totalColsVis; c++) {
			if(g_showlist.columns[c]) {
				for(var r = 0; r < g_showlist.columns[c].rows.length; r++) {
					check_isHover_Row = g_showlist.columns[c].rows[r].check("up", x, y);
					if(check_isHover_Row) isHover_Row = true;						
				}
			}
		}
		g_showlist.track_rated = false;
		if(!isHover_Row) g_showlist.check("up", x, y);			
	}
	brw.on_mouse("lbtn_up", x, y);	
	brw.stopDragging(x, y);
	// scrollbar scrolls up and down RESET
	brw.buttonclicked = false;		
	brw.repaint();		
}

function on_mouse_lbtn_up(x, y, m) {
	if(g_dragA || g_dragR) g_drag_up_action=true;
	else g_drag_up_action=false;
	
	brw.click_down = false;	
	g_showlist.click_down_scrollbar = false;	
    cur_btn = chooseButton(x, y);
	var quit_function = false
    if (cur_btn_down != null && typeof cur_btn_down === 'object') {
        cur_btn_down.onClick();
		cur_btn_down = null;
		quit_function = true; 
    }
	if (cur_btn != null && typeof cur_btn === 'object') {        
        cur_btn.changeState(ButtonStates.hover);
        window.Repaint();
    }	
	if(quit_function) return;

	g_resizing.on_mouse("lbtn_up", x, y, m);

	if(!already_saved){
		x_previous_lbtn_up=x;
		y_previous_lbtn_up=y;
		brw.activeIndexFirstClick=brw.activeIndex;
		already_saved=true;
	}
	timers.afterDoubleClick = setTimeout(function() {
		already_saved=false;
		clearTimeout(timers.afterDoubleClick);
		timers.afterDoubleClick = false;
	},100);

	if(properties.DragToPlaylist) g_plmanager.checkstate("up", x, y);		
	
	if(g_showlist.idx == brw.activeIndex && brw.activeIndex > -1) delay_time=150;
	else delay_time=20;
	
	// Delay some actions, which shouldn't be triggered if there is a double click instead of a simple click
	if(g_dragA || g_dragR){
		on_mouse_lbtn_up_delayed(x, y);
	} else {
		/*timers.delayForDoubleClick = setTimeout(function() {
			clearTimeout(timers.delayForDoubleClick);
			timers.delayForDoubleClick = false;	
			on_mouse_lbtn_up_delayed(x, y);
		},delay_time);*/
		on_mouse_lbtn_up_delayed(x, y);
	}	
	
	// check g_showlist button to execute action
	g_showlist_click_on_next=false;
	g_showlist_click_on_prev=false;		
	if(g_showlist.idx > -1 && !g_showlist.drag_showlist_hscrollbar) {
		if(g_showlist.totalCols > g_showlist.totalColsVis) {	
			if((g_showlist.columnsOffset > 0) && g_showlist.prev_bt.checkstate("up", x, y) == ButtonStates.hover) {
				g_showlist_click_on_prev=true;						
				g_showlist.setColumnsOffset(g_showlist.columnsOffset > 0 ? g_showlist.columnsOffset-1 : 0);
				if(g_showlist.columnsOffset == 0) {
					g_showlist.prev_bt.state = ButtonStates.normal;
					g_cursor.setCursor(IDC_ARROW);
					g_showlist.prev_bt.cursor = IDC_ARROW;						
				}
				brw.repaint();
			}
			else if((g_showlist.columnsOffset < g_showlist.totalCols - g_showlist.totalColsVis) && g_showlist.next_bt.checkstate("up", x, y) == ButtonStates.hover) {
				g_showlist_click_on_next=true;
				g_showlist.setColumnsOffset((g_showlist.totalCols - g_showlist.columnsOffset) > g_showlist.totalColsVis ? g_showlist.columnsOffset+1 : g_showlist.columnsOffset);
				if(g_showlist.columnsOffset >= g_showlist.totalCols - g_showlist.totalColsVis) {
					g_showlist.next_bt.state = ButtonStates.normal;
					g_cursor.setCursor(IDC_ARROW);
					g_showlist.prev_bt.cursor = IDC_ARROW;						
				}				
				brw.repaint();
			}
			else if(y > g_showlist.hscr_y && y < g_showlist.hscr_y + g_showlist.hscr_height && x < g_showlist.hscr_x && !g_showlist_click_on_prev ){
				g_showlist_click_on_prev=true;						
				g_showlist.setColumnsOffset(g_showlist.columnsOffset > 0 ? g_showlist.columnsOffset-1 : 0);
				if(g_showlist.columnsOffset == 0) g_showlist.prev_bt.state = ButtonStates.normal;
				brw.repaint();					
			}					
			else if(y > g_showlist.hscr_y && y < g_showlist.hscr_y + g_showlist.hscr_height && x > g_showlist.hscr_x + g_showlist.hscr_cursor_width && !g_showlist_click_on_next ){
				g_showlist_click_on_next=true;			
				g_showlist.setColumnsOffset((g_showlist.totalCols - g_showlist.columnsOffset) > g_showlist.totalColsVis ? g_showlist.columnsOffset+1 : g_showlist.columnsOffset);
				if(g_showlist.columnsOffset >= g_showlist.totalCols - g_showlist.totalColsVis) g_showlist.next_bt.state = ButtonStates.normal;
				brw.repaint();						
			}
		}
	}		

	
	// check scrollbar scroll on click above or below the cursor
	if(g_scrollbar.hover && !g_scrollbar.cursorDrag && !g_showlist_click_on_next && !g_showlist.drag_showlist_hscrollbar) {
		var scrollstep = brw.totalRowsVis;
		if(y < g_scrollbar.cursorPos) {
			if(!brw.buttonclicked) {
				brw.buttonclicked = true;
				on_mouse_wheel(1*scrollstep);
			};
		} else {
			if(!brw.buttonclicked) {
				brw.buttonclicked = true;
				on_mouse_wheel(-1*scrollstep);
			};
		};
	};
	brw.stopResizing();
	g_showlist.drag_showlist_hscrollbar = false;
	// check scrollbar
	if(properties.showscrollbar && g_scrollbar && g_scrollbar.isVisible) {
		g_scrollbar.check("up", x, y);
	}		
	// inputBox
	if(brw.showFilterBox && properties.showheaderbar  && g_filterbox.inputbox.visible) {
		g_filterbox.on_mouse("lbtn_up", x, y);
	}	
	if(properties.showheaderbar && y>0 && y<brw.headerBarHeight) g_headerbar.on_mouse("lbtn_up", x, y);	
}

function on_mouse_lbtn_dblclk(x, y, mask) {
    doubleClick=true;
    brw.on_mouse("lbtn_dblclk", x_previous_lbtn_up, y_previous_lbtn_up);
    
    // check showList Tracks
	if(brw.activeIndexFirstClick < 0){	
		if(g_showlist.idx > -1) {
			for(var c = g_showlist.columnsOffset; c < g_showlist.columnsOffset + g_showlist.totalColsVis; c++) {
				if(g_showlist.columns[c]) {
					for(var r = 0; r < g_showlist.columns[c].rows.length; r++) {
						g_showlist.columns[c].rows[r].check("dblclk", x_previous_lbtn_up, y_previous_lbtn_up);
					}
				}
			}
		}
	}

    if(x > brw.x + brw.w) {
        // check scrollbar
        if(properties.showscrollbar && g_scrollbar && g_scrollbar.isVisible) {
            g_scrollbar.check("dblclk", x, y);
            if(g_scrollbar.hover) {
                on_mouse_lbtn_down(x, y); // ...to have a scroll response on double clicking scrollbar area above or below the cursor!
            }
        }  
    }
    // inputBox
    if(brw.showFilterBox && properties.showheaderbar && g_filterbox.inputbox.visible) {
        if(g_filterbox.inputbox.hover) {
            g_filterbox.on_mouse("lbtn_dblclk", x, y);
        }
    }	
	if(properties.showheaderbar && y>0 && y<brw.headerBarHeight) g_headerbar.on_mouse("lbtn_dblclk", x, y);		
}

function on_mouse_rbtn_down(x, y){
	var track_clicked=false;
	var album_clicked=false;
	var track_clicked_metadb = false;
	var actions = Array();
	
	brw.setActiveRow(x,y);
	if(brw.activeIndex != brw.activeIndexSaved) {
		brw.activeIndexSaved = brw.activeIndex;
		brw.repaint();
	}	
	g_avoid_on_mouse_leave=true;
	
    if(!g_dragA && !g_dragR && wh > 10) {
        var MF_SEPARATOR = 0x00000800;
        var MF_STRING = 0x00000000;
        var _menu = window.CreatePopupMenu();
        var menu_settings = window.CreatePopupMenu();	
        var Context = fb.CreateContextMenuManager();
		var sendTo = window.CreatePopupMenu();
        var idx;

        var check__ = brw.activeIndex;
        var drawSeparator = false;
		
		_menu.AppendMenuItem(MF_STRING, 1, "Settings...");
		_menu.AppendMenuSeparator();
		
        if(check__ > -1) {
			album_clicked = true;
			brw.album_Rclicked_index = check__;
			metadblist_selection = brw.groups[brw.groups_draw[check__]].pl;
			
			var quickSearchMenu = window.CreatePopupMenu();	
			quickSearchMenu.AppendMenuItem(MF_STRING, 30,"Same artist");
			quickSearchMenu.AppendMenuItem(MF_STRING, 31,"Same album");	
			quickSearchMenu.AppendMenuItem(MF_STRING, 32,"Same genre");	
			quickSearchMenu.AppendMenuItem(MF_STRING, 33,"Same date");			
			quickSearchMenu.AppendTo(_menu, MF_STRING, "Quick search for...");	
			
			try {
				if(!g_genre_cache.initialized) g_genre_cache.build_from_library();
			} catch (e) {
				g_genre_cache = new oGenreCache();
				g_genre_cache.build_from_library();
			}
			var genrePopupMenu = createGenrePopupMenu(brw.groups[brw.groups_draw[check__]].pl[0]);
			genrePopupMenu.AppendTo(_menu, MF_STRING, "Edit Genre");
			_menu.AppendMenuSeparator();
			_menu.AppendMenuItem(MF_STRING, 19, "Refresh this image");	
			_menu.AppendMenuSeparator();

			sendTo.AppendTo(_menu, MF_STRING, "Send to...");
			sendTo.AppendMenuItem(MF_STRING, 3000, "A new playlist...");
			var pl_count = plman.PlaylistCount;
			if(pl_count > 1) {
				sendTo.AppendMenuItem(MF_SEPARATOR, 0, "");
			};
			for(var i=0; i < pl_count; i++) {
				if(i != this.playlist && !plman.IsAutoPlaylist(i)) {
					sendTo.AppendMenuItem(MF_STRING, 3001 + i, plman.GetPlaylistName(i));
				};
			};	
			if(brw.currentSorting=='' && !brw.currently_sorted  && !plman.IsAutoPlaylist(brw.SourcePlaylistIdx)) {
				_menu.AppendMenuItem(MF_STRING, 16, "Delete items from playlist");	
			}
			
            Context.InitContext(brw.groups[brw.groups_draw[check__]].pl);
            Context.BuildMenu(_menu, 100, -1);
			
			track_clicked_metadb = brw.groups[brw.groups_draw[check__]].pl[0];
        } else {
            // check showList Tracks
            if(g_showlist.idx > -1) {
			
                for(var c = g_showlist.columnsOffset; c < g_showlist.columnsOffset + g_showlist.totalColsVis; c++) {
                    if(g_showlist.columns[c]) {
                        for(var r = 0; r < g_showlist.columns[c].rows.length; r++) {
                            if(g_showlist.columns[c].rows[r].check("right", x, y)) {
								
								metadblist_selection = plman.GetPlaylistSelectedItems(brw.getSourcePlaylist());
								
								var quickSearchMenu = window.CreatePopupMenu();	
								quickSearchMenu.AppendMenuItem(MF_STRING, 34,"Same title");									
								quickSearchMenu.AppendMenuItem(MF_STRING, 30,"Same artist");
								quickSearchMenu.AppendMenuItem(MF_STRING, 31,"Same album");	
								quickSearchMenu.AppendMenuItem(MF_STRING, 32,"Same genre");	
								quickSearchMenu.AppendMenuItem(MF_STRING, 33,"Same date");									
								quickSearchMenu.AppendTo(_menu, MF_STRING, "Quick search for...");	
								
								_menu.AppendMenuSeparator();
								sendTo.AppendTo(_menu, MF_STRING, "Send to...");
								sendTo.AppendMenuItem(MF_STRING, 3000, "A new playlist...");
								var pl_count = plman.PlaylistCount;
								if(pl_count > 1) {
									sendTo.AppendMenuItem(MF_SEPARATOR, 0, "");
								};
								for(var i=0; i < pl_count; i++) {
									if(i != this.playlist && !plman.IsAutoPlaylist(i)) {
										sendTo.AppendMenuItem(MF_STRING, 3001 + i, plman.GetPlaylistName(i));
									};
								};									
								if(brw.currentSorting=='' && !plman.IsAutoPlaylist(brw.SourcePlaylistIdx)) {
									
									if(metadblist_selection.Count>1)
										_menu.AppendMenuItem(MF_STRING, 17, "Delete items from playlist");
									else
										_menu.AppendMenuItem(MF_STRING, 17, "Delete item from playlist");
									//_menu.AppendMenuItem(MF_STRING, 18, "Delete useless tags");									
								}
								
								track_clicked = true;
								track_clicked_metadb = g_showlist.columns[c].rows[r].metadb;
                                //Context.InitContext(g_showlist.columns[c].rows[r].metadb);
								Context.InitContext(metadblist_selection);
                                Context.BuildMenu(_menu, 100, -1);
								//delete items

                            }
                        }
                    }
                }
				//check showList title & empty space
				if(!track_clicked &&  g_showlist.check("right", x, y)) {
					album_clicked = true;
					
					sendTo.AppendTo(_menu, MF_STRING, "Send to...");
					sendTo.AppendMenuItem(MF_STRING, 5000, "A new playlist...");
					var pl_count = plman.PlaylistCount;
					if(pl_count > 1) {
						sendTo.AppendMenuItem(MF_SEPARATOR, 0, "");
					};
					for(var i=0; i < pl_count; i++) {
						if(i != this.playlist && !plman.IsAutoPlaylist(i)) {
							sendTo.AppendMenuItem(MF_STRING, 5001 + i, plman.GetPlaylistName(i));
						};
					};						
					metadblist_selection = g_showlist.pl;
					Context.InitContext(g_showlist.pl);
					Context.BuildMenu(_menu, 100, -1);					
				}
            }
        }
		if(!track_clicked && !album_clicked){
			g_headerbar.append_sort_menu(_menu, actions);
			g_headerbar.append_group_menu(_menu, actions);
			g_headerbar.append_properties_menu(_menu, actions);
			drawSeparator = true;
		}			

		if(y>0 && y<brw.headerBarHeight) {
			 g_headerbar.on_mouse("rbtn_up",x,y); return true;
		}
        // inputBox
        if(brw.showFilterBox && properties.showheaderbar  && g_filterbox.inputbox.visible) {
            g_filterbox.on_mouse("rbtn_down", x, y);
        }
		
		if(utils.IsKeyPressed(VK_SHIFT)) {	
			_menu.AppendMenuSeparator();
			_menu.AppendMenuItem(MF_STRING, 7, "Properties ");
			_menu.AppendMenuItem(MF_STRING, 6, "Configure...");		
			_menu.AppendMenuSeparator();
			_menu.AppendMenuItem(MF_STRING, 5, "Reload");				
		}		
        idx = _menu.TrackPopupMenu(x,y);
        switch(true) {
		    case (idx == 1):
                draw_settings_menu(x,y,false,(track_clicked || album_clicked));
                break;  			
            case (idx == 5):
                window.Reload();
                break;  			
            case (idx == 6):
                window.ShowConfigure();
                break;  
            case (idx == 7):
                window.ShowProperties();
                break;
            case (idx == 8):
                scroll = scroll_ = 0;
                brw.populate(14);
                //g_sendResponse();
                break;
            case (idx == 9):
				delete_full_cache();		
                break;								
            case (idx == 16):	
				plman.ClearPlaylistSelection(plman.ActivePlaylist);
				var listIndex = [];
				var IndexStart=brw.groups[brw.groups_draw[check__]].trackIndex;
				var IndexEnd=IndexStart+brw.groups[brw.groups_draw[check__]].pl.Count-1;
				for (var i = IndexStart; i <= IndexEnd; i++) {
					listIndex.push(i);
				}				
				plman.SetPlaylistSelection(plman.ActivePlaylist, listIndex, true);
				plman.RemovePlaylistSelection(plman.ActivePlaylist, false); 
                break;					
            case (idx == 17):										
				g_showlist.removeSelectedItems();
				plman.RemovePlaylistSelection(plman.ActivePlaylist, false); 				
                break;					
            case (idx == 18):	
				delete_tags_except(g_showlist.selected_row,["album","artist","composer","date","genre","title","tracknumber"]);
                break;	
            case (idx == 19):	
				delete_file_cache(brw.groups[brw.groups_draw[check__]].metadb, check__);
				brw.refresh_one_image(check__);
				brw.refresh_browser_thumbnails();
				window.NotifyOthers("RefreshImageCover",brw.groups[brw.groups_draw[check__]].metadb);
                break;									
            case (idx == 30):
				quickSearch(track_clicked_metadb,"artist");
                break;	
            case (idx == 31):
				quickSearch(track_clicked_metadb,"album");		
                break;			
            case (idx == 32):
				quickSearch(track_clicked_metadb,"genre");		
                break;		
            case (idx == 33):
				quickSearch(track_clicked_metadb,"date");		
                break;			
            case (idx == 34):
				quickSearch(track_clicked_metadb,"title");		
                break;					
			case (idx >= 1000 && idx < 2001):
				SetGenre(idx-1000, brw.groups[brw.groups_draw[check__]].pl);
				if(g_showlist.idx > -1) g_showlist.refresh();
				break; 
            case (idx > 0 && idx < 800):
                Context.ExecuteByID(idx - 100);
                break;
			case (idx == 3000):
				fb.RunMainMenuCommand("File/New playlist");
				plman.InsertPlaylistItems(plman.PlaylistCount-1, 0, metadblist_selection, false);
				break;
			case (idx == 10000):
				g_genre_cache.build_from_library();	
				break;						
			case (idx > 5000):
				var insert_index = plman.PlaylistItemCount(idx-5001);
				plman.InsertPlaylistItems((idx-5001), insert_index, metadblist_selection, false);
				break;				
        }
		if(actions[idx]) actions[idx]();		
        Context = undefined;
        _menu = undefined;
		sendTo = undefined;
        return true;
    } else {
        return true;
    }
}
function on_mouse_move(x, y, m) {
    if(x == g_cursor.x && y == g_cursor.y) return;
	g_cursor.onMouse("move", x, y, m);	  
	
	g_resizing.on_mouse("move", x, y, m);
	
    var old = cur_btn;
    if(!brw.resize_click) cur_btn = chooseButton(x, y);	
    if (old == cur_btn && cur_btn) {
        return;
    } else if(cur_btn){
		brw.setActiveRow(-1,-1);
        old && old.changeState(ButtonStates.normal);
        cur_btn && cur_btn.changeState(ButtonStates.hover);
        brw.repaint();
		return;
    } else if(old){	
		old.changeState(ButtonStates.normal);
		brw.repaint();
	}
	
    g_ishover = (x > 0 && x < ww && y > 0 && y < wh);
    g_ishover && brw.on_mouse("move", x, y);

    if(!g_dragA && !g_dragR && !brw.external_dragging) {	
		// check showList Tracks
		if(g_showlist.idx > -1) {
			g_showlist.check("move", x, y);
		}
        // check scrollbar
        if(properties.showscrollbar && g_scrollbar && g_scrollbar.isVisible) {
            g_scrollbar.check("move", x, y);
        }
        // inputBox
        if(brw.showFilterBox && properties.showheaderbar  && g_filterbox.inputbox.visible) {
            g_filterbox.on_mouse("move", x, y);
        }		
    } else {
        if(properties.DragToPlaylist) g_plmanager.checkstate("move", x, y);
    }
    
    // if dragging out of the panel limits, repaint to clear the dragged cover
    //if(!g_ishover) {
		if(g_dragA) {
			g_avoid_on_playlist_switch = true;
			var items = brw.groups[brw.groups_draw[brw.clicked_id]].pl; 
			brw.external_dragging = true; 
			var options = {
				show_text : false,	
				use_album_art : false,
				use_theming : false,
				custom_image : createDragImg(brw.groups[brw.groups_draw[brw.clicked_id]].cover_img_full, 80, brw.groups[brw.groups_draw[brw.clicked_id]].pl.Count),
			}
			var effect = fb.DoDragDrop(window.ID, items, g_drop_effect.copy | g_drop_effect.move | g_drop_effect.link, options);
			// nothing happens here until the mouse button is released	
			brw.external_dragging = false; 
			brw.stopDragging();	
			items = undefined;			
		}
		if(g_dragR) {
			g_avoid_on_playlist_switch = true;			
			var items = plman.GetPlaylistSelectedItems(brw.getSourcePlaylist());
			showlist_selected_count = 0;
			for(var i = 0; i < g_showlist.rows_.length; i++) {
				if(g_showlist.rows_[i].isSelected) showlist_selected_count++;
			}			
			if(showlist_selected_count==items.Count) var drag_img = createDragImg(brw.groups[g_showlist.idx].cover_img_full, 80,items.Count);
			else drag_img = createDragText("Dragging", items.Count+" tracks", 220);
			brw.external_dragging = true;	
			var options = {
				show_text : false,	
				use_album_art : false,
				use_theming : false,
				custom_image : drag_img,
			}
			var effect = fb.DoDragDrop(window.ID, items, g_drop_effect.copy | g_drop_effect.move | g_drop_effect.link, options);  	
			// nothing happens here until the mouse button is released
			brw.external_dragging = false; 
			brw.stopDragging();								
			items = undefined;

		}			
        //brw.repaint();
    //}
}

function on_mouse_wheel(step, stepstrait, delta){
	if(typeof(stepstrait) == "undefined" || typeof(delta) == "undefined") intern_step = step;
	else intern_step = stepstrait/delta;
	
    if(utils.IsKeyPressed(VK_SHIFT) || brw.resize_bt.checkstate("hover", g_cursor.x, g_cursor.y)) {
        properties.thumbnailWidth += (intern_step)*4;
        if(properties.thumbnailWidth < properties.thumbnailWidthMin) properties.thumbnailWidth = properties.thumbnailWidthMin;
        if(properties.thumbnailWidth > globalProperties.thumbnailWidthMax) properties.thumbnailWidth = globalProperties.thumbnailWidthMax;
        window.SetProperty("COVER Width", properties.thumbnailWidth);
		brw.refresh_browser_thumbnails();
		if(properties.CoverShadowOpacity>0 && this.cover_shadow != null){
			this.cover_shadow = undefined;
			this.cover_shadow = null;	
		}				
        on_size();
        return;
    }
    if(!g_dragA && !g_dragR) {
        if(g_showlist.idx > -1 && g_showlist.hscr_visible && (g_showlist.isHover_hscrollbar(g_cursor.x , g_cursor.y))) {
                if(intern_step<0) {
                    g_showlist.setColumnsOffset((g_showlist.totalCols - g_showlist.columnsOffset) > g_showlist.totalColsVis ? g_showlist.columnsOffset+1 : g_showlist.columnsOffset);
                } else {
                    g_showlist.setColumnsOffset(g_showlist.columnsOffset > 0 ? g_showlist.columnsOffset-1 : 0);
                }
                brw.repaint();
        } else {
            scroll -= (intern_step) * brw.rowHeight;
            scroll = g_scrollbar.check_scroll(scroll);
			if(g_showlist.idx>-1){
				var g_showlist_futur_y = Math.round(brw.y + ((g_showlist.rowIdx + 1) * brw.rowHeight)  - scroll);
				if(intern_step<0) { //on descend
					if(g_showlist_futur_y < brw.rowHeight && g_showlist_futur_y > -brw.rowHeight) {
						scroll += g_showlist.h;
					}
				} else { //on remonte
					if(g_showlist_futur_y<brw.headerBarHeight+brw.rowHeight && g_showlist_futur_y > - g_showlist.h +brw.rowHeight) {
						//scroll -= g_showlist.h;
						scroll = g_showlist.rowIdx*brw.rowHeight;
					}				
				}			
			}
			scroll = g_scrollbar.check_scroll(scroll);
            g_scrollbar.setCursor(brw.totalRowsVis*brw.rowHeight, brw.rowHeight*brw.rowsCount, scroll);
			g_tooltip.Deactivate();
        }
    } else {
		if(properties.DragToPlaylist) g_plmanager.checkstate("wheel", g_cursor.x, g_cursor.y, intern_step);
	}
}

function on_mouse_leave() {
	if(brw.album_Rclicked_index>-1 && !g_avoid_on_mouse_leave) brw.album_Rclicked_index = -1;
	else g_avoid_on_mouse_leave=false;

    if (cur_btn) {
        cur_btn.changeState(ButtonStates.normal);
        cur_btn=null;        
    }	
	
    if(properties.showscrollbar && g_scrollbar && g_scrollbar.isVisible) {
        g_scrollbar.check("leave", 0, 0);
    }
    
    // buttons
    if(g_showlist.idx > -1) {
        g_showlist.close_bt.checkstate("leave", 0, 0);
        if(g_showlist.totalCols > g_showlist.totalColsVis) {
            (g_showlist.columnsOffset > 0) && g_showlist.prev_bt.checkstate("leave", 0, 0);
            (g_showlist.columnsOffset < g_showlist.totalCols - g_showlist.totalColsVis) && g_showlist.next_bt.checkstate("leave", 0, 0);
        }
    }
        
    brw.on_mouse("leave", 0, 0);

	g_cursor.x = 0;
    g_cursor.y = 0;
    
    g_ishover = false;
    brw.repaint();
}

//=================================================// Fonts & Colors

function get_colors() {
	get_colors_global();
	dark = {		
		normal_txt : GetGrey(240),
		faded_txt : GetGrey(210),		
		progressbar_linecolor1 : GetGrey(255,25),
		progressbar_linecolor2 : GetGrey(255,0),	
		progressbar_color_bg_off : GetGrey(0,0),
		progressbar_color_bg_on : GetGrey(255,25),
		progressbar_color_shadow : GetGrey(0,6),
		albumartprogressbar_color_rectline : GetGrey(255,30),
		albumartprogressbar_color_overlay : GetGrey(255,30),
		showlist_selected_grad1 : GetGrey(255,0),
		showlist_selected_grad2 : GetGrey(255,45),	
		showlist_selected_grad2_play : GetGrey(255,30),
		g_color_flash_bg : GetGrey(255,40),
		g_color_flash_rectline : GetGrey(255,71),
		showlist_close_bg : GetGrey(255),	
		rating_icon_on : GetGrey(255),	
		rating_icon_off : GetGrey(255,60),	
		rating_icon_border : GetGrey(0,0),			
		showlist_close_icon : GetGrey(255),
		showlist_close_iconhv : GetGrey(0),
		border_color : GetGrey(255,30),
		
	}
	light = {
		normal_txt : GetGrey(0),
		faded_txt : GetGrey(70),		
		progressbar_linecolor1 : GetGrey(0,50),
		progressbar_linecolor2 : GetGrey(255,0),	
		progressbar_color_bg_off : GetGrey(255,0),
		progressbar_color_bg_on : GetGrey(255,70),		
		progressbar_color_shadow : GetGrey(0,4),
		albumartprogressbar_color_rectline : GetGrey(0,40),
		albumartprogressbar_color_overlay : GetGrey(0,80),
		showlist_selected_grad1 : GetGrey(255,0),
		showlist_selected_grad2 : GetGrey(0,36),	
		showlist_selected_grad2_play : GetGrey(0,26),
		g_color_flash_bg : GetGrey(0,15),
		g_color_flash_rectline : GetGrey(0,46),
		showlist_close_bg : GetGrey(0),		
		rating_icon_on : GetGrey(0),	
		rating_icon_off : GetGrey(0,30),		
		rating_icon_border : GetGrey(0,0),		
		showlist_close_icon : GetGrey(0,165),
		showlist_close_iconhv : GetGrey(255),
		border_color : GetGrey(0,60),
		border_color_colored : GetGrey(0,20),
		border_color_colored_darklayout : GetGrey(255,30)
	}
	
	if(properties.darklayout){			
		colors.grad_bottom_1 = GetGrey(0,70);
		colors.grad_bottom_2 = GetGrey(0,0);
		colors.fading_bottom_height = 65;
				
		colors.flash_bg = GetGrey(255,40);
		colors.flash_rectline = GetGrey(255,71);		
		
		image_playing_playlist = now_playing_progress1;
		
		colors.headerbar_settings_bghv = GetGrey(255,40);
		colors.headerbar_grad1 = GetGrey(0,0);
		colors.headerbar_grad2 = GetGrey(0,0);
		colors.headerbar_resize_btn = GetGrey(255,200);	
		colors.headerbar_resize_btnhv = GetGrey(255);
		colors.no_headerbar_top = GetGrey(0,0);	
		
		colors.albumartprogressbar_txt = GetGrey(255);	
		colors.albumartprogressbar_overlay = GetGrey(0,80);	
		colors.albumartprogressbar_rectline = GetGrey(255,40);	
		
		colors.cover_hoverOverlay = GetGrey(0,155);	
		colors.covergrad_hoverOverlay = GetGrey(0,255);			
		colors.cover_rectline = GetGrey(255,20);	
		colors.cover_nocover_rectline = GetGrey(255,45);	
		
		colors.cover_ellipse_before_rectline = GetGrey(255,30);
		colors.cover_ellipse_nowplaying_rectline = GetGrey(255,30);			
		colors.cover_ellipse_after_rectline = GetGrey(255,10);	
		colors.cover_ellipse_notloaded_rectline = GetGrey(255,50);	
		colors.cover_ellipse_nowplaying = GetGrey(0,150);
		colors.cover_ellipse_hover = GetGrey(0,220);	

		colors.nowplaying_animation_circle = GetGrey(255,50);
		colors.nowplaying_animation_line = GetGrey(255,35);
		
		properties.CoverShadowOpacity = (255-properties.default_CoverShadowOpacity)*0.2+properties.default_CoverShadowOpacity;	
		
		colors.cover_shadow = GetGrey(0, properties.CoverShadowOpacity);
		colors.cover_shadow_hover = GetGrey(0, (255-properties.CoverShadowOpacity)*2/3+properties.CoverShadowOpacity);		
		colors.cover_shadow_bg = GetGrey(255);	
		
		colors.cover_date_bg = GetGrey(255,185);
		colors.cover_date_txt = GetGrey(0);
		colors.cover_date_bg_fast = GetGrey(0,155);
		colors.cover_date_txt_fast = GetGrey(255,155);	
		colors.dragcover_overlay = GetGrey(0,85);	
		colors.dragcover_rectline = GetGrey(255,40);	
		colors.dragcover_itemsbg = GetGrey(240,255);	
		colors.dragcover_itemstxt = GetGrey(0);			
		
		colors.showlist_bg = GetGrey(0);	
		colors.showlist_border_color = GetGrey(255,50);		
		colors.showlist_color_overlay = GetGrey(0,80);			
		colors.showlist_close_bg = GetGrey(255);
		colors.showlist_close_icon =  GetGrey(255);
		colors.showlist_close_iconhv =  GetGrey(0);	
		colors.showlist_selected_grad1=GetGrey(255,0);
		colors.showlist_selected_grad2=GetGrey(255,45);	
		colors.showlist_selected_grad2_play=GetGrey(255,30);		
		colors.showlist_scroll_btns_bg = GetGrey(255);
		colors.showlist_scroll_btns_icon = GetGrey(0);
		colors.showlist_dragtrackbg = GetGrey(255,175);	
		colors.showlist_dragitemstxt = GetGrey(0);		
	} else {			
		colors.grad_bottom_1 = GetGrey(230,90);
		colors.grad_bottom_2 = GetGrey(230,0);
		colors.fading_bottom_height = 39;
		
		colors.grad_bottom_12 = GetGrey(0,15);
		colors.grad_bottom_22 = GetGrey(0,0);			

		colors.flash_bg = GetGrey(0,10);		
		colors.flash_rectline = GetGrey(0,41);	

		image_playing_playlist = now_playing_img1;	
	
		colors.headerbar_settings_bghv = GetGrey(230);
		colors.headerbar_grad1 = GetGrey(255,0);
		colors.headerbar_grad2 = GetGrey(255,40);
		colors.headerbar_resize_btn = GetGrey(0,120);	
		colors.headerbar_resize_btnhv = GetGrey(0);
		colors.no_headerbar_top = GetGrey(255);
		
		
		colors.albumartprogressbar_txt = GetGrey(255);	
		colors.albumartprogressbar_overlay = GetGrey(0,80);	
		colors.albumartprogressbar_rectline = GetGrey(0,40);	
		
		colors.cover_hoverOverlay = GetGrey(0,155);	
		colors.covergrad_hoverOverlay = GetGrey(0,255);			
		colors.cover_rectline = GetGrey(0,25);	
		colors.cover_nocover_rectline = GetGrey(0,35);	

		colors.cover_ellipse_before_rectline = GetGrey(255,30);
		colors.cover_ellipse_nowplaying_rectline = GetGrey(255,30);			
		colors.cover_ellipse_after_rectline = GetGrey(255,10);			
		colors.cover_ellipse_notloaded_rectline = GetGrey(0,25);
		colors.cover_ellipse_nowplaying = GetGrey(0,150);
		colors.cover_ellipse_hover = GetGrey(0,160);	
		
		colors.nowplaying_animation_circle = GetGrey(0,20);
		colors.nowplaying_animation_line = GetGrey(0,35);
		
		properties.CoverShadowOpacity = properties.default_CoverShadowOpacity;		
		colors.cover_shadow = GetGrey(0, properties.CoverShadowOpacity);
		colors.cover_shadow_hover = GetGrey(0, (255-properties.CoverShadowOpacity)*0.15+properties.CoverShadowOpacity);				
		colors.cover_shadow_bg = GetGrey(255);
		
		colors.cover_date_bg = GetGrey(0,115);
		colors.cover_date_txt = GetGrey(255,155);
		colors.cover_date_bg_fast = GetGrey(0,155);
		colors.cover_date_txt_fast = GetGrey(255,155);	
		colors.dragcover_overlay = GetGrey(0,85);	
		colors.dragcover_rectline = GetGrey(0,105);	
		colors.dragcover_itemsbg = GetGrey(20);	
		colors.dragcover_itemstxt = GetGrey(255);	
		
		colors.showlist_bg = GetGrey(0,10);	
		colors.showlist_border_color = GetGrey(210);
		colors.showlist_color_overlay = GetGrey(0,80);	
		colors.showlist_close_bg = GetGrey(0);
		colors.showlist_close_icon =  GetGrey(0,165);
		colors.showlist_close_iconhv =  GetGrey(255);	
		colors.showlist_selected_grad1=GetGrey(255,0);
		colors.showlist_selected_grad2=GetGrey(0,36);	
		colors.showlist_selected_grad2_play=GetGrey(0,26);		
		colors.showlist_scroll_btns_bg = GetGrey(30);
		colors.showlist_scroll_btns_icon = GetGrey(255);		
		colors.showlist_dragtrackbg = GetGrey(0,175);	
		colors.showlist_dragitemstxt = GetGrey(255);			
	}
}

function on_font_changed() {
    get_font();
	brw.fontDate = gdi.Font("Arial", g_fsize-1+properties.globalFontAdjustement, 2);	
	g_showlist.ratingImgsLight = false;
	g_showlist.ratingImgsDark = false;
	brw.get_metrics_called = false;
	g_filterbox.on_init();
	on_size();
}

function on_colours_changed() {
    get_colors();
	brw.cover_shadow=null;
	brw.cover_shadow_hover=null;	
	brw.dateCircleBG=null;
	g_showlist.setImages();	
	g_filterbox.on_init();
	g_headerbar.setButtons();
	brw.setResizeButton(65,14);
	positionButtons();
	if(g_scrollbar.isVisible) g_scrollbar.setCursorButton();
    window.Repaint();
}


function on_script_unload() {
    //brw.resetTimer();
}

//=================================================// Playback Callbacks =================================================
/*function on_playback_pause(state) {
    if(window.IsVisible) brw.repaint();
}*/

function on_playback_stop(reason) {
	g_seconds = 0;
	g_showlist.CheckIfPlaying();	
	if(window.IsVisible) {
		if(g_showlist.idx > -1) {
			if(g_showlist.y > 0 - g_showlist.h && g_showlist.y < wh) {
				brw.repaint();
			}
		}
		switch(reason) {
		case 0: // user stop
		case 1: // eof (e.g. end of playlist)
			// update wallpaper
			if(properties.showwallpaper && properties.wallpapermode == 0) {
				g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, null);
			};
			brw.repaint();
			break;
		case 2: // starting_another (only called on user action, i.e. click on next button)
			break;
		};		
	}
}

function on_playback_new_track(metadb) {
	g_showlist.CheckIfPlaying();
	g_seconds = 0;
	try{
		playing_track_playcount = TF.play_count.Eval();
	} catch(e){}	
	if(window.IsVisible){		
		if((properties.followNowPlaying && !nowplayinglib_state.isActive()) || g_showlist.isPlaying || FocusOnNowPlaying && !brw.firstInitialisation) {
			FocusOnNowPlaying = true;					
			if(plman.ActivePlaylist!=plman.PlayingPlaylist) {
				plman.ActivePlaylist = plman.PlayingPlaylist;
			} else {
				var isFound = brw.seek_track(metadb);
				if(!isFound) { 
					if(fb.GetNowPlaying()) {
						brw.populate(18);
					} else {	
						timers.showItem = setTimeout(function(){
							brw.populate(19);
							clearTimeout(timers.showItem);
							timers.showItem=false;
						}, 200);                    
					}
				}	
			}			
		}
		if(properties.showwallpaper && properties.wallpapermode == 0) {
			g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, metadb);
		}		
		timers.updateHeaderText = setTimeout(function(){
			g_headerbar.setDisplayedInfo();
			brw.repaint();
			clearTimeout(timers.updateHeaderText);
			timers.updateHeaderText=false;
		}, 200);  		
		brw.repaint();
	} else {
		update_headerbar = true;
		if(properties.wallpapermode == 0) update_wallpaper = true;
	}
}

function on_playback_time(time) {
	g_seconds = time;
	if(window.IsVisible) {		
		if(g_showlist.idx > -1 && g_showlist.playing_row_w>0) {
			if(g_showlist.y > 0 - g_showlist.h && g_showlist.y < wh && g_showlist.playing_row_y>0) {
				window.RepaintRect(g_showlist.playing_row_x, g_showlist.playing_row_y, g_showlist.playing_row_w+4, g_showlist.playing_row_h+4);
			}
		}
	}
}
function on_playback_seek(time) {
	g_seconds = time;
	if(window.IsVisible) {
		if(g_showlist.idx > -1 && g_showlist.playing_row_w>0) {
			if(g_showlist.y > 0 - g_showlist.h && g_showlist.y < wh) {
				window.RepaintRect(g_showlist.playing_row_x, g_showlist.playing_row_y, g_showlist.playing_row_w+4, g_showlist.playing_row_h+4);
			}
		}
	}
}

//=================================================// Playlist Callbacks
function on_playlist_switch() {
	if(brw.followActivePlaylist){
		if(!g_avoid_on_playlist_switch) {
			if(window.IsVisible) {
				g_avoid_on_items_added=true;	
				g_avoid_on_items_removed=true;		
				if(!g_avoid_on_playlists_changed) {
					var new_SourcePlaylistIdx = brw.calculateSourcePlaylist();
				}
				if(new_SourcePlaylistIdx!=brw.SourcePlaylistIdx){
					if(window.IsVisible) brw.populate(20);
					else set_update_function('brw.populate(20);');
				}
				timers.avoidCallbacks && clearTimeout(timers.avoidCallbacks);		
				timers.avoidCallbacks = setTimeout(function() {
					g_avoid_on_items_added=false;	
					g_avoid_on_items_removed=false;					
					clearTimeout(timers.avoidCallbacks);	
					timers.avoidCallbacks = false;			
				}, 30);					
			} 			
		} else g_avoid_on_playlist_switch = false;
	}
}
function on_playlist_items_reordered(playlist) {
	source_playlist_idx = brw.calculateSourcePlaylist();
	if(brw.followActivePlaylist || source_playlist_idx==playlist){
		if(window.IsVisible) {	
			if(playlist==brw.SourcePlaylistIdx) brw.populate(21);
			set_update_function("");		
		} else set_update_function('on_playlist_items_reordered('+playlist+')');
	}
}
function on_playlists_changed() {
	new_playlist_idx = brw.calculateSourcePlaylist();	
	if(new_playlist_idx!=brw.SourcePlaylistIdx && !g_avoid_on_playlists_changed) brw.populate(46);
	if(brw.followActivePlaylist){	
		if(!g_avoid_on_playlists_changed){
			if(window.IsVisible) {		
				if(properties.DragToPlaylist) g_plmanager.setPlaylistList();
				set_update_function("");		
			} else {
				set_update_function('on_playlists_changed();');		
				if(properties.DropInplaylist) g_plmanager.refresh_required = true;
			}
		}	
	} 
	if(!window.IsVisible) {
		if(properties.DropInplaylist) g_plmanager.refresh_required = true;
	}
}
function on_playlist_items_selection_change() {
    if(window.IsVisible) brw.repaint();
	else g_showlist.resetSelection();
};

function on_playlist_items_added(playlist) {	
	source_playlist_idx = brw.calculateSourcePlaylist();
	if(brw.followActivePlaylist || source_playlist_idx==playlist){	
		if(!g_avoid_on_items_added){		
			g_avoid_on_items_removed=true;
			g_avoid_on_playlist_switch=true;			
			//brw.calculateSourcePlaylist();	
			if(playlist==source_playlist_idx && !brw.external_dragging) {
				if(!window.IsVisible) set_update_function("brw.populate(22)");
				else {
					brw.populate(22,false,true);
					set_update_function("");
				}
			}  
			timers.avoidCallbacks && clearTimeout(timers.avoidCallbacks);		
			timers.avoidCallbacks = setTimeout(function() {
				g_avoid_on_items_removed=false;						
				g_avoid_on_playlist_switch=false;			
				clearTimeout(timers.avoidCallbacks);	
				timers.avoidCallbacks = false;			
			}, 30);			
		}	
	}		
}

function on_playlist_items_removed(playlist) {	
	source_playlist_idx = brw.calculateSourcePlaylist();
	if(brw.followActivePlaylist || source_playlist_idx==playlist){
		if(!g_avoid_on_items_removed){	
			g_avoid_on_items_added=true;
			g_avoid_on_playlist_switch=true;
			if(playlist==source_playlist_idx && !brw.external_dragging) {
				if(!window.IsVisible) set_update_function("brw.populate(23)");
				else {
					brw.populate(23,false,true);
					set_update_function("");
				}
			}
			timers.avoidCallbacks && clearTimeout(timers.avoidCallbacks);
			timers.avoidCallbacks = setTimeout(function() {
				g_avoid_on_items_added=false;	
				g_avoid_on_playlist_switch=false;
				clearTimeout(timers.avoidCallbacks);
				timers.avoidCallbacks = false;
			}, 30);			
		}
	}	
}
function on_library_items_added() {
	if(LibraryItems_counter<1) {
		LibraryItems_counter = fb.GetLibraryItems().Count;
		brw.repaint();
	}	
	if(brw_populate_callID == 'on_metadb_changed') {
		timer.reset(timer.populate, 0);
		brw_populate_callID = '';
	}
};
function on_metadb_changed(metadbs, fromhook) {
	if(window.IsVisible) {			
		playing_track_new_count = parseInt(playing_track_playcount,10)+1;
		try{
			if(fb.IsPlaying && metadbs.Count==1 && metadbs[0].RawPath==fb.GetNowPlaying().RawPath && TF.play_count.Eval()==(playing_track_new_count)) {	
				playing_track_playcount = playing_track_new_count;
				return;
			}
		} catch(e){}	
				
		if(g_rating_updated || fromhook) { // no repopulate if tag update is from rating click action in playlist
			g_rating_updated = false;
			return;			
		};	
		//if(brw.SourcePlaylistIdx==plman.ActivePlaylist){
			timer.brw_populate('on_metadb_changed',false,true);			
			//brw.populate(32,false,true);		
			return;
		//}
		var columnsOffset_saved = g_showlist.columnsOffset;
		// refresh meta datas of the grid
		var total = brw.groups.length;

		var item;
		var str = "";
		var arr = [];
		for(var i=0; i < total; i++) {
			item = brw.groups[i].metadb;
			str = TF.meta_changed.EvalWithMetadb(item);
			arr = str.split(" ^^ ");
			if(brw.groups[i].artist != arr[0]){
				brw.groups[i].artist = arr[0];
				refresh = true;
			}
			if(brw.groups[i].album != arr[1]){
				brw.groups[i].album = arr[1];
				refresh = true;				
			}			
		}
		// refresh rows of the active showList if this one is expanded
		var idx = g_showlist.idx;
		if(idx > -1) {
			var playlist = brw.groups[idx].pl;
			g_showlist.calcHeight(playlist, idx);
			g_showlist.setColumnsOffset(columnsOffset_saved);
			g_showlist.getHeaderInfos(true);	
		}
		brw.repaint();
	} else {
		if(g_avoid_on_metadb_changed || fromhook) {
			g_avoid_on_metadb_changed = false;
			return;
		}		
		Update_Required_function = 'brw.populate(24);';	    	
	}
}

function on_drag_enter(action, x, y, mask) {
	action.Effect = 0;	
}

function on_drag_leave() {
	g_resizing.on_mouse("lbtn_up", 0, 0, null);		
	if(properties.DragToPlaylist) {
		len = g_plmanager.playlists.length;
		for(var i = 0; i < len ; i++) {
			if(g_plmanager.playlists[i].type==2) {
				g_plmanager.playlists[i].checkstate("move", -1, -1, i);
			}
		}
		g_plmanager.checkstate("move", -1, -1);
		g_cursor.x = g_cursor.y = -1;
		brw.repaint();		
	}
}

function on_drag_drop(action, x, y, mask) {
	if(g_dragA || g_dragR) {
		g_resizing.on_mouse("lbtn_up", 0, 0, null);	
	}	
	action.Effect = 0;	
	brw.click_down = false;
	if(properties.DragToPlaylist) g_plmanager.checkstate("up", x, y);	
	brw.on_mouse("lbtn_up", x, y);	
	brw.repaint();
}

function on_drag_over(action, x, y, mask) {
	if(!(g_dragA || g_dragR)) {
		action.Effect = 0;	
		return;
	}
    if(x == g_cursor.x && y == g_cursor.y) return true;	
	if(properties.DragToPlaylist) g_plmanager.checkstate("move", x, y);	
	try{
		action.Text = "Insert";
	} catch(e){}
    g_cursor.x = x;
    g_cursor.y = y;
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
		case "Randomsetfocus":
			randomStartTime = Date.now();
		break;  	
		case "UpdatePlaylists":
			brw.setSourcePlaylist();
		break;  		
		case "nowPlayingTrack":
			g_avoid_on_playlist_switch = true;
		break; 		
		case "enable_screensaver":		
			globalProperties.enable_screensaver = info;
			window.SetProperty("GLOBAL enable screensaver", globalProperties.enable_screensaver);	
		break;			
		case "left_filter_state":		
			properties.leftFilterState = info;
			window.SetProperty("MAINPANEL Left filter state", properties.leftFilterState);	
		break;				
		case "titlebar_search":
			//brw.forceActivePlaylist = true;
			//g_filterbox.inputbox.text = info;
			//g_filterbox.inputbox.on_char(0);
		break; 	
		case "set_font":
			properties.globalFontAdjustement = info;
			window.SetProperty("MAINPANEL: Global Font Adjustement", properties.globalFontAdjustement),
			on_font_changed();
			if(g_showlist.idx>=0){
				playlist = brw.groups[g_showlist.idx].pl;
				g_showlist.calcHeight(playlist, g_showlist.idx);
				g_showlist.reset(g_showlist.idx, g_showlist.rowIdx);
			}
			brw.repaint();
		break; 		
		case "rating_updated": 
			g_avoid_on_metadb_changed=true;
			if(properties.showRating && g_showlist.idx > -1){
				if(window.IsVisible && !timers.ratingUpdate){
					timers.ratingUpdate = setTimeout(function(){
						g_showlist.refreshRows();
						brw.repaint();
						clearTimeout(timers.ratingUpdate);
						timers.ratingUpdate=false;
					}, 300); 
				} else set_update_function("g_showlist.refresh();brw.repaint();");
			}
		break;	
		case "refresh_filters":
			timers.ratingUpdate = setTimeout(function(){
				g_avoid_history = true;
				clearTimeout(timers.ratingUpdate);
				timers.ratingUpdate=false;
			}, 300); 		
		break; 			
		case "reset_filters":
			g_filterbox.clearInputbox();
		break; 		
		case "nowplayinglib_state":
			nowplayinglib_state.value=info;
			if(nowplayinglib_state.isActive()) {
				selection_idx = brw.getSelectionPlaylist();
				if(selection_idx != brw.SourcePlaylistIdx){
					playlist_items = plman.GetPlaylistItems(brw.SourcePlaylistIdx);
					plman.ClearPlaylist(selection_idx);
					plman.InsertPlaylistItems(selection_idx, 0, playlist_items);
					playlist_items = undefined;
				}
			} else {
				brw.calculateSourcePlaylist();
			}
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
		case "stopFlashNowPlaying":
			brw.stopFlashNowPlaying();
			brw.repaint();
		break;  				
		case "library_dark_theme":
			properties.darklayout = info;
			window.SetProperty("_DISPLAY: Dark layout", properties.darklayout);
			on_colours_changed();			
			if(properties.darklayout) g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.IsPlaying ? fb.GetNowPlaying() : null);
			brw.repaint();
		break; 		
		case "wallpaperVisibilityGlobal":		
		case "wallpaperVisibility":
			if(window.IsVisible || name=="wallpaperVisibilityGlobal") toggleWallpaper(info);
		break; 			
		case "wallpaperBlurGlobal":		
		case "wallpaperBlur":
			if(window.IsVisible || name=="wallpaperBlurGlobal") toggleBlurWallpaper(info);
		break; 		
		case "DiskCacheState":
			globalProperties.enableDiskCache = info;
			window.SetProperty("COVER Disk Cache", globalProperties.enableDiskCache);			
			brw.repaint();
		break;  	
		case "LoadAllCoversState":
			globalProperties.load_covers_at_startup = info;
			window.SetProperty("COVER Load all at startup", globalProperties.load_covers_at_startup);	
		break; 	
		case "LoadAllArtistImgState":
			globalProperties.load_artist_img_at_startup = info;
			window.SetProperty("ARTIST IMG Load all at startup", globalProperties.load_artist_img_at_startup);	
		break; 			
		case "libraryfilter_state":
			libraryfilter_state.value=info;
		break; 		
		case "RefreshImageCover":
			if(window.IsVisible) brw.refresh_browser_images();
			else set_update_function('brw.refresh_browser_images();');
		break; 		
		/*case "seek_nowplaying_in_current":
			brw.seek_track(info);
		break;*/
        case "FocusOnNowPlayingForce":			
        case "FocusOnNowPlaying":	
			if(window.IsVisible && (!nowplayinglib_state.isActive() || name=='FocusOnNowPlayingForce') && !avoidShowNowPlaying){
				avoidShowNowPlaying = true;						
				/*if(properties.leftFilterState=="library_tree" && libraryfilter_state.isActive() && nowplayinglib_state.isActive()){
					FocusOnNowPlaying = true;
					clearTimeout(timers.showItem);
					timers.showItem = setTimeout(function(){
						FocusOnNowPlaying = false;
						clearTimeout(timers.showItem);
						timers.showItem = false;
					}, 1000);   
				} else { */
					if(info!=null) { 
						brw.focus_on_now_playing(info);
					} else {
						FocusOnNowPlaying = true;
						clearTimeout(timers.showItem);
						timers.showItem = setTimeout(function(){
							FocusOnNowPlaying = false;
							clearTimeout(timers.showItem);
							timers.showItem = false;
						}, 2000);                    		
					}	
				//}		
				if(timers.avoidShowNowPlaying) clearTimeout(timers.avoidShowNowPlaying);
				timers.avoidShowNowPlaying = setTimeout(function() {
					avoidShowNowPlaying = false;
					clearTimeout(timers.avoidShowNowPlaying);
					timers.avoidShowNowPlaying = false;
				}, 500);					
			}			
            break;
        case "WSH_panels_reload":
			window.Reload();
            break;		
		case "hereIsGenreList":  
			g_genre_cache=info;
			break;	 
		case "avoid_on_playlists_changed":  
			g_avoid_on_playlists_changed=info;
			break;
		case "giveMeGenreList":   
			if(!timers.returnGenre && !g_genre_cache.isEmpty()){
				timers.returnGenre=true;
				timers.returnGenre = setTimeout(function() {
					clearTimeout(timers.returnGenre);		
					timers.returnGenre=false;	
					window.NotifyOthers("hereIsGenreList",JSON_stringify(g_genre_cache));					
				}, 150);		
			}
            break;					
    }
}

//=================================================// Keyboard Callbacks

function on_char(code) {
    // inputBox
    if(brw.showFilterBox && properties.showheaderbar  && g_filterbox.inputbox.visible) {
        g_filterbox.on_char(code);
    }
};

function on_key_up(vkey) {
    // inputBox
    if(brw.showFilterBox && properties.showheaderbar  && g_filterbox.inputbox.visible) {
        g_filterbox.on_key("up", vkey);
    }
};

function on_key_down(vkey) {
    var mask = GetKeyboardMask();

	if (mask == KMask.none) {
		switch (vkey) {
		case VK_F2:
			break;
		case VK_F3:
			//brw.showNowPlaying();
			break;
		case VK_F5:
			brw.repaint();
			break;
		case VK_F6:
			break;
		case VK_TAB:
			break;
		case VK_BACK:
			break;
		case VK_ESCAPE:
			if(g_uihacks.getFullscreenState()) g_uihacks.toggleFullscreen();
			break;			
		case 222:
			break;
		case VK_UP:          
			on_mouse_wheel(1);
			break;
		case VK_DOWN:
			on_mouse_wheel(-1);
			break;
		case VK_PGUP:
			scroll-=brw.totalRowsVis*brw.rowHeight;
			scroll=g_scrollbar.check_scroll(scroll);
			g_scrollbar.setCursor(0, 0, scroll);
			break;
		case VK_PGDN:
			scroll+=brw.totalRowsVis*brw.rowHeight;
			scroll=g_scrollbar.check_scroll(scroll);
			g_scrollbar.setCursor(0, 0, scroll);	
			break;
		case VK_RETURN:
			// play/enqueue focused item
			break;
		case VK_END:
			scroll=brw.rowHeight*brw.rowsCount + g_showlist.h;
			scroll=g_scrollbar.check_scroll(scroll);
			g_scrollbar.setCursor(0, 0, scroll);	
			break;
		case VK_HOME:
			scroll=0;
			g_scrollbar.setCursor(0, 0, scroll);
			break;
		case VK_DELETE:
			if(g_showlist.haveSelectedRows()){
				var metadblist_selection = plman.GetPlaylistSelectedItems(brw.getSourcePlaylist());
				if(!plman.IsAutoPlaylist(brw.getSourcePlaylist()) && metadblist_selection.Count>0) {
					function delete_confirmation(status, confirmed) {
						if(confirmed){
							plman.RemovePlaylistSelection(brw.getSourcePlaylist(), false);
							plman.SetPlaylistSelectionSingle(brw.getSourcePlaylist(), plman.GetPlaylistFocusItemIndex(brw.getSourcePlaylist()), true);	
						}		
					}					
					var QuestionString = 'Delete '+metadblist_selection.Count+' selected file(s) from current library selection ?';
					HtmlDialog("Please confirm", QuestionString, 'Yes', 'No', delete_confirmation);						
				};
			}
			break;
		};
	} else {
		switch(mask) {
			case KMask.shift:
				switch(vkey) {
					case VK_SHIFT: // SHIFT key alone

						break;
					case VK_UP: // SHIFT + KEY UP

						break;
					case VK_DOWN: // SHIFT + KEY DOWN

						break;
				};
				break;
			case KMask.ctrl:
				if(vkey==65) { // CTRL+A
					if(g_showlist.idx>-1){
						g_showlist.selectAll();
						brw.repaint();
					}
				};
				if(vkey==66) { // CTRL+B
				};
				if(vkey==88) { // CTRL+X
				};
				if(vkey==67) { // CTRL+C

				};
				if(vkey==86) { // CTRL+V

				};
				if(vkey==70) { // CTRL+F
					fb.RunMainMenuCommand("Edit/Search");
				};
				if(vkey==73) { // CTRL+I

				};
				if(vkey==78) { // CTRL+N
					fb.RunMainMenuCommand("File/New playlist");
				};
				if(vkey==79) { // CTRL+O
					fb.RunMainMenuCommand("File/Open...");
				};
				if(vkey==80) { // CTRL+P
					fb.RunMainMenuCommand("File/Preferences");
				};
				if(vkey==83) { // CTRL+S
					fb.RunMainMenuCommand("File/Save playlist...");
				};
				if(vkey==84) { // CTRL+T
				};
				if(vkey == 48 || vkey == 96) { // CTRL+0
				};
				break;
			case KMask.alt:
				switch(vkey) {
				case 65: // ALT+A
					fb.RunMainMenuCommand("View/Always on Top");
					break;
				case VK_ALT: // ALT key alone
					break;
				};
				break;
		};
	};
    // inputBox
    if(brw.showFilterBox && properties.showheaderbar  && g_filterbox.inputbox.visible) {
        g_filterbox.on_key("down", vkey);
    }		
};
function on_focus(is_focused) {	
	g_filterbox.on_focus(is_focused)
}
/*function on_item_focus_change(){
    if(fb.GetNowPlaying() && fb.GetFocusItem(true) && fb.GetFocusItem(true).RawPath==fb.GetNowPlaying().RawPath) fb.CursorFollowPlayback=1;
    else if (fb.IsPlaying) fb.CursorFollowPlayback=0;
}*/

function on_init() {
    get_font();	
	get_colors();    
    brw = new oBrowser("brw");
	brw.startTimer();
	
	g_cursor = new oCursor();	
	g_headerbar = new oHeaderBar("g_headerbar");
	g_filterbox = new oFilterBox();
	g_filterbox.inputbox.visible = true;
	positionButtons();
	g_tooltip = new oTooltip('brw');
	
	g_resizing = new Resizing();
	
	g_history = new oPlaylistHistory();
	
    g_showlist = new oShowList("brw");
    g_scrollbar = new oScrollbar("brw");
	brw.dontFlashNowPlaying=true;
    if(properties.DragToPlaylist) g_plmanager = new oPlaylistManager("brw");
    
	g_image_cache = new oImageCache();
	g_genre_cache = new oGenreCache();
	
	timer = new oTimers();
	
	LibraryItems_counter = fb.GetLibraryItems().Count;

	if((globalProperties.load_covers_at_startup || globalProperties.load_artist_img_at_startup) && globalProperties.enableDiskCache) {
		populate_with_library_covers(0,"123456789123456789","");
	}
    if(fb.IsPlaying) {
		g_seconds = TF.playback_time_seconds.Eval();
		playing_track_playcount = TF.play_count.Eval();
	}
}
on_init();