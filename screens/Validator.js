export default function emailValidator  (email){
    const re=/\S+@\S+\.\S+/;
    
    if(re.test(email)) return true;
    return false;
}