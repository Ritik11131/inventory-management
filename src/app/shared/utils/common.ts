export const generateCaptchaCode = (): string => {
    let captchaCode = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 7; i++) {
        captchaCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return captchaCode;
}