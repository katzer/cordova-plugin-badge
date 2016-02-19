	function diff( now, props ) { //noinspection FallthroughInSwitchStatementJS
		switch ( util.ntype( now ) ) {
			case 'number' : case 'string' :
				if ( valid( new Type( now ) ) )
					now = new Type( now );
				else {
					if ( !props ) props = now;

					now = Type.now();

					break;
				}                                                  // allow [specific] fall-through
			case 'array'  : case 'object' :
				props   = now;
				now     = Type.now();
				break;
			case 'date'   : if ( valid( new Type( +now ) ) ) break; // allow [conditional] fall-through if not a valid date
			default       : now = Type.now();

		}

		var diff,
			ms    = +now - +this,
			tense = ms < 0 ? 1 : ms > 0 ? -1 : 0;

		if ( !tense ) {
			diff       = util.obj();
			diff.value = 0;
		}
		else
			diff = diff_get( Math.abs( ms ), diff_get_exclusions( props ) );

		diff.tense = tense;

		return diff;
	}

	function diff_eval( diff, calc, i, calcs ) {
		var time;
		if ( diff.__ms__ ) {
			if ( !diff.excl[calc[0]] ) {
				if ( diff.__ms__ >= calc[1] ) {

					time = diff.__ms__ / calc[1];

					if ( !( calc[0] in diff.val ) ) {
						diff.__ms__       = ( time % 1 ) * calc[1];
						diff.val[calc[0]] = Math.floor( time );
					}
					else {
						time                 = Math.floor( time );
						diff.__ms__       -= time * calc[1];
						diff.val[calc[0]] += time;
					}

				}
				return diff;
			}
// round up or down depending on what's available
			if ( ( !calcs[i + 1] || diff.excl[calcs[i + 1][0]] ) && ( calc = calcs[i - 1] ) ) {
				time          = diff.__ms__ / calc[1];
				diff.__ms__ = ( Math.round( time ) * calc[1] ) + ( ( ( diff.__ms__ / calcs[i][1] ) % 1 ) * calcs[i][1] );
				return diff_eval( diff, calc, i - 1, [] );
			}
			return diff;
		}
		return diff;
	}

	function diff_get( ms, excl ) {
		var diff = time_map.reduce( diff_eval, {
				__ms__ : ms, excl : excl, val : util.obj()
			} ).val;

		diff.value = ms;

		return diff;
	}

	function diff_get_exclusions( props ) {
		var excl = util.obj(), incl_remaining = true;

		if ( props ) { //noinspection FallthroughInSwitchStatementJS
			switch ( util.ntype( props ) ) {
				case 'object' : incl_remaining = false; break;
				case 'string' : props          = props.split( ' ' ); // allow fall-through
				case 'array'  : props          = props.reduce( diff_excl, excl );
								incl_remaining = !!util.len( excl );
			}
		}

		time_props.map( function( prop ) {
			if ( !( prop in this ) )
				this[prop] = !incl_remaining;
		}, excl );

		return excl;
	}

	function diff_excl( excl, val ) {
		var prop = ( val = String( val ).toLowerCase() ).substring( 1 );

		switch ( val.charAt( 0 ) ) {
			case '-' : excl[prop] = true;  break;
			case '+' : excl[prop] = false; break;
			case '>' :
				time_map.map( diff_excl_iter, { excl : excl, prop : prop, val : true } );
				break;
			case '<' :
				time_map.slice().reverse().map( diff_excl_iter, { excl : excl, prop : prop, val : false } );
				break;
			default  : excl[val]  = false;
		}

		return excl;
	}

	function diff_excl_iter( calc ) {
		if ( calc[0] === this.prop )
			this.SET_VALID = true;
		if ( this.SET_VALID )
			this.excl[calc[0]] = this.val;
	}

// this ensures a diff's keys are always in descending order of
// number of milliseconds per unit of time, i.e. year, ..., millisecond
	function diff_keys( diff ) {
		diff = util.copy( diff ); util.remove( diff, 'tense', 'value' );
// while this may seem like overkill, only having to run `indexOf` once for each sort item means that
// the overall performance is dramatically improved
		return Object.keys( diff ).map( function( k ) {
			return [time_props.indexOf( k ), k];
		} ).sort( function( a, b ) {
			a = a[0]; b = b[0];
			return a > b ? 1 : -1; // skipping `===` check as we know all indexes are unique
		} ).pluck( 1 );
	}
