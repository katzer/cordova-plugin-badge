;!function( root, Name, PACKAGE ) {
	"use strict";



/*~  src/vars.js  ~*/

// if ENV === commonjs we want root to be global
	typeof global == 'undefined' ? root : ( root = global );

	var __name__  = '__name__', __type__ = '__type__', __xid__ = '__xid__',
// it's a best guess as to whether the environment we're in is a browser, commonjs platform (like nodejs) or something else completely
		AMD       = !!( typeof define == 'function' && define.amd ),
		ENV       = typeof module != 'undefined' && 'exports' in module && typeof require == 'function' ? 'commonjs' : typeof navigator != 'undefined' ? 'browser' : 'other',
		OP        = Object.prototype, UNDEF,
// this will be used by the bless method to check if a context root is a commonjs module or not.
// this way we know whether to assign the namespace been blessed to module.exports or not.
		Module    = ENV != 'commonjs' ? null : require( 'module' ),
		force     = [false, NaN, null, true, UNDEF].reduce( function( res, val ) {
			res[String( val )] = val; return res;
		}, obj() ),
		htmcol    = 'htmlcollection', htmdoc = 'htmldocument',
		id_count  = 999, id_prefix = 'anon',
// this is a Map of all the different combinations of permissions for assigning property descriptors using Object.defineProperty
		modes     = function() {
			var mode_combos = { ce : 'ec', cw : 'wc', ew : 'we', cew : 'cwe ecw ewc wce wec'.split( ' ' ) },
				prop_keys   = 'configurable enumerable writable'.split( ' ' ),
				prop_vals   = {
					c   : [true,  false, false], ce : [true,  true,  false],
					cew : [true,  true,  true],  cw : [true,  false, true],
					e   : [false, true,  false], ew : [false, true,  true],
					r   : [false, false, false], w  : [false, false, true]
				},
				modes       = Object.keys( prop_vals ).reduce( function( res, key ) {
					function assign( prop_val ) { res[prop_val] = res[key]; }

					var combo = mode_combos[key];

					res[key] = prop_keys.reduce( function( val, prop_key, i ) {
						val[prop_key] = prop_vals[key][i];
						return val;
					}, obj() );

					!combo || ( Array.isArray( combo ) ? combo.forEach( assign ) : assign( combo ) );

					return res;
				}, obj() );
			delete modes[UNDEF];
			return modes;
		}(), // pre-caching common types for faster checks
		ntypes_common = 'Array Boolean Date Function Number Object RegExp String Null Undefined'.split( ' ' ),
		ntype_cache   = ntypes_common.reduce( function( cache, type ) {
			cache['[object ' + type + ']'] = type.toLowerCase();
			return cache;
		}, obj() ),
		randy         = Math.random, re_global = /global|window/i,
		re_gsub       =  /\$?\{([^\}'"]+)\}/g,            re_guid   = /[xy]/g,     re_lib    = new RegExp( '^\\u005E?' + Name ),
		re_name       = /[\s\(]*function([^\(]+).*/,      //re_vendor = /^[Ww]ebkit|[Mm]oz|O|[Mm]s|[Kk]html(.*)$/,
/** opera has been purposefully left out for the following reasons:
  * whose stupid decision was it to make dragonfly not work unless you have an internet connection!?
  * the previous point is so seriously retarded it needs to be mentioned again, here.
  * the opera prefix `O` screws with [object Object] I don't like it, so it's gonski...
**/
		re_tostr      = /^\[object (?:[Ww]eb[Kk]it|[Mm]oz|[Mm]s|[Kk]html){0,1}([^\]]+)\]$/,
		slice         = Array.prototype.slice,            tpl_guid  = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx',
		xcache        = ntypes_common.slice( 0, -2 ).reduce( function( cache, type ) {
			cache[type] = [];
			return cache;
		}, obj() );



/*~  src/lib.js  ~*/

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



/*~  src/lib.x.js  ~*/

// Commonjs Modules 1.1.1: http://wiki.commonjs.org/wiki/Modules/1.1.1
// notes section:          http://wiki.commonjs.org/wiki/Modules/ProposalForNativeExtension
// specifies the possibility of sandboxing JavaScript Natives in Modules in future versions
// this should future proof this all up in your mother's fudge!
	function x() {
		slice.call( arguments ).forEach( x_update );
		return __lib__;
	}

	def( x, 'cache', function( type, extender ) {
		typeof type == 'string' || ( type = type[__name__] || fname( type ) );
		xcache[type] || ( xcache[type] = [] );
		xcache[type].push( extender );
		return __lib__;
	}, 'w' );

	function x_extend( extend_type ) { extend_type( this, __lib__ ); }

	function x_update( Type ) {
		got( Type, __xid__ ) || def( Type, __xid__, 0, 'w' );       // Type.__xid__ will be updated, everytime a Type is
		var extenders = xcache[Type[__name__] || fname( Type )];    // extended. This means unsandboxed environments will
		if ( !extenders ) return;                                   // not have to suffer repeated attempts to assign
		extenders.slice( Type[__xid__] ).forEach( x_extend, Type ); // methods and properties which have already being
		Type[__xid__] = extenders.length;                           // assigned every time __lib__.x() is called, and
	}                                                               // potentilly throwing overwrite errors.



/*~  src/nativex.js  ~*/

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



/*~  src/expose.js  ~*/

	iter( PACKAGE ) || ( PACKAGE = ENV == 'commonjs' ? module : root );

	defs( ( __lib__ = expose( __lib__, Name, PACKAGE ) ), {
	// properties
		AMD        : AMD,               ENV         : ENV,
		global     : { value : root  }, modes       : { value : modes },
	// methods
		bless      : bless,             coerce      : coerce,
		copy       : copy,              cpdef       : cpdef,
		def        : def,               defs        : defs,            define : define_amd,
		describe   : describe,          description : description,
		empty      : empty,             exists      : exists,
		expose     : expose,            format      : format,          got    : prop_exists.bind( null, got ),
		gsub       : gsub,              guid        : guid,            has    : prop_exists.bind( null, has ),
		id         : id,                isObject    : is_plain_object, iter   : iter,
		len        : len,               merge       : merge,
		nativeType : nativeType,        noop        : noop,
		ntype      : nativeType,        obj         : obj,
		proto      : proto,             ptype       : ptype,
		range      : range,             remove      : remove,
		tostr      : tostr,             type        : type,
		update     : update,            valof       : valof,
		x          : x
	}, 'w' );

	x( Object, Array, Boolean, Function );



}( typeof global !== 'undefined' ? global : this, 'm8' );
