export type PinIndex = string | '3V3' | 'GND' | '3V*' | 'GND*';

export const PIN_ORDER: string[] = ["3", "0", "4", "5", "6", "7", "1", "8", "9", "10", "11", 
"12", "2", "13", "14", "15", "16", '3V3A', '3V', '3V3B', "19", "20", 'GND1', 'GND', 'GND2'];
export const PIN_RINGS: string[] = ["0", "1", "2", '3V', 'GND'];

export interface MicroSim {
    leds: string[][]
    temperature: number
    light: number
    accelerometer: number
    compass: number
    buttonA: boolean
    buttonB: boolean
    pins: Record<string, number>
    running: boolean
}


type MICRO_SIM_ACTIONS = 
    {type: "SET_NUMERIC_FIELD", field: 'temperature' | 'light' | 'accelerometer' | 'compass', value: number} |
    {type: "SET_BUTTON", button: 'A' | 'B', pressed: boolean} |
    {type: "SET_PIN", index: string, value: number } |
    {type: "SET_LED", x: number, y: number, value: string } |
    {type: "SET_LEDS", value: string[][]} |
    {type: "RESET"}|
    {type: "START"}|
    {type: "STOP"};

export const LED_ROWS = 5;
export const LED_COLUMNS = 5;

function newMicroSim(): MicroSim {
    return {
        leds: [...Array(LED_ROWS)].map(() => [...Array(LED_COLUMNS)].fill("")),
        temperature: 0,
        light: 0,
        accelerometer: 0,
        compass: 45,
        buttonA: false,
        buttonB: false,
        pins: Object.fromEntries(PIN_ORDER.map((pinIndex: string): [string, number] => [pinIndex, 0])) as Record<string, number>,
        running: false
    }
}

const microSimReducer = (state: MicroSim, action: MICRO_SIM_ACTIONS) => {
    switch (action.type) {
        case "RESET":
            return newMicroSim();
        case "SET_NUMERIC_FIELD":
            return {...state, [action.field]: action.value};
        case "SET_BUTTON":
            return {...state, ['button' + action.button]: action.pressed};
        case "SET_PIN":
            return {...state, pins: {...state.pins, [action.index]: action.value}};
        case "SET_LED":
            const ledCopy = state.leds.map((row: string[]): string[] => row.slice(0));
            ledCopy[action.y][action.x] = action.value;
            return {...state, leds: ledCopy};
        case "SET_LEDS":
            return {...state, leds: action.value};
        case "START":
            return {...state, running: true};
        case "STOP":
            return {...state, running: false};
    }
};