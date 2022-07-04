import React from "react";
import { FileSystem } from "../fs/fs";
import { EngineData, useEngineData } from "./engine-hooks";
import { WRAP_INSTRUCTOR_CODE } from "./on-run-template";

interface ExecutionConfiguration {
    filename: string
    code: string
    dispatch: React.Dispatch<any>
}

const INSTRUCTOR_FILE = "on_run.py";

export type SkulptResult = Record<string, Record<string, any>>;

export class SkulptEngine {

    run = async (filename: string, fs: FileSystem, dispatch: React.Dispatch<any>): Promise<void> => {
        const content = await fs.read(filename);
        const mainProgram = new TextDecoder().decode(content.data);
        console.log("Run the code!", mainProgram);
        dispatch({type: "CLEAR_OUTPUT"});
        try {
            await this.executeStudent(filename, mainProgram, dispatch);
        } catch (error) {
            console.error("Error in student code:", error);
        }
        const onRunCode = new TextDecoder().decode((await fs.read(INSTRUCTOR_FILE)).data);
        let result = await this.executeInstructor(onRunCode, {
            "answer.py": mainProgram
        }, dispatch);
        dispatch({type: "FEEDBACK", title: result.$d.LABEL.v, message: result.$d.MESSAGE.v});
        console.log("DONE", result);
    }

    private executeStudent = async (filename: string, code: string, dispatch: React.Dispatch<any>): Promise<SkulptResult> => {
        Sk.executionReports = {
            student: {
                tracing: []
            }
        }
        return this.execute({
            filename, code, dispatch
        });
    }

    private executeInstructor = async (code: string, studentCode: Record<string, string>, dispatch: React.Dispatch<any>): Promise<SkulptResult> => {
        return this.execute({
            filename: INSTRUCTOR_FILE, 
            code: WRAP_INSTRUCTOR_CODE(studentCode, code, false, false),
            dispatch
        });
    }
    private execute = async(configuration: ExecutionConfiguration): Promise<SkulptResult> => {
        Sk.configure({
            __future__: Sk.python3,
            output: (line: string) => configuration.dispatch({type: "PRINT", line})
        });
        return Sk.misceval.asyncToPromise(() =>
            Sk.importMainWithBody(this.chompExtension(configuration.filename), false, configuration.code, true)
        );
    }

    private chompExtension = (filename: string): string => {
        return filename.substring(0, filename.lastIndexOf("."));
    }
}