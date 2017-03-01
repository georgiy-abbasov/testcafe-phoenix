import TEST_RUN_STATE from '../test-run/state';
import processTestFnError from '../errors/process-test-fn-error';
import testControllerProxy from '../api/test-controller/proxy';

export default class OnEachPageHookController {
    constructor () {

    }


    isHookActual (testRun) {
        return testRun.test.fixture.onEachPageFn;
    }

    async runOnEachPageHook (testRun) {
        var fixture = testRun.test.fixture;
        var error   = '';
        var hookFn  = fixture.onEachPageFn;

        if (hookFn) {
            try {
                await hookFn(testRun);
            }
            catch (err) {
                error = processTestFnError(err);

                try {
                    switch (hookFn) {
                        case testRun.test.fixture.onEachPageFn:
                            testRun.state = TEST_RUN_STATE.inFixtureOnEachPage;
                            break;
                    }
                }
                catch (err) {
                    console.log(err);
                }
            }
        }

        if (error) {
            testRun.addError(error);

            return false;
        }

        return true;
    };
}