// This object represent the waveform generator
var WaveformGenerator = {
    // The generateWaveform function takes 4 parameters:
    //     - type, the type of waveform to be generated
    //     - frequency, the frequency of the waveform to be generated
    //     - amp, the maximum amplitude of the waveform to be generated
    //     - duration, the length (in seconds) of the waveform to be generated
    generateWaveform: function(type, frequency, amp, duration) {
        var nyquistFrequency = sampleRate / 2; // Nyquist frequency
        var totalSamples = Math.floor(sampleRate * duration); // Number of samples to generate
        var result = []; // The temporary array for storing the generated samples c

        switch(type) {
            case "sine-time": // Sine wave, time domain
                for (var i = 0; i < totalSamples; ++i) {
                    var currentTime = i / sampleRate;
                    result.push(amp * Math.sin(2.0 * Math.PI * frequency * currentTime));
                }
                break;

            case "square-time": // Square wave, time domain
                /**
                * TODO: Complete this generator
                **/
                // amp is aplitude
                //mutiply waveform with amop an dush the smaple into "result" using result.push
               for (var i = 0; i < totalSamples; ++i) {   
                    var oneCycle = sampleRate / frequency;
                    var halfCycle = oneCycle / 2;
                    
                    if (i%parseInt(oneCycle) < halfCycle){
                        result.push(amp); //psuh the sample
                    }
                    else{
                        result.push(-amp);
                    }
                }
                break;

            case "square-additive": // Square wave, additive synthesis
                /**
                * TODO: Complete this generator
                **/
               for (var i = 0; i < totalSamples; i++) {
                    var t = i / sampleRate; // t is is current time 
                    var sample = 0; //value of smaple
                    // Add the sine waves, until the nyquist frequency is reached
                    for (var k = 1; k * frequency < nyquistFrequency; k += 2) { //k is wave
                        sample += (1 / k)* Math.sin(2 * Math.PI * k * frequency  * t);
                    }
                    result.push(amp * sample);
                }
                break;

            case "sawtooth-time": // Sawtooth wave, time domain
                /**
                * TODO: Complete this generator
                **/
                var oneCycle = sampleRate / frequency;
				for (var i = 0; i < totalSamples; i++) {
					var whereInTheCycle = i % parseInt(oneCycle);
					var fractionInTheCycle = whereInTheCycle / oneCycle;
					result.push(amp * (1.0 - fractionInTheCycle) - (amp/2));
                }  
                break;

            case "sawtooth-additive": // Sawtooth wave, additive synthesis
                /**
                * TODO: Complete this generator
                **/
				for (var i = 0; i < totalSamples; i++) {
                    var t = i / sampleRate; // this is current time
                    var sample = 0 //sample value
					for (var k = 1; k * frequency < nyquistFrequency; k ++) { //k is wave
						sample += (1/k) * Math.sin(2.0 * Math.PI * k * frequency * t);
					}
					result.push(amp * sample);
				}   
                break;

            case "triangle-additive": // Triangle wave, additive synthesis
                /**
                * TODO: Complete this generator
                **/
                for (var i = 0; i < totalSamples; i++) {
                    var t = i / sampleRate; //this is current time
                    var sample = 0; //sample vlaue
                    
                    for (var k = 1; k * frequency < nyquistFrequency; k += 2) {  // k is wave
                        sample += (1.0/ (k*k) ) * Math.cos( 2 * Math.PI * k * frequency  * t);
                    }
                    result.push(amp * sample);
                }
                break;
////////////////////////////////////////////////////////////////////
            case "customized-additive-synthesis": // Customized additive synthesis
                /**
                * TODO: Complete this generator
                **/
                for (var i = 0; i < totalSamples; ++i) {
                    var sample = 0; //sample vlaue 
                    var t = i / sampleRate;     // t is current time   
                    for (var k = 1; k <= 10; k++) {  // k is the k-th harmonic
                        //use for loop to get all value from 10 slider
                        var harmonic_amplitude = parseFloat($("#additive-f"+k).val());
                        if(k * frequency < nyquistFrequency){
                            sample += harmonic_amplitude * Math.sin(2.0 * Math.PI * k * frequency  * t);
                        }
                        
                    }
                    result.push(amp * sample);
                }

                break;

            case "white-noise": // White noise
                /**
                * TODO: Complete this generator
                **/
               for (var i = 0; i < totalSamples; ++i) {
                    result.push(amp * Math.random()*2-1); //2 is max-min  -1 is min
                }
                break;

            case "karplus-strong": // Karplus-Strong algorithm
                /**
                * TODO: Complete this generator
                **/
               var useFreq = $("#karplus-use-freq").prop("checked");
                if(useFreq){
                    var delay =  sampleRate / frequency;
                    // console.log("delay is", delay); //187.5
                }
                else{
                    var delay = parseFloat($("#karplus-p").val()); //get first p sample for delay
                    // console.log("delay is", delay);
                }
				// var delay = parseFloat($("#karplus-p").val()); // this is p
                var samples = [];
                // console.log("totalSamples is", totalSamples);// 288000
                var input_type = $("#karplus-base option:selected").val()
				for (var i = 0; i < totalSamples; i++) {
					if (i <= delay) {
                        // console.log("i is", i, "and amp is", amp);  //0-100
						if(input_type == "sawtooth"){
                            var oneCycle = parseInt(delay);
                            var whereInTheCycle = i % parseInt(oneCycle);
                            var fractionInTheCycle = whereInTheCycle / oneCycle;
                            samples[i] = amp*(1.0 - fractionInTheCycle) - (amp/2);
                        }
						else if(input_type == "white-noise"){
                            // console.log("NEW UPDATE");
                            samples[i] = Math.random()*2 - 1;
						}
					}
					else{ //i = 2delay+1
						var b = parseFloat($("#karplus-b").val());
                        samples[i] = -0.5 *(samples[i-parseInt(delay)] + samples[i-1-parseInt(delay)]);

                        // samples[i%(delay+1)] = 0.5 *(samples[i%(delay+1)] + samples[(i-1)%(delay+1)]);
                        // samples[i] = -0.5 *(samples[i%(delay+1)] + samples[(i-1)%(delay+1)]); 
                        //above cannot as the Amplitude will explode
						if (Math.random() <= b){
                            samples[i] *= -1;
                        }
					}
                    // result.push(amp*samples[i%(delay+1)]);
                    result.push(amp*samples[i]);
				}
                break;

                

            case "fm": // FM
                /**
                * TODO: Complete this generator
                **/

                // Obtain all the required parameters
                var useFreq = $("#fm-use-freq-multiplier").prop("checked");
                if(useFreq){
                    var carrier_multipier = parseFloat($("#fm-carrier-frequency").val());
                    var modulation_multipier = parseFloat($("#fm-modulation-frequency").val());
                    var carrierFrequency = frequency*carrier_multipier;
                    var modulationFrequency = frequency*modulation_multipier;
                }
                else{
                    var carrierFrequency = parseInt($("#fm-carrier-frequency").val());
                    var modulationFrequency = parseInt($("#fm-modulation-frequency").val());
                }
                
                var carrierAmplitude = parseFloat($("#fm-carrier-amplitude").val());
                var modulationAmplitude = parseFloat($("#fm-modulation-amplitude").val());
                var useADSR = $("#fm-use-adsr").prop("checked");
                if(useADSR) { // Obtain the ADSR parameters
                    var attackDuration = parseFloat($("#fm-adsr-attack-duration").val()) * sampleRate;
                    var decayDuration = parseFloat($("#fm-adsr-decay-duration").val()) * sampleRate;
                    var releaseDuration = parseFloat($("#fm-adsr-release-duration").val()) * sampleRate;
                    var sustainLevel = parseFloat($("#fm-adsr-sustain-level").val()) / 100.0;

                    var attackDuration_time = parseFloat($("#fm-adsr-attack-duration").val()); 
                    var decayDuration_time = parseFloat($("#fm-adsr-decay-duration").val());
                    var releaseDuration_time = parseFloat($("#fm-adsr-release-duration").val()) ;

                    for (var i = 0; i < totalSamples; ++i) {
                        var currentTime = i / sampleRate;

                        if((currentTime<=attackDuration_time) && (currentTime>=0)){
                            var attack_modulation_amplitude= modulationAmplitude *i/attackDuration;
                            var modulator = attack_modulation_amplitude * Math.sin(2.0 * Math.PI * modulationFrequency * currentTime);
                            var value = carrierAmplitude * Math.sin(2.0 * Math.PI * carrierFrequency * currentTime + modulator)
                            // console.log("ATTACK");
                            result.push(amp * value);
                        }
                        else if((currentTime<=attackDuration_time+decayDuration_time) && (currentTime>attackDuration_time)){
                            var decay_modulation_amplitude= modulationAmplitude *(1 - (1-sustainLevel)*(i-attackDuration)/decayDuration);
                            var modulator = decay_modulation_amplitude * Math.sin(2.0 * Math.PI * modulationFrequency * currentTime);
                            var value = carrierAmplitude * Math.sin(2.0 * Math.PI * carrierFrequency * currentTime + modulator)
                            // console.log("DECAY");
                            result.push(amp * value);
                        }
                        else if((currentTime<=totalSamples/sampleRate) && (currentTime>totalSamples/sampleRate-releaseDuration_time)){
                            var release_modulation_amplitude= modulationAmplitude *(sustainLevel * (1-(i-(totalSamples/sampleRate-releaseDuration_time)*sampleRate)/releaseDuration));
                            var modulator = release_modulation_amplitude * Math.sin(2.0 * Math.PI * modulationFrequency * currentTime);
                            var value = carrierAmplitude * Math.sin(2.0 * Math.PI * carrierFrequency * currentTime + modulator)
                            // console.log("RELEASE");
                            result.push(amp * value);
                        }
                        else{
                            var sustain_modulation_amplitude= modulationAmplitude *sustainLevel;
                            var modulator = sustain_modulation_amplitude * Math.sin(2.0 * Math.PI * modulationFrequency * currentTime);
                            var value = carrierAmplitude * Math.sin(2.0 * Math.PI * carrierFrequency * currentTime + modulator)
                            // console.log("SUSTAIN");
                            result.push(amp * value);
                        }
                    }
                }
                else{
                    for (var i = 0; i < totalSamples; ++i) {
                        var time = i / sampleRate;
                        var modulator = modulationAmplitude * Math.sin(2.0 * Math.PI * modulationFrequency * time);
                        result.push(amp * carrierAmplitude * Math.sin(2.0 * Math.PI * carrierFrequency * time + modulator));
                    }
                }
                break;

            case "repeating-narrow-pulse": // Repeating narrow pulse
                var cycle = Math.floor(sampleRate / frequency);
                for (var i = 0; i < totalSamples; ++i) {
                    if(i % cycle === 0) {
                        result.push(amp * 1.0);
                    } else if(i % cycle === 1) {
                        result.push(amp * -1.0);
                    } else {
                        result.push(0.0);
                    }
                }
                break;

            default:
                break;
        }

        return result;
    }
};
