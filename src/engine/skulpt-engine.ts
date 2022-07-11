import React from "react";
import { FileSystem } from "../fs/fs";
import { MicroSimHook } from "../simulator/simulator-hooks";
import { EngineData, useEngineData } from "./engine-hooks";
import { WRAP_INSTRUCTOR_CODE } from "./on-run-template";

interface ExecutionConfiguration {
    filename: string
    code: string
    dispatch: React.Dispatch<any>
    sim: MicroSimHook
}

const INSTRUCTOR_FILE = "on_run.py";

export type SkulptResult = Record<string, Record<string, any>>;

export class SkulptEngine {

    run = async (filename: string, fs: FileSystem, dispatch: React.Dispatch<any>, sim: MicroSimHook): Promise<void> => {
        const content = await fs.read(filename);
        const mainProgram = new TextDecoder().decode(content.data);
        sim.dispatch({type: "START"});
        console.log("Run the code!", mainProgram);
        dispatch({type: "CLEAR_OUTPUT"});
        try {
            await this.executeStudent(filename, mainProgram, dispatch, sim);
        } catch (error) {
            console.error("Error in student code:", error);
        }
        const onRunCode = new TextDecoder().decode((await fs.read(INSTRUCTOR_FILE)).data);
        let result = await this.executeInstructor(onRunCode, {
            "answer.py": mainProgram
        }, dispatch, sim);
        dispatch({type: "FEEDBACK", title: result.$d.LABEL.v, message: result.$d.MESSAGE.v});
        console.log("DONE", result);
        sim.dispatch({type: "STOP"});
    }

    private executeStudent = async (filename: string, code: string, dispatch: React.Dispatch<any>, sim: MicroSimHook): Promise<SkulptResult> => {
        Sk.executionReports = {
            student: {
                tracing: []
            }
        }
        return this.execute({
            filename, code, dispatch, sim
        });
    }

    private executeInstructor = async (code: string, studentCode: Record<string, string>, dispatch: React.Dispatch<any>, sim: MicroSimHook): Promise<SkulptResult> => {
        return this.execute({
            filename: INSTRUCTOR_FILE, 
            code: WRAP_INSTRUCTOR_CODE(studentCode, code, false, false),
            dispatch,
            sim
        });
    }
    private execute = async(configuration: ExecutionConfiguration): Promise<SkulptResult> => {
        Sk.configure({
            __future__: Sk.python3,
            output: (line: string) => configuration.dispatch({type: "PRINT", line})
        });
        Sk.microbitSim = configuration.sim;
        //Sk.microbitSim.dispatch({type: "SET_LED", x: 1, y: 2, value: true})
        return Sk.misceval.asyncToPromise(() =>
            Sk.importMainWithBody(this.chompExtension(configuration.filename), false, configuration.code, true)
        );
    }

    private chompExtension = (filename: string): string => {
        return filename.substring(0, filename.lastIndexOf("."));
    }
}