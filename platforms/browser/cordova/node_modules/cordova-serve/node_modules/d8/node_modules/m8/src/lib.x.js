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
