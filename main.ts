let up = 0
let down = 0
let rotation = 0
let horizontal = 0
let winch_inner = 0
let winch_outer = 0
let gripper = 0
let VERTICAL_SPEED = 30
let ROTATION_SPEED = 30
let WINCH_SPEED = 70
let PRESSED = 1
let NOT_PRESSED = 0
pins.setPull(DigitalPin.P14, PinPullMode.PullUp)
pins.setPull(DigitalPin.P15, PinPullMode.PullUp)
pins.setPull(DigitalPin.P16, PinPullMode.PullUp)
radio.setGroup(120)
basic.forever(function () {
    horizontal = pins.analogReadPin(AnalogPin.P1)
    rotation = 1024 - pins.analogReadPin(AnalogPin.P2)
    up = pins.digitalReadPin(DigitalPin.P14)
    down = pins.digitalReadPin(DigitalPin.P16)
    gripper = pins.digitalReadPin(DigitalPin.P15)
    if (up == PRESSED && down == NOT_PRESSED) {
        winch_inner = VERTICAL_SPEED
        winch_outer = VERTICAL_SPEED
    } else if (up == NOT_PRESSED && down == PRESSED) {
        winch_inner = -VERTICAL_SPEED
        winch_outer = -VERTICAL_SPEED
    } else {
        winch_inner = Math.map(1024 - horizontal, 0, 1023, -WINCH_SPEED, WINCH_SPEED)
        winch_outer = Math.map(horizontal, 0, 1023, -WINCH_SPEED, WINCH_SPEED)
    }
    radio.sendValue("rotation", Math.map(rotation, 0, 1023, -ROTATION_SPEED, ROTATION_SPEED))
    radio.sendValue("inner", winch_inner)
    radio.sendValue("outer", winch_outer)
    radio.sendValue("gripper", gripper)
})