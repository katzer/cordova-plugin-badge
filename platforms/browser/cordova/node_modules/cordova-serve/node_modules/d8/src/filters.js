	function localize_filters( L ) {
		var F = {
// day
			d : function( d ) { return pad( d.getDate(), 2 ); },                       // Day of the month, 2 digits with leading zeros
			D : function( d ) { return L.days[d.getDay()].substring( 0, 3 ); },        // A textual representation of a day, three letters
			j : function( d ) { return d.getDate(); },                                 // Day of the month without leading zeros
			l : function( d ) { return L.days[d.getDay()]; },                          // A full textual representation of the day of the week
			N : function( d ) { return getISODay.call( d ); },                         // ISO-8601 numeric representation of the day of the week
			S : function( d ) { return L.getOrdinal( d.getDate() ); },                 // English ordinal suffix for the day of the month, 2 characters
			w : function( d ) { return d.getDay(); },                                  // Numeric representation of the day of the week
			z : function( d ) { return d.getDayOfYear(); },                            // The day of the year (starting from 0)
// week
			W : function( d ) { return getISOWeek.call( d ); },                        // ISO-8601 week number of year, weeks starting on Monday
// month
			F : function( d ) { return L.months[d.getMonth()]; },                      // A full textual representation of a month
			m : function( d ) { return pad( ( d.getMonth() + 1 ), 2 ); },              // Numeric representation of a month, with leading zeros
			M : function( d ) { return L.months[d.getMonth()].substring( 0, 3 ); },    // A short textual representation of a month, three letters
			n : function( d ) { return d.getMonth() + 1; },                            // Numeric representation of a month, without leading zeros
			t : function( d ) {                                                        // Number of days in the given month
				L.setLeapYear( d );
				return L.day_count[d.getMonth()];
			},
// year
			L : function( d ) { return d.isLeapYear() ? 1 : 0; },                      // Whether it's a leap year
			o : function( d ) {                                                        // ISO-8601 year number. This has the same value as Y, except that if the ISO
				var m = d.getMonth(), w = getISOWeek.call( d );                        // week number (W) belongs to the previous or next year, that year is used instead.
				return ( d.getFullYear() + ( w == 1 && m > 0 ? 1 : ( w >= 52 && m < 11 ? -1 : 0 ) ) );
			},
			Y : function( d ) { return d.getFullYear(); },                             // A full numeric representation of a year, 4 digits
			y : function( d ) { return String( d.getFullYear() ).substring( 2, 4 ); }, // A two digit representation of a year
// time
			a : function( d ) { return _lc( d.getHours() < 12 ? L.AM : L.PM ); },      // Lowercase Ante meridiem and Post meridiem
			A : function( d ) { return _uc( d.getHours() < 12 ? L.AM : L.PM ); },      // Uppercase Ante meridiem and Post meridiem
			g : function( d ) { return d.getHours() % 12 || 12; },                     // 12-hour format of an hour without leading zeros
			G : function( d ) { return d.getHours(); },                                // 24-hour format of an hour without leading zeros
			h : function( d ) { return pad( filter.g( d ), 2 ); },                     // 12-hour format of an hour with leading zeros
			H : function( d ) { return pad( filter.G( d ), 2 ); },                     // 24-hour format of an hour with leading zeros
			i : function( d ) { return pad( d.getMinutes(), 2 ); },                    // Minutes with leading zeros
			s : function( d ) { return pad( d.getSeconds(), 2 ); },                    // Seconds, with leading zeros
			u : function( d ) { return pad( d.getMilliseconds(), 3 ); },               // Milliseconds
// timezone
			O : function( d ) { return getGMTOffset.call( d ); },                      // Difference to Greenwich time (GMT) in hours
			P : function( d ) { return getGMTOffset.call( d, true ); },                // Difference to Greenwich time (GMT) with colon between hours and minutes
			T : function( d ) { return timezone.call( d ); },                          // Timezone abbreviation
			Z : function( d ) { return d.getTimezoneOffset() * -60; },                 // Timezone offset in seconds. The offset for timezones west of UTC
																					   // is always negative, and for those east of UTC is always positive.
// full date/time
			c : function( d ) { return format.call( d, formats.ISO_8601 ); },          // ISO 8601 date
			r : function( d ) { return format.call( d, formats.RFC_2822 ); },          // RFC 2822 formatted date
			U : function( d ) { return d.getTime(); },                                 // Seconds since the Unix Epoch January 1 1970 00:00:00 GMT

// custom
			e : function( d ) { return d.lexicalize( 'exact' );  },                    // these are either self explanatory or you need serious help!
			x : function( d ) { return d.lexicalize( 'approx' ); }                     // t(om )hanks you.
		};

		filter_chars  = Object.keys( F ).sort().join( '' );

		re_compile    = new RegExp( '([^' + filter_chars + ']*)([' + filter_chars + '])([^' + filter_chars + ']*)', 'g' );

		util.def( Type, 'filters', { value : filter = F }, 'w', true );

		return F;
	}
