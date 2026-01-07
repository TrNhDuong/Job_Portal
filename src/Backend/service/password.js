export const generatePassword = () => {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const num   = "0123456789";
    const spec  = "!@#$%^&*()-_=+[]{}";
    
    const pool = upper + lower + num + spec;

    let pass = "";
    for (let i = 0; i < 10; i++) {
        pass += pool[Math.floor(Math.random() * pool.length)];
    }
    return pass;
}