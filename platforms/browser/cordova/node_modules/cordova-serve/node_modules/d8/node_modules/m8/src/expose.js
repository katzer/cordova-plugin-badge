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
