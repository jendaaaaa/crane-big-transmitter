led.enable(false)
let HORIZONTAL_SPEED = 70
let WINCH_SPEED = 70
let ROTATION_SPEED = 20
let PRESSED = 0
let RELEASED = 1
let SERVO_STALL = 90
let spool_outer = 0
let spool_inner = 0
let gripper = 0
let rotor = 0
let hoist = 0
let left = 0
let right = 0
let forward = 0
let backward = 0
radio.setGroup(11)
pins.setPull(DigitalPin.P13, PinPullMode.PullUp)
pins.setPull(DigitalPin.P14, PinPullMode.PullUp)
pins.setPull(DigitalPin.P15, PinPullMode.PullUp)
pins.setPull(DigitalPin.P16, PinPullMode.PullUp)
basic.forever(function () {
    hoist = 1024 - pins.analogReadPin(AnalogPin.P1)
    left = pins.digitalReadPin(DigitalPin.P13)
    right = pins.digitalReadPin(DigitalPin.P15)
    forward = pins.digitalReadPin(DigitalPin.P14)
    backward = pins.digitalReadPin(DigitalPin.P16)
    if (left == PRESSED && right == PRESSED) {
        rotor = 0
    } else if (left == RELEASED && right == PRESSED) {
        rotor = + ROTATION_SPEED
    } else if (left == PRESSED && right == RELEASED) {
        rotor = - ROTATION_SPEED
    } else {
        rotor = 0
    }
    if (forward == PRESSED && backward == RELEASED) {
        spool_inner = + HORIZONTAL_SPEED
        spool_outer = - HORIZONTAL_SPEED
    } else if (forward == RELEASED && backward == PRESSED) {
        spool_inner = - HORIZONTAL_SPEED
        spool_outer = + HORIZONTAL_SPEED
    } else if (forward == RELEASED && backward == RELEASED) {
        spool_inner = Math.map(hoist, 0, 1023, - WINCH_SPEED, WINCH_SPEED)
        spool_outer = spool_inner
    } else {
        spool_inner = 0
        spool_outer = spool_inner
    }
    radio.sendValue("rotate", rotor)
    radio.sendValue("inner", spool_inner)
    radio.sendValue("outer", spool_outer)
    radio.sendValue("gripper", gripper)
})

control.onEvent(EventBusSource.MICROBIT_ID_BUTTON_A, EventBusValue.MICROBIT_EVT_ANY, function () {
    if (control.eventValue() == EventBusValue.MICROBIT_BUTTON_EVT_DOWN) {
        gripper = 1
    }
})

control.onEvent(EventBusSource.MICROBIT_ID_BUTTON_B, EventBusValue.MICROBIT_EVT_ANY, function () {
    if (control.eventValue() == EventBusValue.MICROBIT_BUTTON_EVT_DOWN) {
        gripper = 0
    }
})