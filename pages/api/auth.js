export default function handler(req, res) {
    const { CLIENT_ID, TENANT_ID, REDIRECT_URI } = process.env;
    const authUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=openid files.read offline_access&response_mode=query`;
    res.redirect(authUrl);
}
