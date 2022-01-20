PennController.Sequence("consent","welcome","headphonesInstr","headphoneCheck","passed","test_recording1","init","test_recording2","instr","PicTraining","instr2","PicTesting","instr3","PWITask","upload","send","debrief","exit" );
//PennController.DebugOff();
PennController.ResetPrefix(null);
PennController.SendResults( "send" );
PennController.UploadRecordings("upload");

//TODOs:
//fix bit where it asks for recording permission (maybe fixed?)
//check if pic-name training is using same list as main task
//change to random order of pic presentations for training and quiz? (maybe doesn't matter)
//add second pic-name-quiz block for any pic names Ss got wrong on first quiz?
//add catch trials?
//add practice block of trials?
//check audio recording, data output, etc.
//fix sona credit link at end

PennController("welcome",
        defaultText
            .print()
        ,
        
        newText("<p><strong>Welcome to the experiment!</strong></p>")
        ,
        newText("<p>Before we get going, let's check a few things to make sure this experiment will work properly. </p>")
        ,
        newText("<li>This experiment works best on <i>Chrome </i>or <i>Firefox </i>browsers. If you aren’t using Chrome or Firefox, please restart the study using one of those browsers. </li>")
        ,
        newText("<br/>")
        ,
        newText("<li>This experiment works best in a quiet room without lots of distractions. We can't tell where you are, of course, but we would really appreciate it if you could try to minimize distractions during this experiment! </li>")
        ,
        newText("<br/>")
        ,
        newText("<li>This experiment will play sounds through your headphones and use your computer's microphone to make short recordings. We'll test those functions next. </li>")
        ,
        newText("<br/>")
        ,
        newText("<br/>")
        ,
        newButton("button", "Continue")
            .print()
            .wait()
);

jQuery.prototype.on = function(...args) { return jQuery.prototype.bind.apply(this, args); }
jQuery.prototype.prop = function(...args) { return jQuery.prototype.attr.apply(this, args); }

InitiateRecorder( "https://hjpatt-136.umd.edu/Web_Experiments/Slevc/polypwi/PCIbex.php","This experiment collects audio recordings. You will be notified whenever you are being recorded by a label at the top of the page. <br/> <br/> For this to work, please <strong>grant this page access to your microphone</strong> and then <strong>consent to being recorded by clicking on the text below:</strong>.")
    .label("init");

//attempt to make the consent for recording more clear
//from https://www.pcibex.net/forums/topic/voicerecorder-block-incomplete-recording-authorization-page/#post-4988
let replaceConsentMic = ()=>{
        let consentLink = $(".PennController-PennController a.Message-continue-link");
        if (consentLink.length > 0 && consentLink[0].innerHTML.match(/^By clicking this link I understand that I grant this experiment's script access to my recording device/))
            consentLink.html("By <strong><u>clicking this text </u></strong>I understand that I grant this experiment's script access to my microphone.");
        else
            window.requestAnimationFrame( replaceConsentMic );
};
window.requestAnimationFrame( replaceConsentMic );

PennController("test_recording1" , 
//NOTE: could probably ditch the volume test b/c of the headphone check.
    defaultText
        .print()
    ,
    newText("<p><strong>Audio Recording </strong></p>")
    ,
/*
    newText("<p>Before we begin, please make sure your volume is on and turned up to a comfortable level. Use the audio sample below to test your volume now.</p>")
    ,
    newText("<br/>")
    ,
    newAudio("testBeats", "https://github.com/lmcl-umd/ImageryFiles/blob/master/PitchesWav/C5.wav?raw=true")
        .print()
        .wait()
    ,
    newText("<br/>")
    ,
    newButton("button", "Continue")
        .print()
        .wait()
    ,
*/
    newText("<p>Your main task in this experiment will be to speak the name of a bunch of pictures while ignoring words you hear over your headphones. </p>")
    ,
    newText("<p>The experiment will make short audio recordings of your spoken responses, which will allow us to measure how quickly you started speaking and the accuracy of your response (this will all be more clear soon). </p>")
    ,
    newText("<p><strong>For this to work, you will need to grant the browser access to your microphone.</strong> You will be asked to do this on the next page. Please save this setting for the whole experiment. </p>")
    ,
    newText("<br/>")
    ,
    newButton("button", "Continue")
        .print()
        .wait()
);

PennController("test_recording2" , 
    defaultText
        .print()
    ,
    newText("<p><strong>Audio Recording</strong></p>")
    ,
    newText("<p>Now let's check if the audio recording is working. Please press the button below, then say something like: <br/><br/> <strong><i>I sure hope this recording works properly! </i></strong> </p>")
    ,
    newButton("button", "Start Test Recording")
        .print()
        .wait()
    ,
    newMediaRecorder("test","audio")
        .record()
    ,
    newTimer("recording", 2500)
        .start()
        .wait()
    ,
    getMediaRecorder("test")
        .stop()
        .print()
        .disable()
        .play()
        .wait("playback")
    ,
    newText("<p>Did you hear your recording okay? </p>")
    ,
    newText("<li>If so, press the button below when you are ready to begin. </li>")
    ,
    newText("<li>If not, please make sure you're using Chrome or Firefox, reload the page, and be sure to grant access to your microphone.</li>")
    ,
    newText("<br/>")
    ,

    newButton("button", "Continue")
        .print()
        .wait()
);

PennController( "consent" ,

    newDropDown("age" , "I am...")
        .add( "Less than 18 years old." , "18 years old, or over.")
        .log()
        .center()
        .print()
    ,
    
    newVar("dataShare")
    ,
    
    newButton("agreeC","By clicking this button I indicate my consent.")
        .center()
    ,
    newButton("agreeA","By clicking this button I indicate my assent.")
        .center()
    ,
    newButton("agree","Continue")
        .center()
    ,
    
    getDropDown("age")
        .callback(
            getDropDown("age")
                .test.selected("Less than 18 years old.").success( 
                    newHtml("introA", "Assent-Online.html")
                        .center()
                        .print()
                    ,
                    
                    getButton("agreeA")
                        .print()
                        .callback(
                            getHtml("introA").test.complete()
                                .failure( newText("Please choose one of the data sharing options above before continuing!").color("red").print())
                                .success(
                                    newFunction(function(){
                                        //let keys = document.getElementsByClassName("obligatory");
                                        let keys = document.getElementById("dataShare");
                                        var ele = document.getElementsByName('dataShare'); 
                                        for(i = 0; i < ele.length; i++) { 
                                            if(ele[i].checked){
                                                return ele[i].value;
                                            }
                                        } 
                                        return "none";
                                    }).setVar("dataShare")
                                    ,
                                    getVar("dataShare").set(getVar("dataShare")).log("set")
                                    ,
                                    getButton("agreeA").disable()
                                    ,
                                    newText("<br/>").print()
                                    ,
                                    getButton("agree").print()
                                )    
                        )
                )
                .test.selected("18 years old, or over.").success( 
                    newHtml("introC", "Consent-Online.html")
                        .center()
                        .print()
                    ,
                    getButton("agreeC")
                        .print()
                        .callback(
                            getHtml("introC").test.complete()
                                .failure( newText("Please choose one of the data sharing options above before continuing!").color("red").print())
                                .success(
                                    newFunction(function(){
                                        //let keys = document.getElementsByClassName("obligatory");
                                        let keys = document.getElementById("dataShare");
                                        var ele = document.getElementsByName('dataShare'); 
                                        for(i = 0; i < ele.length; i++) { 
                                            if(ele[i].checked){
                                                return ele[i].value;
                                            }
                                        } 
                                        return "none";
                                    }).setVar("dataShare")
                                    ,
                                    getVar("dataShare").set(getVar("dataShare")).log("set")
                                    ,
                                    getButton("agreeC").disable()
                                    ,
                                    newText("<br/>").print()
                                    ,
                                    getButton("agree").print()
                                )    
                        )
                )
                
        )
    ,
    getButton("agree") //
        .wait()
    
).log( "ParticipantID", PennController.GetURLParameter("id") )
;

PennController("headphonesInstr",
        defaultText
            .print()
        ,
        
        newText("<p><strong>Headphones</strong></p>")
        ,
        newText("<p>During this experiment, we ask that you please wear headphones. Make sure your volume is turned on and to a comfortable level.<br/> You will now complete a task that will check the volume and output of your headphones. </p>")
        ,
        
        newButton("button", "Continue")
            .print()
            .wait()

);

PennController( "headphoneCheck" ,
    newButton("check", "Start Headphone Check")
        .print()
    ,
    // This Canvas will contain the test itself
    newCanvas("headphonecheck", 500,2000)
        .print()
    ,
    // The HeadphoneCheck module fills the element whose id is "hc-container"
    newFunction( () => getCanvas("headphonecheck")._element.jQueryElement.attr("id", "hc-container") ).call()
    ,
    getButton("check")
        .wait()
        .remove()
    ,
    // Create this Text element, but don't print it just yet
    newText("failure", "Sorry, you failed the headphone check")
    ,
    
    newVar("passed", 0)
        .global()
    ,
    
    newVar("totalCorrect")
        .global()
    ,
    
    // This is where it all happens
    newFunction( () => {
        $(document).on('hcHeadphoneCheckEnd', function(event, data) {
            getCanvas("headphonecheck").remove()._runPromises();
            if (data.didPass) getVar("passed").set( 1 )._runPromises();
            getVar("totalCorrect").set( data.data.totalCorrect )._runPromises();
            getButton("dummy").click()._runPromises();
        });
        HeadphoneCheck.runHeadphoneCheck(); 
    }).call()
    ,
    
    // This is an invisible button that's clicked in the function above upon success
    newButton("dummy").wait()
);

PennController( "passed" ,

    getVar("passed").test.is(0)
        .success(
            newText("Hey! It looks like you are not wearing headphones. <br/> If possible, please put on headphones before continuing.<br/><br/>")   
                .print()
            ,
            newTimer("wait", 2000)
                .start()
                .wait()
        )
        .failure(
            newText("Great, it looks like you are wearing headphones. Thanks!<br/><br/>")   
                .print()
            ,
            newTimer("wait", 500)
                .start()
                .wait()
        )
    ,
    newText("Next, we'll check if the audio recording is working.<br/><br/>")
        .print()
    ,
     
    newButton("Continue")
        .print()
        .wait()
);

PennController( "instr" ,
        
        defaultText
            .print()
        ,
        
        newText("<p><strong>Instructions - Part 1</strong></p>")
        ,
        newText("<br/>")
        ,
        newText("<p>In this experiment, your main task will be to say the name of pictures that appear on the screen.</p>")
        ,
        newText("<p>To make sure you know what these pictures are intended to be, we will now show you those pictures along with their one-word name. </p>")
        ,
        newText("<p>After you view all the pictures and their names, we will 'quiz' you on the names. (This shouldn't be very hard.) </p>")
        ,
        newText("<p>Press the button below to start viewing the pictures and names, one-by-one. Each picture/name will stay on the screen for about a second, then will be replaced with another picture/name.</p>")
        ,
        newText("<br/>")
        ,
        newButton("button", "Continue")
            .print()
            .wait()
);

// pic training, part 1
// TEST THIS TO MAKE SURE IT IS USING THE SAME GROUP ASSIGNMENT AS THE MAIN PART OF THE TASK!

PennController.Template( "PolyPWI_praclist.csv" ,
    variable => PennController( "PicTraining" ,
    
        newCanvas("screen", 800,580)
            .center()
            .print()
        ,

        newImage("TargetPic", variable.TargetPic)
            .size(variable.Xdim,variable.Ydim)
        ,

        newText("word", variable.PictureWord)
            .settings.css("font-size", "200%")
        ,

        getCanvas("screen")
            .add("center at 50%","middle at 95%", getText("word"))
            .add("center at 50%","middle at 40%", getImage("TargetPic"))
            .print()
        ,
        
        newTimer("timer", 1500)
            .start()
            .wait()
        ,
        
        getCanvas("screen")
            .remove(getText("word"))
            .remove(getImage("TargetPic"))
        ,

        newTimer("ITI", 500)
            .start()
            .wait()
        
    )
    //maybe don't log data for this, but only for the (not yet existing) test part?
    .log("ParticipantID", PennController.GetURLParameter("id") )
    .log("List", variable.Group)
    .log("Item", variable.Item)
    .log("PicName", variable.PictureWord)
    .log("PicNameSense", variable.WordSense)
);

PennController( "instr2" ,
        
        defaultText
            .print()
        ,
        
        newText("<p><strong>Instructions - Part 2</strong></p>")
        ,
        newText("<br/>")
        ,
        newText("<p>Now we'll just check to make sure you remember what all the pictures are intended to be called.</p>")
        ,
        newText("<p>You'll now see those same pictures again, and you should just type their one-word name (the name that you saw a moment ago). </p>")
        ,
        newText("<p>If you don't type the correct name, you'll see the name we intended and you'll need to type that in to continue. Please try to remember the name for the main task (which we'll get to next). </p>")
        ,
        newText("<p>Note that we aren't using very sophisticated matching here, so don't worry if the experiment script thinks you got it wrong because it's misspelled or something. The important thing is that you know what to call it for the main task. </p>")
        ,
        newText("<br/>")
        ,
        newButton("button", "Continue")
            .print()
            .wait()
);

// Pic name TESTING

PennController.Template( "PolyPWI_praclist.csv" ,
    variable => PennController( "PicTesting" ,
    
        newCanvas("screen", 800,580)
            .center()
            .print()
        ,

        newImage("TargetPic", variable.TargetPic)
            .size(variable.Xdim,variable.Ydim)
        ,
        
        newText("word", variable.PictureWord)
            .center()
            .settings.css("font-size", "150%")
			.before( newText("nameis","Nope, this should be &nbsp;"))
			.after( newText("fixit",". &nbsp; Please type the correct word and press <i>Enter</i> to continue."))
        ,

        newTextInput("resp")
		,

        newText("cont", "<i>Press ENTER when finished.</i>")
        ,

        getCanvas("screen")
            .add("center at 50%","middle at 40%", getImage("TargetPic"))
            .add("center at 50%","middle at 90%", getTextInput("resp").log("final"))
            .add("center at 50%","middle at 95%", getText("cont").print())
            .print()
        ,

		newKey("Enter")
			.wait(
				getTextInput("resp").test.text(RegExp(variable.PictureWord+"|"+variable.PictureWord_lc))
					.failure(getText("word").print() )
				)
		,
		
        newTimer("ITI", 500)
            .start()
            .wait()
        ,
        clear()
    )
    .log("ParticipantID", PennController.GetURLParameter("id") )
);

PennController( "instr3" ,
        
        defaultText
            .print()
        ,
        
        newText("<p><strong>Instructions - Part 3</strong></p>")
        ,
        newText("<br/>")
        ,
        newText("<p>Now that you know the names of the pictures, your main task for the rest of the experiment is to speak the name of each object when it appears. <br/> Please speak at a normal volume and name each picture as quickly as you can.</p>")
        ,
        newText("<p>You will only have a limited amount of time to name each picture before it is quickly replaced by the next picture.</p>")
        ,
        newText("<p>Just before each picture appears, you will hear a spoken word through your headphones. <br/> This word will always be different than the picture name, so you should try to <strong>ignore the word you hear </strong>and just name the picture as quickly as you can.</p>")
        ,
        newText("<br/>")
        ,
        newText("<p>The words might sometimes trip you up a little, but don't worry - just try to name the pictures as quickly and accurately as you can.</p>")
        ,
        newText("<br/>")
        ,
        newText("<p>This will probably only take 5-10 minutes, then you'll be finished with the experiment. <br/> Thanks in advance for helping with our research!</p>")
        ,
        newText("<p>Press the button below when you are ready to begin.</p>")
        ,
        newText("<br/>")
        ,
        newText("<br/>")
        ,
        newButton("button", "Start the experiment")
            .print()
            .wait()
);

// Do we need a practice block? 

PennController.Template( "PolyPWI_list.csv" ,
    variable => PennController( "PWITask" ,
    
//        newVar("check",0) // remove if not using occasional are-you-paying-attention Qs
//        ,
        
        newCanvas("screen", 800,580)
            .center()
            .print()
        ,
        
        newText("cue", "+")
            .settings.css("font-size", "200%")
        ,
        
        getCanvas("screen").add("center at 50%","middle at 50%", getText("cue") )
        ,

        newTimer("pause", 500)
            .start()
            .wait()
        ,
        
        getCanvas("screen").remove(getText("cue"))
        ,

        newTimer("pause", 500)
            .start()
            .wait()
        ,
        
        newAudio("audio", variable.DistWordSoundGit)
            .play()
        ,
        
        newTimer("SOA", 150)
            .start()
            .wait()
        ,
        
        newImage("TargetPic", variable.TargetPic)
            .size(variable.Xdim,variable.Ydim)
        ,
//        newText("word", variable.DistWord)
//        ,

        newMediaRecorder(variable.Item+"_"+PennController.GetURLParameter("id"),"audio")
            .record()
        ,
        
        getCanvas("screen")
//            .add("center at 50%","middle at 5%", getText("word"))
            .add("center at 50%","middle at 40%", getImage("TargetPic"))
            .print()
        ,
        
        newTimer("recording", 1500)
            .start()
            .wait()
        ,
        
        getMediaRecorder(variable.Item+"_"+PennController.GetURLParameter("id"))
            .stop()
            // .play()
            // .wait("playback")
        ,


        getCanvas("screen")
//            .remove(getText("word"))
            .remove(getImage("TargetPic"))
        ,

/*
// occasional are-you-paying-attention questions:

        ((variable.order== 16 || variable.order == 32 || variable.order == 48)? getVar("check").set(1):getVar("check").set(0))
        ,
        
        getVar("check").test.is(1)
            .success(
                newText("q","Are you paying attention and trying to do well in this task?")
                ,
                newText("one","(A) yes, lots of attention")
                ,
                newText("two","(B) yes, mostly")
                ,
                newText("three","(C) no, not even trying")
                ,
                
                newCanvas("attention", 1000,500)
                    .center()
                    .add("center at 50%","middle at 30%", getText("q") )
                    .add("left at 30%","middle at 40%", getText("one") )
                    .add("left at 30%","middle at 50%", getText("two") )
                    .add("left at 30%","middle at 60%", getText("three") )
                    .print()
                ,
                
                newKey("attention","abc").wait().log()
                ,
                
                getCanvas("attention").remove()
            )
        ,
*/        

/*
         newCanvas("screen2", 800,580)
            .center()
            .add("center at 50%","middle at 50%", getText("cue") )
            .print()
        ,
*/        
        newTimer("ITI", 500)
            .start()
            .wait()
        ,

//        getCanvas("screen2").remove(getText("cue"))
        
    )
    .log("ParticipantID", PennController.GetURLParameter("id") )
    .log("List", variable.Group)
    .log("Item", variable.Item)
    .log("PicName", variable.PictureWord)
    .log("PicNameSense", variable.WordSense)
    .log("Distractor", variable.DistWord)
    .log("Condition", variable.Condition)
    .log("Sense1_2", variable.eq_weight_sense1_sense2)
    .log("SenseX_dX", variable.eq_weight_senseX_dX)
    .log("SenseX_dY", variable.eq_weight_senseX_dY)
);


PennController( "debrief" ,
        defaultText
            .print()
        ,
        
        newText("<p><strong>Thank you for participating in our study!</strong></p>")
        ,
        
        newText("<br/>")
        ,

        newText("<p>The aim of this study was to examine how words with multiple meanings are represented in the mind. One possibility is that each separate meaning of a word has its own discrete representation. For instance, for the word <strong>paper,</strong> it is possible that the <i>printer paper</i> meaning is represented separately from the <i>term paper</i> meaning. But another possibility is that these kinds of word meanings are represented in a more graded or continuous manner. By examining how distractor words affect people’s ability to process these kinds of word meanings, we can better understand whether these kinds of word meanings are represented in a more discrete or continuous manner.</p>")
        ,
        newText("<p>Of course, we don’t know the results of this experiment yet as we are still collecting data. However, if you still have any questions about this experiment, please feel free to contact Dr. Slevc at slevc@umd.edu.</p>")
        ,
        newText("<p>Finally, please don’t share any information about the experiment with other people who might participate, just in case knowing the goal of the experiment could bias peoples’ responses in some way.</p>")
        ,
//        newText('<a href="https://umpsychology.sona-systems.com/webstudy_credit.aspx?experiment_id=1640&credit_token=e20ddf267343402cb3a5fc8a2950eb8f&survey_code='+GetURLParameter('id')+'" rel="nofollow">Click here to confirm participation on SONA</a>.')
        newText('<a href="https://umpsychology.sona-systems.com/" rel="nofollow">Click here to confirm participation on SONA</a>.')
            .print()
            .wait()

);


PennController( "exit" ,
        newText("<p>You may now close your browser window.</p>").print()
        ,
        newTimer("dummy", 10)
            .wait() // This will wait forever
);
