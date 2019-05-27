/*!
  * StatPlanet v 2.0 (https://statsilk.com/)
  * Copyright 2008-2019 StatSilk | Frank van Cappelle
  * Licensed under the GNU General Public License v3.0
  */


function isArray(obj) { return Object.prototype.toString.call(obj) === '[object Array]'; }
Array.prototype.max = function() { return Math.max.apply(null, this); };
Array.prototype.min = function() { return Math.min.apply(null, this); };
Array.prototype.uniqueArray = function() { var a = []; for (var i = 0, l = this.length; i < l; i++)
        if (a.indexOf(this[i]) === -1) a.push(this[i]);
    return a; };
 
/***
 * 
 * @desc for adding xaxis and yaxis events
 * @param t Statplanet Shorthand
 * @returns {none}
 */
! function(t) {
    var a, e = t.Tick.prototype,
        r = t.Chart.prototype.customEvent = function(e, n) {
            r.add = function(e, r, i) {
                for (var n in r)
                    ! function(n) {
                        r.hasOwnProperty(n) && e && (e[n] && e[n] !== a || t.addEvent(e.element, n, function() {
                            return i.textStr && (i.value = i.textStr), r[n].call(i), !1;
                        }), e[n] = !0);
                    }(n);
            }, t.wrap(e, n, function(e) {
                function o(t) { c.push(t.label); }
                var l, s, p, c, f, h, u = e.apply(this, Array.prototype.slice.call(arguments, 1));
                switch (n) {
                    case "addLabel":
                        if (f = this.parent, p = this.axis.options.labels.events, c = [this.label], f)
                            for (var d = this; d;) {
                                if (isArray(d))
                                    for (h = d.length, i = 0; i < h; i++) o(d[i]);
                                else o(d);
                                d = d.parent;
                            }
                }
                if (l || p) {
                    if (p)
                        for (var h = c.length, v = 0; h > v; v++) { var y = t.pick(c[v].graphic, c[v]);
                            y && y !== a && r.add(y, p, c[v]); }
                    r.add(s, l, this);
                }
                return u;
            });
        };
    r(e, "addLabel");
}(Statplanet);
 
(function($, Statplanet, window) {
    Statplanet.setOptions({
        lang: {
            decimalPoint: ',',
            thousandsSep: '.'
        }
    });
    $.fn.statsilk = function(options) {
        var defaults = {
                //select color graph/map
                selectionColor: '#a4edba',chartColor: '#337ab7',debug: true,startupParams: '',
                // let the data folder is placed where the plugin initialised page is placed
                dataFile: 'data/data.csv',settingsFile: 'data/settings.csv',
                useDateTime: false,delimeter: '>',bubbleSize: 1,tsAnimationDelay: 1500,isoCountries: {},
                mapData: null, // default World Map Selected
                tempMapData: "Statplanet.maps['custom/world']",mapDataFile: 'js/world.js',mapJoinCode: 'iso-a3',MAPTXT: '1',
                MAPTXTL: '{point.code3}',selectedIndicators: [],visualizationType: 1,chartBGImageSettings: [],
                maxGraphSize: { withSelectPanel: 'GRAPH=0,0,10,32&SEL=10,0,2,32', withoutSelectPanel: 'GRAPH=0,0,12,32' },
                helpBubbles: {
                    enabled: false,
                    cib: { arrowPos: 'up', class: 'help-bubble-right-up', elem: '.indicatorContainer .indicator.active.first', text: '' },
                    ib: { arrowPos: 'up', class: 'help-bubble-right-up', elem: '.categoryContainer', text: '' },
                    rb: { arrowPos: 'up', class: 'help-bubble-left-up', elem: '.allRegionsContainerMenu', text: '' },
                    tsb: { arrowPos: 'down', class: 'help-bubble-left-down', elem: '.time-slider', text: '' }
                },
                gridstackOptions: {},
                preSelectedRegion: '',printStyle: '<style>body{font-size:12px;}font{font-size:100%;}h1{text-align:center;}</style>',
                T_GR_SCALE: 'Bubble size: scale according to indicator',
                T_GR_SEL: '',NODATA: '',FONT_P_S: 10,FONT_S: 12,MAP_BRDR: '#888888',MAP_CLR0_8: ['#08519C', '#3182BD', '#6BAED6', '#BDD7E7', '#EFF3FF'],
                DECPLACES: 1,DECPLACES2: 2,INDICATORBARS: false,GS_RESIZABLE: false,GS_DEVMODE: false,T_SEP: ',',MAPTITLE: false,
                POPUP_M: false,GRTITLE: false,NODATAMAPS: true,API: '',GRAPHFONT: 11,DEC_POINT:'.'},
            that = this,
            $root = $(this);
 
        that.objSPChart = ''; // chart object
 
        var pluginVars = {
                grLineColors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4', '#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4', '#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4', '#058DC7', '#50B432', '#ED561B'],
                indObj: {},
                mapLangValues: {},
                catFid: {},
                lblLatAvail: '',
                // only for the countries which are available in in data.csv
                countriesHavingData: [],
                // for showing chart in different colors
                colors: [],
                // used for render scatter/bubble plot
                bubbleData: {
                    xSPFID: null,xSPId: null,xSPCatIndex: 0,xSPData: [],xSPYear: null,ySPFID: null,ySPId: null,ySPData: [],zSPFID: null,zSPId: null,zSPData: [],
                    zSPCatIndex: 0,zSPYear: null,bubbleXArray: []// array for bubble size min and max
                },
                mi: {
                    M1: { cid: '', fid: '', text: '', index: 0 },M2: { cid: '', fid: '', text: '', index: 0 },M3: { cid: '', fid: '', text: '', index: 0 },
                    M4: { cid: '', fid: '', text: '', index: 0 },M5: { cid: '', fid: '', text: '', index: 0 },bk: { cid: '', fid: '', text: '', index: 0 },
                    irs: { from: 0, to: 0, values: [], time: { M1: [], M2: [], M3: [], M4: [], M5: [] } }
                },
                columnLineData: { firstFId: null, firstId: null, firstIndex: 0, secondFId: null, secondId: null, secondIndex: null },
                // caching ind Data for fast access and redraw chart
                // progress bar code for changin on slider changed and no code passed for progress bar
                progressBarCode: null,
                // min and max indicator values for an indicator for a particular year
                minMaxIndYearValues: {}, //defaults
                yearsRange: [],xAxisValues: {}, yAxisValues: {}, // to change X and Y axis values to create chart
                selectedYear: '',currentSubCategoryId: '',indicatorsDataByYear: [],selectedIndicatorIndex: 0,selectedRegionArea: {},selectedCountries: [],
                minMaxData: [],
                sortType: 'lth', // default lowest to highest
                lenMapColors: 15, // max length is 9, used for settings.csv map colors
                ERROR: "error",WARNING: "warning",INFO: "info",SUCCESS: "success",selectedMapAreaCodes: '',timeRange: [],disableMap: false,dataCategories: {},
                zoomIncr: 1.25,indDis: false,shareLink: '',shareLinkSuccessText: '',dualTimeRange: false,objDualTimeRange: {},selectableTimeRange: [],
                storyPanelData: {},topmenu: true,searchList: true,radioAxis: {},
            },
            plgEl = {},
            localVars = { dataISO: [], settingsISONames: [] },
            JSVOID0 = 'javascript:void(0)';
 
        options = $.extend(defaults, options);
 
        that.debug = function() {
            if (options.debug && window.console && window.console.log)
                window.console.log(Array.prototype.slice.call(arguments));
        };
 
        /**
         * @param {type} n error code
         * @returns {None}
         */
        that.error = function(n) {
            var msg = "",
                type = "";
            switch (n) {
                case 101:
                    msg = "Unable to load map file. Please check if the map file exists and is correctly referenced.";
                    type = pluginVars.ERROR;
                    break;
                case 102:
                    msg = "No data available for the selected indicator/date.";
                    type = pluginVars.WARNING;
                    break;
                case 103:
                    msg = "No secondary indicator selected.";
                    type = pluginVars.WARNING;
                    break;
            }
            if (msg && type) {
                that.showError(msg, type);
            }
        };
 
        that.showError = function(msg, type) {
            $('<div class="notify notify-' + type + '">' + msg + '<span class="cf cf-remove"></span></div>')
                .appendTo(that.child).on('click', '.cf.cf-remove', function() {
                    var n = $(this).closest('.notify');
                    n.fadeOut(100, function() { n.remove(); });
                });
        };
 
        that.isNumber = function(n) {
            //https://stackoverflow.com/a/9716488/1817690
            return !isNaN(parseFloat(n)) && isFinite(n);
        };
 
        /**
         * @param {elem} elem elemnt blocking
         * @param {isActive} isActive flag for blocking on unblocking
         * @param {settings} settings to apply
         * @returns {None}
         */
        that.loader = function(elem, isActive, settings) {
            settings = $.extend({
                css: {
                    border: 'none',
                    padding: '15px',
                    backgroundColor: '#000',
                    '-webkit-border-radius': '10px',
                    '-moz-border-radius': '10px',
                    'border-radius': '10px',
                    opacity: .8,
                    color: '#fff'
                }
            }, settings);
            if (elem.length) isActive ? elem.unblock() : elem.block(settings);
            else isActive ? $.unblockUI() : $.block(settings);
        };
 
        /**
         * @param {queryString} queryString
         * @returns {@this;.parseQueryString.params}
         */
        that.parseQueryString = function(queryString) {
            var params = {},
                queries, temp, i, l;
            // Split into key/value pairs
            if (queryString !== undefined) {
                queries = queryString.split("&");
                // Convert the array of strings into an object
                for (i = 0, l = queries.length; i < l; i++) {
                    temp = queries[i].split('=');
                    params[temp[0]] = temp[1];
                }
            }
            return params;
        };
 
        that.setUrlParams = function(params) {
			if (params !== undefined) {
				options.selectedIndicators = params.i && params.i.split(',') || options.selectedIndicators || [];
				//console.log(options.selectedIndicators);
				var pd = params.d && decodeURI(params.d).split(',') || [];
				for (var i = 0, l = pd.length; i < l; i++) {
					pluginVars.selectableTimeRange.push(isNaN(pd[i]) ? (pd[i]) : Number(pd[i]));
				}
	 
				options.visualizationType = params.v || '';
				options.preSelectedRegion = params.r || '';
				pluginVars.timeRange = params.t && decodeURI(params.t).split(',') || pluginVars.timeRange || [];
				pluginVars.selectedCountries = params.s && params.s.split(',') || pluginVars.selectedCountries || [];
			}
        };
 
 
        var prms = that.parseQueryString(window.location.search.substr(1) || options.startupParams);
 
        options.dataFile = prms.file || options.dataFile,
            options.settingsFile = prms.sf || options.settingsFile;
 
		//prms = undefined;
        that.setUrlParams(prms);
 
        // Used for Parsed Json Array of Objects
        that.parsedDataJson = null;
 
        /**
         * @desc Starting point of plugin
         * @returns that
         */
        that.init = function() {
            //that.loader(that, false);
            var sf = options.settingsFile || 'settings.csv';
            that.getCsv(sf, that.getSettingsCsv_callback, /\.txt/i.test(sf) ? 'txt' : 'csv', 'settings');
        };
 
        /**
         * @desc Creating template pf plugin
         * @returns {None}
         */
        that.createTemplate = function() {
            var settings = that.settings || {},
                GRAPHTYPE = parseInt(options.visualizationType || settings['GRAPH']),
                V_I_MAX = (settings['V-I-MAX'] || 'FALSE') === 'TRUE',
                V_I_COL = (settings['V-I-COL'] || 'FALSE') === 'TRUE',
                V_I_BAR = (settings['V-I-BAR'] || 'FALSE') === 'TRUE',
                V_I_LINE = (settings['V-I-LINE'] || 'FALSE') === 'TRUE',
                V_I_SCAT = (settings['V-I-SCAT'] || 'FALSE') === 'TRUE',
                V_I_CLN = (settings['V-I-CLN'] || 'TRUE') === 'TRUE',
                V_I_CMK = (settings['V-I-CMK'] || 'TRUE') === 'TRUE',
                V_I_ILINE = (settings['V-I-ILINE'] || 'TRUE') === 'TRUE',
                V_I_STA = (settings['V-I-STA'] || 'TRUE') === 'TRUE',
                V_I_SORT = (settings['V-I-SORT'] || 'FALSE') === 'TRUE',
                V_I_IND = (settings['V-I-IND'] || 'FALSE') + '' !== 'TRUE',
                V_I_GRAPH = (settings['V-I-GRAPH'] || 'FALSE') + '' !== 'TRUE',
                V_I_RESET = (settings['V-I-RESET'] || 'FALSE') + '' !== 'TRUE',
                V_I_SELECT = (settings['V-I-SELECT'] || 'FALSE') + '' !== 'TRUE',
                V_I_MAP = (settings['V-I-MAP'] || 'FALSE') + '' !== 'TRUE',
                V_I_STORY = (settings['V-I-STORY'] || 'FALSE') + '' !== 'TRUE',
                V_I_TABLE = (settings['V-I-TABLE'] || 'FALSE') + '' !== 'TRUE',
                V_I_FULLSCR = (settings['V-I-FULLSCR'] || 'FALSE') + '' !== 'TRUE',
                V_I_EXT = (settings['V-I-EXT'] || 'FALSE') + '' !== 'TRUE',
                EXP_PDF = (settings['EXP-PDF'] || 'FALSE') + '' !== 'TRUE',
                T_EXT = settings['T_EXT'] || 'Select',
                T_SELECT = settings['T_SELECT'] || 'Select',
                T_SELECTA = settings['T_SELECTA'] || 'Select all',
                T_DESEL = settings['T_DESEL'] || 'Deselect',
                T_REMOVE = settings['T_REMOVE'] || 'Remove',
                layoutStr = 'IND=0,0,3,3,FALSE&GRAPH=3,0,6,3,FALSE&SEL=9,0,3,3,FALSE&STORY=0,3,3,3,FALSE&MAP=3,3,9,3,FALSE&TABLE=12,3,0,3,FALSE&TIME=12,3,0,3,FALSE',
                GS_LAYOUTSTR = settings['LAYOUT'] || layoutStr,
                GS_LAYOUT = that.parseQueryString(GS_LAYOUTSTR),
                T_RESET = settings['T_RESET'] || 'Reset',
                T_RESET2 = settings['T_RESET2'] || 'Clear selection and reset application to startup state';
 
            options.MAPTITLE = settings['MAPTITLE'] && settings['MAPTITLE'] === 'TRUE';
 
            options.GRCONNECT = (settings['GR-CONNECT'] && settings['GR-CONNECT'] === 'TRUE') || false;
            options.MAPOVERLAP = (settings['MAP-TXT-OVER'] && settings['MAP-TXT-OVER'] === 'TRUE') || false;
            options.MAPWHEEL = (settings['MAP-WHEEL'] && settings['MAP-WHEEL'] === 'TRUE') || false;
 
            options.POPUP_M = settings['POPUP-M'] && settings['POPUP-M'] === 'TRUE';
            options.T_SEP = settings['T_SEP'] ? settings['T_SEP'] : ',';
             
            options.DEC_POINT  = settings['DEC_POINT'] ? settings['DEC_POINT'] : ','   
            options['GS_RESIZABLE'] = (settings['RESIZABLE'] || 'FALSE') + '' !== 'TRUE'; //make string for comparison
            options['GS_DEVMODE'] = (settings['DEVMODE'] || 'FALSE') + '' !== 'TRUE';
            options['T_GR_SEL'] = settings['T_GR-SEL'] || 'Click on a map area to select it';
 
            options['DOT-S'] = settings['DOT-S'] || 3;
            options['DOT-S2'] = settings['DOT-S2'] || 5;
            options['LINE-W'] = settings['LINE-W'] || 2; //0 for dot plots / dotplots
            options['NODATA'] = settings['T_ND'] || 'No data';
 
            options.helpBubbles.cib.text = settings['T_H-IND'] || '';
            options.helpBubbles.ib.text = settings['T_H-CAT'] || '';
            options.helpBubbles.rb.text = settings['T_H-REG'] || '';
            options.helpBubbles.tsb.text = settings['T_H-YR'] || '';
            pluginVars['topmenu'] = settings['TOPMENU'] === 'FALSE' ? false : true;
            pluginVars['listSearch'] = settings['SEARCH'] === 'FALSE' ? false : true;
 
 
            var GS_IND = (GS_LAYOUT['IND'] || '0,0,3,3,FALSE').split(','),
                GS_GRAPH = (GS_LAYOUT['GRAPH'] || '3,0,6,3,FALSE').split(','),
                GS_SEL = (GS_LAYOUT['SEL'] || '9,0,3,3,FALSE').split(','),
                GS_STORY = (GS_LAYOUT['STORY'] || '0,3,3,3,FALSE').split(','),
                GS_MAP = (GS_LAYOUT['MAP'] || '3,3,9,3,FALSE').split(','),
                GS_TABLE = (GS_LAYOUT['TABLE'] || '12,3,0,3,FALSE').split(','),
                GS_TIME = (GS_LAYOUT['TIME'] || '12,3,0,3,FALSE').split(',');
 
 
            options.gridstackOptions['disableResize'] = options.GS_RESIZABLE;
            options.gridstackOptions['disableDrag'] = options.GS_DEVMODE;
 
            options.GRTITLE = settings['GRTITLE'] === 'TRUE';
 
            pluginVars.radioAxis = {
                T_XAX: settings['T_XAX'] || 'x-axis',
                T_YAX: settings['T_YAX'] || 'y-axis',
                T_BUB: settings['T_BUB'] || 'bubble size',
                T_LAX: settings['T_LAX'] || 'left axis',
                T_RAX: settings['T_RAX'] || 'right axis'
            };
            // Case 62757 Change No. 2 -- will cause issue if data file already having Latest available in it.
            pluginVars.lblLatAvail = settings['T_LATEST'] || 'NEWEST'; //Latest available
            pluginVars.zoomIncr = settings['ZOOM-INCR'] || pluginVars.zoomIncr;
            pluginVars.indDis = settings['IND-DIS'] === 'TRUE';
            pluginVars.shareLink = settings['T_LINK'] || 'Copy & share link';
            pluginVars.shareLinkSuccessText = settings['T_LINK2'] || 'Copied';
            pluginVars.dualTimeRange = settings['TIMERANGE'] === 'TRUE';
 
            options.mapJoinCode = settings['MAP-ID'] || options.mapJoinCode;
            options.MAPEXPS = settings['MAP-EXPS'] || '2.5';
            options.MAPTXT = settings['MAP-TXT'] || '1';
            options.MAPTXTL = (settings['MAP-TXT-L'] || '1') === '1' ? '{point.name}' : '{point.code3}';
            options.MAPFONT = settings['MAP-FONT'] || '11';
            options.GRAPHFONT = settings['GRAPH-FONT'] || '11';
 
            options.DECPLACES = settings['DECPLACES'] || options.DECPLACES;
            options.DECPLACES2 = settings['DECPLACES2'] || options.DECPLACES2;
 
            options.NODATAMAPS = settings['V-NODATA'] ? settings['V-NODATA'] !== 'TRUE' : options.NODATAMAPS;
 
            options.INDICATORBARS = settings.hasOwnProperty('V-IND-B') && settings['V-IND-B'] === 'TRUE';
            if (settings.hasOwnProperty('T_GR-SCALE1') && settings.hasOwnProperty('T_GR-SCALE1')) {
                options.T_GR_SCALE = settings['T_GR-SCALE1'] + ' : ' + settings['T_GR-SCALE2'];
            }
 
            options.FONT_S = settings['FONT-S'] || options.FONT_S;
            options.FONT_P_S = settings['FONT-P-S'] || options.FONT_P_S;
            options.SITE_L2 = settings['SITE-L2'] || '';
            that.css('font-size', options.FONT_S + 'px');
 
            that.child = $('<div />').addClass('sp-main-child invisible').appendTo(that);
            that.child2 = $('<div />').addClass('grid-stack').appendTo(that);
 
            $('<div class="hori-topmenu categoryContainer"></div>').appendTo(that.child);
 
            str = '<div class="hp100 staticResizable grid-stack-item ' + (GS_IND[4] === 'FALSE' ? 'hide' : '') + '" data-gs-x="' + GS_IND[0] + '" data-gs-y="' + GS_IND[1] + '" data-gs-width="' + GS_IND[2] + '" data-gs-height="' + GS_IND[3] + '">' +
                '<div class="grid-stack-item-content">' +
                '<ul class="indicatorContainer block-lists list-unstyled block-bordered h200"></ul>' +
                '</div></div>' +
                '<div class="graph-panel hp100 grid-stack-item ' + (GS_GRAPH[4] === 'FALSE' ? 'hide' : '') + '" data-gs-x="' + GS_GRAPH[0] + '" data-gs-y="' + GS_GRAPH[1] + '" data-gs-width="' + GS_GRAPH[2] + '" data-gs-height="' + GS_GRAPH[3] + '">' +
                '<div class="grid-stack-item-content block-bordered">' +
                '<div class="clearfix">' +
                '</div>' +
                '<div class="chart-container clearfix">' +
                '<div class="verticalYCategoryMenu hp100 hide pull-left">' +
                '<button class="yaxis-scatter-category cf cf-angle-right btn btn-success"' +
                ' data-html="true" data-toggle="popover" title="Y axis category"></button>' +
                '</div>' +
                '<div class="verticalcategory-chart col-xs-11 pad0">' +
                '<div class="hp100 row m0 chartContainer"></div>' +
                '<div class="axis-values-tooltip">' +
                '<input type="number" class="form-control"/>' +
                '<a class="refresh-axis cf cf-refresh f20" href="' + JSVOID0 + '"></a>' +
                '<button class="btn btn-primary col-xs-12">Ok</button>' +
                '</div>' +
                '<div class="bottomXCategoryMenu hide row pad0-5"><div class="col-xs-10" ><ul class="bottom-category sm sm-clean">' +
                '<li class="li-selected-category"><a href="' + JSVOID0 + '" class="selected-indicator">Selected Indicator</a></li>' +
                '</ul></div><div class="col-xs-2 pad0 bottomXYearMenu"><ul class="bottom-category-year sm sm-clean">' +
                '<li class="li-selected-year"><a href="' + JSVOID0 + '" class="selected-year"></a></li>' +
                '</ul></div>' +
                '</div>' +
                '</div>' +
                '</div>' + '</div>' + '</div>' +
                '<div class="nopad-xs-sm selection-panel hp100 grid-stack-item ' + (GS_SEL[4] === 'FALSE' ? 'hide' : '') + '" data-gs-x="' + GS_SEL[0] + '" data-gs-y="' + GS_SEL[1] + '" data-gs-width="' + GS_SEL[2] + '" data-gs-height="' + GS_SEL[3] + '">' +
                '<div class="grid-stack-item-content"><div class="region-area">' +
                '<div class="region-area-header">' +
                '<ul class="list-unstyled sm sm-clean allRegionsContainerMenu">' +
                '<li class="li-selected-category">' +
                '<a href="' + JSVOID0 + '" class="selected-indicator">Selected Indicator</a>' +
                '</li>' +
                '</ul>' +
                '<span class="custom-region-settings-icon dropdown"title="Region settings" data-toggle="dropdown">' +
                '<a href="' + JSVOID0 + '" title="Region settings" data-toggle="dropdown">' +
                '<i class="cf cf-settings"></i>' +
                '</a>' +
                '<ul class="custom-region-settings dropdown-menu pull-right">' +
                '<li><a href="' + JSVOID0 + '" title="' + T_SELECT + '" class="custom create-custom-region">' + T_SELECT + '</a></li>' +
                '<li><a href="' + JSVOID0 + '" title="' + T_DESEL + '" class="custom deselect-regions">' + T_DESEL + '</a></li>' +
                '<li><a href="' + JSVOID0 + '" title="' + T_SELECTA + '" class="custom select-all-regions">' + T_SELECTA + '</a></li>' +
                '<li><a href="' + JSVOID0 + '" title="' + T_REMOVE + '" class="recycle-bin-regions">' + T_REMOVE + '</a></li>' +
                '</ul>' +
                '</span>' +
                '</div>' +
                '<ul class="regionsContainer list-unstyled block-lists h200"></ul>' +
                '</div></div>' +
                '</div>';
            $(str).appendTo(that.child2).on('click', "a", function(e) {
                if ($(this).hasClass('sort-graph')) {
                    if ($(this).hasClass('disabled')) {
                        return false;
                    }
 
                    var type = $(this).data('type');
                    $(this).closest('li').siblings('li').find('a.sort-graph.active').removeClass('active');
                    if ($(this).hasClass('active')) {
                        return false;
                    } else {
                        pluginVars.sortType = type;
                        $(this).addClass('active');
                        that.mapChart('h');
                    }
                } else if ($(this).hasClass('rotate-90')) {
                    //console.log('do your work here');
                    that.swapInidicators();
                    that.changeGraphTitle('column-line');
                    e.preventDefault();
                    return false;
                }
            }).on('click', '.icon-resize', function(e) {
                e.preventDefault();
                $(this).find('i').toggleClass('cf-resize-full cf-resize-small');
                that.fullSizeGraph($(this).find('i').hasClass('cf-resize-small'));
            }).on('click', '.deselect-regions', function() {
                if (plgEl.regionsContainer.find('a[data-code3].active').length) {
                    plgEl.regionsContainer.find('a[data-code3].active').removeClass('active');
                    pluginVars.selectedCountries = [];
                    that.mapChart();
                }
            }).on('click', '.create-custom-region', function(e) {
                e.preventDefault();
                //$(this).closest('ul').find('.select-all-regions,.refresh-regions').removeClass('hide');
                that.createCustomRegion();
            }).on('click', '.select-all-regions', function(e) {
                e.preventDefault();
                that.selectAllRegionAreas();
            }).on('hide.bs.dropdown', '.custom-region-settings-icon', function() {
                plgEl.selectionPanel.css('zIndex', '');
            }).on('shown.bs.dropdown', '.custom-region-settings-icon', function() {
                plgEl.selectionPanel.css('zIndex', 2);
            }).on('click', '.recycle-bin-regions', function(e) {
                e.preventDefault();
                that.recyleBinRegionAreas(this);
            });
 
            $('.sort-graph-data > a').toggleClass('rotate-90', GRAPHTYPE == 5 && V_I_CLN)
                .attr('title', GRAPHTYPE == 5 && V_I_CLN ? 'Reverse left and right axis' : 'Sorting');
            $('<div class="story-panel grid-stack-item ' + (GS_STORY[4] === 'FALSE' ? 'hide' : '') + '" data-gs-x="' + GS_STORY[0] + '" data-gs-y="' + GS_STORY[1] + '" data-gs-width="' + GS_STORY[2] + '" data-gs-height="' + GS_STORY[3] + '">' +
                    '<div class="grid-stack-item-content block-bordered"><div class="story-header hide">' +
                    '<ul class="list-unstyled">' +
                    '<li class=""><a href="javascript:void();" class="prev disabled"></a></li>' +
                    '<li class="page-story"><span><span class="num">1</span> of <span class="tot">3</span></span></li>' +
                    '<li class=""><a href="javascript:void();" class="next"></a></li>' +
                    '</ul></div><div class="story-panel-content">Story Panel</div></div>' +
                    '</div>' +
                    '<div class="pad0 map-panel grid-stack-item ' + ((pluginVars.disableMap || GS_MAP[4] === 'FALSE') ? 'hide' : '') + '" data-gs-x="' + GS_MAP[0] + '" data-gs-y="' + GS_MAP[1] + '" data-gs-width="' + GS_MAP[2] + '" data-gs-height="' + GS_MAP[3] + '">' +
                    '<div class="grid-stack-item-content"><div class="mapContainer"></div></div>' +
                    '</div>' +
                    '<div class="table-panel grid-stack-item ' + (GS_TABLE[4] === 'FALSE' ? 'hide' : '') + '" data-gs-x="' + GS_TABLE[0] + '" data-gs-y="' + GS_TABLE[1] + '" data-gs-width="' + GS_TABLE[2] + '" data-gs-height="' + GS_TABLE[3] + '">' +
                    '<div class="grid-stack-item-content">Table Panel</div>' +
                    '</div>').appendTo(that.child2)
                .on('click', '.next,.prev', function(e) {
                    e.preventDefault();
                    that.nextPrevStory(this);
                });
 
 
            $('<div class="graphSettings grid-stack-item" data-gs-x="' + GS_TIME[0] + '" data-gs-y="' + GS_TIME[1] + '" data-gs-width="' + GS_TIME[2] + '" data-gs-height="' + GS_TIME[3] + '">' +
                '<div class="grid-stack-item-content block-bordered dropdown-closed"><ul class="display-table">' +
                '<li class="' + (V_I_FULLSCR ? 'hide' : '') + '"><a class="bg-grad app-full-screen"><i class="cf cf-fullscreen-alt"></i></a></li>' +
                '<li class="' + (V_I_EXT ? 'hide' : '') + '"><a class="bg-grad custom-share-link" title="' + T_EXT + '"><i class="cf cf-worldmap"></i></a></li>' +
                '<li class="' + (false ? 'hide' : '') + '"><a title="Selectable date/time range" class="bg-grad selectable-timerange-items"><i class="cf cf-calendar-check-o"></i></a></li>' +
                '<li style="display:none" class="slider-label"><span class="btn btn-success"></span></li>' +
                '<li class="time-slider-container ' + (GS_TIME[4] === 'FALSE' ? 'hide' : '') + '"><ul class="time-slider display-table ">' +
                '<li class="li-slider"><a href="' + JSVOID0 + '" class="prev-year cf cf-angle-double-left"></a></li>' +
                '&nbsp;&nbsp;<li class="li-slider li-range-slider"><input type="hidden" class="range_slider"/></li>' +
                '&nbsp;<li class="li-slider"><a href="' + JSVOID0 + '" class="cf next-year cf-angle-double-right"></a></li>' +
                '&nbsp;&nbsp;<li class="li-slider"><a href="' + JSVOID0 + '" class="cf time-slider-play cf-play-circle"></a></li>' +
                '</ul></li>' +
                '<li><a title="' + pluginVars.shareLink + '" class="bg-grad app-share-link"><i class="cf cf-share-link"></i></a></li>' +
                '<li class="dropdown export-map-graph"><a href="' + JSVOID0 + '" title="Export" class="bg-grad" data-toggle="dropdown"><i class="cf cf-download"></i></a>' +
                '<ul class="dropdown-menu main-dropdown">' +
                (pluginVars.disableMap ? '' :
                    '<li class="dropdown-submenu">' +
                    '<a href="' + JSVOID0 + '">Map <span class="caret"></span></a>' +
                    '<ul class="dropdown-menu">' +
                    '<li><a data-area="map" data-type="png" href="' + JSVOID0 + '">Download PNG image</a></li>' +
                    '<li><a data-area="map" data-type="jpeg" href="' + JSVOID0 + '">Download JPEG image</a></li>' +
                    '<li class="' + (EXP_PDF ? 'hide' : '') + '"><a data-area="map" data-type="pdf" href="' + JSVOID0 + '">Download PDF document</a></li>' +
                    '<li><a data-area="map" data-type="svg" href="' + JSVOID0 + '">Download SVG</a></li>' +
                    '<li><a data-area="map" data-type="csv" href="' + JSVOID0 + '">Download CSV</a></li>' +
                    '<li><a data-area="map" data-type="xls" href="' + JSVOID0 + '">Download XLS</a></li>' +
                    '</ul>' +
                    '<li>') +
                '<li class="dropdown-submenu">' +
                '<a href="' + JSVOID0 + '">Graph <span class="caret"></span></a>' +
                '<ul class="dropdown-menu">' +
                '<li><a data-type="png" href="' + JSVOID0 + '">Download PNG image</a></li>' +
                '<li><a data-type="jpeg" href="' + JSVOID0 + '">Download JPEG image</a></li>' +
                '<li class="' + (EXP_PDF ? 'hide' : '') + '"><a data-type="pdf" href="' + JSVOID0 + '">Download PDF document</a></li>' +
                '<li><a data-type="svg" href="' + JSVOID0 + '">Download SVG</a></li>' +
                '<li><a data-type="csv" href="' + JSVOID0 + '">Download CSV</a></li>' +
                '<li><a data-type="xls" href="' + JSVOID0 + '">Download XLS</a></li>' +
                '</ul>' +
                '<li>' +
                '</ul>' +
                '</li>' +
                (!options.GS_DEVMODE ? '<li><a title="Developer mode tools" class="bg-grad devmode-tools"><i class="cf cf-settings"></i></a></li>' : '') +
                (!V_I_IND ? '<li><a title="Indicator Panel" data-target="staticResizable" class="bg-grad v-panel"><i class="cf cf-indicator-panel"></i></a></li>' : '') +
                (!V_I_GRAPH ? '<li><a title="Graph Panel" data-target="graphPanel" class="bg-grad v-panel"><i class="cf cf-column-chart"></i></a></li>' : '') +
                (!V_I_SELECT ? '<li><a title="Selection Panel" data-target="selectionPanel" class="bg-grad v-panel"><i class="cf cf-selection-panel"></i></a></li>' : '') +
                (!V_I_STORY ? '<li><a title="Story Panel" data-target="storyPanel" class="bg-grad v-panel"><i class="cf cf-story-panel"></i></a></li>' : '') +
                (!V_I_MAP ? '<li><a title="Map panel" data-target="mapPanel" class="bg-grad v-panel"><i class="cf cf-map-panel"></i></a></li>' : '') +
                (!V_I_TABLE ? '<li><a title="Table panel" data-target="tablePanel" class="bg-grad v-panel"><i class="cf cf-table-panel"></i></a></li>' : '') +
                '<li class="dropdown print-chart-map"><a href="' + JSVOID0 + '" data-type="parent" title="Print" class="bg-grad" data-toggle="dropdown"><i class="cf cf-print"></i></a>' +
                '<ul class="dropdown-menu">' +
                '<li><a href="' + JSVOID0 + '" data-type="map">Map</a></li><li><a href="' + JSVOID0 + '" data-type="graph">Graph</a></li>' +
                '</ul>' +
                '</li>' +
                (!V_I_RESET ? '<li><a title="' + T_RESET2 + '" class="bg-grad reset-app">' + T_RESET + '</a></li>' : '') +
                '</ul></div></div>').appendTo(that.child2)
 
            .on('click', '.print-chart-map a', function(e) {
                e.preventDefault();
                e.stopPropagation();
                that.printChartMap(this, $(this).data('type'), e);
                var flagVis = $(this).next('ul').length ? $(this).next('ul').is(':visible') : $(this).closest('ul').is(':visible');
                plgEl.graphSettings.css('z-index', (flagVis ? 2 : ''));
                plgEl.graphSettings.find('.grid-stack-item-content').toggleClass('dropdown-closed',!flagVis);
                
            }).on('click', '.selectable-timerange-items', function(e) {
                e.preventDefault();
                if ($(this).hasClass('disabled')) {
                    return false;
                }
                that.selectableTimeRangeItems(this);
            }).on('click', '.next-year,.prev-year', function(e) {
                e.preventDefault();
                that.prevNextYearTimeRange(this);
            }).on('click', '.v-panel', function(e) {
                e.preventDefault();
                var self = this;
                if ($(self).data('target') && plgEl.hasOwnProperty($(self).data('target'))) {
                    if ($(self).data('target') === 'mapPanel' && pluginVars.disableMap) {
                        that.error(101); // no map file so showing error here
                    } else {
                        plgEl[$(self).data('target')].toggleClass('hide');
                    }
                    if ($(self).data('target') === 'graphPanel') {
                        that.resizeSPChart();
                    } else if ($(self).data('target') === 'mapPanel') {
                        //that.objSPMap && that.objSPMap.setSize(plgEl.mapPanel.width(),plgEl.mapPanel.height(),false);
                        that.resizeSPMap();
                    }
                }
            }).on('click', '.time-slider-play', function(e) {
                e.preventDefault();
                that.timeSliderAnimation($(this));
            }).on('click', '.app-full-screen', function(e) {
                e.preventDefault();
                that.appFullScreen(this);
            }).on('click', '.app-share-link', function(e) {
                e.preventDefault();
                var loc = window.location;
                loc = loc.protocol + '//' + loc.host + loc.pathname;
                that.shareURL(loc);
            }).on('click', '.custom-share-link', function(e) {
                e.preventDefault();
                options.SITE_L2 && that.shareURL(options.SITE_L2, true);
            }).on('click', '.export-map-graph a', function(e) {
                e.preventDefault();
                e.stopPropagation();
                that.exportMapGraph(this);
                var flagVis = $(this).next('ul').is(':visible');
                plgEl.graphSettings.css('z-index', (flagVis ? 2 : ''));
                plgEl.graphSettings.find('.grid-stack-item-content').toggleClass('dropdown-closed',!flagVis);
            }).on('click', '.devmode-tools', function(e) {
                e.preventDefault();
                that.exportImportLayoutSettings();
            }).on('click', '.reset-app', function(e) {
                e.preventDefault();
                that.resetSPApp();
            });
 
 
 
            that.child.append(that.child2);
 
            $(window).resize(function() {
                that.resizeSPChart();
                return false;
            });
 
            $root.on('click', 'a.icon-chart', function(e) {
                e.preventDefault();
                that.changeChart(this);
            });
 
            plgEl = {
                graphRow: that.child.find('.graphRow'),
                mapRow: that.child.find('.mapRow'),
                chartContainer: that.child.find('.chartContainer'),
                mapContainer: that.child.find('.mapContainer'),
                categoryContainer: $root.find(".categoryContainer"),
                regionsContainer: that.child.find(".regionsContainer"),
                indicatorContainer: that.child.find(".indicatorContainer"),
                chartIcons: that.child.find(".chartIcons"),
                allRegionsContainerMenu: that.child.find('.allRegionsContainerMenu'),
                yearSlider: that.child.find(".range_slider"),
                verticalYCategoryMenu: that.child.find('.verticalYCategoryMenu'),
                bottomXCategoryMenu: that.child.find('.bottomXCategoryMenu'),
                graphSettings: that.child.find('.graphSettings'),
                graphPanel: that.child.find('.graph-panel'),
                selectionPanel: that.child.find('.selection-panel'),
                staticResizable: that.child.find('.staticResizable'),
                bottomXYearMenu: that.child.find('.bottomXYearMenu'),
                storyPanel: that.child.find('.story-panel'),
                mapPanel: that.child.find('.map-panel'),
                tablePanel: that.child.find('.table-panel'),
                graphTitle: that.child.find('.graph-indicator-title'),
                storyHeader: that.child.find('.story-header')
            };
 
            // showing on load if scatter plot is set in parameters
            plgEl.bottomXCategoryMenu.toggleClass('hide', GRAPHTYPE !== 4);
            plgEl.verticalYCategoryMenu.toggleClass('hide', GRAPHTYPE !== 4);
 
            plgEl.verticalYCategoryMenu.find('.yaxis-scatter-category')
                .popover().on('shown.bs.popover', function() { // force to open it on single click
                    plgEl.verticalYCategoryMenu.find('a.selected-indicator').trigger('click');
                });
 
            var df = options.dataFile || 'data/data.csv';
            that.getCsv(df, that.getDataCsv_callback, /\.txt/i.test(df) ? 'txt' : 'csv', 'data');
 
            that.createRegionArea();
 
            that.grid = that.child2.gridstack(options.gridstackOptions).on('resizestop', function(event, ui) {
                //var grid = this;
                var element = event.target;
                if ($(element).hasClass('map-panel')) {
                    setTimeout(function() {
                        //that.objSPMap.setSize(plgEl.mapPanel.width(),plgEl.mapPanel.height(),false);
                        that.resizeSPMap();
                    }, 50);
                }
                if ($(element).hasClass('graph-panel')) {
                    setTimeout(function() {
                        that.resizeSPChart();
                    }, 50);
                }
            }).data('gridstack');
 
 
            var flagDualTimeRange = that.checkGraphForDualTimeRange();
 
 
            //make the selectable date/time range icon disabled or enabled on first load
            plgEl.graphSettings.find('a.selectable-timerange-items').addClass('disabled');
            if (flagDualTimeRange) { // for line and dual charts
                if (pluginVars.dualTimeRange) {
                    plgEl.graphSettings.find('a.selectable-timerange-items').removeClass('disabled');
                }
            }
             
 
            /***
            //When no map is indicated, it currently goes to 'maximize graph'.
            //Could it actually just load it regularly (so the regular interface, just without the map)
            if(pluginVars.disableMap){
                that.fullSizeGraph(true);                
            }*/
        };
 
        that.resetSPApp = function() {
            pluginVars.mi = {
                M1: { cid: '', fid: '', text: '', index: 0 },M2: { cid: '', fid: '', text: '', index: 0 },M3: { cid: '', fid: '', text: '', index: 0 },
                M4: { cid: '', fid: '', text: '', index: 0 },M5: { cid: '', fid: '', text: '', index: 0 },bk: { cid: '', fid: '', text: '', index: 0 },
                irs: { from: 0, to: 0, values: [], time: { M1: [], M2: [], M3: [], M4: [], M5: [] } }
            };
            pluginVars.columnLineData = { firstFId: null, firstId: null, firstIndex: 0, secondFId: null, secondId: null, secondIndex: null };
 
            var pr = that.parseQueryString(window.location.search.substr(1) || options.startupParams);
 
            that.setUrlParams(pr);
 
            var v = pr.hasOwnProperty('v') ? pr.v : 1,
                ca = that.setChartType(v);
            ca !== false && that.changeChart(ca);
            if (pr.hasOwnProperty('t')) {
                var st = decodeURI(pr.t).split(',');
                pluginVars.selectedYear = st.length ? st[0] : pr.t;
            }
 
            var a = plgEl.allRegionsContainerMenu.find(pr.hasOwnProperty('r') ?
                'li.region a[data-regid="' + pr.r + '"]' :
                'li.region:first a[data-regid]');
            a.length && that.changeRegion(a[0], a.attr('data-index'), false);
            $.removeData(plgEl.storyPanel, 'isRunning');
 
            if (!pr.hasOwnProperty('i')) {
 
                var aul = plgEl.categoryContainer.find('ul.top-ul'),
                    $fst = aul.find('a.leaf-indicators:first'),
                    $ul = $fst.closest('ul'),
                    $li = $ul.find('li');
                pluginVars.currentSubCategoryId = $ul.data('id');
                pluginVars.selectedIndicatorIndex = 0;
                that.updateIndicatorPanel($li, plgEl.indicatorContainer.empty().attr('data-cid', $ul.data('id')), $fst);
            }
            that.callIndicators();
        }
 
 
        that.swapInidicators = function() {
 
            if (pluginVars.columnLineData.secondId == null && pluginVars.columnLineData.secondIndex == null &&
                pluginVars.columnLineData.secondFId == null) {
                that.error(103);
                return false;
            }
 
            plgEl.indicatorContainer.find('a.indicator.first,a.indicator.second').toggleClass('first second');
 
 
            pluginVars.selectedIndicatorIndex = pluginVars.columnLineData.firstIndex;
            pluginVars.currentSubCategoryId = pluginVars.columnLineData.firstId;
            
            that.mapChart();
        };
 
 
        /**
         * 
         * @param {type} self
         * @returns {false or noe}
         */
        that.selectableTimeRangeItems = function(self) {
            //console.log(pluginVars.yearsRange);
 
            var range = pluginVars.yearsRange;
 
            if (!range.length || !(that.checkGraphForDualTimeRange())) {
                return false;
            }
 
            var ul = '<ul class="block-lists ul-selectable-items list-unstyled block-bordered h200">';
            for (var i = 0, l = range.length; i < l; i++) {
                ul += '<li><a href="' + JSVOID0 + '" class="">' + range[i] + '</a></li>';
            }
            ul += '</ul>';
 
            var html = '<h4>Select date/time range items</h4>' + '<div>' + '<div class="mb10">' + ul + '</div>' +
                '<div class="mb10"><button class="btn btn-primary btn-change-selectable-items">Change</button>' +
                    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button class="btn btn-primary btn-cancel-selectable-items">Cancel</button>' +
                '</div>' +'<div>';
 
 
            that.loader(that.child, false, {
                message: html,
                css: { width: '300px', border: '3px solid #CCC', 'border-radius': '4px', '-webkit-border-radius': '4px', cursor: 'default' },
                onBlock: function() {
                    var $self = $(this);
                    $(this).on('click', '.ul-selectable-items a', function() {
                        //console.log('test');
                        $(this).toggleClass('active');
                    }).on('click', '.btn-change-selectable-items', function() {
                        pluginVars.selectableTimeRange = [];
                        $self.find('.ul-selectable-items a.active').each(function() {
                            var t = $(this).text();
                            pluginVars.selectableTimeRange.push(isNaN(t) ? t : Number(t));
                        });
 
                        var st = pluginVars.selectableTimeRange;
                        o = { from: pluginVars.yearsRange.indexOf(st[0]) };
 
 
                        if (pluginVars.dualTimeRange) {
                            o['to'] = pluginVars.yearsRange.indexOf(st[st.length - 1]);
                        }
                        pluginVars.selectedYear = st[st.length - 1];
                        pluginVars.objDualTimeRange = o;
 
                        that.objIonRangeSlider.update(o);
                        that.mapChart('h');
                        //pluginVars.selectableTimeRange=[];
                        that.loader(that.child, true);
                    }).on('click', '.btn-cancel-selectable-items', function() {
                        that.loader(that.child, true);
                    });
                }
            });
        };
 
        /**
         * 
         * @param {type} self
         * @returns {None}
         */
        that.appFullScreen = function(self) {
            that.child.toggleClass('full-screen-mode');
 
            var fullMode = $(self).find('i').toggleClass('cf-icon-fullscreen-alt cf-icon-fullscreen-exit-alt')
                .hasClass('cf-icon-fullscreen-exit-alt');
 
            $(self).closest('.grid-stack-item').find('.ui-resizable-handle').hide();
 
            that.grid.movable('.grid-stack-item', !fullMode);
            that.grid.resizable('.grid-stack-item', !fullMode);
            if (fullMode) {
                $(self).data('ch', that.grid.opts.cellHeight);
 
                var maxYArr = that.child2.find('.grid-stack-item[data-gs-y]:visible').map(function() {
                        return parseInt($(this).attr('data-gs-y'), 10);
                    }).get(),
                    maxHeightArr = that.child2.find('.grid-stack-item[data-gs-height]:visible').not('.hide').map(function() {
                        return parseInt($(this).attr('data-gs-height'), 10);
                    }).get(),
                    maxheight = $(window).height(); //-(that.grid.opts.verticalMargin*that.uniqueSort(maxYArr).length);
                if (that.child.find('.hori-topmenu').length) {
                    maxheight -= that.child.find('.hori-topmenu').height();
                }
                //-that.grid.opts.verticalMargin*(maxHeightArr.length)-15;//(that.uniqueSort(maxYArr).length+2);
                var partition = (maxYArr.max() + maxHeightArr[maxYArr.indexOf(maxYArr.max())] || 3) || 7,
                    r = that.uniqueSort(maxYArr).length,
                    p = (that.grid.opts.verticalMargin * r);
                that.grid.cellHeight((maxheight - p) / partition - that.grid.opts.verticalMargin - r + 1);
                console.log(maxYArr, maxHeightArr, maxheight, partition, maxheight / partition);
 
            } else {
                if ($(self).data('ch')) {
                    that.grid.cellHeight($(self).data('ch'));
                } else if (options.gridstackOptions.cellHeight) {
                    that.grid.cellHeight(options.gridstackOptions.cellHeight);
                }
            }
            that.resizeSPMap();
            that.resizeSPChart();
        };
 
        /**
         * @desc By clicking on the tick icon, only the selected regions (countries/map areas) can be
         * defined as a custom region. 
         * @returns {None}
         */
        that.createCustomRegion = function() {
            if (plgEl.regionsContainer.find('a.active').length) {
                that.regions['ci']['code3'] = plgEl.regionsContainer.find('a.active').map(function() {
                    return $(this).data('code3') + ''; // for numeric values make it string
                }).get();
                plgEl.allRegionsContainerMenu.find('a[data-index="ci"]').trigger('click');
            }
        };
 
        /**
         * @desc A select all icon, which selects all the map areas in the list.
         * @returns {None}
         */
        that.selectAllRegionAreas = function() {
            var chartType = that.getChartType(),
                first = plgEl.regionsContainer.find('a[data-code3]:first').addClass('active last-active');
            if (chartType === 'column-line' || chartType === 'multi-line-ind') {
                pluginVars.selectedCountries = first.data('code3');
            } else {
                pluginVars.selectedCountries = plgEl.regionsContainer.find('a[data-code3]:visible').addClass('active').map(function() { return $(this).data('code3'); }).get();
            }
 
            if (chartType !== 'line' && chartType !== 'column-line' && chartType !== 'multi-line-ind') {
                for (var i = 0, s = pluginVars.selectedCountries, l = s.length; i < l; i++) {
                    if (that.objSPChart.get(s[i])) {
                        that.objSPChart.get(s[i]).selected = true;
                        that.objSPChart.get(s[i]).setState('select');
                    }
                }
            }
            if (chartType === 'line' || chartType === 'column-line' || chartType === 'multi-line-ind') {
                that.mapChart('h');
            }
        };
 
 
        /**
         * @desc A bin icon, which removes a map area from the list, creating a (new) custom region/selection.
         * @param {type} self
         * @returns {None}
         */
        that.recyleBinRegionAreas = function(self) {
            $(self).closest('ul').find('.select-all-regions,.refresh-regions').removeClass('hide');
            that.regions['ci']['code3'] = plgEl.regionsContainer.find('a').not('.active').map(function() {
                return $(this).data('code3');
            }).get();
            plgEl.allRegionsContainerMenu.find('a[data-index="ci"]').trigger('click');
        };
 
        /**
         * Change chart according to its type
         * @param {type} self
         * @param {type} isRedraw boolean to call mapChart function
         * @returns {None}
         */
        that.changeChart = function(self, isRedraw) {
            if (!$(self).hasClass('active')) {
                $(self).addClass('active').siblings('a').removeClass('active');
            } else {
                return false;
            }
            var chartType = that.getChartType(); // chart type changed, so update previous one
 
            if (pluginVars.currentSubCategoryId) {
                that.hideGraphPanel(pluginVars.catFid[pluginVars.currentSubCategoryId][pluginVars.selectedIndicatorIndex]);
            }
 
            $root.find('.sort-graph.disabled').removeClass('disabled');
 
            var flagDualTimeRange = that.checkGraphForDualTimeRange();
            !flagDualTimeRange && that.objIonRangeSlider.update({ type: 'single' });
 
            // Case #62757 Pt 3
            /*if(chartType === 'line'){
                $root.find('.sort-graph[data-type="htl"],.sort-graph[data-type="lth"]').addClass('disabled');
            }*/
 
            $('.sort-graph-data > a').toggleClass('rotate-90', chartType === 'column-line')
                .attr('title', chartType === 'column-line' ? 'Reverse left and right axis' : 'Sorting');
 
            that.changeGraphTitle(chartType);
            plgEl.graphSettings.find('a.selectable-timerange-items').addClass('disabled');
            if (flagDualTimeRange) { // for line and dual charts
 
                if (pluginVars.dualTimeRange) {
                    var o = { type: 'double' };
                    plgEl.graphSettings.find('a.selectable-timerange-items').removeClass('disabled');
                    if (pluginVars.objDualTimeRange.hasOwnProperty('from')) {
                        o['from'] = pluginVars.objDualTimeRange.from;
                        o['to'] = pluginVars.objDualTimeRange.to;
                    } else {
                        o['from'] = 0;
                        o['to'] = pluginVars.yearsRange.indexOf(pluginVars.selectedYear);
                    }
                    that.objIonRangeSlider.update(o);
                }
            }
 
            // Case #62757 Pt 3
            $root.find('.sort-graph-data > a').toggleClass('disabled', (chartType === 'scatter' || chartType === 'line' ||
                chartType === 'multi-line-ind' || chartType === 'stacked-column'));
 
            plgEl.categoryContainer.find('.same-size-bubble').toggle(chartType === 'scatter' && plgEl.axisRadioGroup.find('[data-axis]:checked').attr('data-axis') === 'z');
            plgEl.verticalYCategoryMenu.toggleClass('hide', chartType !== 'scatter');
            plgEl.bottomXCategoryMenu.toggleClass('hide', chartType !== 'scatter');
 
            plgEl.axisRadioGroup.toggleClass('hide', !(chartType === 'scatter' || chartType === 'column-line'))
                .find('label.z-axis').toggleClass('hide', !(chartType === 'scatter'));
 
 
            if (chartType === 'column-line') {
                plgEl.regionsContainer.find('.active').not('.last-active').removeClass('active');
                sp = plgEl.indicatorContainer.find('li a.second');
                if (pluginVars.columnLineData.secondFId &&
                    plgEl.indicatorContainer.find('[data-fid="' + pluginVars.columnLineData.secondFId + '"]')) {
                    plgEl.indicatorContainer.find('[data-fid="' + pluginVars.columnLineData.secondFId + '"]').addClass('second active');
                } else if (sp.length) { sp.addClass('active'); }
            } else {
 
                chartType === 'multi-line-ind' && plgEl.regionsContainer.find('.active').not('.last-active').removeClass('active');
 
                if (chartType === 'line') {
                    for (var i = 0, ps = pluginVars.selectedCountries, l = ps.length; i < l; i++) {
                        plgEl.regionsContainer.find('[data-code3="' + ps[i] + '"]').addClass('active');
                    }
                }
                // adding below line as active class removed when there are different indicators from diff categories
                // and then select a chart having single indicator feature
                plgEl.indicatorContainer.find('li a.active').length > 1 &&
                    plgEl.indicatorContainer.find('li a.active.second').removeClass('active');
            }
 
                plgEl.categoryContainer.find('li.li-selected-category > a')
                    .contents().filter(function() {
                        return this.nodeType === 3;
                    }).replaceWith(plgEl.indicatorContainer.find('li a.first .ind-text').text()); //txt.text();
            // make the sorting disabled for line chart
            that.mapChart('h');
        };
 
 
        /**
         * Changing data and update map and graph on changing previous or next year from time range
         * @param {type} self
         * @returns {None}
         */
        that.prevNextYearTimeRange = function(self) {
            if (pluginVars.dualTimeRange && that.checkGraphForDualTimeRange()) {
                return false;
            }
 
            var pflag = $(self).hasClass('prev-year'),
                py = pluginVars.yearsRange,
                pyi = plgEl.yearSlider.data('from'); //py.indexOf(fvlocal);
            if (pflag) {
                if (!(--pyi >= 0)) {
                    return false;
                }
            } else {
                if (!(++pyi < py.length)) {
                    return false;
                }
            }
 
            pluginVars.selectedYear = pluginVars.yearsRange[pyi];
            frv = isNaN(pluginVars.selectedYear) ? pluginVars.selectedYear : Number(pluginVars.selectedYear);
 
            that.objIonRangeSlider.update({ from: py.indexOf(frv) });
            that.mapChart('slider-changed');
        };
 
        /**
         * Share Url with current active indicator, year, selected region.
         * @returns {None}
         */
        that.shareURL = function(loc, inNewWindow) {
            //var loc = window.location,
            var i = [],
                s = [],
                ct5ff = that.getChartType(),
                url = '',
                v;
            plgEl.regionsContainer.find('a.active').each(function() {
                $(this).data('code3') && s.push($(this).data('code3'));
            });
 
            s = s.length ? '&s=' + s.join(',') : '';
 
            i = plgEl.indicatorContainer.find('a.active').data('fid');
            switch (ct5ff) {
                default:
                    v = 1;
                    break;
            }
 
 
            var d = '';
            if (pluginVars.selectableTimeRange.length) {
                d = '&d=' + pluginVars.selectableTimeRange.join(',');
            }
 
 
            t = pluginVars.selectedYear;
            if (that.objIonRangeSlider.result && that.objIonRangeSlider.options.type === 'double') {
                t = that.objIonRangeSlider.result.from_value + ',' + that.objIonRangeSlider.result.to_value;
            }
 
            url = loc + '?i=' + i + '&v=' + v + '&t=' + t + s + d;
            if (options.preSelectedRegion) {
                url += '&r=' + options.preSelectedRegion;
            }
            //url = loc.protocol+'//'+loc.host+loc.pathname+'?i='+i+'&v='+v+'&t='+t+s+d;
            if (inNewWindow === !0) {
                window.open(url, '_blank');
                return false;
            }
 
            that.loader(that.child, false, {
                message: '<textarea class="form-control">' + url + '</textarea>',
                onBlock: function() {
                    $(this).find('textarea').select();
                }
            });
            that.child.find('textarea').select();
            try {
                s = document.execCommand('copy');
                if (s) {
                    msg = pluginVars.shareLinkSuccessText;
                }
            } catch (err) {
                msg = 'Unable to copy the link to clipboard';
            }
 
            that.loader(that.child, false, {
                message: '<h4>' + (msg) + '</h4>',
                css: { width: '50%', border: '3px solid #CCC', 'border-radius': '4px', '-webkit-border-radius': '4px', cursor: 'default' },
                onBlock: function() {
                    setTimeout(function() { that.loader(that.child, true); }, 1500);
                }
            });
        };
 
        /**
         * Time slider play animation, not working if dual time range is active + line, column-line and column-mark
         * @param {type} $self
         * @returns {Boolean}
         */
        that.timeSliderAnimation = function($self) {
            if (pluginVars.dualTimeRange && that.checkGraphForDualTimeRange()) {
                return false;
            }
 
            $self.toggleClass('cf-play-circle cf-stop-circle');
 
            if ($self.hasClass('cf-stop-circle')) {
                $self.data('interval', null);
 
                if (that.getChartType() === 'line') {
                    i = 0;
                    xax = that.objSPChart.xAxis[0];
 
                    mpo = xax.hasOwnProperty('minPointOffset') ? xax.minPointOffset : 0.5;
                    ca = xax.hasOwnProperty('categories') ? xax.categories : [];
 
                    if (xax.hasOwnProperty('min') && xax.hasOwnProperty('max') && ca.length) {
                        if (ca.indexOf(ca.max()) - ca.indexOf(pluginVars.selectedYear) > 1) {
                            i = ca.indexOf(pluginVars.selectedYear);
                        }
                        $self.data('interval', setInterval(function() {
                            xax.removePlotBand('plot-band-1');
                            if (i >= ca.length) {
                                xax.removePlotBand('plot-band-1');
                                $self.toggleClass('cf-play-circle cf-stop-circle');
                                clearInterval($self.data('interval'));
                                return false;
                            }
                            pluginVars.selectedYear = ca[i];
                            that.objIonRangeSlider.update({ from: i });
                            if (i === 0) {
                                fr = -mpo, to = mpo;
                                i++;
                            } else {
                                fr = mpo + (i - 1), to = mpo + (++i - 1);
                            }
 
                            xax.addPlotBand({
                                from: fr,
                                to: to,
                                color: '#FCFFC5',
                                id: 'plot-band-1',
                                label: { text: pluginVars.selectedYear }
                            });
 
                        }, options.tsAnimationDelay));
                    }
                } else {
                    py = pluginVars.yearsRange,
                        mi = py[0], //py.min(),
                        ma = py[py.length - 1], //py.max(),
                        frv = isNaN(pluginVars.selectedYear) ? pluginVars.selectedYear : Number(pluginVars.selectedYear),
                        sio = py.indexOf(frv),
                        maio = py.indexOf(ma);
 
                    that.objIonRangeSlider.update({
                        from: py.indexOf(pluginVars.selectedYear = maio - sio > 2 ? pluginVars.selectedYear : mi)
                    });
                    that.mapChart('slider-changed');
                    $self.data('interval', setInterval(function() {
                        $self.data('year', pluginVars.selectedYear);
                        pyi = plgEl.yearSlider.data('from'); //py.indexOf(plgEl.yearSlider.data('from'));
                        if (++pyi >= py.length) {
                            clearInterval($self.data('interval'));
                            $self.toggleClass('cf-play-circle cf-stop-circle');
                        }
                        plgEl.graphSettings.find('.next-year').click();
                    }, options.tsAnimationDelay));
                }
            } else {
                if (that.getChartType() === 'line') {
                    that.objSPChart.xAxis[0].removePlotBand('plot-band-1');
                }
                clearInterval($self.data('interval'));
            }
        };
 
        /**
         * Export and Import layout settings
         * @returns {None}
         */
 
        that.exportImportLayoutSettings = function() {
            var psr = plgEl.staticResizable,
                pdr = plgEl.selectionPanel,
                pr = plgEl.graphPanel,
                psp = plgEl.storyPanel,
                pmp = plgEl.mapPanel,
                ptp = plgEl.tablePanel,
                pgs = plgEl.graphSettings;
 
            var ind = 'IND=' + [psr.attr('data-gs-x'), psr.attr('data-gs-y'), psr.attr('data-gs-width'), psr.attr('data-gs-height'), psr.hasClass('hide') || !psr.is(':visible') ? 'FALSE' : 'TRUE'].join(','),
                sel = 'SEL=' + [pdr.attr('data-gs-x'), pdr.attr('data-gs-y'), pdr.attr('data-gs-width'), pdr.attr('data-gs-height'), pdr.hasClass('hide') || !pdr.is(':visible') ? 'FALSE' : 'TRUE'].join(','),
                chart = 'GRAPH=' + [pr.attr('data-gs-x'), pr.attr('data-gs-y'), pr.attr('data-gs-width'), pr.attr('data-gs-height'), pr.hasClass('hide') || !pr.is(':visible') ? 'FALSE' : 'TRUE'].join(','),
                story = 'STORY=' + [psp.attr('data-gs-x'), psp.attr('data-gs-y'), psp.attr('data-gs-width'), psp.attr('data-gs-height'), psp.hasClass('hide') || !psp.is(':visible') ? 'FALSE' : 'TRUE'].join(','),
                map = 'MAP=' + [pmp.attr('data-gs-x'), pmp.attr('data-gs-y'), pmp.attr('data-gs-width'), pmp.attr('data-gs-height'), pmp.hasClass('hide') || !pmp.is(':visible') ? 'FALSE' : 'TRUE'].join(','),
                table = 'TABLE=' + [ptp.attr('data-gs-x'), ptp.attr('data-gs-y'), ptp.attr('data-gs-width'), ptp.attr('data-gs-height'), ptp.hasClass('hide') || !ptp.is(':visible') ? 'FALSE' : 'TRUE'].join(','),
                time = 'TIME=' + [pgs.attr('data-gs-x'), pgs.attr('data-gs-y'), pgs.attr('data-gs-width'), pgs.attr('data-gs-height'), pgs.hasClass('hide') || !pgs.is(':visible') ? 'FALSE' : 'TRUE'].join(',');
 
 
            layout = [chart, ind, sel, story, map, table, time].join('&');
            that.loader(that.child, false, {
                message: '<h4>Copy current layout, or paste and apply an existing layout</h4><table class="table" width="98%" align="center">' +
                    '<tbody><tr><td><textarea class="form-control ta-shared-layout" style="height:60px">' + layout + '</textarea></td></tr>' +
                    '<tr><td><button class="btn btn-primary copy-share-link" onclick="' + document.execCommand('copy') + '">Copy</button>' +
                    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button class="btn btn-primary paste-layout-settings">Apply</button>' +
                    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button class="btn btn-primary cancel-share-link">Cancel</button></td></tr></td></tr>' +
                    '</tbody></table>',
                css: { width: '70%', border: '3px solid #CCC', 'border-radius': '4px', '-webkit-border-radius': '4px', cursor: 'default' },
                onBlock: function() {
                    $(this).find('textarea.ta-shared-layout').select();
                }
            });
 
            that.child.one('click', '.cancel-share-link', function() {
                that.loader(that.child, true);
            }).one('click', '.copy-share-link', function() {
                that.child.find('textarea.ta-shared-layout').select();
                msg = "Error in copying text";
                try {
                    s = document.execCommand('copy');
                    if (s) {
                        msg = 'Settings copied';
                    }
                } catch (err) {
                    msg = 'Oops, unable to copy. Please copy it manually';
                }
                that.loader(that.child, false, {
                    message: '<h4>' + (msg) + '</h4>',
                    css: { width: '50%', border: '3px solid #CCC', 'border-radius': '4px', '-webkit-border-radius': '4px', cursor: 'default' },
                    onBlock: function() {
                        setTimeout(function() { that.loader(that.child, true); }, 1500);
                    }
                });
            }).one('click', '.paste-layout-settings', function() {
                var msg = "Error in paste";
                GS_LAYOUTSTR = that.child.find('textarea.ta-shared-layout').val().toString();
                GS_LAYOUT = that.parseQueryString(GS_LAYOUTSTR.trim());
                if (GS_LAYOUT.hasOwnProperty('IND') && GS_LAYOUT.hasOwnProperty('GRAPH')) {
                    //GS_IND = (GS_LAYOUT['IND']||'0,0,3,3,FALSE').split(',');
                    that.updateGridItems(psr, (GS_LAYOUT['IND'] || '0,0,3,3,FALSE').split(','));
 
                    //GS_GRAPH = (GS_LAYOUT['GRAPH']||'3,0,6,3,FALSE').split(',');
                    that.updateGridItems(pr, (GS_LAYOUT['GRAPH'] || '3,0,6,3,FALSE').split(','));
 
                    //GS_SEL = (GS_LAYOUT['SEL']||'9,0,3,3,FALSE').split(',');
                    that.updateGridItems(pdr, (GS_LAYOUT['SEL'] || '9,0,3,3,FALSE').split(','));
                    //GS_STORY = (GS_LAYOUT['STORY']||'0,3,3,3,FALSE').split(',');
                    that.updateGridItems(psp, (GS_LAYOUT['STORY'] || '0,3,3,3,FALSE').split(','));
                    //GS_MAP = (GS_LAYOUT['MAP']||'3,3,9,3,FALSE').split(',');
                    that.updateGridItems(pmp, (GS_LAYOUT['MAP'] || '3,3,9,3,FALSE').split(','));
                    //GS_TABLE = (GS_LAYOUT['TABLE']||'12,3,0,3,FALSE').split(',');
                    that.updateGridItems(ptp, (GS_LAYOUT['TABLE'] || '12,3,0,3,FALSE').split(','));
                    //GS_TIME = (GS_LAYOUT['TIME']||'12,3,0,3,FALSE').split(',');
                    that.updateGridItems(pgs, (GS_LAYOUT['TIME'] || '12,3,0,3,FALSE').split(','));
                    msg = 'Layout changed successfully';
                    that.resizeSPChart();
                    //that.objSPMap && that.objSPMap.setSize(plgEl.mapPanel.width(),plgEl.mapPanel.height(),false);
                    that.resizeSPMap();
                } else {
                    msg = 'Layout string is incorrect';
                }
 
                that.loader(that.child, false, {
                    message: '<h4>' + (msg) + '</h4>',
                    css: { width: '50%', border: '3px solid #CCC', 'border-radius': '4px', '-webkit-border-radius': '4px', cursor: 'default' },
                    onBlock: function() {
                        setTimeout(function() { that.loader(that.child, true); }, 1500);
                    }
                });
            });
        };
 
        that.updateGridItems = function(el, arr) {
            if (arr[0] != '' && arr[1] != '' && arr[2] != '' && arr[3] != '' && arr[4] != '') {
                /*if(arr[0]&&arr[1]&&arr[2]&&arr[3]&&arr[4]){
                if(arr[4]==='TRUE'){
                    if(el.hasClass('graphSettings')){el.find('.time-slider').closest('li').removeClass('hide');}
                    else {el.removeClass('hide');}
                } else {
                    if(el.hasClass('graphSettings')){el.find('.time-slider').closest('li').addClass('hide');}
                    else {el.addClass('hide');}
                }*/
                if (el.hasClass('graphSettings')) {
                    el.find('.time-slider').closest('li').toggleClass('hide', !(arr[4] === 'TRUE'));
                } else {
                    el.toggleClass('hide', !(arr[4] === 'TRUE'));
                }
 
                el.attr({ 'data-gs-x': arr[0], 'data-gs-y': arr[1], 'data-gs-width': arr[2], 'data-gs-height': arr[3] });
            }
        };
 
 
        that.exportMapGraph = function(self) {
            if ($(self).data('type')) {
                var tosp = $(self).data('area') === 'map' ? that.objSPMap : that.objSPChart;
                if (tosp) {
                    var scat = that.getChartType() === 'scatter',
                        iName = (pluginVars.columnLineData.firstFId && that.getIndProp(pluginVars.columnLineData.firstFId, 't')) || plgEl.indicatorContainer.find('li a.active.first .ind-text').text(),
                        fileName = ($(self).data('area') == 'map' ? "map_" : "graph_" + that.getChartType() + "_") + iName;
                    $(self).data('area') !== 'map' && scat && tosp.xAxis[0].setTitle({ text: that.getIndProp(pluginVars.bubbleData.xSPFID, 't') });
 
                    switch ($(self).data('type')) {
                        case 'png':
                            tosp.exportChartLocal({ filename: fileName });
                            break; //exportChart();break;
                        case 'jpeg':
                            tosp.exportChartLocal({ filename: fileName, type: "image/jpeg" });
                            break;
                        case 'pdf':
                            tosp.exportChart({ filename: fileName, type: "application/pdf" });
                            break; //exportChartLocal
                        case 'svg':
                            tosp.exportChartLocal({ type: "image/svg+xml" });
                            break;
                        case 'csv':
                            tosp.downloadCSV();
                            break;
                        case 'xls':
                            tosp.downloadXLS();
                            break;
                    }
                    $(self).data('area') !== 'map' && scat && tosp.xAxis[0].setTitle({ text: '' });
                }
                $(self).closest('.main-dropdown').hide();
            } else {
                if ($(self).next('ul.main-dropdown').length) {
                    $(self).next('.main-dropdown').find('ul.dropdown-menu').hide();
                }
                if (!$(self).data('type') && $(self).next('ul.dropdown-menu').length) {
                    $(self).closest('.main-dropdown').find('ul.dropdown-menu').not(self).hide();
                    $(self).next('ul.dropdown-menu').toggle();
                    return false;
                }
            }
        };
 
 
        that.checkGraphForDualTimeRange = function() {
            var c = that.getChartType();
            return c === 'line' || c === 'column-line' || c === 'column-mark' || c === 'multi-line-ind';
            //return ['line'].indexOf(that.getChartType()) > -1;
        };
 
        /**
         * Creating all regions for regions dropdown
         * @returns {None}
         */
        that.createRegionArea = function() {
            if (that.regions) {
                var ul = $('<ul />').appendTo(plgEl.allRegionsContainerMenu.find('.li-selected-category')),
                    flagCustomIndex = '',
                    ci = {},
                    s;
 
                $.each(that.regions, function(key) {
                    if (this && this.title) {
                        var regid = this.data[5];
                        if (!ul.find('li').length) {
                            plgEl.allRegionsContainerMenu.find('.li-selected-category a').text(this.title);
                        }
                        if (this.subregions.length) {
                            s = '';
                            $(this.subregions).each(function(k) {
                                if (this && this.title) {
                                    s += ('<li class="region has-parent"><a href="' + JSVOID0 + '" data-regid="' + regid + '" data-pid="' + key + '" data-index="' + k + '">' + this.title + '</a></li>');
                                }
                            });
                            ul.append('<li><a>' + this.title + '</a><ul class="parent">' + s + '</ul></li>');
                        } else {
                            ul.append('<li class="region"><a href="' + JSVOID0 + '" data-regid="' + regid + '" data-index="' + key + '">' + this.title + '</a></li>');
                        }
                        if (flagCustomIndex === '' && /all\s*regions/i.test(this.title) === true) {
                            flagCustomIndex = key;
                        }
                    }
                });
 
                if (flagCustomIndex) {
                    ci = that.regions[flagCustomIndex];
                    that.regions['ci'] = { title: 'Custom region', code3: ci.code3, data: ci.data };
                    ul.children('li').children('[data-index="' + flagCustomIndex + '"]').parent('li').after(
                        '<li class="region custom-region"><a href="' + JSVOID0 + '" data-regid="ci" data-index="ci">Custom region</a></li>'
                    );
                }
 
 
                ul.on('click', 'li.region a', function(e) {
                    e.preventDefault();
                    pluginVars.selectedCountries = [];
                    that.changeRegion(this, $(this).data('index'), true);
                });
                plgEl.allRegionsContainerMenu.smartmenus({ noMouseOver: true })
                    .bind('show.smapi', function(e, menu) {
                        plgEl.selectionPanel.css('z-index', 2);
                    })
                    .bind('hide.smapi', function(e, menu) {
                        plgEl.selectionPanel.css('z-index', '');
                    });
                if (options.preSelectedRegion) {
                    if (options.preSelectedRegion.indexOf('-') !== -1) {
                        var op = options.preSelectedRegion.split('-');
                        if (ul.find('li.region a[data-regid="' + op[0] + '"][data-index="' + op[1] + '"]').length) {
                            var a = ul.find('li.region a[data-regid="' + op[0] + '"][data-index="' + op[1] + '"]');
                            that.changeRegion(a[0], a.attr('data-index'), false);
                        }
                    } else if (ul.find('li.region a[data-regid="' + options.preSelectedRegion + '"]').length) {
                        var a = ul.find('li.region a[data-regid="' + options.preSelectedRegion + '"]');
                        that.changeRegion(a[0], a.attr('data-index'), false);
                    }
                }
 
            }
        };
 
        /**
         * @desc Changing the region - All regions, Custom region, etc
         * @param {type} self
         * @param {type} index
         * @param {type} isMapReload
         * @returns {None}
         */
        that.changeRegion = function(self, index, isMapReload) {
            var selectedRegion = that.regions[index];
            options.preSelectedRegion = $(self).attr('data-regid');
            if ($(self).parent('li').hasClass('has-parent')) {
                selectedRegion = that.regions[$(self).data('pid')].subregions[index];
                options.preSelectedRegion += '-' + $(self).attr('data-index');
            }
 
 
            if (selectedRegion && selectedRegion.hasOwnProperty('code3')) {
                plgEl.allRegionsContainerMenu.find('.li-selected-category > a')
                    .contents().filter(function() {
                        return this.nodeType === 3;
                    }).replaceWith(selectedRegion.title);
                if (selectedRegion.code3.length) {
                    pluginVars.selectedRegionArea = selectedRegion;
                } else {
                    pluginVars.selectedRegionArea = {};
                }
            }
            isMapReload && plgEl.regionsContainer.removeClass('v-nodata');
            that.setRegions();
            if (isMapReload) {
                that.mapChart('region-changed');
            }
        };
 
        /**
         * 
         * @param {type} f , true or false to disable resizable of graph
         * @returns {False}
         */
        that.fullSizeGraph = function(f) {
            if (!that.grid) { return false; }
            var pg = plgEl.graphPanel,
                ps, p, g, s;
            if (!f) {
                pg.attr({
                    'data-gs-x': pg.data('sp-x'),
                    'data-gs-y': pg.data('sp-y'),
                    'data-gs-width': pg.data('sp-width'),
                    'data-gs-height': pg.data('sp-height')
                });
 
                if (plgEl.selectionPanel.is(':visible')) {
                    ps = plgEl.selectionPanel;
                    ps.attr({
                        'data-gs-x': ps.data('sp-x'),
                        'data-gs-y': ps.data('sp-y'),
                        'data-gs-width': ps.data('sp-width'),
                        'data-gs-height': ps.data('sp-height')
                    }).css('zIndex', 1);
                }
 
            } else {
                p = that.parseQueryString(options.maxGraphSize.withSelectPanel);
 
                g = p['GRAPH'].split(',');
 
                pg.data({
                    'sp-x': pg.attr('data-gs-x'),
                    'sp-y': pg.attr('data-gs-y'),
                    'sp-width': pg.attr('data-gs-width'),
                    'sp-height': pg.attr('data-gs-height')
                }).attr({
                    'data-gs-x': ~~(g[0] || '0'),
                    'data-gs-y': ~~(g[1] || '0'),
                    'data-gs-height': ~~(g[3] || '32')
                });
                if (plgEl.selectionPanel.is(':visible')) {
                    s = p['SEL'].split(',');
                    ps = plgEl.selectionPanel;
                    pg.attr('data-gs-width', ~~(g[2] || '10'));
 
                    ps.data({
                        'sp-x': ps.attr('data-gs-x'),
                        'sp-y': ps.attr('data-gs-y'),
                        'sp-width': ps.attr('data-gs-width'),
                        'sp-height': ps.attr('data-gs-height')
                    }).attr({
                        'data-gs-x': ~~(s[0] || '10'),
                        'data-gs-y': ~~(s[1] || '0'),
                        'data-gs-width': ~~(s[2] || '2'),
                        'data-gs-height': ~~(s[3] || '32')
                    }).css('zIndex', 1);
                } else {
                    p = that.parseQueryString(options.maxGraphSize.withoutSelectPanel);
                    g = p['GRAPH'].split(',');
                    pg.attr('data-gs-width', ~~(g[2] || '12'));
                }
            }
 
            that.resizeSPChart();
            return false;
        };
 
        /**
         * 
         * @returns {None} Reset the size
         */
        that.resizeSPChart = function() {
        };
 
        that.resetScatterYAxisTitle = function() {
         };
 
 
        /**
         * 
         * @param {t} t title which should be cleaned(removing trainling >)
         * @returns {t} with deletion of > for subcategories
         */
 
        that.getCleanTitle = function(t) { return t.replace(new RegExp("^" + (options.delimeter || '>') + "+"), ''); };
 
 
        /**
         * 
         * @param {type} data
         * @param {type} type
         * @returns {None} Calling the callback functionality
         */
        that.getSettingsCsv_callback = function(data, type) {
            var obj = type === 'txt' ? that.settingsTxtToJson(data) : that.settingsCsvToJson(data);
            that.settings = obj.settings || {};
            that.regions = obj.regions || {};
            // now create template after getting back the settings
            that.createTemplate();
        };
 
        /**
         * 
         * @param {type} data
         * @param {type} type
         * @returns {None} Calling the functionality
         */
 
        that.getDataCsv_callback = function(data, type) {
            var parsedData = type === 'txt' ? that.dataTxtToJson(data) : that.dataCsvToJson(data);
            if (localVars.dataISO.length && localVars.settingsISONames.length) {
                for (var i = 0, s = localVars.settingsISONames, d = localVars.dataISO, l = d.length; i < l; i++) {
                    if (d[i] && typeof s[i] !== 'undefined') {
                        options.isoCountries[d[i]] = { name: s[i].name || d[i], link: s[i].link || '' };
                    }
                }
            }
            that.parseJSON(parsedData);
            that.setRegions();
 
            plgEl.mapContainer.on("contextmenu", 'g.statplanet-series-group', function(e) {
                e.preventDefault();
                $ul = (that.find('ul.map-context').length && that.find('ul.map-context').removeClass('hide')) ||
                    $("<ul class='map-context' />")
                    .html('<li class="map-coordinates">' + (that.settings.hasOwnProperty("T_COPYMC") && that.settings.T_COPYMC || 'Copy Map Coordinates') + '</li>').appendTo(that.find('.sp-main-child'));
                // Show contextmenu In the right position (the mouse)
                $ul.fadeToggle(200).css({ top: e.pageY, left: e.pageX - 80 })
                    .on('click', '.map-coordinates', function() {
                        $(this).closest('ul.map-context').hide();
                        if (that.objSPMap && that.objSPMap.hasOwnProperty('xAxis') && that.objSPMap.xAxis.length) {
                            x = that.objSPMap.xAxis[0].getExtremes();
                            y = that.objSPMap.yAxis[0].getExtremes();
                            xmi = x.min.toFixed(5);
                            xma = x.max.toFixed(5);
                            ymi = y.min.toFixed(5);
                            yma = y.max.toFixed(5);
                            that.loader(plgEl.mapContainer, false, {
                                message: '<h4>Copy the current map coordinates</h4><table class="table" width="98%" align="center"><thead><tr><th>X Min</th><th>X Max</th><th>Y Min</th><th>Y Max</th></tr></thead>' +
                                    '<tbody><tr><td>' + xmi + '</td> <td>' + xma + '</td> <td>' + ymi + '</td><td>' + yma + '</td></tr>' +
                                    '<tr><td colspan="4"><br></td></tr>' +
                                    '<tr><td colspan="4">' +
                                    '<textarea class="inpt-box form-control" style="height:40px;">&lt;html&gt;&lt;body&gt;&lt;table&gt;&lt;tr&gt;&lt;td&gt;' + xmi + '&lt;/td&gt;&lt;td&gt;' + xma + '&lt;/td&gt;&lt;td&gt;' + ymi + '&lt;/td&gt;&lt;td&gt;' + yma + '&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;&lt;/body&gt;&lt;/html&gt;</textarea></td></tr>' +
                                    '<tr><td colspan="4"><button class="btn btn-primary close-block-coordinates">Close</button></td></tr></tbody></table>',
                                css: { width: '70%', border: '3px solid #CCC', 'border-radius': '4px', '-webkit-border-radius': '4px', cursor: 'default' },
                                onBlock: function() {
                                    $(this).find('.inpt-box').select();
                                }
                            });
                            plgEl.mapContainer.on('click', '.close-block-coordinates', function() {
                                that.loader(plgEl.mapContainer, true);
                            });
                        }
                    });
 
            });
            $root.on("mousedown", function(e) {
                // If the clicked element is not the menu
                if (!$(e.target).parents("ul.map-context").length > 0) {
                    // Hide it
                    that.find('ul.map-context').fadeOut(200);
                }
            });
 
            if (pluginVars.disableMap && pluginVars.indDis && options.selectedIndicators.length) {
                plgEl.categoryContainer.smartmenus('disable', true).find('a.selected-indicator').addClass('disabled');
            }
 
            that.child.removeClass('invisible');
 
            if (options.helpBubbles.enabled) {
             }
 
        };
 
        /**
         * @desc Setting bubbules on their appropriate positioned element
         * @returns {None}
         */
        that.setBubbles = function() {
            var ws = $(window).scrollTop(),
                objHelpBubble = options.helpBubbles,
                flagBubble = true,
                el, o, otop, oleft, $tooltip;
            $.each(objHelpBubble, function(key) {
                if (this.hasOwnProperty('elem') && this.hasOwnProperty('text') && this.text) {
                    flagBubble = false;
                    el = $root.find(this.elem);
                    o = el.offset();
 
                    otop = o.top - ws;
                    oleft = o.left + (el.outerWidth() / 2);
 
                    if (this.hasOwnProperty('arrowPos')) {
                        if (this.arrowPos === 'up') {
                            otop += el.outerHeight() + 40;
                        } else if (this.arrowPos === 'down') {
                            otop -= el.outerHeight();
                        }
                    }
 
                    $tooltip = that.child.find('.help-bubble-tooltip.' + key);
                    if (!$tooltip.length) {
                        $tooltip = $('<span class="' + key + ' help-bubble-tooltip"><div class="' + (this.class || '') + '"></div>' + this.text + '</span>').appendTo(
                            that.child
                        );
                    }
                    $tooltip.attr({ 'data-left': oleft, 'data-top': otop });
                }
            });
            if (flagBubble) {
                that.child.removeClass('help-bubble-on');
                that.loader(that, true);
                return false;
            }
 
            that.child.find('.help-bubble-tooltip').each(function(i) {
                var row = $(this);
                if (!row.hasClass('animated')) {
                    clr = setTimeout(function() {
                        row.css({ left: row.data('left'), top: row.data('top') });
                        row.addClass('animated');
                    }, 500 * i);
 
                    that.child.data('helptimer', clr);
 
                } else {
                    row.removeAttr('style').css({ left: row.attr('data-left') + 'px', top: row.attr('data-top') + 'px' });
                }
            });
 
            $(window).on('scroll resize', function() {
                if (that.child.hasClass('help-bubble-on')) {
                    if ($(window).data('timer')) {
                        clearTimeout($(window).data('timer'));
                    }
                    timer = setTimeout(function() { that.setBubbles(); }, 500);
                    $(window).data('timer', timer);
                }
            });
 
        };
 
        that.addRegionList = function() {
            var $elem = plgEl.regionsContainer; //||[];
            if ($elem.hasClass('v-nodata')) {
                return $elem;
            }
            // for all regions
            var regions = options.isoCountries;
            var str = '',
                key, regionArea = [];
            var lastActive = pluginVars.selectedCountries.length ? pluginVars.selectedCountries[pluginVars.selectedCountries.length - 1] : '';
            if (pluginVars.selectedRegionArea.hasOwnProperty('code3')) {
                regionArea = pluginVars.selectedRegionArea.code3;
                if (regionArea.length) {
                    // set those which are available in that region
                    for (var i = 0, l = regionArea.length; i < l; i++) {
                        if (regions.hasOwnProperty(regionArea[i]) && pluginVars.countriesHavingData.indexOf(regionArea[i] + '') !== -1) {
                            str += "<li><a class='" + (lastActive === regionArea[i] ? 'last-active ' : ' ') + (pluginVars.selectedCountries.indexOf(regionArea[i]) !== -1 ? 'active' : '') + "' data-code3='" + regionArea[i] + "' href='" + JSVOID0 + "' title='" + regions[regionArea[i]]['name'] + "'  data-l='" + regions[regionArea[i]]['link'] + "'>" + regions[regionArea[i]]['name'] + "</a></li>"
                        }
                    }
                }
            } else {
                for (key in regions) {
                    if (regions.hasOwnProperty(key) && pluginVars.countriesHavingData.indexOf(key) !== -1) {
                        str += "<li><a class='" + (lastActive === key ? 'last-active ' : ' ') + (pluginVars.selectedCountries.indexOf(key) !== -1 ? 'active' : '') + "' data-code3='" + key + "' href='" + JSVOID0 + "' title='" + regions[key]['name'] + "' data-l='" + regions[key]['link'] + "'>" + regions[key]['name'] + "</a></li>";
                    }
                }
            }
            // add html
            $elem.html(str);
 
            $elem.children('li').sort(function(a, b) {
                return $(a).text().toLowerCase() > $(b).text().toLowerCase() ? 1 : -1;
            }).appendTo($elem);
            return $elem;
        }
 
        /**
         * @returns {None}, Adding Regions to Regions List
         */
        that.setRegions = function() {
 
            var $elem = that.addRegionList();
 
            // scroll to active li or and set scroll position on top
            var dc = $elem.find('a.active:first').parent('li'); //.click();
            (dc && dc.length && $elem.animate({ scrollTop: dc.offset().top - $elem.offset().top }, 200)) || $elem.scrollTop(0);
 
            /** Code for highlighting chart when switching the chart like bar to column */
            $elem.find('a[data-code3].active').each(function() {
                var code3 = $(this).data('code3');
                if (that.getChartType !== 'line' && that.objSPChart && that.objSPChart.get(code3)) {
                    that.objSPChart.get(code3).selected = true;
                    that.objSPChart.get(code3).setState('select');
                }
            });
             
            // When s parameter is set and charttype is column line or multi line ind then add Country name
            var chartType = that.getChartType();
            if (chartType === 'column-line' || chartType === 'multi-line-ind') {
                that.changeGraphTitle(chartType);
            }
 
            $elem.off('click mouseenter mouseleave', 'a[data-code3]').on('click', 'a[data-code3]', function(e) {
                e.preventDefault();
 
                var chartType = that.getChartType();
 
                if (chartType === 'column-line' || chartType === 'multi-line-ind') {
                    if ($(this).hasClass('active')) return false;
                    else {
                        var ind = pluginVars.selectedCountries.indexOf($elem.find('a.active').removeClass('active').attr('data-code3'));
                        if (ind > -1)
                            pluginVars.selectedCountries.splice(ind, 1);
                    }
                }
 
                $elem.find('.last-active').removeClass('last-active');
                $(this).addClass('last-active').toggleClass('active');
 
                // call only after adding active class
                if (chartType === 'column-line' || chartType === 'multi-line-ind') {
                    that.changeGraphTitle(chartType);
                }
 
                var code3 = $(this).attr('data-code3');
 
 
                if (!$(this).hasClass('active')) {
                    pluginVars.selectedCountries = $.grep(pluginVars.selectedCountries, function(a) {
                        return a !== code3;
                    });
                } else {
                    pluginVars.selectedCountries.push(code3);
                }
 
                pluginVars.selectedCountries = $.unique(pluginVars.selectedCountries); //that.uniqueSort(pluginVars.selectedCountries);
 
                if (chartType !== 'line' && chartType !== 'column-line' && chartType !== 'multi-line-ind') {
                    if (that.objSPChart.get(code3)) {
                        that.objSPChart.get(code3).selected = $(this).hasClass('active');
                        that.objSPChart.get(code3).setState(e.type === 'mouseleave' ? ($(this).hasClass('active') ? 'select' : null) : 'select');
                    }
                }
                if (chartType === 'line' || chartType === 'column-line' || chartType === 'multi-line-ind') {
                    that.mapChart('h');
                }
            }).on('mouseenter mouseleave', 'a[data-code3]', function(e) {
 
                if (!that.objSPMap || !that.objSPMap.series) {
                    return false;
                }
                var code3 = $(this).data('code3'),
                    chartType = that.getChartType();
                that.changeIndicatorsProgress(code3);
 
 
                // highlight series
                that.highLightTimeSeries(code3, e.type);
                if (that.objSPMap.get(code3)) {
                    that.objSPMap.get(code3).setState(e.type === 'mouseleave' ? null : 'hover');
                }
                if ((chartType !== 'line' && chartType !== 'column-line') && that.objSPChart && that.objSPChart.get(code3)) {
                    that.objSPChart.get(code3).setState(e.type === 'mouseleave' ? null : 'hover');
                    e.type === 'mouseenter' ? that.objSPChart.tooltip.refresh(that.objSPChart.get(code3)) : that.objSPChart.tooltip.hide();
                }
            }).on('dblclick', 'a[data-code3]', function(e) {
                e.preventDefault();
                $(this).data('l') && window.open($(this).data('l'), '_blank');
            });
 
        };
 
        /***
         * 
         * @param {type} code3 iso code for which datalabels to be shown
         * @param {evtype} evtype event type like mouseenter or mouseleave
         * @returns {undefined}
         */
        that.highLightTimeSeries = function(code3, evtype) {
            var ser = that.objSPChart && that.objSPChart.series,
                opts;
            if (isArray(ser) && ser.length && that.getChartType() === 'line') {
                for (var i = 0, l = ser.length; i < l; i++) {
                    opts = ser[i].options;
                    if (opts.code3 === code3) {
                        opts.dataLabels.enabled = evtype === 'mouseenter';
                        opts.animation = false;
                        that.objSPChart.series[i].update(opts);
                        break;
                    }
                }
            }
        };
 
 
        /**
         * 
         * @param {l} l length of level counting the category delimeter >
         * @param {subcat} subcat traversed subcat upto n-1 level
         * @returns {subcat} last indexed array to puch data object
         */
        that.recursiveSubCategoryAddition = function(l, subcat) {
            if (subcat !== undefined && subcat.length && subcat instanceof Array && l-- > 1) {
                return that.recursiveSubCategoryAddition(l, subcat[subcat.length - 1].subcat);
            }
            if (l <= 1) { return subcat; }
        };
        /**
         * 
         * @param {subcat} subcat array of sub category of a main category
         * @param {catdata} catdata array of CSV
         * @param {n} n main category number
         * @param {m} m sub category number
         * @returns {subcat} array of sub category having title,level,data in it
         */
        that.recursiveCategory = function(subcat, catdata, n, m) {
            var category = catdata && catdata[0].CATEGORY,
                ctime = (catdata.length && catdata[0].TIME) || '',
                file, sobj;
            if ($.trim(category) !== "") {
                currentLevel = that.getCategoryLevel(category);
                datacatid = 'sc_' + n + '_' + (m++) + '_' + currentLevel;
                sobj = { title: category, id: datacatid, level: currentLevel };
 
                // no sub category main category has direct indicators
                if ($.trim(ctime) !== "") {
 
                    pluginVars.yearsRange.push(ctime);
 
                    file = (catdata[0].FILE && catdata[0].FILE !== '#') ? catdata[0].FILE : ((catdata[0].DATA && catdata[0].DATA !== '#') ? catdata[0].DATA : '');
                    sobj['data'] = that.recursiveCategoryData([], catdata, datacatid);
                    //console.log(file,datacatid);
 
                    pluginVars.dataCategories[datacatid] = sobj;
                    if (currentLevel > 1) {
                        t = that.recursiveSubCategoryAddition(currentLevel, subcat);
                        if (t !== undefined) {
                            t.push(sobj);
                        }
                    } else {
                        subcat.push(sobj);
                    }
 
                    that.addLatestTime(sobj.data);
 
 
                } else { // having sub categories
                    catdata.splice(0, 1);
                    // create subcategory array object, as it hase more categories
                    sobj['subcat'] = [];
                    if (currentLevel > 1) {
                        t = that.recursiveSubCategoryAddition(currentLevel, subcat);
                        t.push(sobj);
                    } else {
                        subcat.push(sobj);
                    }
                }
                if (catdata.length === 0) return subcat;
                that.recursiveCategory(subcat, catdata, n, m);
            }
            return subcat;
        };
        /**
         * 
         * @param {data} data array of data's having year and indicators array
         * @param {catdata} catdata array of CSV
         * @returns {data} data of a sub category
         */
        that.recursiveCategoryData = function(data, catdata, datacatid) {
            //indicator = catdata[0].INDICATOR||'';
            var ctime = catdata[0].TIME || '',
                file = (catdata[0].FILE && catdata[0].FILE !== '#') ? catdata[0].FILE : ((catdata[0].DATA && catdata[0].DATA !== '#') ? catdata[0].DATA : ''),
                indicators = [];
            if (ctime) {
                if (data.length !== 0 && catdata[0].CATEGORY) {
                    return data;
                }
                catdata.splice(0, 1);
 
                data.push({ file: file, year: ctime, indicators: that.recursiveIndicators(indicators, catdata, ctime, true, file, datacatid, 1) });
                // if last indicator of sub category, then return data
                if (catdata.length === 0) {
                    return data;
                }
                that.recursiveCategoryData(data, catdata, datacatid);
            }
            return data;
        };
 
 
        /**
         * 
         * @param {indicators} indicators array of indicator's title
         * @param {catdata} catdata array of CSV
         * @param ctime year from data.csv
         * @param isParentCaller flag for creating tooltip data as arguments.callee.caller.name not working in ie
         * @param file file name for dynamic load
         * @param datacatid data's category id
         * @param indIndex indicator index
         * @returns {indicators} Array of indicators for category year
         */
        that.recursiveIndicators = function(indicators, catdata, ctime, isParentCaller, file, datacatid, indIndex) {
            var indicator = catdata[0].INDICATOR || '',
                unit = ' ' + catdata[0].UNIT || '',
                map = catdata[0].MAP || '',
                graph = '',
                opts = '',
                clearValue=null,
                sfile = ''; // for single indicator data file
 
            catdata[0].GRAPH && (graph = that.parseQueryString(catdata[0].GRAPH));
            catdata[0].OPTIONS && (opts = that.parseQueryString(catdata[0].OPTIONS));
 
 
            if (!file) {
                sfile = (catdata[0].FILE && catdata[0].FILE !== '#') ? catdata[0].FILE : ((catdata[0].DATA && catdata[0].DATA !== '#') ? catdata[0].DATA : '');
            }
 
            ////if(isParentCaller){
            ////   pluginVars.indicatorDescription=[];
            ////}
            desc = catdata[0].DESCRIPTION || '';
 
            /////if(catdata[0].DESCRIPTION){
            /////pluginVars.indicatorDescription.push(catdata[0].DESCRIPTION);
            /////}
 
            if (indicator) {
                // if condition, added for handling * in data.csv
                if (indicator !== '*' && indicator !== '**') {
                    var catInd = [];
                    if (options.isoCountries) {
                        var countryIndex = 0;
                        $.each(options.isoCountries, function(key, value) {
                            //comment this line otherwise it will show cachec indicators tooltip
 
                            // if the callee function is recursiveCategoryData then 
                            // make data array for all indicators
                            if (isParentCaller) { //(callee === '') {
                                var cd = catdata;
                                pluginVars.indicatorsDataByYear = [];
                                flagged = false;
                                $(cd).each(function() {
                                    if (this.INDICATOR) {
                                        // Pop up issue if the value is blank #67610
                                        // if (this[key] !== undefined && this[key] !== "") { 
                                        if (this[key] !== undefined) { 
                                            flagged = true;
                                            // replacing comma by decimal if exists, #64259
                                            pluginVars.indicatorsDataByYear.push(this[key].replace(',','.') || null);
                                        }
                                    } else {
                                        return false;
                                    }
                                });
                            } else {
                                // same country array data for next indicators
                                if (indicators.length && //--indicators[indLength - 1]
                                    indicators[0] && indicators[0].hasOwnProperty('country_data')) { //+++
                                    var ob = $.grep(indicators[0].country_data, function(n) {
                                        return n.code3 === key;
                                    });
                                    if (ob.length && ob[0] && ob[0].indicatorsData) {
                                        pluginVars.indicatorsDataByYear = ob[0].indicatorsData;
                                    }
                                }
                            }
                            // replacing comma by decimal if exists, #64259
                            if (catdata[0][key] != undefined) {
                                clearValue = $.trim(catdata[0][$.trim(key)]) == "" ? null : Number(catdata[0][key].replace(',','.'));
                            }
                            catInd.push({
                                code3: $.trim(key),
                                value: clearValue,
                                id: $.trim(key),
                                year: ctime,
                                name: value.name,
                                link: value.link,
                                indicatorsData: pluginVars.indicatorsDataByYear || []
                            });
                            if (catdata[0].hasOwnProperty(key) && pluginVars.countriesHavingData.indexOf(key) === -1) {
                                pluginVars.countriesHavingData.push(key);
                            }
                        });
                    }
                    fid = catdata[0].ID ? catdata[0].ID : (datacatid ? datacatid + ('__' + indIndex) : '');
                    indicators.push({
                        desc: desc,
                        sfile: sfile,
                        graph: (graph.hasOwnProperty('show') && graph.show.toString() === 'false') ? 'hide' : '',
                        unit: unit,
                        map: map,
                        title: indicator,
                        fid: fid,
                        country_data: catInd,
                        opts: (opts.hasOwnProperty('numberFormat') && opts.numberFormat.toString() === 'none') ? 'noformat' : '',
                        gsets: (catdata[0].GRAPH || ''),
                        q: (catdata[0].OPTIONS || '')
                    });
                }
                catdata.splice(0, 1);
                // if last indicator of sub category, then return indicators 
                if (catdata.length === 0) {
                    return indicators;
                }
                that.recursiveIndicators(indicators, catdata, ctime, false, file, datacatid, ++indIndex);
            }
            return indicators;
        };
        /**
         * 
         * @param {arr} arr array of values
         * @returns {Array} unique array with sorted data in ascending order
         */
        that.uniqueSort = function(arr) { return $.grep(arr, function(el, inx) { return inx === $.inArray(el, arr); }).sort(); };
        /**
         * 
         * @param {json} json getting parsed JSON object from CSV
         * @returns {None} only appends data to parsedDataJson variable.
         */
        that.parseJSON = function(json) {
            that.parsedDataJson = [];
            var n, root, catdata, os = options['startupParams'],
                oap = options['API'];
            $.each(json, function(row, col) {
                n = row + 1;
                root = { title: col.title, id: 'cat-' + n, level: 0, subcat: [], data: [], pid: 'pid-' + n, };
 
                catdata = col.data || [];
                if (catdata.length) {
                    // having sub categories
                    if (catdata[0].CATEGORY !== "") {
                        // no sub category main category has direct indicators
                        if (catdata[0].TIME !== "") {
                            pluginVars.yearsRange.push(catdata[0].TIME);
                            root.data = that.recursiveCategoryData([], catdata, root.id, 1);
                            that.addLatestTime(root.data);
                            pluginVars.dataCategories[root.id] = root;
                        } else {
                            catdata.splice(0, 1);
                            if (catdata.length) { //++ check if this has at least a sub category                            
                                root.subcat = that.recursiveCategory([], catdata, n, 1);
                            }
                        }
                    }
                    that.parsedDataJson.push(root);
                }
            });
            var ul = $("<ul data-loadType='1'><li class='same-size-bubble' style='display:none'><a href='" + JSVOID0 + "'>Same size</a></li></ul>");
            // building category list
            ul.on('click', '.same-size-bubble > a', function(e) {
                e.preventDefault();
                plgEl.categoryContainer.find('li.li-selected-category > a').contents().filter(function() {
                    return this.nodeType === 3;
                }).replaceWith(options.T_GR_SCALE);
 
                that.mapChart('h');
            });
 
 
 
            if (oap && that.parseQueryString(os).hasOwnProperty('qv')) {
                if (that.parsedDataJson.length === 1 && that.parsedDataJson[0].hasOwnProperty('data')) {
                    if (that.parsedDataJson[0]['data'].length && that.parsedDataJson[0]['data'][0].hasOwnProperty('file')) {
                        that.parsedDataJson[0]['data'][0]['file'] = oap;
                        that.parsedDataJson[0]['data'][0]['indicators'][0].q = os;
                    }
                }
            }
 
            that.buildUL(ul, that.parsedDataJson);
 
 
 
            (function(ul) {
                var a = $(ul).find('a[data-fid]');
                a.each(function() {
                    var fid = $(this).attr('data-fid');
                    pluginVars.indObj[fid] = { t: $(this).text(), u: $(this).attr('data-unit') };
                });
 
                $(ul).find('a[data-fid]').closest('ul[data-id]').each(function() {
                    var ths = $(this),
                        a = ths.find('a[data-fid]'),
                        k = ths.attr('data-id'),
                        counter = 0,
                        th, fid;
                    pluginVars.catFid[k] = { fid: {} };
 
                    a.each(function() {
                        th = $(this), fid = th.attr('data-fid');
                        pluginVars.catFid[k][counter++] = fid;
                        pluginVars.catFid[k]['fid'][fid] = {
                            id: fid,
                            t: th.text(),
                            u: th.attr('data-unit'),
                            m: th.attr('data-map'),
                            g: th.attr('data-graph'),
                            o: th.attr('data-opts'),
                            gs: th.data('gsets'),
                            q: th.data('q')
                        };
                    });
                });
            })(ul);
 
 
            // making the indicators panel
            that.generateIndicatorsPanel(ul);
 
            var $clone = ul.clone(),
                $clone1 = ul.clone();
            plgEl.bottomXCategoryMenu
                .find('.bottom-category li.li-selected-category').append($clone)
                .find('.leaf-indicators').toggleClass('leaf-indicators xaxis-leaf-indicators')
                .on('click', function(e) {
                    e.preventDefault();
                    that._trigger_x_indicator_menu_click(this);
                });
 
 
 
            plgEl.bottomXCategoryMenu.find('li.same-size-bubble').remove();
            plgEl.bottomXCategoryMenu.find('ul.bottom-category')
                .smartmenus({ noMouseOver: true, bottomToTopSubMenus: true })
                .bind('show.smapi', function(e, menu) {
                    plgEl.categoryContainer.css('z-index', 2);
                })
                .bind('hide.smapi', function(e, menu) {
                    plgEl.categoryContainer.css('z-index', '');
                });
 
            var $elpop = plgEl.verticalYCategoryMenu.find('.yaxis-scatter-category'),
                $newUl = '';
            if ($elpop.data('bs.popover')) {
                $newUl = $("<ul class='sm sm-clean hp100'><li class='li-selected-category'><a href='" + JSVOID0 + "' class='selected-indicator'>Selected Indicator</a></li></ul>");
                $newUl.find('li.li-selected-category')
                    .append($clone1)
                    .find('.leaf-indicators').toggleClass('leaf-indicators yaxis-leaf-indicators')
                    .on('click', function(e) {
                        e.preventDefault();
                        $.removeData(plgEl.storyPanel, 'isRunning');
                        that._trigger_y_indicator_click(this, $elpop, $newUl);
                    });
                $newUl.smartmenus({ noMouseOver: true });
                $elpop.data('bs.popover').options.content = $newUl;
                $newUl.find('li.same-size-bubble').remove();
            }
 
            that.fuzitwada(ul);
            that.callIndicators();
        };
 
        that.callIndicators = function() {
            var ul = plgEl.categoryContainer.find('ul.top-ul');
            if (options.selectedIndicators.length && options.selectedIndicators[0]) {
                if (options.selectedIndicators[1]) {
                    that.multipleIndicatorsInUrl(options.selectedIndicators[0],
                        options.selectedIndicators[1], options.selectedIndicators[2] || '',
                        options.selectedIndicators[3] || '', options.selectedIndicators[4] || '');
 
                } else {
                    that._trigger_category_indicators_click(ul.find('a.leaf-indicators[data-fid="' + options.selectedIndicators[0] + '"]')[0], true);
                    
                }
            } else {
                ///ul.find('a.leaf-indicators:first').click();
                that._trigger_category_indicators_click(ul.find('a.leaf-indicators:first'), true);
            }
            pluginVars.yearsRange = that.uniqueSort(pluginVars.yearsRange);
            that.yearRangeChanged('load');
        };
 
        /**
         * Click Event for Radio Buttons on Scatter and Column Line Axis
         * @param {type} self clciked radio object
         * @returns {None}
         */
        that._trigger_radio_axis_click = function(self) {
 
            var axis = $(self).data('axis'),
                chtType = that.getChartType(),
                lbl = 'Add new indicator';
 
            !pluginVars.topmenu && lbl && $(plgEl.categoryContainer).find('li.li-selected-category > a')
                .contents().filter(function() {
                    return this.nodeType === 3;
                }).replaceWith(lbl);
 
        };
 
 
        /**
         * Changing graph label, if it is enabled in settings.csv
         * @param {type} chtType
         * @param {type} lbl as text if direct changes
         * @returns {None}
         */
        that.changeGraphTitle = function(chtType, txt) {
        };
 
 
 
        /**
         * @desc function to init Horizontal Topmenu and/or Fuzzy List Search
         * @param {type} ul
         * @returns {None}
         */
        that.fuzitwada = function(ul) {
            var $horList = $("<ul data-loadType='1' class='top-ul'></ul>");
 
            if (pluginVars.topmenu) {
                $horList = ul.clone();
                $horList.addClass('sm sm-clean fuzite-list top-ul').find('.same-size-bubble').remove();
            } else {
                $horList.addClass('sm sm-clean simple-sm').append('<li class="li-selected-category"><a href="' + JSVOID0 + '" class="selected-indicator">Selected Indicator</a></li>');
                $(ul).appendTo($horList.find('.li-selected-category'));
            }
 
            var $li = $('<li class="fuzite-search" id="fuzind" />').appendTo($horList),
                chtType = that.getChartType(),
                axisCls = (chtType == 'scatter' || chtType == 'column-line') ? '' : 'hide',
                zCls = chtType == 'column-line' ? 'hide' : '',
                prad = pluginVars.radioAxis,
                isScatter = chtType == 'scatter';
 
            var $divAxis = $('<div class="axis-radio-group form-control ' + axisCls + '">' +
                '<label class="y-axis"><input data-axis="y" checked type="radio" name="radio-axis"/><span>' + (isScatter ? prad['T_YAX'] : prad.T_LAX) + '</span></label>' +
                '<label class="x-axis"><input data-axis="x" type="radio" name="radio-axis"/><span>' + (isScatter ? prad.T_XAX : prad.T_RAX) + '</span></label>' +
                '<label class="z-axis ' + zCls + '"><input data-axis="z" type="radio" name="radio-axis"/><span>' + prad.T_BUB + '</span></label>' +
                '</div>').appendTo($li);
            plgEl['axisRadioGroup'] = $divAxis;
            $divAxis.on('click', '[type="radio"]', function() { that._trigger_radio_axis_click(this); });
 
 
            if (pluginVars.listSearch) {
                $li.append('<input class="form-control fuzzy-search" placeholder="Search" /><ul class="fuzzite-ind-list-ul"></ul>');
            }
 
            $horList.smartmenus({ noMouseOver: true });
            $horList.appendTo(plgEl.categoryContainer).on('click', '.leaf-indicators', function(e) { //fuzzite-indicators
                e.preventDefault();
                that.getChartType() !== 'scatter' && $.removeData(plgEl.storyPanel, 'isRunning');
                that._trigger_category_indicators_click(this, false);
            });
 
            if (pluginVars.listSearch) {
                var optionsl = { valueNames: ['name'], plugins: [ListFuzzySearch()], listClass: 'fuzzite-ind-list-ul' },
                    listul = ul.clone(),
                    lindul = $horList.find('.fuzzite-ind-list-ul');
                listul.find("li:not(:has(ul))").each(function() { //
                    var a = $(this).find('a.leaf-indicators').toggleClass('leaf-indicators name fuzzit-ind');
                    if (a.length) {
                        lindul.append($('<li/>').append(a.clone()));
                    }
                });
                lindul.on('click', 'a.fuzzit-ind', function(e) {
                    e.preventDefault();
                    var el = $('a.leaf-indicators[data-fid="' + $(this).attr('data-fid') + '"]')[0];
                    that.getChartType() !== 'scatter' && $.removeData(plgEl.storyPanel, 'isRunning');
                    that._trigger_category_indicators_click(el, false);
                    lindul.hide();
                });
 
                new List('fuzind', optionsl).on('updated', function(list) { lindul.toggle(list.matchingItems.length > 0); });
            }
        };
 
        /**
         * @desc triggers when there are multiple indicators in URL
         * @param {type} x_id
         * @param {type} y_id
         * @param {type} z_id
         * @param {type} M4 // for multi line indicators and stacked column
         * @param {type} M5 // for multi line indicators and stacked column
         * @returns {None}
         */
        that.multipleIndicatorsInUrl = function(x_id, y_id, z_id, M4, M5) {
  
        };
 
 
 
        that._trigger_category_indicators_click = function(self, isFirstLoad) {
 
            var $ul = $(self).closest('ul'),
                paf, $li = $ul.find('li'),
                chtTp = that.getChartType(),
                condScatter = chtTp === 'scatter';
            // Adding !isFirstLoad, because x axis will be blank as y axis is default checked and will affect x axis indicator selection
            that.hideGraphPanel($(self).attr('data-fid'));
 
 
            // in scatter plot it act as Z parameter in chart,
            // so don't update story panel
            if (!condScatter) {
                pluginVars.currentSubCategoryId = pluginVars.currentSubCategoryId ? pluginVars.currentSubCategoryId : $ul.data('id');
                that.updateStoryPanel($(self).attr('data-desc'), self);
            }
 
            plgEl.categoryContainer.find('a.selected-indicator').contents().filter(function() {
                return this.nodeType === 3;
            }).replaceWith($(self).text());
 
            if (condScatter) {
            } else {
                pluginVars.currentSubCategoryId = $ul.data('id');
                if (!$.hasData(plgEl.storyPanel, 'isRunning')) {
                    that.updateIndicatorPanel($li, plgEl.indicatorContainer.empty().attr('data-cid', $ul.data('id')), $(self));
                    var p = plgEl.indicatorContainer;
 
                    if (options.selectedIndicators.length && options.selectedIndicators[0] && isFirstLoad) {
                        if (options.selectedIndicators[1]) {
                            p.find('a[data-fid="' + options.selectedIndicators[1] + '"]').click();
                        } else if (options.selectedIndicators[0]) {
                            p.find('a[data-fid="' + options.selectedIndicators[0] + '"]').click();
                        }
                    } else {
                        p.find('a.indicator:eq(' + $(self).closest('li').index() + ')').click();
                    }
                }
 
            }
        };
 
        that.hideGraphPanel = function(fid) {
        }
 
        /**
         * @desc trigger click event for x indicator menu
         * @param {type} self
         * @returns {None}
         */
        that._trigger_x_indicator_menu_click = function(self) {
            var $self = $(self),
                $ul = $self.closest('ul');
 
            plgEl.axisRadioGroup && plgEl.axisRadioGroup.find('[type="radio"][data-axis="z"]').prop('checked', true);
 
            if ($self.data('file') || $self.data('sfile')) {
                that.getSingleIndicatorData(self, function() {
                    plgEl.bottomXCategoryMenu.find('a.selected-indicator').contents().filter(function() {
                        return this.nodeType === 3;
                    }).replaceWith($self.text());
                    that.bottomXYearMenu($ul.data('id'));
                    that.mapChart('h');
                }, false, $ul.data('id'));
 
            } else {
                plgEl.bottomXCategoryMenu.find('a.selected-indicator').contents().filter(function() {
                    return this.nodeType === 3;
                }).replaceWith($self.text());
                that.bottomXYearMenu($ul.data('id'));
                that.mapChart('bubbleX');
            }
        };
 
        /**
         * @desc trigger when changing y indicator in scatter plot
         * @param {type} self
         * @param {$elpop} $elpop
         * @param {$newUl} $newUl
         * @returns {undefined}
         */
        that._trigger_y_indicator_click = function(self, $elpop, $newUl) {
            var $self = $(self),
                $ul = $self.closest('ul'),
                $elem = plgEl.indicatorContainer.empty().attr('data-cid', $ul.attr('data-id')),
                $li = $ul.find('li'),
                fg5ed = $self.data('file') || $self.data('sfile');
            pluginVars.currentSubCategoryId = $ul.data('id');
            
            plgEl.axisRadioGroup && plgEl.axisRadioGroup.find('[type="radio"][data-axis="x"]').prop('checked', true);
 
 
            if (fg5ed) {
                that.getSingleIndicatorData(self, function() {
                    that.mapChart('bubbleY');
                }, false, pluginVars.bubbleData.ySPId);
            }
 
            that.updateStoryPanel($self.attr('data-desc'), self);
 
            pluginVars.selectedIndicatorIndex = $self.parent('li').index();
 
            // added for issue when switching scatter to column first time then it is 
            // not showing proper secondary y axis and tooltip
            if (pluginVars.columnLineData.firstId && pluginVars.columnLineData.firstFId) {
                pluginVars.columnLineData.secondIndex = pluginVars.columnLineData.firstIndex;
                pluginVars.columnLineData.secondId = pluginVars.columnLineData.firstId;
                pluginVars.columnLineData.secondFId = pluginVars.columnLineData.firstFId;
            }
 
            pluginVars.columnLineData.firstId = pluginVars.currentSubCategoryId;
            pluginVars.columnLineData.firstIndex = pluginVars.selectedIndicatorIndex;
            pluginVars.columnLineData.firstFId = $self.attr('data-fid');
            
 
            plgEl.categoryContainer.find('li.li-selected-category > a').data('text', $self.text());
 
            that.updateIndicatorPanel($li, $elem, $self);
 
            $newUl && $newUl.find('a.selected-indicator').contents().filter(function() {
                return this.nodeType === 3;
            }).replaceWith($self.text());
 
            $elpop && $elpop.popover('hide').attr('title', $self.text());
 
            // if file then call this function in getSingleIndicatorData callback
            !fg5ed && that.mapChart('bubbleY');
        };
 
 
        that.updateIndicatorPanel = function($li, $elem, $self) {
            var cls = options.INDICATORBARS ? 'col-xs-7' : 'col-xs-12';
            $li.each(function(ind) {
                var a = $(this).children('a'),
                    file = a.attr('data-file') || '',
                    sfile = a.attr('data-sfile') || '',
                    fid = a.attr('data-fid') || '',
                    unit = a.attr('data-unit') || '',
                    map = a.attr('data-map') || '',
                    graph = a.attr('data-graph') || '',
                    desc = a.attr('data-desc') || '',
                    vopts = a.attr('data-opts') || '',
                    gsets = a.data('gsets') || '',
                    q = a.data('q') || '',
                    cfbt9 = $self ? (ind === $self.closest('li').index() ? 'first active' : '') : '';
                var anc = $('<a href="' + JSVOID0 + '" class="indicator col-xs-12 ' + cfbt9 + '" data-unit="' + unit + '" data-graph="' + graph + '" data-opts="' + vopts + '" data-desc="' + desc + '" data-fid="' + fid + '" data-sfile="' + sfile + '" data-file="' + file + '">' +
                    '<div class="ind-text ' + cls + ' pad0 pr7">' + $(this).text() + '</div>' +
                    (options.INDICATORBARS ? '<div class="indicators-progress col-xs-4 pad0 pull-right"><div class="progress">' +
                        '<div class="progress-bar progress-bar-primary" role="progressbar" aria-valuemin="0" aria-valuemax="100" style="width:0%"></div>' +
                        '</div><div class="ind-value"></div></div>' : '') + '</a>');
                li = $("<li></li>").append(anc);
                anc.attr({
                    'data-map': map,
                }).data({ 'gsets': gsets, q: q });
                $elem.append(li);
            });
            var dc = $elem.find('a.active').parent('li');
            dc && dc.length && ($elem.animate({ scrollTop: dc.offset().top - $elem.offset().top + $elem.scrollTop() }, 200));
        };
 
        /**
         * @desc Year range slider
         * @param {type} type
         * @returns {None}
         */
        that.yearRangeChanged = function(type) {
            if (pluginVars.yearsRange.length) {
                var yr = pluginVars.yearsRange,
                    $range = plgEl.yearSlider;
                var params = {
                    prettify_enabled: false,
                    grid: true,
                    values: yr,
                    type: pluginVars.dualTimeRange && that.checkGraphForDualTimeRange() ? "double" : "single",
                    onChange: function() {
                        if (!options.GS_DEVMODE) { plgEl.graphSettings.draggable('disable'); }
                    },
                    onFinish: function(data) {
                        pluginVars.selectableTimeRange = [];
                        //console.log(data,that.objIonRangeSlider);
                        if (!options.GS_DEVMODE) { plgEl.graphSettings.draggable('enable'); }
                        if (pluginVars.dualTimeRange) {
                            o = { from: data.from };
                            if (that.checkGraphForDualTimeRange()) {
                                o['to'] = data.to;
                            }
                            pluginVars.objDualTimeRange = o;
                        }
                        //--- commenting for issue in dual time range
                        if (pluginVars.dualTimeRange && that.objIonRangeSlider.options.type === 'double' && data.to_value) {
                            pluginVars.selectedYear = data.to_value;
                        } else {
                            pluginVars.selectedYear = data.from_value;
                        }
                        that.mapChart('slider-changed');
                    }
                };
                if (pluginVars.dualTimeRange) {
                    if (type === 'load' && pluginVars.timeRange.length) {
                        params['to'] = yr.indexOf(pluginVars.timeRange[1] || yr[yr.length - 1]);
                        params['from'] = yr.indexOf(pluginVars.timeRange[0] || yr[0]);
                    } else {
                        params['to'] = yr[yr.length - 1];
                        params['from'] = yr[0];
                    }
                }
 
                $range.ionRangeSlider(params);
                // slider cache
                that.objIonRangeSlider = $range.data("ionRangeSlider");
                //console.log(that.objIonRangeSlider);
                if (pluginVars.timeRange.length) {
                    if (pluginVars.timeRange[1]) {
                        pluginVars.selectedYear = pluginVars.timeRange[1];
                    } else {
                        pluginVars.selectedYear = pluginVars.timeRange[0];
                    }
                } else {
                    var v = $range.val();
                    if (v && v.split(';').length) {
                        // if the slide has type double range then get the last value as selectedyear
                        v = v.split(';');
                        v = v[1] ? v[1] : v[0];
                    }
                    pluginVars.selectedYear = v;
                }
            }
        };
 
        /**
         * Settings X year menu for Scatter plot
         * @param {type} id
         * @returns {undefined}
         */
        that.bottomXYearMenu = function(id) {
            var t = pluginVars.dataCategories[id],
                yrArr = {};
 
            if (t && t.hasOwnProperty('data')) {
                var ydata = t.data,
                    y, s;
                for (var i = 0, l = ydata.length; i < l; i++) {
                    if (ydata[i].hasOwnProperty('year')) {
                        y = ydata[i].year;
                        if (isNaN(y)) { yrArr[y] = (y); } else { s = parseInt(y / 10) + '0s'; if (!yrArr.hasOwnProperty(s)) { yrArr[s] = []; }
                            yrArr[s].push(y); }
                    }
                }
            }
            plgEl.bottomXYearMenu.find('li.li-selected-year').children('ul').remove();
            var $ul = $('<ul />').appendTo(plgEl.bottomXYearMenu.find('li.li-selected-year'));
            $.each(yrArr, function(k, v) {
                var $li = $('<li><a href="' + JSVOID0 + '">' + k + '</a></li>').appendTo($ul);
                if (isArray(v) && v.length) {
                    var $ullocal = $('<ul></ul>').appendTo($li);
                    for (var i = 0, l = v.length; i < l; i++) {
                        $('<li><a class="bottom-leaf-year" href="' + JSVOID0 + '" data-year="' + v[i] + '">' + v[i] + '</a></li>').appendTo($ullocal);
                    }
                } else {
                    // add click event to root element also
                    $li.find('a').addClass('bottom-leaf-year').attr('data-year', k);
                }
            });
 
        };
 
        /**
         * 
         * @param {parent} parent
         * @param {items} items
         * @returns {None} Append the element to main list
         */
        that.buildUL = function(parent, items) {
            $.each(items, function() {
                if (this.title) {
                    // create LI element and append it to the parent element.
                    var li = $("<li " + (this.pid ? 'data-pid=' + this.pid : '') + "><a href='" + JSVOID0 + "'>" + that.getCleanTitle(this.title) + "</a></li>");
                    li.appendTo(parent);
                    // if there are sub items, call the buildUL function.
                    if (this.subcat && this.subcat.length > 0) {
                        var ul = $("<ul data-id='" + (this.id || "") + "'></ul>");
                        ul.appendTo(li);
                        that.buildUL(ul, this.subcat);
                    } else if (this.data && this.data.length && this.data[0].indicators) {
                        var ul = $("<ul data-id='" + (this.id || "") + "'></ul>");
                        ul.appendTo(li);
                        var file = this.data[0].file || '';
 
                        $(this.data[0].indicators).each(function(key) {
                            if (this.title) {
                                sfile = '';
                                if (!file && this.sfile && this.sfile !== '#') {
                                    sfile = this.sfile;
                                }
 
                                // create LI element and append it to the parent element.
                                var anc = $("<a class='leaf-indicators' data-unit='" + (this.unit || '') + "' data-desc='" + (this.desc || "") + "' data-opts='" + (this.opts || '') + "' data-graph='" + (this.graph || '') + "' data-fid='" + (this.fid || '') + "' data-sfile='" + sfile + "' data-file='" + file + "' href='" + JSVOID0 + "'>" + this.title + "</a>"),
                                    li = $("<li class='leaf-li'></li>").append(anc);
                                anc.attr({
                                    'data-map': (this.map || '')
                                }).data({ 'gsets': this.gsets || '', 'q': this.q || '' });
                                li.appendTo(ul);
                            }
                        });
                    }
                }
            });
        };
 
 
        /**
         * 
         * @param {ul} ul ul list to create/bind on click event on each leaf indicator
         * @returns {None}
         */
        that.generateIndicatorsPanel = function(ul) {
            var $indicators = ul.find('a.leaf-indicators');
            if ($indicators.length) {
                plgEl.indicatorContainer
                    .off('click', 'a.indicator')
                    .on('click', 'a.indicator', function(e) {
                        e.preventDefault();
                        if ($(this).attr('data-fid') === pluginVars.columnLineData.firstFId) {
                            return false;
                        }
                        $.removeData(plgEl.storyPanel, 'isRunning');
                        that._trigger_indicator_click(this);
                    });
 
            }
        };
 
        that.swapMultiLineIndicators = function(self) {
            var temp1, temp2;
            if (pluginVars.mi.M1.cid) {
                temp1 = pluginVars.mi.M2.cid ? pluginVars.mi.M2 : '';
                pluginVars.mi.M2 = pluginVars.mi.M1;
            }
            if (temp1) {
                temp2 = pluginVars.mi.M3.cid ? pluginVars.mi.M3 : '';
                pluginVars.mi.M3 = temp1;
                temp1 = '';
            }
 
            if (temp2) {
                temp1 = pluginVars.mi.M4.cid ? pluginVars.mi.M4 : '';
                pluginVars.mi.M4 = temp2;
                temp2 = '';
            }
 
            if (temp1) {
                temp2 = pluginVars.mi.M5.cid ? pluginVars.mi.M5 : '';
                pluginVars.mi.M5 = temp1;
                temp1 = '';
            }!pluginVars.topmenu && that.updateGraphLabel(self.find('.ind-text').text());
        };
 
        that.updateGraphLabel = function(txt) {
 
            var lbl = '',
                M = pluginVars.mi,
                count = 0,
                a = ['fifth', 'fourth', 'third', 'second', 'new'];
            "" == M.M1.text && count++, "" == M.M2.text && count++, "" == M.M3.text && count++,
                "" == M.M4.text && count++, "" == M.M5.text && count++;
 
            if (count == 0) {
                lbl = txt ? txt : M.M1.text;
            } else if (count && a[count - 1]) {
                lbl = 'Add ' + a[count - 1] + ' indicator';
            }
 
            //lbl && plgEl.graphTitle.text(lbl);
 
            lbl && $(plgEl.categoryContainer).find('li.li-selected-category > a')
                .contents().filter(function() {
                    return this.nodeType === 3;
                }).replaceWith(lbl);
            return count;
        };
 
 
        /**
         * @desc change indicator from indicator panel
         * @param {type} self
         * @returns {None}
         */
 
        that._trigger_indicator_click = function(self) {
 
            var chartType = that.getChartType(),
                rghtActCL = false,
                lftActCL = false;
 
 
            that.hideGraphPanel($(self).attr('data-fid'));
 
            //console.log(JSON.stringify(pluginVars.mi));
            pluginVars.selectedIndicatorIndex = $(self).parent('li').index();
 
 
            if (chartType !== 'scatter') {
                $(plgEl.categoryContainer).find('li.li-selected-category > a')
                    .contents().filter(function() {
                        return this.nodeType === 3;
                    }).replaceWith($(self).find('.ind-text').text());
                that.changeGraphTitle(chartType, $(self).find('.ind-text').text());
            } else {
                plgEl.axisRadioGroup && plgEl.axisRadioGroup.find('[type="radio"][data-axis="x"]').prop('checked', true);
            }
 
 
            that.updateStoryPanel($(self).attr('data-desc'), self);
 
 
            /////that.debug(chartType,$(self).find('.ind-text').text());
            //+++ adding dual chart type
            if (chartType === 'column-line') {
 
                lftActCL = plgEl.axisRadioGroup.find(':radio:checked').attr('data-axis') == 'y';
                rghtActCL = plgEl.axisRadioGroup.find(':radio:checked').attr('data-axis') == 'x';
 
                if ((lftActCL && $(self).attr('data-fid') == pluginVars.columnLineData.firstFId) ||
                    (rghtActCL && $(self).attr('data-fid') == pluginVars.columnLineData.secondFId)) {
                    return false;
                }
 
                ///that.debug(pluginVars.columnLineData);
                if (plgEl.indicatorContainer.find('.indicator.active').length > 1) {
                    plgEl.indicatorContainer.find('.indicator.active.second').removeClass('second active');
                }
 
                plgEl.indicatorContainer.find('.indicator.active.first').removeClass('first').addClass('second');
 
 
                if (plgEl.indicatorContainer.find('.indicator.active.second').length) {
                    if (rghtActCL) {
                    
                        plgEl.indicatorContainer.find('.indicator.active.second').toggleClass('first second');
 
                    } else if (!lftActCL) {
            
                    } else if (lftActCL) {
                        !pluginVars.columnLineData.secondFId && plgEl.indicatorContainer.find('.indicator.second.active').removeClass('active second');
                    }
                } else if (pluginVars.columnLineData.firstFId) {
                    plgEl.indicatorContainer.find('[data-fid="' + pluginVars.columnLineData.secondFId + '"]')
                        .addClass('second active');
 
                }
            } else {
                plgEl.indicatorContainer.find('.indicator').removeClass('active second');
                plgEl.indicatorContainer.find('.indicator.first').toggleClass('first'); //first second
            }
 
            if (!rghtActCL) {
                
            }
 
 
            /*
             * Fwd: Re: Query for Statplanet Phase 4 (Dec 01, 2016) 5:14 PM Mail
             *  I noticed the x-axis for the scatter plot seems to plot the 'second to last
             *   indicator' if no 'Indicator B1' was defined. Could it select the current/last indicator selected.
             */
 
            if (rghtActCL) { $(self).addClass('active second'); } else { $(self).addClass('active first'); }
            //plgEl.indicatorContainer.find('.indicator.active.first').removeClass('active first');
 
            if (chartType === 'multi-line-ind' || chartType === 'stacked-column') {
                var fid = $(self).attr('data-fid');
                if (pluginVars.mi.M1.fid == fid || pluginVars.mi.M2.fid == fid || pluginVars.mi.M3.fid == fid ||
                    pluginVars.mi.M4.fid == fid || pluginVars.mi.M5.fid == fid) {
                    /**that.mapChart('maponly');*/
 
                    if ($(self).data('file') || $(self).data('sfile')) {
                        that.getSingleIndicatorData(self, function() {
                            that.mapChart('indicator-changed');
                        }, true);
                    } else {
                        that.mapChart('maponly');
                    }
                    return false;
                }
                that.swapMultiLineIndicators($(self));
            }
 
 
            //(chartType==='multi-line-ind'||chartType==='stacked-column') && that.swapMultiLineIndicators($(self));
 
            pluginVars.mi.M1 = {
                cid: pluginVars.columnLineData.firstId,
                fid: pluginVars.columnLineData.firstFId,
                index: pluginVars.columnLineData.firstIndex,
                text: $(self).find('.ind-text').text()
            };
 
 
 
            if (that.objSPMap) {
                // code for slider reinitialisation
                pluginVars.minMaxData = []; // make it empty for less values
                /**that.mapChart('indicator-changed');*/
                if ($(self).data('file') || $(self).data('sfile')) {
                    that.getSingleIndicatorData(self, function() {
                        // passing true will redraw it from getSingleIndicatorData()
                        // so don't call mapChart() again
                        //that.mapChart('indicator-changed');
                    }, true);
                } else {
                    that.mapChart('indicator-changed');
                }
            } else { // else part added for loading indicator if not rendered map and chart - Case 56577
                if (!($(self).data('file') || $(self).data('sfile'))) {
                    // check if regions are empty then first add them.
                    !plgEl.regionsContainer.find('li').length && that.addRegionList();
                    that.mapChart();
                }
            }
 
            if ($(self).data('file') || $(self).data('sfile')) {
                that.getSingleIndicatorData(self, function() {
                    that.hideGraphPanel($(self).attr('data-fid'));
                }, true);
            }
        };
 
 
        /**
         * Parsing SDMX File data, with OPTIONS
         */
        that.getXMLAPIData = function(data) {
            var curOb = that.currentFidProp('all'),
                indTit = curOb['t'],
                json = [],
                map = curOb['m'],
                apiQ = curOb['q'] ? that.parseQueryString(curOb['q']) : [],
                qs = apiQ.hasOwnProperty('qs') ? apiQ['qs'].replace(':', '\\:') : '',
                qo = apiQ.hasOwnProperty('qo') ? apiQ['qo'].replace(':', '\\:') : '',
                qt = apiQ.hasOwnProperty('qt') ? apiQ['qt'] : '',
                qc = apiQ.hasOwnProperty('qc') ? apiQ['qc'] : '',
                qv = apiQ.hasOwnProperty('qv') ? apiQ['qv'] : '';
            //qs=ns1:Series&qo=ns1:Obs&qt=TIME_PERIOD&qc=REF_AREA&qv=OBS_VALUE&numberFormat=none
            if (qs && qo && qt && qc && qc) {
                var $series = $(qs, data),
                    xmlTimes = {},
                    m, xxml = [];
                $series.each(function(i) {
                    m = $(qo, this), REFAREA = $(this).attr(qc)
                        //console.log(m.length);
                    if (options.isoCountries.hasOwnProperty(REFAREA)) {
                        m.each(function(i) {
                            if (!xmlTimes.hasOwnProperty($(this).attr(qt))) {
                                xmlTimes[$(this).attr(qt)] = {};
                            }
                            var oloca = {};
                            oloca[REFAREA] = $(this).attr(qv);
                            xmlTimes[$(this).attr(qt)][REFAREA] = $(this).attr(qv);
                        });
                    }
                });
                var xx = Object.keys(xmlTimes).sort().reverse(),
                    ocat;
                $.each(xx, function(k, xv) {
                    var times = xmlTimes[xv];
                    ocat = { CATEGORY: '', TIME: xv, INDICATOR: '' };
                    if (!xxml.length) {
                        ocat.CATEGORY = 'Parent';
                    }
                    $.each(options.isoCountries, function(id, code) {
                        if (!times.hasOwnProperty(id)) {
                            times[id] = '';
                        }
                        ocat[id] = '';
                    });
                    xxml.push(ocat);
                    ocat = { CATEGORY: '', TIME: '', INDICATOR: indTit, MAP: map };
                    $.each(times, function(k, v) {
                        ocat[k] = v;
                    });
                    xxml.push(ocat);
                });
                //console.log(xmlTimes,xxml);
                json = [{ data: xxml }];
            }
            return json;
        };
 
 
        that.addLatestTime = function(rootData) {
            var d1 = rootData[0];
            // https://stackoverflow.com/a/11197343/1817690
            // Copy of object is not working, as it copies by reference
            // to get rid of use stringify the object then parse it again
            // https://stackoverflow.com/a/5344074/1817690
            var enhan = JSON.parse(JSON.stringify(d1)); //extend({}, d1, {year: pluginVars.lblLatAvail});
            enhan.year = pluginVars.lblLatAvail;
            $(enhan.indicators).each(function(curInd, curIndic) {
                $(curIndic.country_data).each(function(i, oCode) {
                    // check for null values
                    if (oCode.hasOwnProperty('code3') && oCode.value == null) {
                        var flChVal = true;
                        $(rootData).each(function() {
                            if (this.hasOwnProperty('indicators') && this.indicators[curInd] && oCode.year != this.year && flChVal) {
                                var rootCD = this.indicators[curInd].country_data;
                                $(rootCD).each(function() {
                                    if (oCode.code3 == this.code3 && this.value != null) {
                                        oCode.value = this.value;
                                        oCode.indicatorsData = [];
                                        oCode.indicatorsData.push(this.value);
                                        flChVal = false;
                                        return false;
                                    }
                                });
                            }
                            if (!flChVal) return false;
                        })
                    }
                    oCode.year = pluginVars.lblLatAvail;
                });
            });
            // change for string TIME in data CSV
            rootData.unshift(enhan); // push is inserting in last, so use unshift to prepend
            // Add the NEWEST year if already Latest is added.
            pluginVars.selectedYear = pluginVars.lblLatAvail;
        };
 
 
 
        /**
         * 
         * @param {type} self
         * @param {type} callback
         * @param {type} isRedraw
         * @param {type} catId
         * @returns {undefined}
         */
 
        that.getSingleIndicatorData = function(self, callback, isRedraw, catId) {
            var file = $(self).data('file'),
                fileElem = file && that.child.find('[data-file="' + decodeURIComponent(file.replace(/\\/g, "\\\\")) + '"]'),
                indFileFlag = false;
            if (!file) {
                file = $(self).data('sfile');
                fileElem = file && that.child.find('[data-sfile="' + decodeURIComponent(file.replace(/\\/g, "\\\\")) + '"]');
                indFileFlag = true;
            }
 
            fileElem && fileElem.length && fileElem.data({ sfile: null, file: null }).removeAttr('data-file data-sfile');
 
            if (file) {
                var isAPI = /http/i.test(file);
                that.getCsv(file, function(data) {
 
                    var root = { data: [] },
                        json = /\.txt/i.test(file) ? that.dataTxtToJson(data, true) :
                        (/\.csv/i.test(file) ? that.dataCsvToJson(data, true) : []);
 
                    if (isAPI) { // API has called
                        //pluginVars.yearsRange=[];
                        json = that.getXMLAPIData(data);
                    } // API End
 
                    //console.log(JSON.stringify(json));
 
                    if (isRedraw || isRedraw === 'undefined') {
                        pluginVars.yearsRange = [];
                    }
                    $.each(json, function(row, col) {
                        //n = row + 1;
                        // {title: col.title, id: 'cat-' + n, level: 0, subcat: [], data: [],pid:'pid-'+n};
                        var catdata = col.data || [];
                        if (catdata.length) {
                            // having sub categories
                            // commenting this 
                            //if (catdata[0].CATEGORY !== "") {
                            // no sub category main category has direct indicators
                            if (catdata[0].TIME !== "") {
                                // in case if a root has its indicators then for tooltip, it need to be clear the array
                                // no sub category main category has direct indicators
                                if (isRedraw || isRedraw === 'undefined') {
                                    pluginVars.yearsRange.push(catdata[0].TIME);
                                }
                                root.data = that.recursiveCategoryData([], catdata);
                            }
                            //}
                        }
                    });
 
                    //console.log(root);
                    if (root.data.length) {
                        // Adding for LATESTAVAIL +1 line
                        that.addLatestTime(root.data);
 
                        that.updateHTMLParams(root.data);
 
                        //console.log(JSON.stringify(that.parsedDataJson));
                        (function(o, k, v) {
                            function replaceData(obj, key, val, replaceKey, newVal) {
                                var objects = [];
                                //console.log(key,val,replaceKey);
                                for (var j in obj) {
                                    //console.log(j,obj);
                                    if (!obj.hasOwnProperty(j))
                                        continue;
                                    if (typeof obj[j] === 'object' && (obj[j].hasOwnProperty('level') || j == 'data' || j == replaceKey || j == 'subcat')) {
                                        objects = objects.concat(replaceData(obj[j], key, val, replaceKey, newVal));
                                    } else if (j == key && obj[key] == val) {
                                        //console.log(obj);
                                        if (indFileFlag) {
                                            if (obj[replaceKey].length) {
                                                $.each(newVal.data, function() {
                                                    if (this.year) {
                                                        var y = this.year,
                                                            insD = false,
                                                            s = this,
                                                            notInArr = [];
                                                        $.each(obj[replaceKey], function(kapkey) {
                                                            if (this.year == y) {
                                                                this.indicators[pluginVars.selectedIndicatorIndex] = s.indicators[0];
                                                                insD = true;
                                                            } else {
                                                                notInArr.push(this.year);
                                                            }
                                                        });
                                                        console.log(notInArr);
                                                        if (!insD) {
                                                            var nd = { year: this.year, file: this.file, indicators: [] };
                                                            nd.indicators[pluginVars.selectedIndicatorIndex] = this.indicators.length && this.indicators[0];
                                                            obj[replaceKey].push(nd);
                                                        }
                                                    }
                                                });
                                                // vanishing CSV old time data if API is called
                                                if (isAPI) {
                                                    $.each(obj[replaceKey], function(kapkey) {
                                                        var y = this.year,
                                                            flag = true;
                                                        $.each(newVal.data, function() {
                                                            if (this.year == y && y) {
                                                                flag = false;
                                                                return false;
                                                            }
                                                        });
                                                        flag && obj[replaceKey].splice(kapkey, 1);
 
                                                    });
                                                }
 
 
                                            }
                                        } else {
                                            obj[replaceKey] = newVal.data;
                                        }
                                    }
                                }
                                return obj;
                            }
                            replaceData(o, k, v, 'data', root);
 
                            if (isRedraw || isRedraw === 'undefined') {
                                that.mapChart('indicator-changed');
                            }
                        })(that.parsedDataJson, 'id', catId || pluginVars.currentSubCategoryId);
                    } else {
                        // Case 62757 Issue 8 calling Map function if the URL gives 404
                        if (isAPI) {
                            if (isRedraw || isRedraw === 'undefined') {
                                that.mapChart('indicator-changed');
                            }
                        }
                    }
                    if (typeof callback === "function") {
                        callback();
                    }
                }, 'csv', '', { isAPI: isAPI, continueOnError: true });
            }
        };
 
 
        that.updateHTMLParams = function(data) {
            $.each(data, function() {
                if (this.indicators && this.indicators.length) {
                    $.each(this.indicators, function() {
                        if (this.desc && this.title) {
                            var uob = { 'data-desc': this.desc, 'data-graph': this.graph, 'data-opts': this.opts }; //,'data-gsets':this.gsets
                            plgEl.categoryContainer.find('li[data-pid] a:contains(' + this.title + ')').attr(uob);
 
                            a = plgEl.indicatorContainer.find('li a:contains(' + this.title + ')').attr(uob).data({
                                'gsets': this.gsets,
                                q: this.q
                            });
                            if ($(a).closest('ul').attr('data-cid') && this.hasOwnProperty('fid') && this.fid) {
                                var el = pluginVars.catFid[$(a).closest('ul').attr('data-cid')]['fid'][this.fid];
                                // add other keys like u,m if changed dynamically
                                if (el !== undefined) {
                                    el['g'] = this.graph;
                                    el['o'] = this.opts;
                                    el['gs'] = this.gsets;
                                    el['q'] = this.q;
                                }
                            }
                            if (a.hasClass('active')) {
                                that.updateStoryPanel(this.desc, this); // preventing multiple calls
                            }
 
                            plgEl.verticalYCategoryMenu.find('.yaxis-scatter-category').data('bs.popover')
                                .options.content.find('a[data-fid="' + this.fid + '"]').attr(uob);
                        }
                    });
                }
            });
        };
 
 
        that.nextPrevStory = function(self) {
            if ($(self).hasClass('disabled')) { return false; }
            var u = $(self).closest('ul'),
                num = u.find('.num'),
                tot = u.find('.tot').text(),
                sno = parseInt(num.text());
            if ($(self).hasClass('prev')) {
                u.find('.next').removeClass('disabled');
                sno -= 1;
                sno <= 1 && $(self).addClass('disabled');
            } else {
                sno += 1;
                u.find('.prev').removeClass('disabled');
                sno >= tot && $(self).addClass('disabled');
            }
            num.text(sno);
            var o = (plgEl.storyHeader.data('content')); //JSON.parse
            if (o.hasOwnProperty('k') && o.hasOwnProperty('c')) {
                $.removeData(plgEl.storyPanel, 'isRunning');
                that.updateStoryPanel(o.c, { fid: o.k }, sno);
            }
        };
 
 
        that.updateStoryPanel = function(content, self, sno) {
            if ($.hasData(plgEl.storyPanel, 'isRunning')) { return false; }
 
            var index = '',
                fid = self ? $(self).attr('data-fid') || (self.hasOwnProperty('fid') && self.fid) : '',
                el = null,
                ext;
            //content='';
            var matches = content && content.match(/([^{}]+(?=\}))/g);
            if (isArray(matches) && matches.length) {
                !sno && (sno = 1);
                plgEl.storyHeader.toggleClass('hide', matches.length < 2)
                    .data('content', { k: fid, c: content });
 
                plgEl.storyPanel.find('.story-panel-content').toggleClass('h-calc--30', matches.length > 2);
 
 
                index = sno - 1;
                var m = matches[index]; // index starts from 1 so decrement it by 1
                var p = that.parseQueryString(m);
                content = p.hasOwnProperty('l') ? p.l : content;
 
                p.hasOwnProperty('i') && (options.selectedIndicators = []);
                if (p.hasOwnProperty('t')) {
                    var st = decodeURI(p.t).split(',');
                    pluginVars.selectedYear = st.length ? st[0] : p.t;
                }
                //make the selectable date/time range icon disabled or enabled on first load
                that.setUrlParams(p);
                if (p.hasOwnProperty('s')) {
                    plgEl.regionsContainer.find('a[data-code3="' + p.s + '"]').length &&
                        plgEl.regionsContainer.find('a[data-code3="' + p.s + '"]').addClass('active last-active');
                }
                if (p.hasOwnProperty('v')) {
                    var ca = that.setChartType(p.v);
                    ca !== false && that.changeChart(ca);
                }
 
                $.data(plgEl.storyPanel, 'isRunning', true);
                that.callIndicators();
            } else {
                plgEl.storyHeader.addClass('hide').data('content', '');
                plgEl.storyPanel.find('.story-panel-content').removeClass('h-calc--30');
            }
 
 
            if (content) {
 
                el = plgEl.storyPanel.show().find('.story-panel-content');
                plgEl.storyPanel.next('.col-md-12.map-panel') /////----before-gridstack .toggleClass('col-md-9 col-md-12')
                    .addClass('pad0');
                if (fid && !pluginVars.storyPanelData.hasOwnProperty(fid) ||
                    (sno && pluginVars.storyPanelData.hasOwnProperty(fid) && !pluginVars.storyPanelData[fid].hasOwnProperty(index))
                ) {
                    (function(content, fid) {
                        ext = $.trim(content.substr((content.lastIndexOf('.') + 1)));
                        if (ext === 'html' || ext === 'htm') {
                            content = decodeURIComponent(content.replace(/\\/g, "/"));
                            el.load(content + '?_' + Math.random(), function(data) {
                                data = data.replace(/<img([^>]*)\ssrc=(['"])(?:[^\2\/]*\/)*([^\2]+)\2/gi, "<img$1 src=$2story/$3$2");
                                el.html(data);
                                if (fid) {
                                    if (index !== '' && pluginVars.storyPanelData[fid] !== undefined) {
                                        !pluginVars.storyPanelData.hasOwnProperty(fid) && (pluginVars.storyPanelData[fid] = {});
                                        pluginVars.storyPanelData[fid][index] = data;
                                    } else pluginVars.storyPanelData[fid] = data;
                                    //$.removeData(self,'isRunning');
                                }
                            });
                        } else {
                            el.html(content);
                            if (index !== '' && pluginVars.storyPanelData[fid] !== undefined) {
                                !pluginVars.storyPanelData.hasOwnProperty(fid) && (pluginVars.storyPanelData[fid] = {});
                                pluginVars.storyPanelData[fid][index] = content;
                            } else pluginVars.storyPanelData[fid] = content;
                            //$.removeData(self,'isRunning');
                        }
                    })(content, fid);
 
                } else if (pluginVars.storyPanelData[fid] !== undefined) {
                    el.html(pluginVars.storyPanelData[fid].hasOwnProperty(index) ?
                        pluginVars.storyPanelData[fid][index] :
                        pluginVars.storyPanelData[fid]);
                    //$.removeData(self,'isRunning');
                }
            } else {
                if (fid && pluginVars.storyPanelData.hasOwnProperty(fid)) {
                    el = plgEl.storyPanel.show().find('.story-panel-content');
                    el.html(pluginVars.storyPanelData[fid].hasOwnProperty(index) ?
                        pluginVars.storyPanelData[fid][index] :
                        pluginVars.storyPanelData[fid]);
                    //$.removeData(self,'isRunning');
                } else {
                    plgEl.storyPanel.next('.col-md-9.map-panel').removeClass('pad0');
                    plgEl.storyPanel.hide();
                }
            }
        };
 
        /**
         * @desc get the CSV to Parse
         * @returns None
         * @param fileName
         * @param msg Msg for File error
         * @param type type of file like txt,csv
         * @param callback callback function called after success
         */
        that.getCsv = function(fileName, callback, type, msg, params) {
            fileName = decodeURIComponent(fileName.replace(/\\/g, "/")).replace(/&amp;/g, '&');
            //console.log(fileName);
            params = $.extend({ continueOnError: false }, params);
 
            $.ajax({
                contentType: "text/plain; charset=utf-8",
                url: fileName,
                dataType: 'text',
                cache: false,
                success: function(json) {
                    if (typeof callback === "function") {
                        callback(json, type);
                    }
                },
                error: function(xhr) {
                    if (params.continueOnError) {
                        if (typeof callback === "function") {
                            callback([], type);
                        }
                    }
                    if (msg && xhr.status == 404) {
                        document.write("Error: invalid " + msg + " file location (<b>" + fileName + "</b>).");
                    }
                }
 
            });
 
        };
 
        /**
         * 
         * @param {type} n
         * @param {type} is_formatted
         * @returns {n} formated number
         */
        that.roundToPrecision = function(n, is_formatted) {
			//check how many decimal places it has
            if (n && n !== "undefined") {
                n = Number(n);
                if (n % 1 === 0) { 
					return n; // no decimal places, so do not add any
				} else {
					return n < 2 ? n.toFixed(options.DECPLACES2) :
                    (is_formatted === true ? Statplanet.numberFormat(n, options.DECPLACES, options.DEC_POINT, options.T_SEP) :
                        n.toFixed(options.DECPLACES));
				}
                //n < 2 ? n.toFixed(options.DECPLACES2) : n.toFixed(options.DECPLACES));
            }
            return n;
        };
 
        /**
         * 
         * @param {data} data for which min and max values to be fetched
         * @returns {None} only set the values in array
         */
        that.getMinMaxData = function(data) {
            $(data).each(function() {
                if (this.hasOwnProperty('code3') &&
                    (plgEl.regionsContainer.find('a[data-code3="' + this.code3 + '"]').length
                        // below line added becoz map colors not showing, on passing indicator in URL
                        ||
                        plgEl.regionsContainer.is(':empty') || !plgEl.regionsContainer.is(':visible')) &&
                    this.hasOwnProperty("indicatorsData")) {
                    pluginVars.minMaxData.push(this.value || '');
                }
            });
        };
 
 
        /**
         * @param {code} code
         * @returns {None}
         */
        that.changeIndicatorsProgress = function(code) {
			
            if (code) {
                pluginVars.progressBarCode = code;
            } else if (pluginVars.progressBarCode) {
                // get the iso code used for time slider changed
                code = pluginVars.progressBarCode;
            }
			
			//console.log(pluginVars.minMaxIndYearValues.hasOwnProperty(code));
			if (pluginVars.minMaxIndYearValues && pluginVars.minMaxIndYearValues.hasOwnProperty(code)) {
                var oi = pluginVars.minMaxIndYearValues.otherIndicators,
                    idat = pluginVars.minMaxIndYearValues[code].indiData;
 
                pb = plgEl.indicatorContainer.find('.progress-bar');
                if (oi.length) {
                    if (pb.length > idat.length && idat.length === 1) { // in case of single indicator data
                        pbs = plgEl.indicatorContainer.find('.progress-bar:eq(' + pluginVars.selectedIndicatorIndex + ')');
                        o = isArray(oi[0]) && oi[0];
                        if (isArray(o)) {
                            val = Number(idat[0]);
                            min = o.min(),
                                max = o.max(),
                                siz = ((val - min) * 100) / (max - min);
                            pbs.css('background-color', options.chartColor).attr({
                                'aria-valuemin': min,
                                'aria-valuemax': max,
                                'aria-valuenow': val
                            }).stop(true, true).animate({ 'width': siz + '%' }, 100);
                            var optsCond = that.getIndProp(pbs.closest('a.indicator').attr('data-fid'), 'o') === 'noformat';
                            pbs.closest('.indicators-progress').find('.ind-value')
                                .text(idat[0] === null ? options.NODATA : (optsCond ? val : that.roundToPrecision(val, true)) + ' ' + (idat[0] !== null ? pbs.closest('a.indicator').attr('data-unit') : ''));
                            pbs.closest('.indicators-progress').popover();
                        }
                    } else {
                        pb.each(function(i) {
                            if (isArray(oi[i])) {
 
                                val = Number(idat[i]),
                                    min = oi[i].min(),
                                    max = oi[i].max(),
                                    siz = ((val - min) * 100) / (max - min);
                                $(this).css('background-color', options.chartColor).attr({
                                    'aria-valuemin': min,
                                    'aria-valuemax': max,
                                    'aria-valuenow': val
                                }).stop(true, true).animate({ 'width': siz + '%' }, 100);
                                var optsCond = that.getIndProp($(this).closest('a.indicator').attr('data-fid'), 'o') === 'noformat';
                                $(this).closest('.indicators-progress').find('.ind-value')
                                    .text(idat[i] === null ? options.NODATA : (optsCond ? val : that.roundToPrecision(val, true)) + ' ' + (idat[i] !== null ? $(this).closest('a.indicator').attr('data-unit') : ''));
                                $(this).closest('.indicators-progress').popover();
                            }
                        });
                    }
                }
            }
        };
 
 
        /**
         * 
         * @param eventType for rendering only statplanet or other parameters like for slider-changed event
         * @returns {None}
         */
        that.mapChart = function(eventType) {
            var data = [],
                indData = [],
                chartType = that.getChartType(),
                scatterCondition = chartType === 'scatter';
            
            if (pluginVars.currentSubCategoryId && pluginVars.dataCategories &&
                pluginVars.dataCategories.hasOwnProperty(pluginVars.currentSubCategoryId)) {
                indData = pluginVars.dataCategories[pluginVars.currentSubCategoryId];
            }
 
            var categoryData = [];
            if (indData) {
                var newdata = indData.data || [];
                categoryData = newdata;
                var allOpts = that.currentFidProp(),
                    newLatAvl = allOpts.hasOwnProperty('q') && allOpts.q ? allOpts.q.indexOf('calc=latestdata') != -1 : !1;
 
                !newLatAvl && pluginVars.selectedYear == pluginVars.lblLatAvail && (pluginVars.selectedYear = '');
 
 
                // check if selected year is not blank added for Case 56577
                if (!pluginVars.selectedYear) {
                    var frmUrlT = false;
                    // if it is in URL then get it
                    if (pluginVars.timeRange.length) {
                        if (pluginVars.timeRange[1]) {
                            pluginVars.selectedYear = pluginVars.timeRange[1];
                        } else {
                            pluginVars.selectedYear = pluginVars.timeRange[0];
                        }
                        frmUrlT = true;
                    } else if (newdata && newdata[0] && newdata[0].hasOwnProperty('year')) { // get the last year from the time object
                        pluginVars.selectedYear = newdata[0].year;
                    }
                    // Adding to prevent NEWEST from URL for an indicator which has not enabled it
                    if (pluginVars.selectedYear == pluginVars.lblLatAvail && !newLatAvl) {
                        if (frmUrlT) {
                            if (newdata && newdata[0] && newdata[0].hasOwnProperty('year')) { // get the last year from the time object
                                pluginVars.selectedYear = newdata[0].year;
                            }
                        }
                        if (pluginVars.selectedYear == pluginVars.lblLatAvail) {
                            $(newdata).each(function() {
                                if (this.hasOwnProperty('year') && this.year != pluginVars.lblLatAvail) {
                                    pluginVars.selectedYear = this.year;
                                    return false;
                                }
                            });
                        }
                    }
                }
 
 
                if (pluginVars.selectedYear) {
                    var localYears = [],
                        chno = [],
                        ind = pluginVars.selectedIndicatorIndex ? pluginVars.selectedIndicatorIndex : 0;
                    if (eventType !== 'slider-changed') {
                        pluginVars.minMaxData = [];
                    }
 
                    $(newdata).each(function() {
                        if (this.year && this.indicators[ind] && this.indicators[ind].hasOwnProperty('country_data')) {
                            that.getMinMaxData(this.indicators[ind].country_data);
                            localYears.push(this.year);
                            options.NODATAMAPS && chno.push(this.indicators[ind].country_data);
                            if (this.year + '' === pluginVars.selectedYear + '') {
                                data = this.indicators[ind].country_data;
                            }
                        }
                    });
 
                    // Code for restrict Countries/Map areas visibility which are having data in atleast one time/year
                    options.NODATAMAPS && (function(c) {
                        var chnd = {};
                        plgEl.regionsContainer.removeClass('v-nodata').find('li').show();
                        $(c).each(function(i, cd) {
                            $(cd).each(function() {
                                if (this.hasOwnProperty('code3') && plgEl.regionsContainer.find('[data-code3="' + this.code3 + '"]')) {
                                    !chnd.hasOwnProperty(this.code3) && (chnd[this.code3] = { year: [], values: [], totalBlanks: 0 });
                                    chnd[this.code3]['totalBlanks'] += this.value === null || this.value === '' ? 1 : 0;
                                    chnd[this.code3]['values'].push(this.value);
                                    chnd[this.code3]['year'].push(this.year);
                                }
                            })
                        });
                        $.each(chnd, function(k, v) {
                            if (v.totalBlanks === v.values.length) {
                                plgEl.regionsContainer.find('[data-code3="' + k + '"]').parent('li').hide();
                            }
                        });
                        !$.isEmptyObject(chnd) && plgEl.regionsContainer.addClass('v-nodata');
                    })(chno);
 
 
                    localYears.uniqueArray();
                    //pluginVars.yearsRange = localYears.sort();
                    pluginVars.yearsRange = localYears;
                    pluginVars.yearsRange.reverse();
 
                    // make it unique, so that min and max can be easily fetched
                    pluginVars.minMaxData.uniqueArray();
 
                    if (!newLatAvl && localYears.indexOf(pluginVars.lblLatAvail) !== -1) {
                        localYears.splice(localYears.indexOf(pluginVars.lblLatAvail), 1);
                    }
 
                    // forcefully show the latest year data if not found selected year
                    if (!data.length && eventType !== 'slider-changed' && //pluginVars.timeRange.length===0) {
                        (pluginVars.timeRange.length === 0 || (eventType == 'indicator-changed' && pluginVars.timeRange.length !== 0))) {
                        // a don't know condition for last time, so check if NAN then check is it Latest one
                        // else set the maximum from localyears
                        if (isNaN(localYears.max())) {
                            if (isNaN(localYears[0])) pluginVars.selectedYear = localYears[0];
                            else pluginVars.selectedYear = localYears[localYears.length - 1];
                        } else {
                            pluginVars.selectedYear = localYears.max();
                        }
                        ///----pluginVars.selectedYear = localYears[0];
                        // get the max year from the data, if NaN then use the very last from localYears
                        // changing last from first index found issue when used third party APIs(SDMX)
                        ////----pluginVars.selectedYear = isNaN(localYears.max()) ? localYears[0] : localYears.max();
                        var newObj = $.grep(newdata, function(k) {
                            return k.year + '' === pluginVars.selectedYear + '';
                        });
                        if (newObj.length && newObj[0] && newObj[0].hasOwnProperty('indicators')) {
                            ind = pluginVars.selectedIndicatorIndex ? pluginVars.selectedIndicatorIndex : 0;
                            data = newObj[0].indicators[ind].country_data;
                        }
                    }
 
 
                    // for showing progress bar data
                    if (data.length && options.INDICATORBARS) {
                        var mpvArr = {},
                            larr = [];
                        $.each(data, function() {
							//console.log(this.code3 + " / " + this.indicatorData + " / " + this.value);
                                
                            if (!isNaN(this.value) && this.code3 && this.indicatorsData) {
                                //v = Number(this.value);
                                tid = this.indicatorsData;
								mpvArr[this.code3] = { value: Number(this.value), indiData: tid };
                                //console.log(tid + " / " + this.code3 + " / " + this.value);
                            
								for (var i = 0, l = tid.length; i < l; i++) {
                                    if (!isArray(larr[i])) {
                                        larr[i] = [];
                                    }
                                    larr[i].push(Number(tid[i]));
                                }
                                mpvArr['otherIndicators'] = larr;
                            }
                        });
                        pluginVars.minMaxIndYearValues = mpvArr;
                        // trigger progress change when tim slider changed
                        if (eventType === 'slider-changed') {
                            that.changeIndicatorsProgress();
                        }
                    }
 
                    // to fix if the range slider did not get initialised
                    if (!that.hasOwnProperty('objIonRangeSlider')) {
                        that.yearRangeChanged('load');
                    }
 
                    //first need to update values then update selected time
                    that.objIonRangeSlider.update({ values: localYears }); //, from: localYears.indexOf((''+pluginVars.selectedYear))
                    var frv = isNaN(pluginVars.selectedYear) ? pluginVars.selectedYear : Number(pluginVars.selectedYear),
                        ob;
                    if (pluginVars.dualTimeRange && that.checkGraphForDualTimeRange()) {
 
                        if (eventType !== 'slider-changed') {
                            frv = pluginVars.timeRange[0] || pluginVars.selectedYear;
                            frv = isNaN(frv) ? frv : Number(frv);
 
                            if (!pluginVars.timeRange.length) {
                                that.objIonRangeSlider.update({ from: 0, to: localYears.length - 1 });
                            }
 
                            if (!pluginVars.objDualTimeRange.hasOwnProperty('from') && pluginVars.timeRange.length &&
                                localYears.indexOf(frv) !== -1) {
                                trv = pluginVars.timeRange[1] || localYears[localYears.length - 1];
                                trv = isNaN(trv) ? trv : Number(trv);
                                pluginVars.objDualTimeRange['to'] = localYears.indexOf(trv);
                                pluginVars.objDualTimeRange['from'] = localYears.indexOf(frv);
                                pluginVars.timeRange = [];
                            }
 
                            if (pluginVars.objDualTimeRange.hasOwnProperty('from')) {
                                if (localYears.length > pluginVars.objDualTimeRange.to) {
                                    ob = { from: pluginVars.objDualTimeRange.from, to: pluginVars.objDualTimeRange.to };
                                } else {
                                    ob = { from: 0, to: localYears.length - 1 };
                                }
                                that.objIonRangeSlider.update(ob);
                            }
 
                            if (pluginVars.mi.irs.values.length && chartType === 'multi-line-ind') {
                                var vl = pluginVars.mi.irs.values.length;
                                ob = {};
                                if (!isNaN(that.objIonRangeSlider.result.from_value) && !isNaN(pluginVars.mi.irs.values[0])) {
                                    ob['from'] = Number(Number(pluginVars.mi.irs.values[0]) < Number(that.objIonRangeSlider.result.from_value) ?
                                        pluginVars.mi.irs.values[0] : that.objIonRangeSlider.result.from_value);
                                }
                                //TxLt5LF)[WML
                                if ((!isNaN(that.objIonRangeSlider.result.to_value) || !/latest\s*available/i.test(that.objIonRangeSlider.result.to_value)) &&
                                    !isNaN(pluginVars.mi.irs.values[vl - 1])) {
                                    ob['to'] = Number(Number(pluginVars.mi.irs.values[vl - 1]) > Number(that.objIonRangeSlider.result.to_value) ?
                                        pluginVars.mi.irs.values[vl - 1] : that.objIonRangeSlider.result.to_value);
                                }
 
                                if (ob.hasOwnProperty('from') || ob.hasOwnProperty('to')) {
                                    //pluginVars.mi.irs.values = pluginVars.mi.irs.values.concat(localYears);
                                    pluginVars.mi.irs.values = that.uniqueSort(pluginVars.mi.irs.values.concat(localYears));
                                    ob.hasOwnProperty('from') && (ob.from = pluginVars.mi.irs.values.indexOf(ob.from));
                                    ob.hasOwnProperty('to') && (ob.to = pluginVars.mi.irs.values.indexOf(ob.to));
 
                                    ob['values'] = pluginVars.mi.irs.values;
 
                                    // Adding for NEWEST
                                    // Adding "&& ob['values'].indexOf(pluginVars.lblLatAvail)!==-1" 
                                    // For Case #62757 pt 2
                                    // Need to check NEWEST index otherwise it remoes the last index which is "Latest Available"
                                    if (!newLatAvl && ob['values'].indexOf(pluginVars.lblLatAvail) !== -1) {
                                        ob['values'].splice(ob['values'].indexOf(pluginVars.lblLatAvail), 1);
                                    }
 
                                    that.objIonRangeSlider.update(ob);
                                }
                            } else {
                                pluginVars.mi.irs.values = localYears;
                            }
                        }
 
                    } else {
                        that.objIonRangeSlider.update({ from: localYears.indexOf(frv) });
                    }
 
                    plgEl.graphSettings.find('.slider-label').toggle(localYears.length <= 1).find('span').text(pluginVars.selectedYear);
                    plgEl.graphSettings.find('.time-slider').toggle(localYears.length > 1);
                }
            }
            if (eventType === 'maponly' && !pluginVars.disableMap) {
                that.renderHighMap(data);
                return false;
            }
 
            scatterCondition && that.scatterChartData(data);
 
            if (!data.length) { that.error(102); } else { $(that).find('.notify').fadeOut(100).remove(); }
 
            if (!pluginVars.disableMap) {
                that.renderHighMap(data);
            }
            that.renderStatPlanet(data, categoryData, eventType);
 
        };
 
        /**
         * 
         * @param {type} data
         * @returns {None} updates pluginVars variable
         */
        that.scatterChartData = function(data) {
 
            
        };
 
        /**
         * 
         * @param {type} colors
         * @param {type} colorValues
         * @param {type} allBlnks, checking conditions for all blank indicator data array
         * @param {type} isNotNumberFormat, for no formating for an indicator
         * @returns {Array|legendArray}
         */
        that.getPercentile = function(colors, colorValues, allBlnks, isNotNumberFormat) {
            var to, from, toText, fromText, legendArray = [],
                cObj, nameProp;
            if (isArray(colorValues) && colorValues.length && !allBlnks) {
                //do the actual rounding and set the map legend text    
                for (i = 0, clrsLen = colorValues.length; i < clrsLen; i++) {
                    cObj = {};
                    if (colorValues[i].hasOwnProperty('color')) {
                        cObj = colorValues[i];
                        from = Number(cObj.value || null);
                        to = colorValues[i + 1] && colorValues[i + 1].hasOwnProperty('value') &&
                            colorValues[i + 1].value ? Number(colorValues[i + 1].value) : null;
                        toText = to !== null && (isNotNumberFormat ? to : that.roundToPrecision(to, true));
                        fromText = from !== null && (isNotNumberFormat ? from : that.roundToPrecision(from, true));
 
                        legendArray[i] = {};
                        cObj.hasOwnProperty('color') && (legendArray[i]['color'] = cObj.color);
                        cObj.hasOwnProperty('text') && (legendArray[i]['name'] = cObj.text);
                    } else {
                        from = Number(colorValues[i]);
                        to = Number(colorValues[i + 1]);
                        toText = isNotNumberFormat ? to : that.roundToPrecision(to, true);
                        fromText = isNotNumberFormat ? from : that.roundToPrecision(from, true);
 
                        if (colors[i] && legendArray[i]) {
                            legendArray[i]['color'] = colors[i];
                            //Remove the blow line for comment - Sometimes the bar chart color is not the default one, e.g. it may be green (31-Jan-2017)
                            //////if (that.isDarkColor(colors[i])) {options.chartColor = colors[i];}
                        }
                    }
                    nameProp = !legendArray[i].hasOwnProperty('name');
                    if (i === 0) {
                        legendArray[i]['to'] = to;
                        nameProp && (legendArray[i]['name'] = '< ' + toText);
                    } else if (i === clrsLen - 1) {
                        legendArray[i]['from'] = from;
                        nameProp && (legendArray[i]['name'] = '> ' + fromText);  //was '>='
                    } else {
                        legendArray[i]['from'] = from;
                        legendArray[i]['to'] = to;
                        nameProp && (legendArray[i]['name'] = fromText + ' - ' + toText);
                    }
                }
                return legendArray.reverse();
            }
 
 
            var dpAll = pluginVars.minMaxData.uniqueArray().sort(function(a, b) { return a - b; }),
                clrsLen = colors.length,
                perc = 1 / clrsLen,
                MAP_EST_MIN = dpAll[Math.floor(perc * (dpAll.length - 1))],
                MAP_EST_MAX = dpAll[Math.ceil((1 - perc) * (dpAll.length - 1))],
                incrMinMax = (MAP_EST_MAX - MAP_EST_MIN) / clrsLen,
                incr = 0,
                newIncr = null;
 
 
            if (incrMinMax >= 1000000) { incr = 1000000; } else if (incrMinMax >= 1000) { incr = 1000; } else if (incrMinMax >= 100) { incr = 100; } else if (incrMinMax >= 10) { incr = 10; } else if (incrMinMax >= 5) { incr = 5; } else if (incrMinMax >= 1) { incr = 1; } else if (incrMinMax >= .1) { incr = .1; } else if (incrMinMax >= .05) { incr = .05; } else { incr = .01; }
 
            var minValue = MAP_EST_MIN,
                maxValue = MAP_EST_MAX,
                legendValue = [] /*,aStr = " - "*/ ;
            if (MAP_EST_MIN >= 0) { newIncr = incr; for (i = 0; i < 1000; i++) { if (minValue < newIncr) { minValue = newIncr; break; }
                    newIncr += incr; } } else { newIncr = incr; for (i = 0; i < 1000; i++) { if (minValue > newIncr) { minValue = newIncr; break; }
                    newIncr -= incr; } }
 
            newIncr = incr * 100000;
            for (i = 0; i < 1000000; i++) { if (maxValue > newIncr) { maxValue = newIncr; break; }
                newIncr -= incr; }
 
 
            for (var i = 1; i < clrsLen - 2; i++) { legendValue[clrsLen - 1 - i] = minValue + (i * (maxValue - minValue)) / (clrsLen - 2); }
 
            legendValue[0] = dpAll.max();
            legendValue[1] = maxValue;
            legendValue[clrsLen - 1] = minValue;
            legendValue[clrsLen] = dpAll.min();
 
            //if (legendValue[clrsLen] < 0) {aStr = " < ";}
            var aNumber = options.DECPLACES2;
 
            for (i = 1; i < clrsLen - 1; i++) {
                while (aNumber < 7 && that.roundToPrecision(legendValue[i + 1]) === that.roundToPrecision(legendValue[i])) {
                    aNumber++;
                }
            }
            legendArray = [];
            //do the actual rounding and set the map legend text    
            for (i = 0, j = clrsLen - 1; i < clrsLen; i++, j--) {
                to = Number(legendValue[i]);
                from = Number(legendValue[i + 1]);
                mct = Math.ceil(to);
                mff = Math.floor(from);
                cv = Number(colorValues[j]);
 
                f_t_sep = isNotNumberFormat ? from : that.roundToPrecision(from, true);
                t_t_sep = isNotNumberFormat ? to : that.roundToPrecision(to, true);
 
 
                if (i === 0) { legendArray[i] = { from: from, name: '> ' + f_t_sep }; } else if (i === clrsLen - 1) { legendArray[i] = { to: to, name: '< ' + t_t_sep }; } else { legendArray[i] = { from: from, to: to, name: f_t_sep + ' - ' + t_t_sep }; }
 
 
                if (colorValues.length && colorValues[j]) {
                    if (i === 0 && from <= cv) { legendArray[i]['color'] = colors[j]; } else if (i === clrsLen - 1 && cv <= to) { legendArray[i]['color'] = colors[j]; } else if (mff <= cv && cv <= mct) { legendArray[i]['color'] = colors[j]; }
                }
            }
            return legendArray;
        };
 
 
        /**
         * @Desc Toggle Graph options if the Map Areas having language distributions
         * @param {type} flag
         * @returns {None}
         */
        that.toggleLangGraphOptions = function(flag) {
            plgEl.chartIcons.find('[data-type="bar"],[data-type="line"],[data-type="scatter"],[data-type="column-line"],' +
                    '[data-type="column-mark"],[data-type="stacked-column"],[data-type="multi-line-ind"]')
                .toggleClass('disabled', flag);
            var chtType = that.getChartType(),
                condition = chtType === 'line' || chtType === 'scatter' || chtType === 'multi-line-ind' || chtType === 'stacked-column';
            plgEl.chartIcons.find('.sort-graph-data>a').toggleClass('disabled', condition);
 
        };
 
 
        /**
         * 
         * @param {data} data for creating highmap
         * @returns {None}
         */
        that.renderHighMap = function(data) {
            var $elem = plgEl.mapContainer || [];
            if (!$elem.length) {
                return false;
            }
 
            var dataClass = [],
                colors = [],
                colorValues = [];
            pluginVars.mapLangValues = {}; //,min = 0, max = 100;
 
            // indicators data for all years to get min and max values
            if (pluginVars.minMaxData.length) {
                // get the min and max of data for any indicator
 
                var indArr = [],
                    iMap = that.currentFidProp('m')
 
                // for colors, if exists in data.csv
                if (iMap) {
                    // -- not working from small values => indArr = iMap.match(/\[0x[a-z0-9]{6}\]+\[\d+\]|\[0x[a-z0-9]{6}\]+/ig);
                    indArr = iMap.match(/(\d+=)([^=]+)([^\s+\d+=]+)/ig);
                    //indArr = iMap.match(/\[0x[a-z0-9]{6}\]+\[[+-]?\d+(\.\d+)?\]|\[0x[a-z0-9]{6}\]+/ig);
                }
 
                var flagLang = !0,
                    countBlanks = 0;
                var indLen = (indArr instanceof Array && indArr.length) ? indArr.length : 0;
                for (var i = 0, d11, t11, r11, c11, cob, lth = indLen > pluginVars.lenMapColors ? indLen : pluginVars.lenMapColors; i < lth; i++) {
                    if (indLen) {
                        if (indArr[i]) {
                            //Use this if not works => /\[(.*?)\]/g
                            r11 = indArr[i].match(/\[(.*?)\]/g); // adding \W for other characters
                            //r11 = indArr[i].match(/\[[\w\s+\-_\/\&|(\d|(\d\.\d))]+\]/g);// adding \W for other characters
                            if (r11.length && r11[0]) {
                                d11 = '', t11 = '';
                                c11 = /0x/i.test(r11[0]) && r11[0].replace(/0x/i, '#');
                                r11[1] && (d11 = r11[1].replace(/[\[\]]/ig, ''));
                                r11[2] && (t11 = r11[2].replace(/[\[\]]/ig, ''));
 
 
                                //colorValues.push(d11.replace(/[\[\]]/ig, ''));
                                colors[i] = c11.replace(/[\[\]]/ig, '');
                                cob = { color: colors[i] };
                                if (d11) {
                                    if (/^[0-9\.]+$/.test(d11)) {
                                        cob['value'] = d11;
                                        flagLang = !1;
                                    } else if (/[a-z_-]+/ig.test(d11)) {
                                        cob['text'] = d11;
                                        // check for language
                                        //if(!flagLang){flagLang = !0;}
                                    }
                                } else {
                                    countBlanks++;
                                }
                                if (t11 && /[a-z_-]+/ig.test(t11)) { cob['text'] = t11; }
                                colorValues.push(cob);
                            }
 
                        }
                    } else { // else get the colors from settings.csv
                        flagLang = !1;
                        if (that.settings.hasOwnProperty('MAP-CLR' + i)) {
                            if (/0x/i.test(that.settings['MAP-CLR' + i])) {
                                colors[i] = (that.settings['MAP-CLR' + i].replace(/0x/i, '#'));
                            }
                        }
                    }
                }
 
                var allBlnks = indArr.length === countBlanks; // make it false if no text/value presents
                that.toggleLangGraphOptions(flagLang && !allBlnks);
                if (flagLang && !allBlnks) {
                    that.setChartType(1);
                    that.changeGraphTitle('column');
                    var indLen = (indArr instanceof Array && indArr.length) ? indArr.length : 0;
                    for (var i = 0, r11, lth = indLen > pluginVars.lenMapColors ? indLen : pluginVars.lenMapColors; i < lth; i++) {
                        if (indArr.length && indArr instanceof Array) {
                            if (indArr[i]) {
                                //r11 = indArr[i].match(/\[[\w\s+|(\d|(\d\.\d))]+\]/g);
                                r11 = indArr[i].split('=');
                                if (r11.length && r11[0] != "") {
                                    colorValues[i]['value'] = r11[0];
                                    pluginVars.mapLangValues[r11[0] + ''] = colorValues[i].hasOwnProperty('text') && colorValues[i].text;
                                }
                            }
                        }
                    }
                    colorValues.reverse();
                }
                // colors are showing in revers order in map legend so reverse it before
                // showing in map legend
                colors.reverse();
                colorValues.reverse();
 
                dataClass = that.getPercentile(colors, colorValues, allBlnks, that.currentFidProp('o') === 'noformat').reverse();
            }
 
            // for custom region
            var ldata = [],
                displayLabels;
            if (pluginVars.selectedRegionArea.hasOwnProperty('code3') && pluginVars.selectedRegionArea.code3.length) {
                ldata = $.grep(data, function(key) {
                    return key.hasOwnProperty('indicatorsData') && $.inArray(key.code3, pluginVars.selectedRegionArea.code3) !== -1;
                });
            }
 
            if (options.MAPTXT === '1') { displayLabels = false; } else if (options.MAPTXT === '2') { displayLabels = true; } else { displayLabels = (ldata.length !== 0); }
            var clickDetected = false;
 
            var seriesData = [
                { allAreas: true, mapData: options.mapData, showInLegend: false, name: 'Data' },
 
                {
 
                    name: plgEl.indicatorContainer.find('li a.active .ind-text').text(),
                    //dataLabels: {allowOverlap:options.MAPOVERLAP,enabled:displayLabels,useHTML:false,format:options.MAPTXTL,crop:true},
                    dataLabels: { allowOverlap: options.MAPOVERLAP, enabled: displayLabels, useHTML: false, format: options.MAPTXTL, style: { fontSize: options.MAPFONT + "px" }, crop: true },
                    allAreas: !ldata.length, // depends on ldata length
                    data: ldata.length ? ldata : data,
                    mapData: options.mapData,
                    joinBy: [options.mapJoinCode, 'code3'],
                    allowPointSelect: true,
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function() {
                                if (clickDetected) {
                                    // Managing Double click event, as custom event removing previously added events
                                    this.hasOwnProperty('link') && this.link && window.open(this.link, '_blank');
                                    clickDetected = false;
                                    //return false;
                                } else {
                                    clickDetected = true;
                                    setTimeout(function() {
                                        clickDetected = false;
                                    }, 500);
                                }
                                //console.log(this);
                                //if (this.code3) {
                                //    var rc = plgEl.regionsContainer,dc = rc.find('li a[data-code3="' + this.code3 + '"]').click();
                                //    rc.animate({scrollTop: dc.offset().top - rc.offset().top + rc.scrollTop()}, 200);
                                //}
                                //var chart = that.objSPChart,point = chart.series && chart.series[0].data[this.index];
                                //if (!chart||!point) { return false; }
                                return false;
                            },
                            select: function() {
                                //console.log(this);
                                if (this.code3) {
                                    var rc = plgEl.regionsContainer,
                                        dc = rc.find('li a[data-code3="' + this.code3 + '"]').click();
                                    rc.animate({ scrollTop: dc.offset().top - rc.offset().top + rc.scrollTop() }, 200);
                                }
                                var chart = that.objSPChart,
                                    point = chart.series && chart.series[0].data[this.index];
                                if (!chart || !point) { return false; }
                                return false;
                            },
                            mouseOver: function() {
                                var code3 = this.code3;
                                if (code3) { that.changeIndicatorsProgress(code3); }
                                var chart = that.objSPChart,
                                    //point = chart && chart.series[0] && chart.series[0].hasOwnProperty('data') && chart.series[0].data[this.index];
                                    pdata = chart && chart.series[0] && chart.series[0].hasOwnProperty('data') && chart.series[0].data;
                                // prevent hovering on chart if it line type
                                var chrtTyp = that.getChartType();
                                if (chrtTyp === 'line' || chrtTyp === 'multi-line-ind') {
                                    code3 && that.highLightTimeSeries(code3, 'mouseenter');
                                    return false;
                                }
                                if (pdata && pdata.length) {
                                    for (var i = 0, a = pdata, l = a.length; i < l; i++) {
                                        if (a[i].code3 == code3) {
                                            //console.log(a[i]);
                                            a[i].setState('hover');
                                        }
                                    }
                                    //point = $.grep(data, function (a) {
                                    //    return a.code3 == code3;
                                    //});
                                }
                                //if (!chart||!point) {return false;}
                                //point.length && point[0].setState('hover');
                                //console.log(point);
                                //point.setState('hover');
                            },
                            mouseOut: function() {
                                var code3 = this.code3;
                                this.code3 && that.highLightTimeSeries(this.code3, 'mouseleave');
                                var chart = that.objSPChart,
                                    //point = null,//chart && chart.series[0] && chart.series[0].hasOwnProperty('data') && chart.series[0].data[this.index];
                                    //point = chart && chart.series[0] && chart.series[0].hasOwnProperty('data') && chart.series[0].data[this.index];
                                    pdata = chart && chart.series[0] && chart.series[0].hasOwnProperty('data') && chart.series[0].data;
 
                                if (pdata && pdata.length) {
                                    for (var i = 0, a = pdata, l = a.length; i < l; i++) {
                                        if (a[i].code3 == code3) {
                                            //console.log(a[i])
                                            a[i].setState();
                                        }
                                    }
                                    //point = $.grep(data, function (a) {
                                    //    return a.code3 == code3;
                                    //});
                                }
                                //console.log(point);
                                //if (!chart||!point) {return false;}
                                //point.length && point[0].setState();
                                //point.setState();
                            }
                        }
                    },
                    states: {
                        select: { color: options.selectionColor, borderColor: 'black', dashStyle: 'shortdot' },
                        hover: { color: options.selectionColor }
                    }
                }
            ];
 
            // set the map parameters
            var params = {
                credits: { enabled: false },
                title: {
                    text: options.MAPTITLE ?
                        plgEl.indicatorContainer.find('li a.active.first .ind-text').text() + ' (' + pluginVars.selectedYear + ')' :
                        ''
                },
                subtitle: '',
                chart: {
                    backgroundColor: null,
                    //plotBackgroundImage: 'http://www.highcharts.com/demo/gfx/skies.jpg',
                    events: {
                        load: function() {
                            pluginVars.selectedRegionArea.hasOwnProperty('data') &&
                                $elem.append('<button class="map-reset-button cf cf-icon-enlarge-exit"></button>');
                            if (options.chartBGImageSettings.length && options.chartBGImageSettings[0]) {
                                var co = options.chartBGImageSettings;
                                this.renderer.image(
                                    // default position 0,0 and default size 100x50
                                    co[0],co[1]||0,co[2]||0,co[3]||100,co[4]||50
                                    //'http://www.the-afc.com/media/afc/data/clubs_and_teams/50x50/234.png', 0, 0, 50, 50
                                ).attr({ zIndex: 4 }).css({ position: 'absolute', bottom: 0, right: 0 }).add();                             
                            }
                        }
                    }
                },
                tooltip: {
                    hideDelay: 0,
                    headerFormat: '',
                    footerFormat: '',
                    useHTML: true,
                    pointFormatter: function() {
                        var tooltipRows = '<table style="font-size:' + options.FONT_P_S + 'px"><tr><td colspan="2" align="center" class="bold">' + this.options.name || this.name + '</td></tr>';
                        if (this.indicatorsData) {
                            var tVal, titles, cFId = pluginVars.catFid[pluginVars.currentSubCategoryId],
                                opC;
                            if (this.indicatorsData.length === 1) { // in case of single data indicator
                                cob = cFId['fid'][cFId[pluginVars.selectedIndicatorIndex]]; // check here for errors
                                opC = cob['o'] === 'noformat';
                                tVal = pluginVars.mapLangValues.hasOwnProperty(this.indicatorsData[0]) ? pluginVars.mapLangValues[this.indicatorsData[0]] : (opC ? this.indicatorsData[0] : that.roundToPrecision(this.indicatorsData[0], true));
                                tooltipRows += '<tr class=""><td class="popup-td-lbl">' + cob['t'] + '</td><td class="pl-10">' + (this.indicatorsData[0] === null ? options.NODATA : tVal) + (this.indicatorsData[0] !== null ? cob['u'] : '') + '</td></tr>';
                            } else {
                                var m, mats, cb, u, collang, row;
                                for (var i = 0, d = this.indicatorsData, l = d.length; i < l; i++) {
                                    cb = '';
                                    cob = cFId['fid'][cFId[i]];
                                    if (!cob) { continue; }
                                    u = cob['u'];
                                    titles = cob['t'];
                                    opC = cob['o'] === 'noformat';
                                    tVal = pluginVars.mapLangValues.hasOwnProperty(d[i]) ? pluginVars.mapLangValues[d[i]] : (opC ? d[i] : that.roundToPrecision(d[i], true));
                                    if (pluginVars.selectedIndicatorIndex === i) {
                                        cb = 'bold';
                                    } else {
                                        if (!cFId[i]) { continue; }
                                        m = cob['m'];
                                        mats = m.match(/(\d+=)([^=]+)([^\s+\d+=]+)/ig)
                                        if (mats && mats.length) {
                                            for (var j = 0, lem = mats.length; j < lem; j++) {
                                                r11 = mats[j].split('=');
                                                if (r11[0] + '' === d[i] + '') {
                                                    //collang=mats[j].match(/\[[\w\s+\-_|(\d|(\d\.\d))]+\]/g);
                                                    collang = mats[j].match(/\[(.*?)\]/g);
                                                    collang && collang.length && collang[1] && (tVal = collang[1].replace(/[\[\]]/ig, ''));
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                    row = '<tr class="' + cb + '"><td class="popup-td-lbl">' + (titles || '') + '</td><td class="pl-10">' + (d[i] === null ? options.NODATA : tVal) + (' ' + (d[i] !== null ? u : '') || '') + '</td></tr>'; //added class="popup-td-lbl" 2018 Sept
                                    options.POPUP_M ? tooltipRows += row : cb && (tooltipRows += row);
                                }
                            }
                        }
                        return tooltipRows + '</table>';
                    }
                },
                mapNavigation: {
                    enableMouseWheelZoom: options.MAPWHEEL,
                    enabled: true,
                    enableDoubleClickZoomTo: true,
                    enableDoubleClickZoom: false,
                    buttonOptions: { align: 'left', style: { 'z-index': 10 } },
                    buttons: {
                        // the lower the value, the greater the zoom in
                        zoomIn: { onclick: function() { this.mapZoom(1 / pluginVars.zoomIncr);
 
 
                        } },
                        // the higher the value, the greater the zoom out
                        zoomOut: { onclick: function() { this.mapZoom(pluginVars.zoomIncr); } }
                    }
                },              
                legend: {
                    align: 'left',
                    verticalAlign: 'bottom',
                    floating: true,
                    layout: 'vertical',
                    backgroundColor: (Statplanet.theme && Statplanet.theme.legendBackgroundColor) || 'rgba(255, 255, 255, 0.85)',
                    valueDecimals: 0,
                    symbolRadius: 0,
                    symbolHeight: 14,
                    reversed: true,
                    /*x:100,y:-50,*/
                    itemStyle: { fontSize: options.FONT_S + 'px' }
                },
                colors: colors,
                colorAxis: { dataClassColor: 'category', dataClasses: dataClass || [] },
                series: seriesData,
                //exporting:{buttons:{contextButton:{enabled:false}},fallbackToExportServer: true}
                exporting: { buttons: { contextButton: { enabled: false } }, fallbackToExportServer: true, sourceWidth: plgEl.mapPanel.width(), sourceHeight: plgEl.mapPanel.height(), scale: options.MAPEXPS }
            };
            //console.log(ldata,data,params);
 
            if (pluginVars.selectedRegionArea.hasOwnProperty('data')) {
                var psd = pluginVars.selectedRegionArea.data;
                //console.log(psd);
                if (psd[0] !== "" && psd[1] !== "" && psd[2] !== "" && psd[3] !== "") {
                    $.extend(params, {
                        xAxis: { min: Number(psd[0]), max: Number(psd[1]) },
                        yAxis: { min: Number(psd[2]), max: Number(psd[3]) }
                    });
                }
 
                $elem.off('click', 'button.map-reset-button')
                    .on('click', 'button.map-reset-button', function() {
                        that.objSPMap.xAxis[0].setExtremes(null, null);
                        that.objSPMap.yAxis[0].setExtremes(null, null);
                    });
            }
            that.objSPMap = $elem.empty().statplanet('Map', params).statplanet();
            that.resizeSPMap();
        };
 
        that.resizeSPMap = function() {
            that.objSPMap && that.objSPMap.setSize(plgEl.mapPanel.width(), plgEl.mapPanel.height(), false);
            var spbt = plgEl.mapContainer.find('.statplanet-button:eq(1)');
            if (spbt) {
                plgEl.mapContainer.find('button.map-reset-button').offset({ top: spbt.offset().top + spbt.get(0).getBBox().height - 1 });
            }
        };
 
 
        that.currentFidProp = function(type) {
            if (pluginVars.currentSubCategoryId && pluginVars.catFid.hasOwnProperty(pluginVars.currentSubCategoryId)) {
                return that.getIndProp(pluginVars.catFid[pluginVars.currentSubCategoryId][pluginVars.selectedIndicatorIndex], type ? type : 'all');
            }
            return null;
        }
 
        /**
         * 
         * @param {data} data data having the code,name, value and indicatorsData array to show in chart
         * @param {categoryData} categoryData for creating line chart
         * @param eventType type of chart or event like slider-changed
         * @returns {None} creating chart
         */
        that.renderStatPlanet = function(data, categoryData, eventType) {
            var chartType = that.getChartType(),
                newYearRange = [],
                d = [],
                tooltipArrayBody = [],
                seriesData = [];
 
            if (pluginVars.minMaxData.length === 0) {
                that.getMinMaxData(data);
            }
            var dataXMin = null,
                dataXMax = null,
                paxis = pluginVars.yAxisValues,
                ccid = pluginVars.currentSubCategoryId,
                dataMin = null,
                dataMax = null,
                zIndicatorFlag = false,
                spColor = options.chartColor; /*selectionColor;*/
 
            if (chartType == 'bar' || chartType == 'column' || chartType == 'scatter' || chartType == 'column-line' || chartType == 'column-mark' || (chartType == 'line' && options['LINE-W'] === '0')) { // dot plot
                var curProp = that.currentFidProp('gs');
                !curProp && (curProp = that.getIndProp(pluginVars.columnLineData.firstFId, 'gs'));
                if (curProp) {
                    curProp = that.parseQueryString(curProp);
                    console.log(curProp);
                    dataMin = curProp.hasOwnProperty('mn') ? Number(curProp.mn) : null;
                    dataMax = curProp.hasOwnProperty('mx') ? Number(curProp.mx) : null;
                    (chartType !== 'column-line' && chartType !== 'column-mark') && (spColor = curProp.hasOwnProperty('c') ? curProp.c : options.selectionColor);
                }
            }
 
 
            if (paxis.hasOwnProperty(ccid)) {
                si = pluginVars.selectedIndicatorIndex;
                if (paxis[ccid][si] && paxis[ccid][si].hasOwnProperty('dataMin')) {
                    dataMin = paxis[ccid][si].dataMin;
                    dataMax = paxis[ccid][si].dataMax;
                }
            }
 
 
 
            var newDa = [],
                totalLang;
            if (!$.isEmptyObject(pluginVars.mapLangValues)) {
                var av;
                $.each(pluginVars.mapLangValues, function(i, lang) {
                    //d =[];
                    totalLang = 0, o = [];
                    $.each(data, function(ind, a) {
                        av = (a['value'] !== null && a['value'] !== '') ? Number(a['value']) : '';
                        //flag=false;
                        if (pluginVars.mapLangValues.hasOwnProperty(av + '') && pluginVars.mapLangValues[av + ''] == lang &&
                            (plgEl.regionsContainer.find('li').length && plgEl.regionsContainer.find('[data-code3="' + a['code3'] + '"]').length) // hack for custom regions
                        ) {
                            totalLang++;
                            o.push(a['name']);
                        }
 
                    });
                    newDa.push([lang, totalLang]);
                    tooltipArrayBody.push('<div style="font-size:' + options.FONT_P_S + 'px" >' +
                        '<div class="bold">' + lang + '</div><div class="popup-languages">' + o.join(', ') + '</div></div>');
                });
            }
            o = that.chartTooltipSeriesData(chartType, data, dataMin, dataMax);
            d = o.d, zIndicatorFlag = o.z;
            dataXMin = o.dataXMin, dataXMax = o.dataXMax;
                
            if (dataMin === null && chartType === 'scatter' && pluginVars.minMaxData.min() >= 0) {
                dataMin = 0; // to prevent negative area for bubble chart
            }
            var minSize = 3,
                maxSize = 45;
            //if (!zIndicatorFlag) {minSize = 5, maxSize = 5;}
            if (!zIndicatorFlag) { minSize = options['DOT-S2'];
                maxSize = options['DOT-S2']; }
 
 
            var tickInt = null; //#60758-pt2
            if (dataMin && dataMax) {
                if (dataMax - dataMin > 20 && dataMax - dataMin < 100) {
                    tickInt = 5;
                }
            }
            var yAxisData = {
                crosshair: true,
                tickInterval: tickInt /*#60758-pt2 dataMin > 0 ? dataMin : null*/ ,
                min: dataMin,
                max: dataMax,
                title: {
                    text: chartType === 'scatter' ? that.getIndProp(pluginVars.bubbleData.ySPFID, 't') : null
                },
                labels: {
                    style: { textOverflow: chartType === 'bar' ? 'none' : 'ellipsis' }, // preventing ... from x axis values
                    enabled: true,
                    events: {
                        click: function() {
                            that.changeAxisLabelValues(this, pluginVars.currentSubCategoryId, pluginVars.selectedIndicatorIndex, data, categoryData, eventType, 'y');
                        }
                    }
 
                }
            };
 
            // for adjust size on clicking on y-axis or x-axis
            that.objSPChart = new Statplanet.Chart({
                chart: {
                    renderTo: plgEl.chartContainer[0],                  
                },                               
            });
  
        };
 
        that.stackedColumnChartData = function(dataMin, dataMax) { 
            return { newYearRange: newYearRange, seriesData: seriesData, titles: titles, tpa: tpa };
        };
 
 
        that.multiLineIndicatorChart = function(dataMin, dataMax) {

        };
        that.getLineChartData = function(categoryData, dataMin, dataMax) {
        };
 
        that.getLineDataFromIndicatorData = function(params) {
        };
 
 
        that.chartTooltipSeriesData = function(chartType, data, dataMin, dataMax) {
            var zIndicatorFlag = false,
                tooltipBody = [],
                d = [],
                dataXMin = null,
                dataXMax = null;
            //cached for loop performance
            var xdataCondition = isArray(pluginVars.bubbleData.xSPData) && pluginVars.bubbleData.xSPData.length && chartType === 'scatter',
                zdataCondition = isArray(pluginVars.bubbleData.zSPData) && pluginVars.bubbleData.zSPData.length && chartType === 'scatter',
                xall = that.getIndProp(pluginVars.bubbleData.xSPFID, 'all'),
                xtitle = xall.hasOwnProperty('t') ? xall['t'] : '',
                xunit = xall.hasOwnProperty('u') ? xall['u'] : '',
                xOpC = xall.hasOwnProperty('o') ? xall['o'] === 'noformat' : !1,
                yall = that.getIndProp(pluginVars.bubbleData.ySPFID, 'all'),
                ytitle = yall.hasOwnProperty('t') ? yall['t'] : '',
                yunit = yall.hasOwnProperty('u') ? yall['u'] : '',
                yOpC = yall.hasOwnProperty('o') ? yall['o'] === 'noformat' : !1,
                ztitle = '',
                zunit = '',
                zall, zOpC = false;
            if (!xtitle) {
                xtitle = plgEl.bottomXCategoryMenu.find('.li-selected-category>a').text();
            }
            
            var dataXMn = null,
                dataXMx = null;
            
 
            // make the bubble x data as empty for new sizes
            pluginVars.bubbleData.bubbleXArray = [];
            $(data).each(function() {
                var code3 = this.code3,
                    v, obj, sxi, xtest, xv;
                // only if the code3 is available in data
                if (pluginVars.selectedRegionArea.hasOwnProperty('code3')) {
                    if (code3) {
                        var flag = false,
                            psc = pluginVars.selectedRegionArea.code3;
                        for (var j = 0, l = psc.length; j < l; j++) {
                            // don't use === as it may required to compare number == string like "1" == 1
                            if (code3 == psc[j]) { flag = true; break; }
                        }
                        if (!flag) { return true; }
                    }
                }
                if (this.hasOwnProperty("indicatorsData")) {
                    v = Number(this.value);
                    if (dataMin !== null && dataMax !== null) {
                        if (v > dataMax || v < dataMin) {
                            return true;
                        }
                    }
                    obj = { id: code3, y: this.value || null, name: this.name, indData: this.indicatorsData, code3: code3 || this[options.mapJoinCode] };
                    if (xdataCondition) {
                        var pxaxis = pluginVars.xAxisValues,
                            xccid = pluginVars.bubbleData.xSPId;
 
 
                        if (pxaxis.hasOwnProperty(xccid)) {
                            sxi = pluginVars.bubbleData.xSPCatIndex;
                            if (pxaxis[xccid][sxi] && pxaxis[xccid][sxi].hasOwnProperty('dataMin')) {
                                dataXMin = pxaxis[xccid][sxi].dataMin;
                                dataXMax = pxaxis[xccid][sxi].dataMax;
                            }
                        }
                        xtest = $.grep(pluginVars.bubbleData.xSPData, function(n) {
                            return n.code3 === code3;
                        });
                        if (xtest.length && xtest[0] && xtest[0].hasOwnProperty('value') &&
                            xtest[0].value !== null) {
                            xv = Number(xtest[0].value);
 
                            // adding null check condition,
                            // before adding the code, it was not working for scatter plot
                            if (dataXMn !== null && dataXMx !== null) {
                                if ((!isNaN(dataXMn) && xv < dataXMn) || (!isNaN(dataXMx) && xv > dataXMx)) {
                                    return true;
                                }
                            }
 
                            if (dataXMin !== null) {
                                if (xv > dataXMax || xv < dataXMin) {
                                    return true;
                                }
                            }
                            obj['x'] = xv;
                            pluginVars.bubbleData.bubbleXArray.push(xv);
                        } else {
                            obj['x'] = null;
                        }
                    }
            
                    if ((!isArray(pluginVars.bubbleData.zSPData) || !pluginVars.bubbleData.zSPData.length) && chartType === 'scatter') {
                        obj['z'] = options.bubbleSize;
                    } else if (zdataCondition) {
                        var ztest = $.grep(pluginVars.bubbleData.zSPData, function(n) {
                            return n.code3 === code3;
                        });
                        if (ztest.length && ztest[0] && ztest[0].hasOwnProperty('value')) {
                            obj['z'] = ztest[0].value;
                            zIndicatorFlag = true;
                        } else {
                            obj['z'] = options.bubbleSize;
                        }
                    }
 
                    var doflag = false;
                    null != obj.y && obj.y && (d.push(obj), doflag = !0);
                    var t = '<table class="tbl-' + chartType + '" style="font-size:' + options.FONT_P_S + 'px"><tr><td colspan="2" align="center" class="bold">' + this.name + '</td></tr>';
                    
                        if (this.indicatorsData) {
                            var cFId = pluginVars.catFid[pluginVars.currentSubCategoryId],
                                opC = false,
                                cob = null;
                            if (this.indicatorsData.length === 1) { // in case of single data indicator
                                cob = cFId['fid'][cFId[pluginVars.selectedIndicatorIndex]]; // check here for errors
                                opC = cob['o'] === 'noformat';
                                t += '<tr class=""><td class="popup-td-lbl">' + cob['t'] + '</td><td>' + (this.indicatorsData[0] === null ? options.NODATA : (opC ? this.indicatorsData[0] : that.roundToPrecision(this.indicatorsData[0], true))) + (d[i] !== null ? cob['u'] : '') + '</td></tr>';
                            } else {
                                for (var i = 0, cb, u, row, id = this.indicatorsData, l = id.length; i < l; i++) {
                                    cb = pluginVars.selectedIndicatorIndex === i ? 'bold' : '';
                                    cob = cFId['fid'][cFId[i]];
                                    u = cob['u'];
                                    opC = cob['o'] === 'noformat';
                                    row = '<tr class="' + cb + '"><td class="popup-td-lbl">' + cob['t'] + '</td><td>' + (id[i] === null ? options.NODATA : (opC ? id[i] : that.roundToPrecision(id[i], true))) + (id[i] !== null ? cob['u'] : '') + '</td></tr>';
                                    options.POPUP_M ? t += row : cb && (t += row);
                                }
                            }
                        }
                    
                    doflag === !0 && tooltipBody.push(t + "</table>");
                }
            });
            return { t: tooltipBody, z: zIndicatorFlag, d: d, dataXMin: dataXMin, dataXMax: dataXMax };
        };
 
 
        /**
         * @desc Modify series and creating tooltip data for column and mark chart
         * @param {type} seriesData
         * @param {type} categoryData
         * @returns {Object of series and tooltip}
         */
        that.getColumnMarkData = function(seriesData, categoryData) {
        };
 
        that.getChartSeriesData = function(newYearRange) {
        };
 
        /**
         * @desc check the color is dark or not
         * @param {type} hex
         * @returns {Boolean}
         */
        that.isDarkColor = function(hex) {
            var rgb = parseInt(hex.substring(1), 16), // strip # and convert rrggbb to decimal
                r = (rgb >> 16) & 0xff, // extract red
                g = (rgb >> 8) & 0xff, // extract green
                b = (rgb >> 0) & 0xff, // extract blue
                luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
            return luma < 150 && luma > 100;
        };
 
        /**
         * 
         * @param {type} ths    this object
         * @param {type} ccid   current category id
         * @param {type} si selected indicator index
         * @param {type} data data to be rendered
         * @param {type} categoryData   all category data
         * @param {type} eventType which event is triggered
         * @param {type} axisType x or y
         * @returns {None}
         */
        that.changeAxisLabelValues = function(ths, ccid, si, data, categoryData, eventType, axisType) {

        };
 
        that._trigger_print = function(type) {
            var cp;
            var opw = window.open('about:blank', '_blank', 'width=1000,height=660,resizable=1,scrollbars=1');
 
            opw.document.write('<html><head><title>Print ' + type + '</title>' + options.printStyle + '</head><body"></body></html>');
            $(opw.document.body).html('<h1>' + plgEl.indicatorContainer.find('a.active.first .ind-text').text() + '</h1>');
 
            if (type === 'graph') {
                cp = that.objSPChart.getSVG({ chart: { width: 920 } });
                //cp=plgEl.chartContainer.clone(true);
            } else {
                cp = plgEl.mapContainer.clone(true);
                cp.find('g.statplanet-button,button.map-reset-button,.statplanet-title').hide();
            }
 
            var $div = $("<div/>").html('<h1>' + plgEl.indicatorContainer.find('a.active.first .ind-text').text() + '</h1>')
                .append($('<div style="width:100%;"/>').append(cp));
 
            if (plgEl.storyPanel.is(':visible')) {
                $div.append($('<div style="margin-top:20px" />').append(plgEl.storyPanel.find('.story-panel-content').clone()));
            }
            opw.document.body.innerHTML = $div[0].outerHTML;
            opw.document.close();
            opw.focus();
            opw.print();
            opw.close();
        };
 
        that.printChartMap = function(self, type, e) {
            var isMapVis = plgEl.mapPanel.is(':visible'),
                isGraphVis = plgEl.graphPanel.is(':visible');
            if (type === 'parent') {
                //plgEl.graphSettings.css('z-index', 2);
                if ((isMapVis && isGraphVis)) {
                    //return true;
                } else if (!isMapVis && !isGraphVis) {
                    e.stopPropagation();
                } else if (isMapVis || isGraphVis) {
                    $(self).closest('.print-chart-map').find('ul.dropdown-menu').hide();
                    that._trigger_print(isMapVis ? 'map' : 'graph');
                    e.stopPropagation();
                }
            } else {
                $(self).closest('.print-chart-map').find('ul.dropdown-menu').hide();
                that._trigger_print(type);
            }
            $(self).next('ul.dropdown-menu').length && $(self).next('ul.dropdown-menu').toggle();
        };
 
 
 
        /**
         * 
         * @param {type} data
         * @returns {Settings}
         */
        that.settingsTxtToJson = function(data) {
 
            data = data.replace(new RegExp(String.fromCharCode(65533), 'g'), '')
                .replace(new RegExp(String.fromCharCode(0), 'g'), "");
            var lines = data.split("\r\n"),
                result = [],
                settings = { regions: [], settings: {} }, // adding custom variables
                settingKey = 'regions', // by default key is regions
                settingsFlag = localVars.settingsISONames.length === 0;
            for (var i = 1, lineCounter = 1, lenLines = lines.length; i < lenLines; i++) {
                var obj = {},
                    row = lines[i].split("\t"),
                    queryIdx = 0,
                    idx = 0;
                if ($.trim(row) === '') { continue; }
                var flagSubCategory = false;
                while (idx < row.length) {
 
                    var value = $.trim(row[idx]).replace(/^"(.*)"$/, '$1');
 
                    obj[queryIdx] = $.trim(value);
                    value = obj[queryIdx];
 
                    if (value && $.trim(value.toUpperCase()) === 'SETTINGS') {
                        settingKey = 'settings';
                    }
                    if (value && $.trim(value.toUpperCase()) === 'NAMES') {
                        settingKey = 'names';
                    }
 
                    if (settingKey === 'regions') {
                        if (obj[0]) {
                            if (queryIdx === 0) {
                                if (that.getCategoryLevel($.trim(obj[0])) === 0) {
                                    settings.regions[i] = { title: obj[0], data: [], code3: [], subregions: [] };
                                    lineCounter = i;
                                } else {
                                    // currently it is working for first level only
                                    sr = settings.regions[lineCounter] && settings.regions[lineCounter].subregions;
                                    if (sr) {
                                        sr.push({ title: that.getCleanTitle(obj[0]), data: [], code3: [] });
                                    }
                                    flagSubCategory = true;
                                }
 
                            } else {
                                sr = settings.regions[lineCounter] && settings.regions[lineCounter].subregions;
                                if (queryIdx > 6) {
                                    if (value) {
                                        if (flagSubCategory) {
                                            sr[sr.length - 1].code3.push(value);
                                        } else {
                                            settings.regions[i].code3.push(value);
                                        }
                                    }
                                } else {
                                    if (flagSubCategory) {
                                        sr[sr.length - 1].data.push(value);
                                    } else {
                                        settings.regions[i] && settings.regions[i].data.push(value);
                                    }
                                }
                            }
                        }
                    } else if (settingKey === 'settings') {
                        if (queryIdx === 1) {
                            settings.settings[obj[0]] = $.trim(value);
                        }
                    }
                    queryIdx++;
                    ++idx;
                }
                if (settingsFlag && settingKey === 'names' && !/names/i.test(obj[0])) {
                    localVars.settingsISONames.push({ name: obj[0], link: obj[1] });
                }
                result.push(obj);
            }
            return settings;
 
        };
 
        /**
         * @desc Converting CSV Data to Json
         * @param data
         * @returns Json String
         */
        that.settingsCsvToJson = function(data) {
 
            var lines = data.replace('/\r\n|\n\r|\n|\r/g', "\n").split("\n"),
                result = [],
                settings = { regions: [], settings: {} }, // adding custom variables
                settingKey = 'regions'; // by default key is regions
 
            settingsFlag = localVars.settingsISONames.length === 0;
 
            for (var i = 1, lineCounter = 1, lenLines = lines.length; i < lenLines; i++) {
                var obj = {},
                    row = lines[i],
                    queryIdx = 0,
                    startValueIdx = 0,
                    idx = 0;
                if ($.trim(row) === '') { continue; }
                var flagSubCategory = false;
                while (idx < row.length) {
                    /* if we meet a double quote we skip until the next one */
                    var c = row[idx];
                    if (c === '"') {
                        do {
                            c = row[++idx];
                        } while (c !== '"' && idx < row.length - 1);
                    }
                    if (c === ',' || /* handle end of line with no comma */ idx === row.length - 1) {
                        /* we've got a value */
                        var value = $.trim(row.substr(startValueIdx, idx - startValueIdx));
                        /* skip first double quote */
                        if (value[0] === '"') {
                            value = value.substr(1);
                        }
                        /* skip last comma */
                        if (value[value.length - 1] === ',') {
                            value = value.substr(0, value.length - 1);
                        }
                        /* skip last double quote */
                        if (value[value.length - 1] === '"') {
                            value = value.substr(0, value.length - 1);
                        }
                        obj[queryIdx] = $.trim(value);
                        value = obj[queryIdx];
 
                        if (value && $.trim(value.toUpperCase()) === 'SETTINGS') {
                            settingKey = 'settings';
                        }
                        if (value && $.trim(value.toUpperCase()) === 'NAMES') {
                            settingKey = 'names';
                        }
 
                        if (settingKey === 'regions') {
                            if (obj[0]) {
                                if (queryIdx === 0) {
                                    if (that.getCategoryLevel($.trim(obj[0])) === 0) {
                                        settings.regions[i] = { title: obj[0], data: [], code3: [], subregions: [] };
                                        lineCounter = i;
                                    } else {
                                        // currently it is working for first level only
                                        sr = settings.regions[lineCounter] && settings.regions[lineCounter].subregions;
                                        if (sr) {
                                            sr.push({ title: that.getCleanTitle(obj[0]), data: [], code3: [] });
                                        }
                                        flagSubCategory = true;
                                    }
 
                                } else {
                                    sr = settings.regions[lineCounter] && settings.regions[lineCounter].subregions;
                                    if (queryIdx > 6) {
                                        if (value) {
                                            if (flagSubCategory) {
                                                sr[sr.length - 1].code3.push(value);
                                            } else {
                                                settings.regions[i].code3.push(value);
                                            }
                                        }
                                    } else {
                                        if (flagSubCategory) {
                                            sr[sr.length - 1].data.push(value);
                                        } else {
                                            settings.regions[i] && settings.regions[i].data.push(value);
                                        }
                                    }
                                }
                            }
                        } else if (settingKey === 'settings') {
                            if (queryIdx === 1) {
                                settings.settings[obj[0]] = $.trim(value);
                            }
                        }
                        queryIdx++;
                        startValueIdx = idx + 1;
                    }
                    ++idx;
                }
 
                if (settingsFlag && settingKey === 'names' && !/names/i.test(obj[0])) {
                    localVars.settingsISONames.push({ name: obj[0], link: obj[1] })
                }
                result.push(obj);
            }
            return settings;
        };
 
 
        /**
         * 
         * @param {type} data
         * @returns {Array|@this;.dataTxtToJson.result}
         */
 
        that.dataTxtToJson = function(data, isDynamicFile) {
            // removing extra white space from text, issue came in firefox detecting ISO-8859-1 encoding
            data = data.replace(new RegExp(String.fromCharCode(65533), 'g'), '')
                .replace(new RegExp(String.fromCharCode(0), 'g'), "");
            // adding \r\n (in place of \n) for last column to read and carriage return
            var lines = data.replace(/\r\n|\n\r|\n/g, "\n").split("\n"),
                result = [],
                headers = lines[0].split("\t", -1),
                catObj = null,
                catDataObj = {};
            if (0 === localVars.dataISO.length)
                for (var i = 11, h = headers, l = h.length; i < l; i++) localVars.dataISO.push(h[i]);
 
 
            for (var i = 1, lineLen = lines.length; i < lineLen; i++) {
                var obj = {};
                catDataObj = {};
                var row = lines[i],
                    queryIdx = 0;
                if ($.trim(row) === '') { continue; }
 
                var currentline = lines[i].split("\t", -1);
                for (var j = 0; j < headers.length; j++) {
 
                    var value = $.trim(currentline[j]).replace(/^"(.*)"$/, '$1'),
                        key = headers[queryIdx++].replace(/^"(.*)"$/, '$1');
                    if (key === 'CATEGORY' && value !== '' && (that.getCategoryLevel(value) === 0 || isDynamicFile)) {
                        if (catObj) { result.push(catObj); }
                        catObj = { title: value, data: [] };
                    }
                    if (catObj && catObj.data) { catDataObj[key] = value; }
                    obj[key] = value;
                }
                if (catObj && catObj.data && catDataObj) {
                    catObj.data.push(catDataObj);
                }
            }
            if (catObj) {
                result.push(catObj);
            }
            return result;
        };
 
        /**
         * @desc Converting CSV Data to Json
         * @param data
         * @param isDynamicFile
         * @returns Json String
         */
        that.dataCsvToJson = function(data, isDynamicFile) {
            var lines = data.replace('/\r\n|\n\r|\n|\r/g', "\n").split("\n"),
                result = [],
                headers = lines[0].split(","),
                catObj = null,
                catDataObj = {};
 
            if (0 === localVars.dataISO.length)
                for (var i = 11, h = headers, l = h.length; i < l; i++) localVars.dataISO.push(h[i]);
 
            for (var i = 1; i < lines.length; i++) {
                var obj = {},
                    row = lines[i],
                    queryIdx = 0,
                    startValueIdx = 0,
                    idx = 0;
                if ($.trim(row) === '') { continue; }
 
                catDataObj = {};
                while (idx < row.length) {
                    /* if we meet a double quote we skip until the next one */
                    var c = row[idx];
                    if (c === '"') {
                        do { c = row[++idx]; } while (c !== '"' && idx < row.length - 1);
                    }
                    if (c === ',' || /* handle end of line with no comma */ idx === row.length - 1) {
                        var value = $.trim(row.substr(startValueIdx, idx - startValueIdx)); /* we've got a value */
                        '"' === value[0] && (value = value.substr(1)), /* skip first double quote */
                            "," === value[value.length - 1] && (value = value.substr(0, value.length - 1)), /* skip last comma */
                            '"' === value[value.length - 1] && (value = value.substr(0, value.length - 1)); /* skip last double quote */
 
                        var key = headers[queryIdx++];
 
 
                        if (key === 'CATEGORY' && value !== '' && (that.getCategoryLevel(value) === 0 || isDynamicFile)) {
                            if (catObj) { result.push(catObj); }
                            catObj = { title: value, data: [] };
                        }
 
                        if (catObj && catObj.data) { catDataObj[key] = value; }
                        obj[key] = value;
                        startValueIdx = idx + 1;
                    }
                    ++idx;
                }
                if (catObj && catObj.data && catDataObj) {
                    catObj.data.push(catDataObj);
                }
            }
            if (catObj) {
                result.push(catObj);
            }
            return result;
        };
 

        that.getChartType = function() {
            var a = plgEl.chartIcons.find('.icon-chart.active');
            return a.length ? a.data('type') : plgEl.chartIcons.find('.icon-chart:first').addClass('active').data('type');
        };
 
        /**
         * @Desc Set chart by index
         * @param {type} index
         * @returns {Array|@this;.setChartType.a|Boolean}
         */
        that.setChartType = function(index) {
            
        };
 
        /**
         * @desc Getting the level of category by using >
         * @param {cat} cat is category
         * @returns {Number|@this;.getCategoryLevel.level}
         */
        that.getCategoryLevel = function(cat) {
            var level = 0,
                delim = options.delimeter || '>';
            if (cat.charAt(0) === delim) { while (cat.charAt(0) === delim) { cat = cat.substr(1);
                    level++; } }
            return level;
        };
 
        /**
         * @desc function to get property of an indicator from its id
         * @param {type} id
         * @param {type} prop
         * @returns {pluginVars@arr;@arr;indObj|@this;.getIndProp.t|String}
         */
        that.getIndProp = function(id, prop) {
            var t = '',
                ind = [];
            if (id && prop) {
                $.each(pluginVars.catFid, function() {
                    if (this['fid'].hasOwnProperty(id.toString())) { // cast for numeric ids
                        ind = this['fid'][id.toString()];
                        return false;
                    }
                });
                if (ind) { if (prop == 'all') { return ind; } else { ind.hasOwnProperty(prop) && ind[prop] && (t = ind[prop]); } }
                ind && ind.hasOwnProperty(prop) && ind[prop];
            }!id && !t && prop == 't' && (t = 'Add new indicator');
            return t;
        };
 
        if (options.mapDataFile) {
            $.getScript(options.mapDataFile).done(function() {
                options.mapData = eval(options.tempMapData);
                that.init();
            }).fail(function() {
                that.error(101);
                // adding for map file not found error
                //document.write("Error: the map file <b>" + options.mapDataFile + "</b> could not be found.");
                document.write("Error: invalid map ID or map location (<b>" + options.mapDataFile + "</b>).");
            });
        } else {
            pluginVars.disableMap = true;
            that.init();
        }
 
        $(document).keyup(function(e) {
            if ((e.keyCode || e.which) === 27 && that.child.hasClass('full-screen-mode')) { // escape key maps to keycode `27`
                that.child.find('.app-full-screen').trigger('click');
            }
        }).on('click', function(e) {
            // hiding the menu on clicking outside the list or input box
            if (pluginVars.listSearch) {
                if ($(e.target).closest('.fuzite-search').length === 0 &&
                    that.child.find('.fuzzite-ind-list-ul').is(':visible')) {
                    that.child.find('.fuzzite-ind-list-ul').hide();
                } else if ($(e.target).hasClass('inpt-fuzite-search') && that.child.find('.fuzzite-ind-list-ul').not(':visible')) {
                    that.child.find('.fuzzite-ind-list-ul').show();
                }
            }
        });
        return this; // for using chaining of objects        
    };
})(jQuery, Statplanet, window);