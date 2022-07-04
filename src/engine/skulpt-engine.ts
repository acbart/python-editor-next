import { FileSystem } from "../fs/fs";

interface ExecutionConfiguration {
    filename: string
    code: string
}

const INSTRUCTOR_FILE = "on_run.py";

export class SkulptEngine {
    run = async (filename: string, fs: FileSystem): Promise<void> => {
        const content = await fs.read(filename);
        const mainProgram = new TextDecoder().decode(content.data);
        console.log("Run the code!", mainProgram);
        await this.executeStudent(filename, mainProgram);
        const onRunCode = new TextDecoder().decode((await fs.read(INSTRUCTOR_FILE)).data);
        await this.executeInstructor(onRunCode);
        console.log("DONE");
    }

    private executeStudent = async (filename: string, code: string): Promise<void> => {
        Sk.executionReports = {
            student: {}
        }
        return this.execute({
            filename, code
        });
    }

    private executeInstructor = async (code: string): Promise<void> => {
        return this.execute({
            filename: INSTRUCTOR_FILE, code
        });
    }
    private execute = async(configuration: ExecutionConfiguration): Promise<void> => {
        Sk.configure({
            __future__: Sk.python3,
            output: console.log
        });
        return Sk.misceval.asyncToPromise(() =>
            Sk.importMainWithBody(this.chompExtension(configuration.filename), false, configuration.code, true)
        );
    }

    private chompExtension = (filename: string): string => {
        return filename.substring(0, filename.lastIndexOf("."));
    }
}