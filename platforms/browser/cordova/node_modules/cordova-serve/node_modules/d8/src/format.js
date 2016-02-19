	function buildTemplate( date_format ) {
		var LID = Type.locale.id, fn, i, l, part, parts, re_invalid;

		if ( cache_format[LID][date_format] ) return cache_format[LID][date_format];

		fn         = ['\tvar out=[];'];
		parts      = date_format.replace( re_add_nr, NOREPLACE_RB ).replace( re_add_enr, NOREPLACE_RE ).split( re_split ),
		re_invalid = /^[^A-Za-z]*$/g;
		i = -1;  l = parts.length;

		while( ++i < l ) {
			part = parts[i];
			part == NOREPLACE ? ( fn.push( tplOut( parts[++i] ) ), ++i )
						   :   re_invalid.test( part )
						   ?   fn.push( tplOut( part ) )
						   :   fn.push( compileTplStr( part ) );
		}

		fn.push( 'return out.join( "" );\n\t//@ sourceURL=d8/format/' + LID + '/' + date_format );

		return cache_format[LID][date_format] = new Function( 'filter', 'date', fn.join( '\n\n\t' ) );
	}

	function format( f ) { return buildTemplate( f )( filter, this ); }

	function compileTplStr( o ) { return o.replace( re_compile, function( m, p0, p1, p2 ) { return tplOut( p0 + '\', filter.' + p1 + '( date ), \'' + p2 ); } ); }

	function tplOut( s ) { return 'out.push( \'' + s + '\' );'; }
