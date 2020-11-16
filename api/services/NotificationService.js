const admin = require('firebase-admin');
let serviceAccount;
try {
    const FILENAME = process.env.FIREBASE_PRIVATE_API_KEY || "senior-project-46cb5-firebase-adminsdk-f115h-821ef108cd.json"
    serviceAccount = require("../../config/" + FILENAME);
}catch (e) {
}


const config = process.env.FIREBASE_API !== undefined ? {
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_API)),
    databaseURL: "https://senior-project-46cb5.firebaseio.com",
} : {
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://senior-project-46cb5.firebaseio.com"
}

function uniq(a) {
    return Array.from(new Set(a));
}

class NotificationService {
    initialize() {
        admin.initializeApp(config);
    }

    sendNotifications(title, body, tokens) {
        if (tokens.length === 0)
            return;
        tokens = uniq(tokens);
        const message = {
            notification: {
                title: title,
                body: body,
            },
        }
        admin.messaging().sendToDevice(tokens, message)
            .then((response) => {
                console.log("successful notifications: " + response.successCount)
                if (response.failureCount > 0) {
                    const failedTokens = [];
                    response.results.forEach((resp, idx) => {
                        if (!resp.success) {
                            failedTokens.push(tokens[idx]);
                        }
                    });
                    console.log('List of tokens that caused failures: ' + failedTokens);
                }
            });
    }

}


module.exports = new NotificationService();