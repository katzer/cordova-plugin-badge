// instance methods
	util.defs( Type.prototype, {
		adjust       : adjust,              between            : between,              clearTime               : clearTime,
		clone        : clone,               diff               : diff,                 format                  : format,
		getDayOfYear : getDayOfYear,        getFirstOfTheMonth : getFirstOfTheMonth,   getGMTOffset            : getGMTOffset,
		getISODay    : getISODay,           getISODaysInYear   : getISODaysInYear,     getISOFirstMondayOfYear : getISOFirstMondayOfYear,
		getISOWeek   : getISOWeek,          getISOWeeksInYear  : getISOWeeksInYear,    getLastOfTheMonth       : getLastOfTheMonth,
		getWeek      : getWeek,             isDST              : isDST,                isLeapYear              : isLeapYear,
		lexicalize   : lexicalize,          setWeek            : setWeek,              timezone                : timezone,
		valid        : function() { return Type.valid( this ); }
	}, 'r' );

// static methods & properties
	util.defs( Type, {
// constants used by Date.prototype.adjust
		DAY          : DAY,                 HOUR               : 'hr',                 MINUTE                  : MINUTE.substring( 0, 3 ),
		MILLISECOND  : MILLISECOND,         MONTH              : MONTH,                SECOND                  : SECOND.substring( 0, 3 ),
		WEEK         : WEEK,                YEAR               : YEAR,
// constants defining milliseconds for different times
		MS_DAY       : MS_DAY,              MS_HOUR            : MS_HOUR,              MS_MINUTE               : MS_MINUTE, MS_MONTH : MS_MONTH,
		MS_SECOND    : MS_SECOND,           MS_WEEK            : MS_WEEK,              MS_YEAR                 : MS_YEAR,
// filters and formats
		lexicon      : { value : lexicon }, time_map           : { value : time_map }, time_props              : { value : time_props },
// static methods
		coerce       : coerce,              diffKeys           : diff_keys,            localize                : localize,
		toDate       : coerce,              valid              : valid
	}, 'r' );
