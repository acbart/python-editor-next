import { useCallback, useRef } from "react";
import { PinIndex, PIN_RINGS, PIN_ORDER, useMicroSim } from "./simulator-hooks";
import './simulator.css';

interface MicroSimulatorProps {

}

export function MicroSimulator(props: MicroSimulatorProps): JSX.Element {
    const {state} = useMicroSim();

    return (state.running ? <div>Running</div>: <div className="sim">
        <div className="sim-board">
            <div className="sim-header">
                <div className="sim-light-sensor"></div>
                <span className="sim-label">{state.light}</span>
                <div className="sim-compass"></div>
                <span className="sim-label">{state.compass}</span>
            </div>
            <div className="sim-middle">
                <div className="sim-button sim-button-A">A</div>
                <div className="sim-leds">
                    { state.leds.map((ledRow: string[], rowIndex: number) =>(
                        <div key={rowIndex}>
                            { ledRow.map((lit: string, colIndex: number) => (
                                <span key={colIndex} className={lit ? 'active sim-led' : 'sim-led'} style={{opacity: lit+"0%"}}></span>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="sim-button sim-button-A">B</div>
            </div>
            <div className="sim-pins">
                { PIN_ORDER.map((pinIndex: string) => (
                    PIN_RINGS.includes(""+pinIndex) ? 
                        <div className="sim-ring" key={pinIndex}>
                            {pinIndex}
                        </div>
                        :
                        <div className="sim-pin" key={pinIndex}> </div>
                ))}
            </div>
        </div>
    </div>
    );
}