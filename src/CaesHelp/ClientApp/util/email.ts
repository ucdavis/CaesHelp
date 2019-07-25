export function validateEmail(email: string): boolean {
    if (!email || email.trim().length === 0) {
        return true;
    }

/* tslint:disable-next-line:max-line-length */
    // This one is really permissive, perhaps replace with one from PEAKS
    // per: https://www.regular-expressions.info/email.html
    const regex = new RegExp("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$", "i");
    return regex.test(email.trim());
}