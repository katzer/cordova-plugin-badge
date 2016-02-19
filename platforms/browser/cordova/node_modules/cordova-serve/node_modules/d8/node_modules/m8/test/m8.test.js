typeof m8   !== 'undefined' || ( m8   = require( '../../m8/m8' ) );
typeof chai !== 'undefined' || ( chai = require( 'chai' ) );

expect = chai.expect;

suite( 'm8', function() {
	test( '<static> m8', function( done ) {
		var expected = { one : 1, three : 3, five : 5 };

		expect( m8( true ) ).to.equal( true );
		expect( m8( expected ) ).to.equal( expected );

		done();
	} );

	test( '<static> m8.bless', function( done ) {
		var expected = { foo : { bar : 'hello' } };

		expect( m8.bless( 'foo.bar' ) ).to.be.an( 'object' );

		if ( m8.ENV == 'commonjs' ) {
			expect( m8.bless( 'foo.bar',   module ) ).to.equal( module.exports.foo.bar );
			module.exports.expected = expected;
			expect( m8.bless( '^.foo.bar', module.exports.expected ) ).to.equal( expected.foo.bar );
		}
		else {
			expect( m8.bless( '^foo.bar', expected ) ).to.equal( expected.bar );
			expect( m8.bless( '^.bar'    ) ).to.equal( m8.global.bar );
		}

		expect( m8.bless( 'foo.bar', expected ) ).to.equal( 'hello' );

		done();
	} );

	test( '<static> m8.coerce', function( done ) {
		expect( m8.coerce( 'false'     ) ).to.equal( false );
		expect( m8.coerce( 'null'      ) ).to.equal( null );
		expect( m8.coerce( 'true'      ) ).to.equal( true );
		expect( m8.coerce( 'undefined' ) ).to.equal( undefined );
		expect( isNaN( m8.coerce( 'NaN' ) ) ).to.equal( true );
		expect( m8.coerce( '1' ) ).to.equal( 1 );
		expect( m8.coerce( '12' ) ).to.equal( 12 );
		expect( m8.coerce( '123' ) ).to.equal( 123 );
		expect( m8.coerce( '123.4' ) ).to.equal( 123.4 );
		expect( m8.coerce( '123.45' ) ).to.equal( 123.45 );
		expect( m8.coerce( '123.456' ) ).to.equal( 123.456 );
		expect( m8.coerce( '1e10' ) ).to.equal( 10000000000 );
		expect( m8.coerce( '.0000000001e10' ) ).to.equal( 1 );

		done();
	} );

	test( '<static> m8.copy', function( done ) {
		var expected = { foo : { bar : 'hello' } };

		expect( m8.copy( {}, expected ) ).to.eql( expected );
		expect( m8.copy( expected, { foo : { bar : 'goodbye' } }, true ) ).to.eql( expected );
		expect( m8.copy( { foo : { bar : 'goodbye' } }, expected ) ).to.eql( expected );

		done();
	} );

	test( '<static> m8.cpdef', function( done ) {
		var source = m8.obj(), target;

		m8.defs( source, {
			bar : {
				get : function() { return 'foo'; },
				set : function( val ) { return this.foo.bar = val; }
			},
			foo : { value : { bar : 'hello' } }
		}, 'r' );

		m8.defs( source, {
			label : 'price',
			value : '1234'
		}, 'e' );

		target = m8.cpdef( source );

		expect( target ).to.eql( source );
		expect( Object.keys( target ).sort() ).to.eql( ['label', 'value'] );
		expect( Object.values( target ).sort() ).to.eql( ['1234', 'price'] );
		expect( target.foo.bar ).to.eql( 'hello' );
		expect( target.bar = 'this' ).to.eql( 'this' );
		expect( target.bar ).to.eql( 'foo' );
		expect( target.foo.bar ).to.eql( 'this' );

		target = m8.cpdef( { bar : 'SHAZAAM!!!' }, source, true );
		expect( target.bar ).to.eql( 'SHAZAAM!!!' );

		done();
	} );

	test( '<static> m8.def', function( done ) {
		var o = {};

		m8.def( o, 'foo', m8.describe( 'bar', 'r' ) );
		m8.def( o, 'bar', m8.describe( { value : { boo : 'baz' } }, 'c' ) );

		expect( o.foo ).to.equal( 'bar' );
		expect( o.bar ).to.eql( { boo : 'baz' } );
		expect( Object.keys( o ) ).to.eql( [] );
		expect( delete o.foo ).to.equal( false );
		expect( delete o.bar ).to.equal( true );

		done();
	} );

	test( '<static> m8.defs', function( done ) {
		var o = {};

		m8.defs( o, {
			foo : 'bar',
			bar : { value : { boo : 'baz' } }
		}, 'c' );

		expect( o.foo ).to.equal( 'bar' );
		expect( o.bar ).to.eql( { boo : 'baz' } );
		expect( Object.keys( o ) ).to.eql( [] );
		expect( delete o.foo ).to.equal( true );
		expect( delete o.bar ).to.equal( true );

		done();
	} );

	test( '<static> m8.describe', function( done ) {
		function getter() {} function setter() {}

		expect( m8.describe( 'foo', 'r' ) ).to.eql( { configurable : false, enumerable : false, value : 'foo', writable : false } );
		expect( m8.describe( { value : 'bar' }, 'cw' ) ).to.eql( { configurable : true, enumerable : false, value : 'bar', writable : true } );
		expect( m8.describe( { get : getter, set : setter }, m8.modes.c ) ).to.eql( { configurable : true, enumerable : false, get : getter, set : setter, writable : false } );
		expect( m8.describe( getter, m8.modes.e ) ).to.eql( { configurable : false, enumerable : true, value : getter, writable : false } );

		done();
	} );

	test( '<static> m8.empty', function( done ) {
		expect( m8.empty( '' ) ).to.equal( true );
		expect( m8.empty( [] ) ).to.equal( true );
		expect( m8.empty( NaN ) ).to.equal( true );
		expect( m8.empty( {} ) ).to.equal( true );
		expect( m8.empty( null ) ).to.equal( true );
		expect( m8.empty( undefined ) ).to.equal( true );
		expect( m8.empty() ).to.equal( true );
		expect( m8.empty( 0 ) ).to.equal( false );
		expect( m8.empty( ' ' ) ).to.equal( false );
		expect( m8.empty( [''] ) ).to.equal( false );
		expect( m8.empty( { foo : '' } ) ).to.equal( false );

		done();
	} );

	test( '<static> m8.exists', function( done ) {
		expect( m8.exists( 0 ) ).to.equal( true );
		expect( m8.exists( false ) ).to.equal( true );
		expect( m8.exists( '' ) ).to.equal( true );
		expect( m8.exists( NaN ) ).to.equal( false );
		expect( m8.exists( null ) ).to.equal( false );
		expect( m8.exists( undefined ) ).to.equal( false );

		done();
	} );

	test( '<static> m8.format', function( done ) {
		expect( m8.format( '{0}, {1}, {2}, {3}, {4}, {5}, {6}, ${7}, ${8}, ${9}', 'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine' ) ).to.deep.equal( 'zero, one, two, three, four, five, six, seven, eight, nine' );
		expect( m8.format( '{ "{0}" : \'{1}\', "${2}" : \'${3}\' }', 'zero', 'one', 'two', 'three' ) ).to.deep.equal( '{ "zero" : \'one\', "two" : \'three\' }' );

		done();
	} );

	test( '<static> m8.got', function( done ) {
		function Test( val ) { this.value = val; } Test.prototype = { foo : 'bar', baz : 'bam' };

		expect( m8.got( { foo : 'bar' }, 'foo' ) ).to.equal( true );
		expect( m8.got( [1, 2, 3], 'length' ) ).to.equal( true );
		expect( m8.got( { foo : 'bar' }, 'bar' ) ).to.equal( false );
		expect( m8.got( { foo : 'bar', baz : 'bam' }, 'foo', 'baz' ) ).to.equal( true );
		expect( m8.got( new Test(), 'foo', 'baz' ) ).to.equal( true );
		expect( m8.got( new Test(), 'baz', 'bam' ) ).to.equal( true );
		expect( m8.got( new Test( 'val' ), 'foo', 'bam', 'val' ) ).to.equal( true );
		expect( m8.got( { foo : { bar : 'baz' } }, 'foo.bar' ) ).to.equal( true );
		expect( m8.got( { foo : { bar : 'baz' } }, 'foo.baz' ) ).to.equal( false );
		expect( m8.got( { foo : { bar : 'baz' }, items : [{ foo : { bar : 'baz' } }] }, 'items.0.foo.bar' ) ).to.equal( true );
		expect( m8.got( { foo : { bar : 'baz' }, items : [{ foo : { bar : 'baz' } }] }, 'zoo', 'goo.bar', 'items.0.foo.bar' ) ).to.equal( true );
		expect( m8.got( { foo : { bar : 'baz' }, items : [{ foo : { bar : 'baz' } }] }, 'items.1.foo.bar' ) ).to.equal( false );
		expect( m8.got( { foo : { bar : 'baz' }, items : [{ foo : { bar : 'baz' } }] }, 'zoo', 'goo.bar', 'items.1.foo.bar' ) ).to.equal( false );

		done();
	} );

	test( '<static> m8.gsub', function( done ) {
		expect( m8.gsub( 'The {one} {two} {three} jumps over the ${four} ${five}.', {
			one   : 'quick', two  : 'brown',
			three : 'fox',   four : 'lazy',
			five  : 'dog'
		} ) ).to.deep.equal( 'The quick brown fox jumps over the lazy dog.' );
		expect( m8.gsub( 'The ===one=== ===two=== ===three=== jumps over the ===four=== ===five===.', {
			one   : 'quick', two  : 'brown',
			three : 'fox',   four : 'lazy',
			five  : 'dog'
		}, /={3}([^=]+)={3}/g ) ).to.deep.equal( 'The quick brown fox jumps over the lazy dog.' );

		done();
	} );

	test( '<static> m8.has', function( done ) {
		function Test( val ) { this.value = val; } Test.prototype = { foo : 'bar', baz : 'bam' };

		expect( m8.has( { foo : 'bar' }, 'foo' ) ).to.equal( true );
		expect( m8.has( [1, 2, 3], 'length' ) ).to.equal( true );
		expect( m8.has( { foo : 'bar' }, 'bar' ) ).to.equal( false );
		expect( m8.has( { foo : 'bar', baz : 'bam' }, 'foo', 'baz' ) ).to.equal( true );
		expect( m8.has( new Test(), 'foo', 'baz' ) ).to.equal( false );
		expect( m8.has( new Test(), 'bar', 'bam' ) ).to.equal( false );
		expect( m8.has( new Test( 'value' ), 'foo', 'bam', 'value' ) ).to.equal( true );
		expect( m8.has( { foo : { bar : 'baz' } }, 'foo.bar' ) ).to.equal( true );
		expect( m8.has( { foo : { bar : 'baz' } }, 'foo.baz' ) ).to.equal( false );
		expect( m8.has( { foo : { bar : 'baz' }, items : [{ foo : { bar : 'baz' } }] }, 'items.0.foo.bar' ) ).to.equal( true );
		expect( m8.has( { foo : { bar : 'baz' }, items : [{ foo : { bar : 'baz' } }] }, 'zoo', 'goo.bar', 'items.0.foo.bar' ) ).to.equal( true );
		expect( m8.has( { foo : { bar : 'baz' }, items : [{ foo : { bar : 'baz' } }] }, 'items.1.foo.bar' ) ).to.equal( false );
		expect( m8.has( { foo : { bar : 'baz' }, items : [{ foo : { bar : 'baz' } }] }, 'zoo', 'goo.bar', 'items.1.foo.bar' ) ).to.equal( false );

		done();
	} );

	test( '<static> m8.id', function( done ) {
		var expected = { id : 'foo' }, empty_obj = {};

		expect( m8.id( expected ) ).to.equal( 'foo' );
		expect( empty_obj.id ).to.equal( undefined );
		expect( m8.id( empty_obj ) ).to.equal( empty_obj.id );
		expect( m8.id( {}, 'foo' ).split( '-' )[0] ).to.equal( 'foo' );

		done();
	} );

	test( '<static> m8.isObject', function( done ) {
		expect( m8.isObject( {} ) ).to.be.true;
		expect( m8.isObject( m8.obj() ) ).to.be.true;
		expect( m8.isObject( Object.create( null ) ) ).to.be.true;
		expect( m8.isObject( Object.create( Object.prototype ) ) ).to.be.true;
		expect( m8.isObject( Object.create( Object.getPrototypeOf( {} ) ) ) ).to.be.true;
		expect( m8.isObject( Object.create( new Object() ) ) ).to.be.true;

		expect( m8.isObject( [] ) ).to.be.false;
		expect( m8.isObject( Object.create( Number.prototype ) ) ).to.be.false;
		expect( m8.isObject( Object.create( Object.getPrototypeOf( Object( true ) ) ) ) ).to.be.false;
		expect( m8.isObject( Object.create( new RegExp( '.*' ) ) ) ).to.be.false;

		done();
	} );

	test( '<static> m8.iter', function( done ) {
		var undef;
		expect( m8.iter( [] ) ).to.equal( true );
		expect( m8.iter( {} ) ).to.equal( true );
		expect( m8.iter( m8.obj() ) ).to.equal( true );
		expect( m8.iter( '' ) ).to.equal( true );
		expect( m8.iter( new Date() ) ).to.equal( true );
		expect( m8.iter( /.*/ ) ).to.equal( true );
		expect( m8.iter( undef ) ).to.equal( false );
		expect( m8.iter( null ) ).to.equal( false );
		expect( m8.iter( 3 ) ).to.equal( false );

		done();
	} );

	test( '<static> m8.len', function( done ) {
		expect( m8.len( { foo : 'bar' } ) ).to.equal( 1 );
		expect( m8.len( ['foo', 'bar'] ) ).to.equal( 2 );

		done();
	} );

	test( '<static> m8.merge', function( done ) {
		var expected = { foo : 'bar', items : [ { value : 1 }, { items : [ { value : 1 }, { items : [ { value : 1 }, { value : 2 }, { value : 3 } ], value : 2 }, { value : 3 } ], value : 2 }, { value : 3 } ] },
			returned = m8.merge( m8.obj(), expected ),
			overwritten = m8.merge( { items : [ { value : '1 2 3' }, { items : m8.range( 1, 100 ) } ] }, expected );

		expect( returned ).to.not.equal( expected );
		expect( returned ).to.eql( expected );
		expect( returned.items ).to.not.equal( expected.items );
		expect( returned.items[1].items[1] ).to.not.equal( expected.items[1].items[1] );

		expect( overwritten.items[0].value ).to.equal( 1 );
		expect( overwritten.items[1].items.length ).to.equal( 3 );
		expect( overwritten.items[1].items ).to.not.equal( expected.items[1].items );
		expect( overwritten.items[2].value ).to.equal( 3 );

		done();
	} );

	test( '<static> m8.nativeType', function( done ) {
		expect( m8.nativeType( null ) ).to.equal( 'null' );
		expect( m8.ntype( undefined ) ).to.equal( 'undefined' );
		expect( m8.nativeType( [] ) ).to.equal( 'array' );
		expect( m8.ntype( true ) ).to.equal( 'boolean' );
		expect( m8.nativeType( new Date() ) ).to.equal( 'date' );
		expect( m8.ntype( function() {} ) ).to.equal( 'function' );
		expect( m8.nativeType( 0 ) ).to.equal( 'number' );
		expect( m8.ntype( NaN ) ).to.equal( 'number' );
		expect( m8.nativeType( { get : function() {} } ) ).to.equal( 'object' );
		expect( m8.ntype( { set : function() {} } ) ).to.equal( 'object' );
		expect( m8.nativeType( m8.describe( 'foo', 'ce' ) ) ).to.equal( 'object' );
		expect( m8.ntype( m8.description( Array.prototype, 'join' ) ) ).to.equal( 'object' );
		expect( m8.nativeType( {} ) ).to.equal( 'object' );
		expect( m8.ntype( Object.create( null ) ) ).to.equal( 'object' );
		expect( m8.nativeType( /.*/ ) ).to.equal( 'regexp' );
		expect( m8.ntype( '' ) ).to.equal( 'string' );

		if ( m8.ENV == 'browser' ) {
		   expect( m8.ntype( document.createElement( 'div' ) ) ).to.equal( 'htmldivelement' );

		   expect( m8.ntype( document.querySelectorAll( 'div' ) ) ).to.match( /htmlcollection|nodelist/ );
		   expect( m8.ntype( document.getElementsByTagName( 'div' ) ) ).to.match( /htmlcollection|nodelist/ );

		   expect( m8.ntype( m8.global ) ).to.match( /global|window/ );
		}

		done();
	} );

	test( '<static> m8.obj', function( done ) {
		var expected = { foo : 'bar', items : [1, 2, 3] }, returned = m8.obj( expected );

		expect( returned ).to.eql( expected );
		expect( m8.type( returned ) ).to.eql( 'nullobject' );
		expect( Object.getPrototypeOf( returned ) ).to.equal( null );
		expect( m8.nativeType( returned ) ).to.equal( 'object' );
		expect( m8.nativeType( returned ) ).to.not.equal( 'nullobject' );
		expect( m8.type( returned ) ).to.not.equal( 'object' );

		done();
	} );

	test( '<static> m8.ptype', function( done ) {
		function Collection() {
			this.push.apply( this, arguments );
			return this;
		}
		m8.defs( Collection.prototype = [], {
			__type__ : 'collection',
			slice    : function() {
				var val = this.__proto__.__proto__.slice.apply( this, arguments );
				return Array.isArray( val ) ? Collection.apply( Object.create( Collection.prototype ), val ) : val;
			},
			splice   : function() {
				var val = this.__proto__.__proto__.splice.apply( this, arguments );
				return Array.isArray( val ) ? Collection.apply( Object.create( Collection.prototype ), val ) : val;
			}
		}, 'cw', true );

		var col    = new Collection( 1, 2, 3, 4, 5 ),
// for any Node `__proto__`:
// - webkit  returns `object` as the type
// - firefox returns `xpc_..._jsclass` something or other
// - msie >=9 returns `html*elementprototype` for HTMLElement;
//                    `htmlcollectionprototype` for HTMLCollection (querySelectorAll);
//                    `nodelistprototype` for NodeList (getElementsByTagName);
//                    `windowprototype` for global/window
// personally I like what MSIE returns the bestest! :D
			re_dom = /object|xpc_.*|(html|node|window).*prototype/;

		expect( m8.ntype( col ) ).to.equal( 'object' );
		expect( m8.ptype( col ) ).to.equal( 'array' );

		expect( m8.ntype( col.slice( 0 ) ) ).to.equal( 'object' );
		expect( m8.ptype( col.slice( 0 ) ) ).to.equal( 'array' );

		expect( m8.ptype( null ) ).to.equal( 'object' );
		expect( m8.ptype( undefined ) ).to.equal( 'object' );
		expect( m8.ptype( [] ) ).to.equal( 'array' );
		expect( m8.ptype( true ) ).to.equal( 'boolean' );
		expect( m8.ptype( new Date() ) ).to.equal( 'date' );
		expect( m8.ptype( function() {} ) ).to.equal( 'function' );
		expect( m8.ptype( 0 ) ).to.equal( 'number' );
		expect( m8.ptype( NaN ) ).to.equal( 'number' );
		expect( m8.ptype( { get : function() {} } ) ).to.equal( 'object' );
		expect( m8.ptype( { set : function() {} } ) ).to.equal( 'object' );
		expect( m8.ptype( m8.describe( 'foo', 'ce' ) ) ).to.equal( 'object' );
		expect( m8.ptype( m8.description( Array.prototype, 'join' ) ) ).to.equal( 'object' );
		expect( m8.ptype( {} ) ).to.equal( 'object' );
		expect( m8.ptype( Object.create( null ) ) ).to.equal( 'null' );
		expect( m8.ptype( /.*/ ) ).to.equal( 'regexp' );
		expect( m8.ptype( '' ) ).to.equal( 'string' );

		if ( m8.ENV == 'browser' ) {
		   expect( m8.ptype( document.createElement( 'div' ) ) ).to.match( re_dom );

		   expect( m8.ptype( document.querySelectorAll( 'div' ) ) ).to.match( re_dom  );
		   expect( m8.ptype( document.getElementsByTagName( 'div' ) ) ).to.match( re_dom  );

		   expect( m8.ptype( m8.global ) ).to.match( re_dom );
		}

		done();
	} );

	test( '<static> m8.range:Number', function( done ) {
		var returned = m8.range( 1, 10 );

		expect( returned ).to.eql( [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] );
		expect( returned ).to.be.an( 'array' );

		done();
	} );

	test( '<static> m8.range:String', function( done ) {
		var returned = m8.range( 'a', 'z' );

		expect( returned ).to.be.an( 'array' );
		expect( returned.join( ' ' ) ).to.eql( 'a b c d e f g h i j k l m n o p q r s t u v w x y z' );

		expect( m8.range( 'A', 'z' ).join( ' ' ) ).to.eql( 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z [ \\ ] ^ _ ` a b c d e f g h i j k l m n o p q r s t u v w x y z' );
		expect( m8.range( 'α', 'ω' ).join( ' ' ) ).to.eql( 'α β γ δ ε ζ η θ ι κ λ μ ν ξ ο π ρ ς σ τ υ φ χ ψ ω' );

		done();
	} );

	test( '<static> m8.remove', function( done ) {
		var expected = { one : 1, three : 3, five : 5 };

		expect( m8.remove( { one : 1, two : 2, three : 3, four : 4, five : 5 }, 'two', 'four' ) ).to.eql( expected );
		expect( m8.remove( { one : 1, two : 2, three : 3, four : 4, five : 5 }, ['two', 'four'] ) ).to.eql( expected );

		done();
	} );

	test( '<static> m8.tostr', function( done ) {
		expect( m8.tostr( {} ) ).to.equal( '[object Object]' );
		expect( m8.tostr( [] ) ).to.equal( '[object Array]' );

		done();
	} );

	test( '<static> m8.type', function( done ) {
		expect( m8.type( null ) ).to.equal( false );
		expect( m8.type( undefined ) ).to.equal( false );
		expect( m8.type( [] ) ).to.equal( 'array' );
		expect( m8.type( true ) ).to.equal( 'boolean' );
		expect( m8.type( new Date() ) ).to.equal( 'date' );
//		expect( m8.type( { get : function() {} } ) ).to.equal( 'descriptor' );
//		expect( m8.type( { set : function() {} } ) ).to.equal( 'descriptor' );
//		expect( m8.type( m8.describe( 'foo', 'ce' ) ) ).to.equal( 'descriptor' );
//		expect( m8.type( m8.description( Array.prototype, 'join' ) ) ).to.equal( 'descriptor' );
		expect( m8.type( function() {} ) ).to.equal( 'function' );
		expect( m8.type( 0 ) ).to.equal( 'number' );
		expect( m8.type( NaN ) ).to.equal( 'nan' );
		expect( m8.type( {} ) ).to.equal( 'object' );
		expect( m8.type( Object.create( null ) ) ).to.equal( 'nullobject' );
		expect( m8.type( /.*/ ) ).to.equal( 'regexp' );
		expect( m8.type( '' ) ).to.equal( 'string' );

		if ( m8.ENV == 'browser' ) {
		   expect( m8.type( document.createElement( 'div' ) ) ).to.equal( 'htmlelement' );

		   expect( m8.type( document.querySelectorAll( 'div' ) ) ).to.equal( 'htmlcollection' );
		   expect( m8.type( document.getElementsByTagName( 'div' ) ) ).to.equal( 'htmlcollection' );

		   expect( m8.type( m8.global ) ).to.equal( 'global' );
		}

		done();
	} );

	test( '<static> m8.update', function( done ) {
		var expected = { foo : 'bar', items : [ { id : 1, value : 1 }, { items : [ { value : 1 }, { items : [ { value : 1 }, { value : 2 }, { value : 3 } ], value : 2 }, { value : 3 } ], value : 2 }, { value : 3 } ] },
			returned = m8.update( m8.obj(), expected ),
			overwritten = m8.update( { foo : 'foo', items : [ { value : '1 2 3' }, { items : [ { id : 0 }, { items : [ { id : 2 } ] }].concat( m8.range( 0, 3 ) ) } ] }, expected );

		expect( returned ).to.not.equal( expected );
		expect( returned ).to.eql( expected );
		expect( returned.items ).to.not.equal( expected.items );
		expect( returned.items[1].items[1] ).to.not.equal( expected.items[1].items[1] );

		expect( overwritten.foo ).to.equal( 'foo' );
		expect( overwritten.items[1].items.length ).to.equal( 6 );
		expect( overwritten.items[0].id ).to.equal( 1 );
		expect( overwritten.items[0].value ).to.equal( '1 2 3' );
		expect( overwritten.items[0] ).to.not.equal( expected.items[0] );
		expect( overwritten.items[1].items[0].id ).to.equal( 0 );
		expect( overwritten.items[1].items[0].value ).to.equal( 1 );
		expect( overwritten.items[1].items[1].items.length ).to.equal( 3 );
		expect( overwritten.items[1].items[1].items[0].id ).to.equal( 2 );
		expect( overwritten.items[1].items[1].items[0].value ).to.equal( 1 );
		expect( overwritten.items[1].items[1].items.length ).to.not.equal( expected.items[1].items[1].items );

		done();
	} );

	test( 'Object.prototype.__proto__', function( done ) {
		function Collection() {
			this.push.apply( this, arguments );
			return this;
		}
		m8.defs( Collection.prototype = [], {
			__type__ : 'collection',
			slice    : function() {
				var val = this.__proto__.__proto__.slice.apply( this, arguments );
				return Array.isArray( val ) ? Collection.apply( Object.create( Collection.prototype ), val ) : val;
			},
			splice   : function() {
				var val = this.__proto__.__proto__.splice.apply( this, arguments );
				return Array.isArray( val ) ? Collection.apply( Object.create( Collection.prototype ), val ) : val;
			}
		}, 'cw', true );

		var col = new Collection( 1, 2, 3, 4, 5 );
		expect( m8.type( col.slice( 0 ) ) ).to.equal( 'collection' );
		expect( col.slice( 1, 3 ).length ).to.equal( 2 );
		expect( col.length ).to.equal( 5 );
		expect( m8.type( col.__proto__ ) ).to.equal( 'collection' );
		expect( m8.type( col.__proto__.__proto__ ) ).to.equal( 'array' );

		done();
	} );

	test( '<static> Array.coerce returns an Array based on the passed item', function( done ) {
		expect( Array.coerce( [1, 2, 3] ) ).to.eql( [1, 2, 3] );
		expect( Array.coerce( { foo : 'bar' } ) ).to.eql( [{ foo : 'bar' }] );
		expect( Array.coerce( function() { return arguments; }( 1, 2, 3 ) ) ).to.eql( [1, 2, 3] );

		done();
	} );

	test( 'Array.prototype.find', function( done ) {
		expect( m8.range( 1, 5 ).find( function( v ) { return v == 3; } ) ).to.deep.equal( 3 );
		expect( m8.range( 1, 5 ).find( function( v ) { return v == 6; } ) ).to.equal( null );

		done();
	} );

	test( 'Array.prototype.invoke', function( done ) {
		expect( m8.range( 1, 5 ).invoke( 'toFixed', 2 ) ).to.deep.equal( ['1.00', '2.00', '3.00', '4.00', '5.00'] );
		expect( m8.range( 1, 7 ).invoke( 'toString', 2 ) ).to.deep.equal( ['1', '10', '11', '100', '101', '110', '111'] );

		done();
	} );

	test( 'Array.prototype.pluck', function( done ) {
		expect( [
			{ 'one' : 1, 'two' : 2, 'three' : 3 },
			{ 'one' : 1, 'two' : 2, 'three' : 3 },
			{ 'one' : 1, 'two' : 2, 'three' : 3 }
		].pluck( 'two' ) ).to.deep.equal( [2, 2, 2] );
		expect( [
			{ 'one' : 1,         'two' : 2, 'three' : 3 },
			{ 'one' : undefined, 'two' : 2, 'three' : 3 },
			{ 'one' : 1,         'two' : 2, 'three' : 3 },
			{ 'one' : null,      'two' : 2, 'three' : 3 },
			{ 'one' : 1,         'two' : 2, 'three' : 3 }
		].pluck( 'one', true ) ).to.deep.equal( [1, 1, 1] );
		expect( m8.range( 1, 10 ).map( function( o, i ) {
			return { src : { val : i } };
		} ).pluck( 'src.val' ) ).to.deep.equal( m8.range( 0, 9 ) );
		expect( m8.range( 1, 10 ).map( function( o, i ) {
			return { src : { val : { id : i % 2 ? i : null } } };
		} ).pluck( 'src.val.id', true ) ).to.deep.equal( [1, 3, 5, 7, 9] );

		done();
	} );

	test( '<static> Boolean.coerce: returns true for true like Strings', function( done ) {
		expect( Boolean.coerce( true ) ).to.equal( true );
		expect( Boolean.coerce( 'true' ) ).to.equal( true );
		expect( Boolean.coerce( 1 ) ).to.equal( true );
		expect( Boolean.coerce( '1' ) ).to.equal( true );
		expect( Boolean.coerce( 'some random string of text' ) ).to.equal( true );
		expect( Boolean.coerce( -1 ) ).to.equal( true );

		done();

	} );

	test( '<static> Boolean.coerce: returns false for false like Strings', function( done ) {
		expect( Boolean.coerce( false ) ).to.equal( false );     expect( Boolean.coerce( 'false' ) ).to.equal( false );
		expect( Boolean.coerce( 0 ) ).to.equal( false );         expect( Boolean.coerce( '0' ) ).to.equal( false );
		expect( Boolean.coerce( NaN ) ).to.equal( false );       expect( Boolean.coerce( 'NaN' ) ).to.equal( false );
		expect( Boolean.coerce( null ) ).to.equal( false );      expect( Boolean.coerce( 'null' ) ).to.equal( false );
		expect( Boolean.coerce( undefined ) ).to.equal( false ); expect( Boolean.coerce( 'undefined' ) ).to.equal( false );
		expect( Boolean.coerce() ).to.equal( false );            expect( Boolean.coerce( '' ) ).to.equal( false );

		done();
	} );

	test( 'Function.prototype.__name__', function( done ) {
		function Test() {}
		Test.prototype = {
			get : function get() {}, set : function set() {}, test : function() {}
		};

		expect( function( one ){}.__name__ ).to.equal( 'anonymous' );
		expect( function foo( one, two, three ){}.__name__ ).to.equal( 'foo' );
		expect( m8.coerce.__name__ ).to.equal( 'coerce' );
		expect( m8.nativeType.__name__ ).to.equal( 'nativeType' );
		expect( Test.__name__ ).to.equal( 'Test' );
		expect( Test.prototype.get.__name__ ).to.equal( 'get' );
		expect( Test.prototype.set.__name__ ).to.equal( 'set' );
		expect( Test.prototype.test.__name__ ).to.equal( 'anonymous' );

		done();
	} );

	test( 'Function.prototype.mimic', function( done ) {
		function one() {}
		function two() {}
		two.mimic( one );

		expect( one ).to.not.equal(  two );
		expect( one ).to.not.equal( two );
		expect( one.valueOf()  ).to.equal( two.valueOf()  );
		expect( one.toString() ).to.equal( two.toString() );

		done();
	} );

	test( '<static> Object.key', function( done ) {
		expect( Object.key( { foo : 'bar' }, 'bar' ) ).to.equal( 'foo' );
		expect( Object.key( { foo : 'bar' }, 'foo' ) ).to.equal( null );

		done();
	} );

	test( '<static> Object.reduce', function( done ) {
		expect( Object.reduce( { one : 1, two : 2, three : 3, four : 4, five : 5 }, function( res, v, k, o ) {
			return res += v;
		}, 0 ) ).to.equal( 15 );

		done();
	} );

	test( '<static> Object.value', function( done ) {
		var d = { one : { two : { three : true, four : [1, 2, 3, 4] } } };

		expect( Object.value( d, 'one' ) ).to.eql( d.one );
		expect( Object.value( d, 'one.two' ) ).to.eql( d.one.two );
		expect( Object.value( d, 'one.two.three' ) ).to.eql( d.one.two.three );
		expect( Object.value( d, 'one.two.four' ) ).to.eql( d.one.two.four );
		expect( Object.value( d, 'one.two.four.2' ) ).to.eql( d.one.two.four[2] );
		expect( Object.value( d, 'one.three.four.2' ) ).to.equal( undefined );
		expect( Object.value( d, 'one.two.beep.7' ) ).to.equal( undefined );
		expect( Object.value( d, 'one.two.four.7' ) ).to.equal( undefined );

		done();
	} );

	test( '<static> Object.values', function( done ) {
		expect( Object.values( { one : 1, two : 2, three : 3, four : 4, five : 5 } ) ).to.eql( [1, 2, 3, 4, 5] );
		expect( Object.values( [1, 2, 3, 4, 5] ) ).to.eql( [1, 2, 3, 4, 5] );

		done();
	} );

} );
