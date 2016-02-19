Date.localize( {
	id                  : 'en-US',
	AM                  : 'am',
	PM                  : 'pm',
	days                : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	days_short          : ['Sun',    'Mon',    'Tue',     'Wed',       'Thu',      'Fri', 'Sat'],
	day_count           : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
	lexicon             : {
		DEFAULT         : 'approx',
		a               : 'a',
		about           : 'about',
		ago             : 'ago',
		almost          : 'almost',
		an              : 'an',
		and             : 'and',
		delim           : ', ',
		from_now        : 'from now',
		half            : 'half',
		just_now        : 'just now',
		just_over       : 'just over',
		last            : 'last',
		next            : 'next',
		now             : 'now',
		today           : 'today',
		tomorrow        : 'tomorrow',
		yesterday       : 'yesterday',
		time_units      : [ // the descending order of these is important!
			['year', 'years'], ['month',  'months'],  ['week',   'weeks'], ['day', 'days'],
			['hour', 'hours'], ['minute', 'minutes'], ['second', 'seconds']
		]
	},
	formats             : {
		server_date     : 'Y-m-d',
		server_datetime : 'Y-m-d<T>H:i:sP',
		server_time     : 'H:i:s',
		short_date      : 'm/d/Y',
		short_time      : 'h:ia'
	},
	months              : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	months_short        : ['Jan',     'Feb',      'Mar',   'Apr',   'May', 'Jun',  'Jul',  'Aug',    'Sep',       'Oct',     'Nov',      'Dec'],
	ordinal             : ['th', 'st', 'nd', 'rd', 'th'],
	ordinal_day_count   : [
		[0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365],
		[0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366]
	],
	getOrdinal          : function( d ) {
		return ( d > 3 && d < 21 ) ? Date.locale.ordinal[0] : Date.locale.ordinal[Math.min( d % 10, 4 )];
	},
	isLeapYear          : function( y ) {
		return !!( y && ( ( new Date( y, 1, 29 ) ).getDate() == 29 && ( y % 100 || y % 400 == 0 ) ) );
	},
	setLeapYear         : function( d ) {
		Date.locale.day_count[1] = Date.locale.isLeapYear( d.getFullYear() ) ? 29 : 28;
	}
} );
