
import {Logger} from "src/loudmotion/utils/debug/Logger";

export class TraceObject {

	private static $tabs:string;

	constructor() {
	}

	public static DUMP(obj:any, outerChar:string = null, initialBlockDisplayed:boolean = false, results:string = null):string {
		Logger.log(this, "DUMP");
		Logger.log(this, "obj=== "+obj);
		Logger.log(this, "outerChar=== "+outerChar);
		Logger.log(this, "initialBlockDisplayed=== "+initialBlockDisplayed);
		Logger.log(this, "results=== "+results);
		
		if (obj == null) {
			return null;
		}

		if (typeof(obj) as "xml" || typeof(obj) as "xmlNode") {
			return obj.toString();
		}

		if (results == null) {
			results = "";
			TraceObject.$tabs = "";
		}

		// if the variable we are tracing isn't an object, we can just
		// call the regular trace command and bail out.
		if (typeof(obj) != "object") {
			results += TraceObject.$tabs + outerChar + "\n";

			return results;
		}

		if (TraceObject.$tabs == null) {
			TraceObject.$tabs = "";
		}

		// default the "outer character" of a container to be "{"
		// -- the only other choice here is "["
		if (outerChar == null) {
			let isArray:boolean = false;
			try {
				isArray = (typeof(obj["pop"]) == "function")
			} catch (e) {
			}
			if (isArray) {
				outerChar = "[";
			} else {
				outerChar = "{";
			}
		}

		// initial block is used to signify if the outer character
		// has already been printed to the screen.
		if (initialBlockDisplayed != true) {
			results += TraceObject.$tabs + outerChar + "\n";
		}

		// every time this is called we'll add another
		// tab to the indention in the output window
		TraceObject.$tabs += "\t";

		// loop through everything in the object we're tracing
		for (let i in obj) {
			let type:string = typeof(obj[i]);
			// determine what's inside...
			if (type == "object") {
				// the variable is another container
				// check to see if the variable is an array.  Arrays
				// have a "pop" method, and objects don't...
				try {
					if (typeof(obj[i].pop) == "function") {
						// if an array, use the "[" as the outer character
						results += TraceObject.$tabs + i + ": [" + "\n";

						// recursive call
						results = TraceObject.DUMP(obj[i], "[", true, results);
					} else if (obj[i] instanceof Date) {
						results += TraceObject.$tabs + i + ": {" + obj[i] + "}" + "\n";
					} else if (typeof(obj[i]) as "xml") {
						results += TraceObject.$tabs + i + ": {" + "\n" + obj[i].toString() + "\n" + "}" + "\n";
					} else {
						results += TraceObject.$tabs + i + ": {" + "\n";
						// recursive call
						results = TraceObject.DUMP(obj[i], "{", true, results);
					}
				} catch (e) {
					results += TraceObject.$tabs + i + ": " + obj[i] + "" + "\n";
				}
			} else if (type == "string") {
				// display quotes
				results += TraceObject.$tabs + i + ": \"" + obj[i] + "\"" + "\n";
			} else {
				//variable is not an object or string, just trace it out normally
				if (obj[i] == null) {
					results += TraceObject.$tabs + i + ": null" + "\n";
				} else {
					results += TraceObject.$tabs + i + ": " + obj[i] + "\n";
				}
			}
		}
		// here we need to displaying the closing '}' or ']', so we bring
		// the indent back a tab, and set the outerchar to be it's matching
		// closing char, then display it in the output window
		if (outerChar == "{") {
			outerChar = "}";
		} else {
			outerChar = "]";
		}
		TraceObject.$tabs = TraceObject.$tabs.substr(0, TraceObject.$tabs.length - 1);

		results += TraceObject.$tabs + "" + outerChar + "\n";

		return results;
	}

}
