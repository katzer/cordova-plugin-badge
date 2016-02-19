// private methods
	function _24hrTime( o, res ) { return ( o = Number( o ) ) < 12 && _lc( res.ampm ) == _lc( Type.locale.PM ) ? o += 12 : o; }
	function _adjust( d, v, k ) { return d.adjust( k, v ); }
	function _adjust_toobj( a ) {
		return adjust_order.reduce( function( v, k, i ) {
			var delta = parseFloat( a[i] );

			if ( !isNaN( delta ) && delta !== 0 )
				v[k] = delta;

			return v;
		}, util.obj() );
	}
	function _dayOffset( d ) { return Math.floor( ( d - getISOFirstMondayOfYear.call( d ) ) / MS_DAY ); }
	function _hours( d ) { return d.getHours() + ( d.isDST() ? 1 : 0 ); }
	function _timezoneOffset( o ) {
		if ( o == 'Z' ) {
			o = '0000';
		}
		var t = !!o.indexOf( '-' ),
			m = o.match( re_tz_off ),
			v = ( Number( m[1] ) + ( m[2] / 60 ) ) * 3600;
		return t ? v : -v;
	}
	function _weekOffset( d ) { return Math.floor( Math.abs( _dayOffset( d ) / 7 ) ); }
	function _zeroIndexedInt( o, k ) { return !isNaN( k ) ? k == o ? 0 : Number( k ) : Number( o ) - 1; }

// public methods

	function adjust( o, v ) {
		var date = this, day, fn, weekday;              // noinspection FallthroughInSwitchStatementJS
		switch ( util.ntype( o ) ) {
		case 'number' : o = arguments;                  // allow fall-through
		case 'array'  : o = _adjust_toobj( o );         // allow fall-through
		case 'object' : Object.reduce( o, _adjust, date ); break;
		case 'string' :
			fn = adjust_by[o.toLowerCase()];
			if ( fn && v !== 0 ) {
				Type.locale.setLeapYear( date );

				if ( fn == adjust_by.month ) {
					day = date.getDate();
					day < 28 || date.setDate( Math.min( day, getLastOfTheMonth.call( getFirstOfTheMonth.call( date ).adjust( Type.MONTH, v ) ).getDate() ) );
				}

				fn != adjust_by.week || ( weekday = date.getDay() );

				date[fn[1]]( date[fn[0]]() + v );

				!weekday || date.setDate( date.getDate() + weekday );
			}
		}

		return date;
	}

	function between( l, h ) { return +this >= +l && +this <= +h; }

	function clearTime() {
		this.setHours( 0 ); this.setMinutes( 0 ); this.setSeconds( 0 ); this.setMilliseconds( 0 );
		return this;
	}

	function clone() { return new Type( this.getTime() ); }

	function getDayOfYear() {
		var L = Type.locale;
		L.setLeapYear( this );
		return L.day_count.slice( 0, this.getMonth() ).reduce( sum, 0 ) + this.getDate() - 1;
	}

	function getFirstOfTheMonth() { return new Type( this.getFullYear(), this.getMonth(), 1 ); }

	function getGMTOffset( colon ) {
		var tz = this.getTimezoneOffset();
		return [( tz > 0 ? '-' : '+' ), pad( Math.floor( Math.abs( tz ) / 60 ), 2 ), ( colon ? ':' : '' ), pad( Math.abs( tz % 60 ), 2 )].join( '' );
	}

	function getISODay() { return this.getDay() || 7; }
	function getISODaysInYear() { return Math.ceil( ( getISOFirstMondayOfYear.call( new Type( this.getFullYear() + 1, 0, 1 ) ) - getISOFirstMondayOfYear.call( this ) ) / MS_DAY ); }
	function getISOFirstMondayOfYear() {
		var y = this.getFullYear();
		return new Type( y, 0, DAY_OFFSETS[new Type( y, 0, 1 ).getDay()] );
	}
	function getISOWeek() {
		var w, y = this.getFullYear();
		if ( this >= getISOFirstMondayOfYear.call( new Type( y + 1, 0, 1 ) ) ) return 1;
		w = Math.floor( ( getDayOfYear.call( this ) - getISODay.call( this ) + 10 ) / 7 );
		return w == 0 ? getISOWeeksInYear.call( new Type( y - 1, 0, 1 ) ) - _weekOffset( this ) : w;
	}
	function getISOWeeksInYear() { return Math.round( ( getISOFirstMondayOfYear.call( new Type( this.getFullYear() + 1, 0, 1 ) ) - getISOFirstMondayOfYear.call( this ) ) / MS_WEEK ); }

	function getLastOfTheMonth() {
		var L = Type.locale, m = this.getMonth(); L.setLeapYear( this );
		return new Type( this.getFullYear(), m, L.day_count[m] );
	}

	function getWeek() { return Math.floor( getDayOfYear.call( this ) / 7 ); }

	function isDST() { return new Type( this.getFullYear(), 0, 1 ).getTimezoneOffset() != this.getTimezoneOffset(); }

	function isLeapYear() { return Type.locale.isLeapYear( this.getFullYear() ); }

	function setWeek( v ) { this.setMonth( 0 ); this.setDate( 1 ); return ( this.adjust( Type.DAY, v * 7 ) ).getTime(); }

	function timezone() {
		var s = this.toString().split( ' ' );
		return s.splice( 4, s.length ).join( ' ' ).replace( re_tz, '$1' ).replace( re_tz_abbr, '' );
	}

	function valid( date ) { return util.ntype( date ) == 'date' && !isNaN( +date ); }
