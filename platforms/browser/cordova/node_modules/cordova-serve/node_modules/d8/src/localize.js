	function localize( locale ) { //noinspection FallthroughInSwitchStatementJS
		switch ( util.ntype( locale ) ) {
			case 'object' :
				if ( locale.id ) {
					locales[locale.id] = locale;
					break;
				} // allow [conditional] fall-through
			case 'string' :
				if ( locale in locales ) {
					locale = locales[locale];
					break;
				} // allow [conditional] fall-through
			default       : locale = null;
		}

		if ( util.ntype( locale ) == 'object' ) {
			util.defs( Type, {
				locale      : { value : locale },
				getOrdinal  : locale.getOrdinal,
				isLeapYear  : locale.isLeapYear,
				setLeapYear : locale.setLeapYear
			}, 'w', true );

			if ( !( locale.id in cache_format ) )
				cache_format[locale.id] = util.obj();
			if ( !( locale.id in cache_parse ) )
				cache_parse[locale.id] = util.obj();

			filter  = localize_filters( locale );
			formats = localize_formats( locale );
			parser  = localize_parsers( locale );
		}

		return Type;
	}
