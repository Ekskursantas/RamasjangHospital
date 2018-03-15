export class TouchPhase{

    // public static BEGAN:string = "began"; // [static] The finger touched the screen just now, or the mouse button was pressed.
    // public static ENDED:string = "ended"; // [static] The finger was lifted from the screen or from the mouse button.
    // public static HOVER:string = "hover"; // [static] Only available for mouse input: the cursor hovers over an object without a pressed button.
    // public static MOVED:string = "moved"; // [static] The finger moves around on the screen, or the mouse is moved while the button is pressed.

    // public static BEGAN:string = "mousedown";
    // public static ENDED:string = "mouseup";
    // public static TOUCH_OUT:string = "mouseout";
    // public static MOVED:string = "mousemove";

    public static BEGAN:string = "pointerdown";
    public static ENDED:string = "pointerup";
    public static TOUCH_OUT:string = "pointerout";
    public static MOVED:string = "pointermove";

    public static STATIONARY:string = "stationary";

}
