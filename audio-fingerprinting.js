export default class AFP {}

AFP.context = null;
AFP.currentTime = null;
AFP.oscillator = null;
AFP.compressor = null;
AFP.fingerprint = null;
AFP.callback = null;

AFP.run = function( cb, debug = true ) {
	AFP.callback = cb;
	
	try {
		
		AFP.setup();
	
		AFP.oscillator.connect( AFP.compressor );
		AFP.compressor.connect( AFP.context.destination );
	
		AFP.oscillator.start( 0 );
		AFP.context.startRendering();
		
		AFP.context.oncomplete = AFP.onComplete;
	  
	} catch ( error ) {
		
		if ( debug ) {
			throw error;
		}
		
	}
};

AFP.setup = function() {
		var audioContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;
		AFP.context = new audioContext( 1, 44100, 44100 );
		AFP.currentTime = AFP.context.currentTime;

		AFP.oscillator = AFP.context.createOscillator();
		AFP.oscillator.type = "triangle";
		AFP.oscillator.frequency.setValueAtTime( 10000, AFP.currentTime );

		AFP.compressor = AFP.context.createDynamicsCompressor();
		
		AFP.setCompressorValueIfDefined( "threshold", -50 );
		AFP.setCompressorValueIfDefined( "knee", 40 );
		AFP.setCompressorValueIfDefined( "ratio", 12 );
		AFP.setCompressorValueIfDefined( "reduction", -20 );
		AFP.setCompressorValueIfDefined( "attack", 0 );
		AFP.setCompressorValueIfDefined( "release", .25 );
};

AFP.setCompressorValueIfDefined = function( item, value ) {
	if ( AFP.compressor[ item ] !== undefined && typeof AFP.compressor[ item ].setValueAtTime === "function" ) {
		AFP.compressor[ item ].setValueAtTime( value, AFP.context.currentTime );
	}
};

AFP.onComplete = function( event ) {
	AFP.generateFingerprints( event );
	AFP.compressor.disconnect();
};

AFP.generateFingerprints = function( event ) {
	let output = null;
	for ( let i = 4500; i < 5e3; i++ ) {
		
		var channelData = event.renderedBuffer.getChannelData( 0 )[ i ];
		output += Math.abs( channelData );
		
	}
	
	AFP.fingerprint = output.toString();
	
	if ( typeof AFP.callback === "function" ) {
		return AFP.callback( AFP.fingerprint );
	}
};
