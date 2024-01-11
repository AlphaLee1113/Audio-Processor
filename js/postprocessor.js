// This object represent the postprocessor
Postprocessor = {
    // The postprocess function takes the audio samples data and the post-processing effect name
    // and the post-processing stage as function parameters. It gathers the required post-processing
    // paramters from the <input> elements, and then applies the post-processing effect to the
    // audio samples data of every channels.

    // channel contains left/right channel
    //  each channel contain a sample array 

    //effect =  name of effect

    //pass =  post-processor number that is being applied now
    postprocess: function(channels, effect, pass) {
        switch(effect) {
            case "no-pp":
                // Do nothing
                break;

            case "reverse":
                /**
                * TODO: Complete this function
                **/

                // Post-process every channels
                for(var c = 0; c < channels.length; ++c) {
                    // Get the sample data of the channel
					var audioSequence = channels[c].audioSequenceReference;
					
                    // Apply the post-processing, i.e. reverse
                    //reverse the data point in the data
					audioSequence.data.reverse();
					
                    // Update the sample data with the post-processed data
					channels[c].setAudioSequence(audioSequence);
                }
                break;

            case "boost":
                // Find the maximum gain of all channels
                var maxGain = -1.0;
                for(var c = 0; c < channels.length; ++c) {
                    // Get the sample data of the channel
                    var audioSequence = channels[c].audioSequenceReference;
                    //now audioSequence =  data array
                    var gain = audioSequence.getGain();
                    if(gain > maxGain) {
                        maxGain = gain;
                    }
                }

                // Determin the boost multiplier
                var multiplier = 1.0 / maxGain;

                // Post-process every channels
                for(var c = 0; c < channels.length; ++c) {
                    // Get the sample data of the channel
                    var audioSequence = channels[c].audioSequenceReference;

                    // For every sample, apply a boost multiplier
                    for(var i = 0; i < audioSequence.data.length; ++i) {
                        audioSequence.data[i] *= multiplier;
                    }

                    // Update the sample data with the post-processed data
                    channels[c].setAudioSequence(audioSequence);
                }
                break;

            case "adsr":
                /**
                * TODO: Complete this function
                **/

                // Obtain all the required parameters
                //these variable contain the        # of sapmle in the duration
                var attackDuration = parseFloat($("#adsr-attack-duration").data("p" + pass)) * sampleRate;
                // console.log("parseFloat", parseFloat($("#adsr-attack-duration").data("p" + pass)));   get the second
                var decayDuration = parseFloat($("#adsr-decay-duration").data("p" + pass)) * sampleRate;
                var releaseDuration = parseFloat($("#adsr-release-duration").data("p" + pass)) * sampleRate;
                var sustainLevel = parseFloat($("#adsr-sustain-level").data("p" + pass)) / 100.0;
                // console.log("sustainLevel is ", sustainLevel);
                //sustainLevel is just percentage

                var attackDuration_time = parseFloat($("#adsr-attack-duration").data("p" + pass)); 
                var decayDuration_time = parseFloat($("#adsr-decay-duration").data("p" + pass));
                var releaseDuration_time = parseFloat($("#adsr-release-duration").data("p" + pass));


                //Assume the total duratio is 6 s
                for(var c = 0; c < channels.length; ++c) {
                    // Get the sample data of the channel
                    var audioSequence = channels[c].audioSequenceReference;

                    for(var i = 0; i < audioSequence.data.length; ++i) {
                        // console.log("audioSequence.data.length is", audioSequence.data.length);

                        // TODO: Complete the ADSR postprocessor
                        // Hinst: You can use the function lerp(v0, v1, t) in utility.js
                        // for performing linear interpolation of v0 and v1, i.e.:
                        // v = v0 * (1 - t) + v1 * t
                        //v0 = interpolate from
                        //v1 = interpolate to
                        // t = interpolation factor in the closed interval [0, 1]
                        // why the duration values have been multiplied by sampleRate
                        // because want to change into # of sample in the duration
                        current_time = i/sampleRate;
                    
                        if((current_time<=attackDuration_time) && (current_time>=0)){
                            // audioSequence.data[i] *= lerp(0,1, attackDuration);
                            // attack time * sample rate 
                            audioSequence.data[i] *= i/attackDuration;  
                        }
                        else if((current_time<=attackDuration_time+decayDuration_time) && (current_time>attackDuration_time)){
                             audioSequence.data[i] *= 1 - (1-sustainLevel)*(i-attackDuration)/decayDuration; 
                            // console.log(audioSequence.data[i]);
                            // if(audioSequence.data[i]<sustainLevel){
                            //     audioSequence.data[i] /= (decayDuration+attackDuration-i)/decayDuration;
                            //     audioSequence.data[i]*=sustainLevel;
                            // }
                        }
                        else if((current_time<=audioSequence.data.length/sampleRate) && (current_time>audioSequence.data.length/sampleRate-releaseDuration_time)){
                            audioSequence.data[i] *= sustainLevel * (1-(i-(audioSequence.data.length/sampleRate-releaseDuration_time)*sampleRate)/releaseDuration);  
                            // if(audioSequence.data[i]>sustainLevel){
                            //     audioSequence.data[i]=sustainLevel;
                            // }
                        }
                        else{
                            audioSequence.data[i] *=sustainLevel;
                        }
                    }
                    // Update the sample data with the post-processed data
                    channels[c].setAudioSequence(audioSequence);
                }
                break;

            case "tremolo":
                /**
                * TODO: Complete this function
                **/

                // Obtain all the required parameters
                var tremoloFrequency = parseFloat($("#tremolo-frequency").data("p" + pass));
                var wetness = parseFloat($("#tremolo-wetness").data("p" + pass));
                 //handle wetnss(strength of tremolo effect)
                 // wetness = how high is the bottom of the sine wave

                // Post-process every channels
                for(var c = 0; c < channels.length; ++c) {
                    // Get the sample data of the channel
                    var audioSequence = channels[c].audioSequenceReference;


                    // For every sample, apply a tremolo multiplier
                    for(var i = 0; i < audioSequence.data.length; ++i) {
						var currentTime = i / sampleRate;
                        var multiplier = (Math.sin(2 * Math.PI * tremoloFrequency * (currentTime - 0.25/tremoloFrequency)) + 1) * 0.5;
						multiplier = multiplier * wetness + (1 - wetness);
						audioSequence.data[i] *= multiplier;
					}

                    // Update the sample data with the post-processed data
                    channels[c].setAudioSequence(audioSequence);
					
                }
                break;

            case "echo":
                /**
                * TODO: Complete this function
                **/

                // Obtain all the required parameters
                var delayLineDuration = parseFloat($("#echo-delay-line-duration").data("p" + pass));
                var multiplier = parseFloat($("#echo-multiplier").data("p" + pass));

                // Post-process every channels
                for(var c = 0; c < channels.length; ++c) {
                    // Get the sample data of the channel
                    var audioSequence = channels[c].audioSequenceReference;

                    // Create a new empty delay line
                    var delayLineSize = parseInt(delayLineDuration*sampleRate);
                    var delayLine = [];
                    for(var i = 0; i < delayLineSize; ++i) {
                        delayLine.push(0);
                    }
                    var delayLineOutput;


                    // Get the sample data of the channel
                    for(var i = 0; i < audioSequence.data.length; ++i) {
                        // Get the echoed sample from the delay line
                        delayLineOutput = delayLine[i % delayLineSize];

                        // Add the echoed sample to the current sample, with a multiplier
                        audioSequence.data[i] += delayLineOutput * multiplier;

                        // Put the current sample into the delay line
                        delayLine[i % delayLineSize] = audioSequence.data[i];
                    }
                    // Update the sample data with the post-processed data
                    channels[c].setAudioSequence(audioSequence);
                }
                break;
            
            default:
                // Do nothing
                break;
        }
        return;
    }
}
