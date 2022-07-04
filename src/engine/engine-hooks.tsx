import React, { ReactNode, useReducer } from "react";
import { useContext } from "react";
import { SkulptEngine } from "./skulpt-engine";

export interface EngineData {
    console: string[]
    feedbackTitle: string,
    feedbackMessage: string
}

export interface EngineHook {
    state: EngineData,
    dispatch: React.Dispatch<any>
}

const EngineContext = React.createContext<undefined | EngineHook>(undefined);

type ENGINE_ACTIONS = {type: "PRINT", line: string} | {type: "FEEDBACK", title: string, message: string} |
{type: "CLEAR_OUTPUT"};

const engineReducer = (state: EngineData, action: ENGINE_ACTIONS) => {
    switch (action.type) {
        case 'PRINT': return {
            ...state,
            console: [...state.console, action.line]
        };
        case 'FEEDBACK': return {
            ...state,
            feedbackTitle: action.title,
            feedbackMessage: action.message
        };
        case 'CLEAR_OUTPUT': return {
            ...state,
            console: []
        }
    }
};

export const EngineContextProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(engineReducer, {
        feedbackTitle: "Ready",
        feedbackMessage: "",
        console: []
    });

    return (
        <EngineContext.Provider value={{state, dispatch}}>
            {children}
        </EngineContext.Provider>
    )
};

/**
 * Hook to access the device from UI code.
 *
 * @returns The device.
 */
export const useEngineData = () => {
    const engine = useContext(EngineContext);
    if (!engine) {
        throw new Error("Missing provider.");
    }
    return engine;
};