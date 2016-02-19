	function __lib__( val ) { return val; }

	function bless( ns, ctx ) {
		if ( !Array.isArray( ns ) ) {
			if ( typeof ns == 'string' )
				ns = ns.split( '.' );
			else
				return bless_ctx( ctx );
		}

		if ( re_lib.test( ns[0] ) ) { ctx = __lib__; ns.shift(); }

		if ( !ns.length ) return bless_ctx( ctx );

		ns[0].indexOf( '^' ) || ( ctx || ns[0] == '^' ? ns.shift() : ns[0] = ns[0].substring( 1 ) );
		ctx = bless_ctx( ctx );

		var o; while ( o = ns.shift() ) ctx = ctx[o] || ( ctx[o] = obj() );

		return ctx;
	}
	function bless_ctx( ctx ) {
		return ENV == 'commonjs'
			? ( ctx ? is_mod( ctx ) ? ctx.exports : ctx : module.exports )
			: ctx || root;
	}

	function coerce( item ) {
		var num = Number( item ), str;
		return !isNaN( num ) ? num : ( str = String( item ) ) in force ? force[str] : item;
	}

	function copy( target, source, no_overwrite ) {
		no_overwrite = no_overwrite === true;
		if ( !source ) {
			source = target;
			target = {};
		}

		source = Object( source );

		for ( var key in source )
			if ( OP.hasOwnProperty.call( source, key ) && ( no_overwrite !== true || !OP.hasOwnProperty.call( target, key ) ) )
				target[key] = source[key];
		return target;
	}

	function cpdef( target, source, no_overwrite ) {
		no_overwrite = no_overwrite === true; source || ( source = target, target = obj() );
		return Object.getOwnPropertyNames( source ).reduce( function( o, key ) {
			( no_overwrite && has( o, key ) ) || def( o, key, description( source, key ) );
			return o;
		}, target );
	}

	function def( item, name, desc ) {
		var args    = slice.call( arguments, 3 ),
			defined = name in Object( item ), debug, mode, ntype, overwrite;

		switch ( typeof args[0] ) {
			case 'string'  : mode = modes[args.shift()]; break;
			case 'object'  : mode = args.shift();
				if ( desc === null )
					desc = { value : null };
				break;
			default        :
				 ntype = nativeType( desc );
				 mode  = ntype != 'object' && defined
				 	   ? description( item, name )
				 	   : null;

				if ( !mode )
					mode = ntype == 'function'
				 		 ? modes.cw
				 		 : modes.cew;
		}
		overwrite = args.shift() === true;
		debug     = args.shift() === true;

		if ( defined && !overwrite ) {
			if ( debug ) new Error( Name + '.def cannot overwrite existing property: ' + name + ', in item type: ' + type( item ) + '.' );
		}
		else {
			if ( ntype != 'object' && mode )
				desc = describe( desc, mode );
			if ( desc.get || desc.set )
				delete desc.writable; // <- ARGH!!! see: https://plus.google.com/117400647045355298632/posts/YTX1wMry8M2
			Object.defineProperty( item, name, desc )
		}
		return __lib__;
	}

	function define_amd( path, deps, mod ) {
		if ( !AMD ) return;

		if ( Array.isArray( deps ) ) {
			mod  = deps;
			deps = [];
		}

		define( path, deps, function() { return mod; } );

		return __lib__;
	}

	function defs( item, props, mode, overwrite, debug ) {
		mode || ( mode = 'cw' );
		for ( var key in props )
			!has( props, key ) || def( item, key, props[key], mode, overwrite, debug );
		return __lib__;
	}

	function describe( desc, mode ) {
		return copy( ( nativeType( desc ) == 'object' ? desc : { value : desc } ), ( nativeType( mode ) == 'object' ? mode : modes[String( mode ).toLowerCase()] || modes.cew ), true );
	}
	function description( item, property ) {
		return Object.getOwnPropertyDescriptor( item, property );
	}

	function empty( item ) { return !exists( item ) || ( !len( item ) && iter( item ) ) || false; }
	function exists( item ) { return !( item === null || item === UNDEF || ( typeof item == 'number' && isNaN( item ) ) ); }

	function expose( lib, name, mod ) {
		if ( typeof name != 'string' && lib[__name__] ) {
			mod  = name;
			name = lib[__name__];
		}

		var conflict, defaults = obj();                            // make sure the exposed library has a type
		defaults[__name__] = name; defaults[__type__] = 'library'; // of "library" and its name attached to it.

		if ( ENV == 'commonjs' && is_mod( mod ) )
			mod.exports = lib;
		else {
			mod || ( mod = root );

			if ( ( conflict = mod[name] ) && iter( conflict ) ) {
				conflict[name] = lib;
				lib            = cpdef( conflict, lib );
			}
			else
				def( mod, name, describe( { value : lib }, 'ew' ) );

 // don't expose as amd if lib is being added to a module that will be exposed
			!AMD || mod !== root || define_amd( name, lib );
		}

		defs( lib, defaults, 'w', true );

		return lib; // return the exposed library, if it already exists this will allow us to re-assign our internal copy
	}

	function fname( fn ) { return fn.name || fn.displayName || ( String( fn ).match( re_name ) || ['', ''] )[1].trim(); }

	function format( str ) { return gsub( str, Array.coerce( arguments, 1 ) ); }

	function got( item, property ) {
		return String( property ) in Object( item );
	}

	function gsub( str, o, pattern ) {
		return String( str ).replace( ( pattern || re_gsub ), function( m, p ) { return o[p] || ''; } );
	}

	// credit for guid goes here: gist.github.com/2295777
	function guid() { return tpl_guid.replace( re_guid, guid_replace ); }
	function guid_replace( match ) {
		var num = ( randy() * 16 ) | 0;
		return ( match == 'x' ? num : ( num & 0x3 | 0x8 ) ).toString( 16 );
	}

	function has( item, property ) {
		return OP.hasOwnProperty.call( Object( item ), String( property ) );
	}

	function id( item, prefix ) { return item ? 'id' in Object( item ) && !empty( item.id ) ? item.id : ( item.id = id_create( prefix ) ) : id_create( prefix ); }
	function id_create( prefix ) { return ( prefix || id_prefix ) + '-' + ( ++id_count ); }

	function is_mod( mod ) {
		if ( Module === null ) return false;
		try { return mod instanceof Module; }
		catch ( e ) { return false; }
	}

	function is_plain_object( item ) {
		if ( item === UNDEF || item === null || typeof item !== 'object' )
			return false;

		var proto = Object.getPrototypeOf( item );

		return !!( proto === null || proto.constructor === Object );
	}

	function iter( item ) { return exists( item ) && ( ( 'length' in Object( item ) ) || typeof item == 'object' ); }

	function len( item ) { return ( 'length' in ( item = Object( item ) ) ? item : Object.keys( item ) ).length; }

	function merge( target, source ) {
		if ( source === UNDEF ) {
			if ( target === UNDEF ) // todo: test
				return  target;

			if ( Array.isArray( target ) )
				return  target.reduce( merge_array, [] );

			else if ( is_plain_object( target ) )
				return  Object.keys( target ).reduce( merge_object, {
							source : target,
							target : {}
						} ).target;

			return target;
		}

		if ( Array.isArray( source ) ) {
			if ( !Array.isArray( target ) )
				target = [];
			else
				target.length = source.length; // remove any extra items on the merged Array

				return source.reduce( merge_array, target );
		}
		else if ( is_plain_object( source ) )
			return  Object.keys( source ).reduce( merge_object, {
						source : source,
						target : is_plain_object( target ) ? target : {}
					} ).target;

		return source;
	}
	function merge_array( target, source, i ) {
		target[i] = merge( target[i], source );
		return target;
	}
	function merge_object( o, key ) {
		o.target[key] = merge( o.target[key], o.source[key] );
		return o;
	}

	function noop() {}

	function obj( props ) {
		var nobj = Object.create( null );
		return typeof props == 'object' ? copy( nobj, props ) : nobj;
	}

	function prop_exists( test, item, property ) {
		var key; property = String( property );

		if ( arguments.length > 3 ) {
			property = slice.call( arguments, 2 );

			while ( key = property.shift() )
				if ( prop_exists( test, item, key ) )
					return true;

			return false;
		}

		if ( test( item, property ) )
			return true;

		if ( typeof item != 'string' && !!~property.indexOf( '.' ) ) {
			property = property.split( '.' );

			while ( key = property.shift() ) {
				if ( !prop_exists( test, item, key ) )
					return false;

				item = item[key];
			}

			return true;
		}

		return false;
	}

	function range( i, j ) {
		return isNaN( i ) ? range_str( i, j ) : range_num( i, j );
	}
	function range_num( i, j ) {
		var a = [i];
		while ( ++i <= j ) a.push( i );
		return a;
	}
	function range_str( i, j ) {
		i = String( i ).charCodeAt( 0 );
		j = String( j ).charCodeAt( 0 );

		var a = [], m = -1, n = Math.abs( i - j ); --i;

		while ( ++m <= n ) a.push( String.fromCharCode( ++i ) );

		return a;
	}

	function remove( item, keys ) {
		keys = Array.isArray( keys ) ? keys : slice.call( arguments, 1 );
		var remove_ = Array.isArray( item ) ? remove_array : remove_object;
		keys.forEach( remove_, item );
		return item;
	}
	function remove_array( val ) {
		var i = this.indexOf( val );
		i = !!~i ? i : !isNaN( val ) && val in this ? val : i;
		i < 0 || this.splice( i, 1 );
	}
	function remove_object( key ) { delete this[key]; }

	function proto( item ) { return Object.getPrototypeOf( item ); }
	function tostr( item ) { return OP.toString.call( item ); }
	function valof( item ) { return OP.valueOf.call( item ); }

// type methods
	function dom_type( dtype, item ) {
		return dtype == htmdoc
			 ? htmdoc : ( dtype == htmcol || dtype == 'nodelist' )
			 ? htmcol : ( !dtype.indexOf( 'htm' ) && ( dtype.lastIndexOf( 'element' ) + 7 === dtype.length ) )
			 ? 'htmlelement' : item === root ? 'global' : false;
	}
//	function get_type( str_type ) { return str_type.split( ' ' )[1].split( ']' )[0].replace( re_vendor, '$1' ).toLowerCase(); }
	function get_type( str_type ) { return str_type.replace( re_tostr, '$1' ).toLowerCase(); }
	function nativeType( item ) {
		var native_type = OP.toString.call( item );

		return native_type in ntype_cache // check the ntype_cache first
			 ? ntype_cache[native_type]
			 : ntype_cache[native_type] = get_type( native_type );
	}
	function ptype( item ) { return nativeType( proto( Object( item ) ) ); }
	function type( item ) {
		if ( item === null || item === UNDEF )
			return false;

		if ( item === root ) return 'global'; // quick fix for android

		var t = __type__ in Object( item )
			  ? item[__type__] : proto( item ) === null
			  ? 'nullobject'   : UNDEF;

		return t;
//		return t !== 'object'
//			 ? t
//			 : ( prop_exists( has, item, 'configurable', 'enumerable', 'writable' ) && has( item, 'value' )
//			 ||  prop_exists( has, item, 'get', 'set' ) )
//			 ? 'descriptor'
//			 : t;
	}

	function update( target, source ) {
		if ( source === UNDEF ) return merge( target );

		if ( target === UNDEF || target === null )
			return merge( source );

		if ( Array.isArray( source ) ) {
			if ( !Array.isArray( target ) )
				return target;

			return source.reduce( update_array, target )
		}
		else if ( is_plain_object( source ) ) {
			if ( !is_plain_object( target ) )
				return target;

			return Object.keys( source ).reduce( update_object, { source : source, target : target } ).target;
	}

		return target;
	}

	function update_array( target, source, i ) {
		target[i] = update( target[i], source );

		return target;
	}

	function update_object( o, key ) {
		o.target[key] = update( o.target[key], o.source[key] );

		return o;
	}
