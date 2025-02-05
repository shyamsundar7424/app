export const storeInSession = (key, value) => {
    sessionStorage.setItem(key, JSON.stringify(value));
    console.log(`Stored in session: ${key} =`, JSON.parse(sessionStorage.getItem(key)));
};



const lookInSession = (key) =>{
    return sessionStorage.getItem(key)
}

const removeFromSession =(key)=>{
    return sessionStorage.removeItem(key)
}

const logOutUser =()=>{
    sessionStorage.clear();
}

export {
    lookInSession,
    removeFromSession,
    logOutUser
}