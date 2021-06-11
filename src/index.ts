import { RevealingMoodleTests } from 'revealing-moodle-tests';

const tests = new RevealingMoodleTests();

/**
 * Simple Yes-No-Questions that are put in the same category
 * Of course this can be done in Moodle directly but if you prefer typing
 * over lots of mouse clicking in Moodle this is the way to go
 * 
 * Please note the singular statement in the question text as for each
 * entry a new question is generated
 */

tests.addMultiChoice('Arithmetic statements simple', 'Please assess the following statement', {
    '2 + 3 = 5': true,
    '3 + 7 = 8': false,
    '1 + 1 = 3': false,
    '1 + 1 = 2': true
});

/**
 * Better to generate the statements programatically
 * Also we can use some helper functions for generating random values
 */

const stmts_yesno: Record<string, boolean> = {}
for (let index = 0; index < 50; index++) {
    const a = RevealingMoodleTests.randomInt(1, 100);
    const b = RevealingMoodleTests.randomInt(1, 100);
    const c = a + b + RevealingMoodleTests.randomInt(-1, 1);
    stmts_yesno[`${a} + ${b} = ${c}`] = a + c == c;
}

tests.addMultiChoice('Arithmetic statements generated',
    'Please assess the following statement',
    stmts_yesno);

/**
 * If Yes-No is too simple, then we can also have more answer options
 * Shuffle Answers is true by default so Moodle will randomly arrange
 * the answer options
 */

const stmts_multi: Record<string, string[]> = {}
for (let index = 0; index < 50; index++) {
    const a = RevealingMoodleTests.randomInt(1, 100);
    const b = RevealingMoodleTests.randomInt(1, 100);
    const c = a + b;
    const errors = [0];
    for (let j = 0; j < 3; j++) {
        errors.push(RevealingMoodleTests.randomInt(1, 3) * -1 ^ (RevealingMoodleTests.randomInt(0, 1)));
    }
    stmts_multi[`${a} + ${b} = `] = errors.map((error) => {
        if (error == 0) {
            return '=' + c.toString();
        } else {
            return (c + error).toString();
        }
    });
}
tests.addMultiChoice('Arithmetic calculations multi',
    'Please evaluate the following expression',
    stmts_multi)


/**
 * That is still too simple, let's do free text answers
 */

tests.addQuestions('Arithmetic calculations free text',
    50,
    'shortanswer',
    () => {
        const a = RevealingMoodleTests.randomInt(1, 100);
        const b = RevealingMoodleTests.randomInt(1, 100);
        const c = a + b;
        return {
            text: `Please calculate the value of ${a} + ${b}`,
            answers: [c.toString()]
        }
    })

/**
 * Finally, we can create cloze questions with multiple subquestions
 * of different types
 */

tests.addQuestions('Arithmetic calculations cloze',
    50,
    'cloze',
    () => {
        const a = RevealingMoodleTests.randomInt(1, 100);
        const b = RevealingMoodleTests.randomInt(1, 100);
        const c = a + b;
        const factor = RevealingMoodleTests.randomInt(2, 5);
        const d = c * factor;

        return {
            text: `Please add the numbers ${a} and ${b}
            Result: {1:SHORTANSWER:=${a + b}}
            
            Now multiply that result with ${factor}: {1:SHORTANSWER:=${d}}`
        }

    })

/**
 * Of course we can also create questions about much more complex domains
 * Java Loops, sorry in German
 */

tests.addQuestions('Java while loops', 20, "cloze", () => {
    const varname = RevealingMoodleTests.randomChar();
    const initval = RevealingMoodleTests.randomInt(2, 9);
    const maxval = RevealingMoodleTests.randomInt(11, 33);
    const incr = RevealingMoodleTests.randomInt(3, 6);
    let i = initval;
    let reps = 0;
    while (i < maxval) {
        reps += 1;
        i = i + incr;
    }
    const finalval = i;

    return {
        text: `Betrachten Sie bitte die folgende Schleife:<br />
    
     int ${varname} = ${initval};
     while (${varname} < ${maxval}) {
         ${varname} = ${varname} + ${incr};
        }
        System.out.println(${varname});
     
    Wie oft wird diese Schleife durchlaufen? {1:SHORTANSWER:=${reps}} Welcher Wert wird auf dem Bildschirm ausgegeben? {1:SHORTANSWER:=${finalval}}`
    }
})


/**
 * Or maybe the code for the exercise is quite the same but we want
 * to vary domains
 */

tests.addQuestions('Java for each loops', 20, "cloze", () => {
    const domain = RevealingMoodleTests.randomElement([
        {
            'object': 'Book', 'collection': 'books',
            'numericValue': 'pages', 'numericFunction': 'getPages()'
        },
        {
            'object': 'Conference', 'collection': 'conferences',
            'numericValue': 'participants', 'numericFunction': 'getParticipants()'
        },
        {
            'object': 'Club', 'collection': 'clubs',
            'numericValue': 'members', 'numericFunction': 'getMembers()'
        }
    ]);

    return {
        text: `Consider a Java program that stores information about \
${domain['collection']}. You have a variable ${domain['collection']} \
of type List<${domain['object']}>. Each object of type ${domain['object']} \
has a method ${domain['numericFunction']} that returns the ${domain['numericValue']} \
of the ${domain['object'].toLowerCase()} as an integer. \
Complete the following code that adds up the ${domain['numericValue']} of \
all ${domain['collection']}:

int total = 0;
for({1:SHORTANSWER:=${domain['object']}} element : {1:SHORTANSWER:=${domain['collection']}})) {
    total += {1:SHORTANSWER:=element.${domain['numericFunction']};}
}
System.out.println("Total: " + total);`}
})


/**
 * Now let's save it
 */

tests.saveTo("examples.xml")