import { FileSystem } from "../fs/fs";

interface ExecutionConfiguration {
    filename: string
    code: string
}


export class SkulptEngine {
    run = async (filename: string, fs: FileSystem): Promise<void> => {
        const content = await fs.read(filename);
        const mainProgram = new TextDecoder().decode(content.data);
        console.log("Run the code!", mainProgram);
        await this.executeStudent(filename, mainProgram);
        await this.executeInstructor();
        console.log("DONE");
    }

    private executeStudent = async (filename: string, code: string): Promise<void> => {
        return this.execute({
            filename, code
        });
    }

    private executeInstructor = async (): Promise<void> => {
        return this.execute({
            filename: "on_run.py",
            code: "#from pedal import *"
        });
    }
    private execute = async(configuration: ExecutionConfiguration): Promise<void> => {
        Sk.configure({
            __future__: Sk.python3,
            output: console.log
        });
        return Sk.misceval.asyncToPromise(() =>
            Sk.importMainWithBody(configuration.filename, false, configuration.code, true)
        );
    }
}