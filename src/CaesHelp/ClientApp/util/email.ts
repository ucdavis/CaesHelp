export function validateEmail(email: string): boolean {
    /* tslint:disable-next-line:max-line-length */
    // per: https://www.regular-expressions.info/email.html
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/;
    return regex.test(email);
}