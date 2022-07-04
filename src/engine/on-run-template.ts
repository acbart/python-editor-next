export function findActualInstructorOffset(instructorCode: string) {
    const index = instructorCode.indexOf(INSTRUCTOR_MARKER);
    const before = instructorCode.slice(0, index);
    const match = before.match(NEW_LINE_REGEX);
    return match ? (1+match.length) : 0;
}

export const INSTRUCTOR_MARKER = "###Run the actual instructor code###";
export const NEW_LINE_REGEX = /\n/g;
/**
 * @return {string}
 */
export const WRAP_INSTRUCTOR_CODE = function (studentFiles: Record<string, string>, instructorCode: string, quick: boolean, isSafe: boolean) {
    let safeCode = JSON.stringify(studentFiles);
    let skip_tifa = quick ? "True": "False";

    // TODO: Add in Sk.queuedInput to be passed in

    return `
# Support our sysmodules hack by clearing out any lingering old data
from pedal.core.report import MAIN_REPORT
MAIN_REPORT.clear()

from cisc108 import student_tests
student_tests.reset()

from utility import *

# Load in some commonly used tools
from pedal.cait.cait_api import parse_program
from pedal.sandbox.commands import *
from pedal.core.commands import *

from pedal.environments.blockpy import setup_environment
# Do we execute student's code?
skip_run = False # get_model_info('assignment.settings.disableInstructorRun')
inputs = None if skip_run else [] #get_model_info('execution.input')

# Set the seed to the submission ID by default?
from pedal.questions import set_seed
set_seed("Apple") # str(get_model_info("submission.id")))

# Initialize the BlockPy environment
pedal = setup_environment(skip_tifa=${skip_tifa},
                          skip_run=skip_run,
                          inputs=inputs,
                          main_file='answer.py',
                          files=${safeCode})
student = pedal.fields['student']

# TODO: Refactor resolver to return instructions
# Monkey-patch questions
#from pedal import questions
#questions.show_question = set_instructions

${INSTRUCTOR_MARKER}
${instructorCode}

# Resolve everything
from pedal.resolvers.simple import resolve
final = resolve()
SUCCESS = final.success
SCORE = final.score
CATEGORY = final.category
LABEL = final.title
MESSAGE = final.message
DATA = final.data
HIDE = final.hide_correctness

# Handle questions
if final.instructions:
    set_instructions(final.instructions[-1].message)
    
# Handle positive feedback
POSITIVE = []
for positive in final.positives:
    message = positive.message
    if not positive:
        message = positive.else_message
    POSITIVE.append({
        "title": positive.title,
        "label": positive.label,
        "message": message
    })
    
# Handle system messages
for system in final.systems:
    if system.label == 'log':
        console_log(system.title, system.message);
    if system.label == 'debug':
        console_debug(system.title, system.message);

`;
};