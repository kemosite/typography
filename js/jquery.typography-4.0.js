/**
  * [Typography]
  *
  * Description:
  + A JavaScript object to automatically set the typography your webpage based on viewing device dimensions.
  + Does 3 things: Sets ideal font size, sets ideal line lengths and leading, and applies orphan control.
  * Version: 4.0
  * By: Kevin Montgomery

  * 
  * What's New?
  + Uses class properties instead of inline styles. Can be applied globally as a body class, or individual element classes.
  *
  */

var typography_obj = new function() {	
	
	/* [R2] */

	/* [Parameters] */
	this.parameters = {

		/* [Field of view] */
		field_of_view: 30, // About 30 degree fov monitor viewing.

		/* [Fovial vision] */
		fovial_vision: 1.5, // fovial vision, in degrees, for 4 letters. Usually 1-2 degrees.

		/* [Field of view ratio] */
		field_of_view_ratio: "", // fovial_vision / field_of_view, // Calculate ratio of fovial vision to field of view

		/* [Determine diameter for 1 lowercase letter] */
		fovial_vision_pixels: "", // Math.round(typography_obj.user_configuration.screen_avg * typography_obj.parameters.field_of_view_ratio), // Fovial diameter in pixels, for 4 letters
		letter_diameter_pixels: "", // Math.round(typography_obj.parameters.fovial_vision_pixels / 4) // Diameter of 1 lowercase letter

		font_height_ratio: "",

	};

	/* [User Configuration Detection] */
	this.user_configuration = {

		/* [Capture screen resolution, use average for diameter] */
		screen_width: screen.width,
		screen_height: screen.height,
		screen_avg: "", // (screen_width + screen_height) / 2
		screen_min: "", // = Math.min(this.screen_width, this.screen_height);

		/* [Establish parameters for users font size] */
		font_height_pixels: "",
		ex_height_pixels: ""

	}

	/* [Outputs] */
	this.outputs = {

		font_height_pixels: "",
		font_height_em: "",
		ex_height_diameter_pixels: "",
		line_height_pixels: "",
		line_height_em: "",
		line_space_before_pixels: "",
		line_space_before_em: "",
		line_space_after_pixels: "",
		line_space_after_em: "",
		line_length_em: "",
		line_length_pixels: ""

	};

	/* [Initialize the object] */
	this.init = function() {

		/* [Evaluate users font size] */
		var user_font_height_obj = document.createElement("div");
		user_font_height_obj.setAttribute("id", "usr_font_height_obj");
		user_font_height_obj.setAttribute("style", "line-height: 100%, padding: 0, margin: 0");
		user_font_height_obj.innerHTML = "&nbsp;";
		document.getElementsByTagName("body")[0].insertBefore(user_font_height_obj, document.getElementsByTagName("body")[0].childNodes[0]);
		
		typography_obj.user_configuration.font_height_pixels = Math.min(
			Math.min(user_font_height_obj.scrollHeight, user_font_height_obj.scrollHeight),
			Math.min(user_font_height_obj.offsetHeight, user_font_height_obj.offsetHeight),
			Math.min(user_font_height_obj.clientHeight, user_font_height_obj.clientHeight)
	    );
	    
	    user_font_height_obj.setAttribute("style", "font-size: 1ex;");
	    
	    typography_obj.user_configuration.ex_height_pixels = Math.min(
			Math.min(user_font_height_obj.scrollHeight, user_font_height_obj.scrollHeight),
			Math.min(user_font_height_obj.offsetHeight, user_font_height_obj.offsetHeight),
			Math.min(user_font_height_obj.clientHeight, user_font_height_obj.clientHeight)
	    );
	    
	    /* [Remove font testing object] */
	    document.getElementsByTagName("body")[0].removeChild(user_font_height_obj);

	    /* [User configuration calculations] */
	    typography_obj.user_configuration.screen_avg = (typography_obj.user_configuration.screen_width + typography_obj.user_configuration.screen_height) / 2;
		typography_obj.user_configuration.screen_min = Math.min(typography_obj.user_configuration.screen_width, typography_obj.user_configuration.screen_height);


	    /* [Parameter calculations] */
	    typography_obj.parameters.font_height_ratio = 1 + (typography_obj.user_configuration.ex_height_pixels / typography_obj.user_configuration.font_height_pixels);
	    typography_obj.parameters.field_of_view_ratio = (typography_obj.parameters.fovial_vision / typography_obj.parameters.field_of_view);
	    typography_obj.parameters.fovial_vision_pixels = Math.round(typography_obj.user_configuration.screen_avg * typography_obj.parameters.field_of_view_ratio), // Fovial diameter in pixels, for 4 letters
	    typography_obj.parameters.letter_diameter_pixels = Math.round(typography_obj.parameters.fovial_vision_pixels / 4) // Diameter of 1 lowercase letter

	    /* [Outputs calculations] */
	    typography_obj.outputs.font_height_pixels = Math.max(typography_obj.parameters.letter_diameter_pixels, typography_obj.user_configuration.font_height_pixels); // Apply the larger of the users setting, or the new setting.
	    typography_obj.outputs.font_height_em = Math.round((typography_obj.outputs.font_height_pixels / typography_obj.user_configuration.font_height_pixels) * 1000) / 1000; // Calculate height using em measure.
	    typography_obj.outputs.ex_height_diameter_pixels = Math.round(typography_obj.outputs.font_height_pixels / typography_obj.parameters.font_height_ratio);
	    typography_obj.outputs.line_height_pixels = typography_obj.outputs.ex_height_diameter_pixels * 2;
	    typography_obj.outputs.line_height_em = Math.round((typography_obj.outputs.line_height_pixels / typography_obj.outputs.font_height_pixels) * 1000) / 1000;
	    typography_obj.outputs.line_space_before_pixels =  typography_obj.outputs.ex_height_diameter_pixels;
	    typography_obj.outputs.line_space_before_em = Math.round((typography_obj.outputs.line_space_before_pixels / typography_obj.outputs.font_height_pixels) * 1000) / 1000;
	    typography_obj.outputs.line_space_after_pixels =  typography_obj.outputs.ex_height_diameter_pixels;
	    typography_obj.outputs.line_space_after_em = Math.round((typography_obj.outputs.line_space_after_pixels / typography_obj.outputs.font_height_pixels) * 1000) / 1000;
	    typography_obj.outputs.line_length_em = Math.max(39, (typography_obj.outputs.font_height_pixels * 2)); // Calculate ideal line length, compare the 'alphabet-and-a-half rule' to the 'points-times-two' rule
	    typography_obj.outputs.line_length_pixels = typography_obj.outputs.line_length_em * typography_obj.outputs.font_height_pixels;

	    /*
	     * Apply style properties to "typography" class
	     * Locate all elements with applicable "typography" class and adjust them.
	     */

	    typography_obj.orphan_control();
		typography_obj.stylesheet();

	    console.log(typography_obj);

	}

	this.stylesheet = function() {

		var typography_css = document.createElement('style');
		typography_css.setAttribute("type", "text/css");

		var typography_body_size = "body.typography { "+
		"font-size: "+typography_obj.outputs.font_height_em+"em; "+
		"} ";

		var typography_margins = "body .typography, "+
	     	"body.typography h1, "+
	     	"body.typography h2, "+
	     	"body.typography h3, "+
	     	"body.typography h4, "+
	     	"body.typography h5, "+
	     	"body.typography h6, "+
	     	"body.typography p, " +
	     	"body.typography td, " +
	     	"body.typography li " +
		"{ "+
		"line-height: "+typography_obj.outputs.line_height_em+"em; "+
		"max-width: "+typography_obj.outputs.line_length_em+"rem; "+
		"margin-top: "+typography_obj.outputs.line_space_before_em+"rem; "+
		"margin-bottom: "+typography_obj.outputs.line_space_after_em+"rem; "+
		"margin-left: auto; "+
		"margin-right: auto; "+
		"} ";

		if (typography_css.styleSheet) {
			typography_css.styleSheet.cssText = typography_body_size + typography_margins;
		} else {
			typography_css.appendChild(document.createTextNode(typography_body_size));
			typography_css.appendChild(document.createTextNode(typography_margins));
		}

		document.getElementsByTagName("head")[0].appendChild(typography_css);

	}

	this.orphan_control = function() {

	    /* [Locate elements for typesetter] */
	    var typesetter_elements = document.querySelectorAll("body .typography, "+
	     	"body.typography h1, "+
	     	"body.typography h2, "+
	     	"body.typography h3, "+
	     	"body.typography h4, "+
	     	"body.typography h5, "+
	     	"body.typography h6, "+
	     	"body.typography p," +
	     	"body.typography td," +
	     	"body.typography li");

	    var punctuation = new Array("!", ".", ",", "?", ":", ";");

	    for (var i = 0; i < typesetter_elements.length; i++) {

			/* [Apply orphan control] */
	    	var line = typesetter_elements[i].innerHTML;
	    	var word_array = line.split(" ");
	    	var word_cound = word_array.length;
	    	
	    	for (var ii = 0; ii < word_array.length - 2; ii++) { // Look at each word for punctuation
	    		
	    		var word = word_array[ii];
				var evaluate_punctuation = word.substring(word.length - 1, word.length);

	    		/*
	    		 * If punctuation is found, apply non-breaking spaces to the preceding and following words.
	    		 */
	    		
	    		if (ii > 0 && punctuation.indexOf(evaluate_punctuation) > 0) {
	    			var preceding_words =  new Array(word_array[ii - 1], word);
	    			var preceding_words_join = preceding_words.join("&nbsp;");
	    			word_array.splice(ii - 1, 2, preceding_words_join);
	    			ii--;

	    			var following_words =  new Array(word_array[ii + 1], word_array[ii + 2]);
	    			var following_words_join = following_words.join("&nbsp;");
	    			word_array.splice(ii + 1, 2, following_words_join);

	    		}
	    		
	    	}

	    	var last_words =  word_array.splice(-2);
	    	var last_words_join = last_words.join("&nbsp;");
			word_array.push(last_words_join);
			console.log(word_array);

			line = word_array.join(" ");
			typesetter_elements[i].innerHTML = line;

		}

	}

};