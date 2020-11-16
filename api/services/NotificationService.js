const admin = require('firebase-admin');
const FILENAME = process.env.FIREBASE_PRIVATE_API_KEY || "senior-project-46cb5-firebase-adminsdk-f115h-821ef108cd.json"
const serviceAccount = require("../../config/" + FILENAME);
// const config = process.env.TYPE !== undefined ? {
//     credential: admin.credential.cert({
//         type: process.env.TYPE,
//         project_id: process.env.PROJECT_ID,
//         private_key_id: process.env.PRIVATE_KEY_ID,
//         private_key: process.env.PRIVATE_KEY,
//         client_email: process.env.CLIENT_EMAIL,
//         client_id: process.env.CLIENT_ID,
//         auth_uri: process.env.AUTH_URI,
//         token_uri: process.env.TOKEN_URI,
//         auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
//         client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
//     }),
//     databaseURL: "https://senior-project-46cb5.firebaseio.com"
// } : {
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://senior-project-46cb5.firebaseio.com"
// }

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