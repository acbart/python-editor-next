import React from "react";
import { useContext } from "react";
import { SkulptEngine } from "./skulpt-engine";

const EngineContext = React.createContext<undefined | SkulptEngine>(
    undefined
);

export const EngineContextProvider = EngineContext.Provider;

/**
 * Hook to access the device from UI code.
 *
 * @returns The device.
 */
export const useEngine = () => {
    const engine = useContext(EngineContext);
    if (!engine) {
        throw new Error("Missing provider.");
    }
    return engine;
};