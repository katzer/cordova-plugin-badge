	var U,
// DAY_OFFSETS is the amount of days from the current day to the Monday of the week it belongs to
		DAY_OFFSETS  = [9, 1, 0, -1, -2, 4, 3],    MS_DAY       = 864e5,     MS_HOUR = 3600000,   MS_MINUTE = 60000,
		MS_MONTH     = 2592e6, MS_SECOND = 1000,   MS_WEEK      = 6048e5,    MS_YEAR = 31536e6,
// parser keys
		AMPM         = 'ampm', DAY    = 'day',     DAYWEEK      = 'dayweek', DAYYEAR = 'dayyear', HOUR      = 'hour',
		MILLISECOND  = 'ms',   MINUTE = 'minute',  MONTH        = 'month',   SECOND  = 'second',  TIMEZONE  = 'timezone',
		UNIX         = 'unix', WEEK   = 'week',    YEAR         = 'year',
// used by Date.prototype.format && Date.toDate to replace escaped chars
		NOREPLACE    = 'NOREPLACE', NOREPLACE_RB = '<' + NOREPLACE + '<', NOREPLACE_RE = '>END' + NOREPLACE + '>',
		adjust_by    = { day : ['getDate', 'setDate'], hr : ['getHours', 'setHours'], min : ['getMinutes', 'setMinutes'], month : ['getMonth', 'setMonth'], ms : ['getMilliseconds', 'setMilliseconds'], sec : ['getSeconds', 'setSeconds'], week : ['getWeek', 'setWeek'], year : ['getFullYear', 'setFullYear'] },
		adjust_order = [YEAR, MONTH, WEEK, DAY, 'hr', MINUTE.substring( 0, 3 ), SECOND.substring( 0, 3 ), MILLISECOND],
// cache objects
		cache_format = util.obj(), cache_parse  = util.obj(), date_members = [DAY, DAYWEEK, DAYYEAR, MONTH, WEEK, YEAR],
		filter, filter_chars, formats, lexicon  = util.obj(), locales      = util.obj(), m, parser,
		re_ampm     = '(am|pm)',      re_add_enr = />/g,         re_add_nr = /</g, re_compile,
		re_d1_2     = '([0-9]{1,2})', re_d2      = '([0-9]{2})', re_d4     = '([0-9]{4})',
		re_space    = /\s{2,}/g,      re_split   = /[<>]/,       re_tz     = /[^\(]*\(([^\)]+)\)/g,
		re_tz_abbr  = /[^A-Z]+/g,     re_tz_off  = /[\+-]?([0-9]{2}):?([0-9]{2})/,
		time_map     = [              // the order of this Array is important as it is the remainder of the larger
			[YEAR   + 's', MS_YEAR],  // time unit that gets passed to the following time unit — as such we want
			[MONTH  + 's', MS_MONTH], // to keep the order in case we want to exclude time units from the diff
			[WEEK   + 's', MS_WEEK],
			[DAY    + 's', MS_DAY],
			[HOUR   + 's', MS_HOUR],
			[MINUTE + 's', MS_MINUTE],
			[SECOND + 's', MS_SECOND],
			[MILLISECOND,  1]
		],
		time_props   = time_map.pluck( 0 );
