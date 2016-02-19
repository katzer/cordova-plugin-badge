	function localize_parsers( L ) {
		var P = {
		// day
			d : { k  : DAY,         fn : Number,                               re : re_d2 },
			D : { k  : DAYWEEK,     fn : _indexOf.bind( null, L.days_short ),  re : '(' + L.days_short.join( '|' ) + ')' },
			j : { k  : DAY,         fn : Number,                               re : re_d1_2 },
			l : { k  : DAYWEEK,     fn : _indexOf.bind( null, L.days ),        re : '(' + L.days.join( '|' ) + ')' },
			N : { k  : DAYWEEK,     fn : _zeroIndexedInt.bind( null, 7 ),      re : '([1-7])' },
			S : { re : '(?:' + L.ordinal.join( '|' ) + ')' },
			w : { k  : DAYWEEK,     fn : Number,                                re : '([0-6])' },
			z : { k  : DAYYEAR,     fn : Number,                                re : '([0-9]{1,3})' },
		// week
			W : { k  : WEEK,        fn : Number,                                re : re_d2 },
		// month
			F : { k  : MONTH,       fn : _indexOf.bind( null, L.months ),       re : '(' + L.months.join( '|' ) + ')' },
			m : { k  : MONTH,       fn : _zeroIndexedInt,                       re : re_d2 },
			M : { k  : MONTH,       fn : _indexOf.bind( null, L.months_short ), re : '(' + L.months_short.join( '|' ) + ')' },
			n : { k  : MONTH,       fn : _zeroIndexedInt,                       re : re_d1_2 },
			t : { re : '[0-9]{2}' },
		// year
			L : { re : '(?:0|1)' },
			o : { k  : YEAR,        fn : Number,                                re : re_d4 },
			Y : { k  : YEAR,        fn : Number,                                re : re_d4 },
			y : { k  : YEAR,        fn : function( o ) {
										o = Number( o );
										return o += ( o < 30 ? 2000 : 1900 );
									},                                          re : re_d2 },
		// time
			a : { k  : AMPM,        fn : util,                                  re : re_ampm },
			A : { k  : AMPM,        fn : _lc,                                   re : _uc( re_ampm ) },
			g : { k  : HOUR,        fn : _24hrTime,                             re : re_d1_2 },
			G : { k  : HOUR,        fn : Number,                                re : re_d1_2 },
			h : { k  : HOUR,        fn : _24hrTime,                             re : re_d2 },
			H : { k  : HOUR,        fn : Number,                                re : re_d2 },
			i : { k  : MINUTE,      fn : Number,                                re : re_d2 },
			s : { k  : SECOND,      fn : Number,                                re : re_d2 },
			u : { k  : MILLISECOND, fn : Number,                                re : '([0-9]{1,})' },
		// timezone
			O : { k  : TIMEZONE,    fn : _timezoneOffset,                       re : '([\\+-][0-9]{4})' },
			P : { k  : TIMEZONE,    fn : _timezoneOffset,                       re : '([\\+-][0-9]{2}:[0-9]{2})' },
			T : { re : '[A-Z]{1,4}' },
			Z : { k  : TIMEZONE,    fn : _timezoneOffset,                       re : '(Z|[\\+-]?[0-9]{2}:?[0-9]{2})' },
		// full date/time
			U : { k  : UNIX,        fn : Number,                                re : '(-?[0-9]{1,})'  }
		};

		P.c = {
			combo : [P.Y, P.m, P.d, P.H, P.i, P.s, P.u, P.P],
			re    : [P.Y.re, '-', P.m.re, '-', P.d.re, 'T', P.H.re, ':', P.i.re, ':', P.s.re, '(?:\\.', P.u.re, '){0,1}', P.Z.re, '{0,1}'].join( '' )
		};
		P.r = {
			combo : [P.D, P.d, P.M, P.Y, P.H, P.i, P.s, P.O],
			re    : [P.D.re, ', ', P.d.re, ' ', P.M.re, ' ', P.Y.re, ' ', P.H.re, ':', P.i.re, ':', P.s.re, ' ', P.O.re].join( '' )
		};

		util.def( Type, 'parsers', { value : parser = P }, 'w', true );

		return P;
	}
