	function lexicalize( now, precision ) {
		if ( !valid( now ) ) {
			if ( valid( new Type( now ) ) )
				now       = new Type( now );
			else {
				precision = now;
				now       = Type.now();
			}
		}

		var LEX = Type.locale.lexicon;

		if ( typeof lexicon[precision = String( precision ).toLowerCase()] != 'function' )
			precision = LEX.DEFAULT;

		return !( +now - +this ) ? LEX.just_now : lexicon[precision].call( LEX, this, now ).replace( re_space, ' ' );
	}

	function lexicalize_approx( parts, diff ) {
		return parts.join( ' ' );
	}

	function lexicalize_exact( parts, diff ) {
		var last = parts.pop();

		return ( parts.length ? parts.join( this.delim ) + ' ' + this.and + ' ' + last : last ) + ' ' + this[diff.tense < 1 ? 'ago' : 'from_now'];
	}

	lexicon.approx = function( date, now ) {
		var	adverb, bal, determiner = this.a,
			diff  = date.diff( now ),
			dkeys = Type.diffKeys( diff ), index, parts, tense,
			tm    = Type.time_map, tu = this.time_units, today, use_noun;

		if ( diff.value < Type.MS_MINUTE )
			return this.just_now;

		switch ( dkeys[0] ) {
			case 'years'   : index       = 0; break;
			case 'months'  : index       = 1; break;
			case 'weeks'   : index       = 2; break;
			case 'days'    : if ( diff.days < 2 ) {
								today    = date.format( 'l' ) === now.format( 'l' );
								use_noun = today || dkeys[1] != 'hours' || diff.hours < 25;
							 }
							 index       = 3; break;
			case 'hours'   : today       = date.format( 'l' ) === now.format( 'l' );
							 use_noun    = diff.hours / 24 >= .75;
							 determiner  = this.an;
							 index       = 4; break;
			case 'minutes' : index       = 5; break;
		}

		bal  = ( diff.value - tm[index][1] * diff[dkeys[0]] ) / tm[index][1];

		if ( use_noun )
			return today ? this.today : diff.tense > 0 ? this.tomorrow : this.yesterday;

		parts = [];
		tense = diff.tense > 0 ? this.from_now : this.ago;

		if ( bal < .1 ) { //noinspection FallthroughInSwitchStatementJS
			switch ( dkeys[0] ) {
				case 'years' : case 'months' : case 'weeks' :
					if ( diff[dkeys[0]] === 1 ) {
						parts.push( ( diff.tense < 1 ? this.last : this.next ), tu[index][0] );
						break;
					} // allow [conditional] fall-through
				default      :
					!bal || parts.push( this.about );
					parts.push( diff[dkeys[0]], tu[index][diff[dkeys[0]] > 1 ? 1 : 0], tense );
			}
		}
		else {
			if ( bal < .74 ) {
				if ( bal < .24 )
					adverb = this.just_over;
				else {
					adverb = ( bal > .24 && bal < .4 ) ? this.almost : this.about;
					parts.push( this.and, this.a, this.half );
				}
			}
			else
				parts.push( this.almost, ( diff[dkeys[0]] + 1 ), tu[index][1], tense );
		}

		if ( adverb ) {
			parts.push( tu[index][diff[dkeys[0]] > 1 || parts.length ? 1 : 0], tense );
			parts.unshift( adverb, diff[dkeys[0]] );
		}

		return typeof this.approx == 'function' ? this.approx.call( this, parts, diff ) : lexicalize_approx.call( this, parts, diff );
	};

	lexicon.exact  = function( date, now ) {
		var diff = date.diff( now ), parts, tu = this.time_units;

		parts = Type.time_map.reduce( function( val, unit, i ) {
			var v = diff[unit[0]];

			!v || !tu[i] || val.push( v + ' ' + tu[i][v > 1 ? 1 : 0] );

			return val;
		}, [] );

		if ( !parts.length )
			return this.just_now;

		return typeof this.exact == 'function' ? this.exact.call( this, parts, diff ) : lexicalize_exact.call( this, parts, diff );
	};
