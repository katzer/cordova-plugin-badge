Date.localize(  {
	id                  : 'GR',
	AM                  : 'πμ',
	PM                  : 'μμ',
	days                : ['Κυριακή', 'Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο'],
	days_short          : ['Κυρ',     'Δευ',     'Τρι',   'Τετ',     'Πέμ',    'Παρ',        'Σαβ'],
	day_count           : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
	lexicon             : {
		DEFAULT         : 'approx',
		a               : '',
		about           : 'περίπου',
		ago             : 'πριν',
		almost          : 'σχεδόν',
		an              : '',
		and             : 'και',
		delim           : ', ',
		from_now        : 'από τώρα',
		half            : 'μισή',
		just_now        : 'μόλις τώρα',
		just_over       : 'λίγο περισσότερο', //'λιγο πανω απο',
		last            : 'το περασμένο',
		next            : 'τον επόμενο',
		now             : 'τώρα',
		today           : 'σήμερα',
		tomorrow        : 'αύριο',
		yesterday       : 'εχθές',
		time_units      : [ // the descending order of these is important!
			['χρόνος', 'χρόνια'], ['μήνα', 'μήνες'], ['εβδομάδα',    'εβδομάδες'], ['ημέρα', 'ημέρες'],
			['ώρα',   'ώρες'],   ['λεπτό', 'λεπτά'], ['δευτερόλεπτο', 'δευτερόλεπτα']
		]
	},
	formats             : {
		server_date     : 'Y-m-d',
		server_datetime : 'Y-m-d<T>H:i:sP',
		server_time     : 'H:i:s',
		short_date      : 'd/m/Y',
		short_time      : 'h:ia'
	},
	months              : ['Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος', 'Μάιος', 'Ιούνιος', 'Ιούλιος', 'Αύγουστος', 'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος'],
	months_short        : ['Ιαν',        'Φεβ',         'Μαρ',    'Απρ',      'Μαϊ',   'Ιουν',   'Ιουλ',    'Αυγ',       'Σεπ',        'Οκτ',        'Νοε',      'Δεκ'],
	ordinal             : ['ος', 'η'],
	ordinal_day_count   : [
		[0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365],
		[0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366]
	],
	getOrdinal          : function( d ) {
		return Date.locale.ordinal[d < 11 ? 0 : 1];
	},
	isLeapYear          : function( y ) {
		return !!( y && ( ( new Date( y, 1, 29 ) ).getDate() == 29 && ( y % 100 || y % 400 == 0 ) ) );
	},
	setLeapYear         : function( d ) {
		Date.locale.day_count[1] = Date.locale.isLeapYear( d.getFullYear() ) ? 29 : 28;
	}
} );
