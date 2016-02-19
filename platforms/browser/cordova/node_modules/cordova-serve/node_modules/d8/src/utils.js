// utility methods
	function _indexOf( o, k ) { var i = o.indexOf( k ); return i == -1 ? null : i; }
	function _lc( o ) { return o.toLocaleLowerCase(); }
	function _uc( o ) { return o.toLocaleUpperCase(); }
	function associate( o, k ) { return o.reduce( function( res, v, i ) { res[k[i]] = v; return res; }, {} ); }
	function between_equalto( v, l, h ) { return l <= v && v <= h; }
	function pad( o, len, radix ) {
		var i = -1, s = o.toString( radix || 10 );
		len -= s.length;
		while ( ++i < len ) s = '0' + s;
		return s;
	}
	function sum( v, i ) { return v + i; }
