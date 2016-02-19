	x.cache( 'Array', function( Type ) {
		var PROTO = Type.prototype;

		def( Type, 'coerce', function( a, i, j ) {
			if ( !( 'length' in Object( a ) ) ) return [a];
			i = !isNaN( i ) ? i > 0 ? i : 0 : 0;
			j = !isNaN( j ) ? j > i ? j : j <= 0 ? a.length + j : i + j : a.length;
			return slice.call( a, i, j );
		}, 'w' );

		defs( PROTO, {
			find : function( fn, ctx ) {
				var i = -1, l = this.length >>> 0;
				ctx || ( ctx = this );
				while ( ++i < l ) if ( !!fn.call( ctx, this[i], i, this ) ) return this[i];
				return null;
			},
			invoke    : function( fn ) {
				var args = Type.coerce( arguments, 1 );
				return PROTO.map.call( this, function( item ) {
					return item && typeof item[fn] == 'function' ? item[fn].apply( item, args ) : UNDEF;
				} );
			},
			pluck     : function( key, existing_only ) {
				existing_only = existing_only === true;
				return PROTO.reduce.call( this, function( val, item ) {
					var v = Object.value( item, key );

					( existing_only && !exists( v ) ) || val.push( v );

					return val;
				}, [] );
			}
		}, 'w' );
	} );

	x.cache( 'Boolean', function( Type ) {
		def( Type, 'coerce', function( item ) {
			switch( type( item ) ) {
				case 'boolean' : return item;
				case 'nan'     : case false    : return false;
				case 'number'  : case 'string' : return !( item in force ? !force[item] : Number( item ) === 0 );
			}
			return true;
		}, 'w' );
	} );

	x.cache( 'Function', function( Type ) {
		function anon( name ) { return !name || name in anon_list; }
		function toString()   { return this.toString(); }
		function valueOf()    { return this; }

		var __xname__ = '__xname__',
			anon_list = { Anonymous : true, anonymous : true },
			desc      = { mimic : function( fn, name ) {
				var fn_val = fn.valueOf(); // in case fn is a mimicked Function, we'll want to mimic the original
				defs( this, {
					displayName : ( name || fname( fn_val ) ),
					toString    : toString.bind( fn_val ),
					valueOf     : valueOf.bind( fn_val )
				}, 'c', true );
				return this;
			} };

		desc[__name__] = { get : function() {
			if ( !this[__xname__] ) {
				var fn     = this.valueOf(), // if this function is mimicking another, get the mimicked function
// handles anonymous functions which are mimicking (see mimic below) named functions
					name_m = fn !== this ? !anon( fn[__name__] ) ? fn[__name__] : null : null,
					name   = name_m || fname( this );
				!anon( name ) || anon( this.displayName ) || ( name = this.displayName );
				 def( this, __xname__, ( name || 'anonymous' ), 'w' );
			}
			return this[__xname__];
		} };

		defs( Type.prototype, desc, 'w' );
// allows us to better try and get a functions name, you can add to this list if you like
		def( Type, 'anon_list', { value : anon_list }, 'w' );

	} );

	x.cache( 'Object', function( Type ) {
// this is a special case which does not use __lib__.describe
// since it internally uses __type__ which is about to be set up here.
		def( Type.prototype, __type__, copy( { get : function() {
			var _type_, item = this, ctor = item.constructor, ntype = nativeType( item ),
				dtype = dom_type( ntype, item ) || ( re_global.test( ntype ) ? 'global' : false );

			if ( dtype ) return dtype;
			if ( ntype == 'number' ) return isNaN( item ) ? 'nan' : 'number';

			if ( ntype == 'object' && typeof ctor == 'function' ) {
				if ( ctor[__type__] != 'function' ) {
					_type_ = String( ctor[__name__] ).toLowerCase();
					return !_type_ || _type_ == 'anonymous' ? ctor[__type__]  || ntype : _type_;
				}
			}

			return ntype;
		} }, modes.r ) );

		def( Type.prototype, '__proto__', {
			get : function() {
				return proto( this );
			} // todo: set, or would it be anti-spec/overkill???
		}, 'c' );

		defs( Type, {
			key    : function( item, val ) {
				return Type.keys( Type( item ) ).find( function( key ) {
					return item[key] === val;
				} );
			},
			reduce : function( item, fn, val ) {
				return Type.keys( Type( item ) ).reduce( function( res, key, i ) {
					res = fn.call( item, res, item[key], key, item, i );
					return res;
				}, val );
			},
			value  : function( item, key )  {
				if ( !exists( item ) ) return UNDEF;

				if ( key in item ) return item[key];

				if ( isNaN( +key ) ) {
					if ( !!~key.indexOf( '.' ) ) {
						var val; key = key.split( '.' );
						while ( val = key.shift() )
							if ( ( item = Type.value( item, val ) ) === UNDEF )
								break;
						return item;
					}
				}

				return item[key] !== UNDEF
					 ? item[key]                : typeof item.get          == 'function'
					 ? item.get( key )          : typeof item.getAttribute == 'function'
					 ? item.getAttribute( key ) : UNDEF;
			},
			values : function( item ) { return Type.keys( Object( item ) ).map( function( key ) { return item[key]; } ); }
		}, 'w' );
	} );
