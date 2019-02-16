// IMPORTS
// ================================================================================================
import * as crypto from 'crypto';
import * as logger from '../index';

// MODULE VARIABLES
// ================================================================================================
logger.configure({
    iKey        : '',
    appVersion  : '0.1.2',
    appName     : 'API Server',
    appInstance : process.env['WEBSITE_INSTANCE_ID']
});

// TEST FUNCTIONS
// ================================================================================================
async function runTests() {

    console.log('Testing global logger');

    logger.debug('Debug message');
    logger.info('Information message');
    logger.warn('Warning message');
    logger.error(new Error('Error message'));
    
    console.log('Testing operation logger');

    const startTime = Date.now();
    const idBuffer = Buffer.alloc(16);
    const opLogger = logger.startOperation({
        requestName     : 'GET /users',
        operationId     : crypto.randomFillSync(idBuffer).toString('hex'),
        operationName   : 'UserFunction',
        componentName   : 'REST Server',
        requestUrl      : 'https://api.test.com/users?id=123',
        requestIp       : '2.2.2.2'
    }, startTime);

    opLogger.debug('Operation debug message');
    opLogger.authenticatedUserId = '123456789';
    opLogger.info('Operation information message');
    opLogger.warn('Operation warning message');

    await wait(100);
    opLogger.trace(
        { name: 'database', type: 'sql' },
        { name: 'qRetrieveUser', text: 'SELECT * FROM users WHERE id = 123' },
        100,
        true
    );

    await wait(10);
    const err: any = new Error('Operation error message');
    err.details = { test: 'testing' };
    opLogger.error(err);

    opLogger.close(200, true, { test: 'testing' });
}

runTests().then(() => { console.log('done!'); });

// HELPER FUNCTIONS
// ================================================================================================
function wait(time: number) {
    return new Promise((resolve, reject)=>{
        setTimeout(resolve, time);
    });
}