import AsyncStorage from '@react-native-community/async-storage'


export const addToStorage = (key, value) => {

    try {
        AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {

    }
}

export const getFromStorage = (key, success, reject) => {
    try {
        AsyncStorage.getItem(key).then(value => {

            success(JSON.parse(value))
        });
    } catch (error) {
        reject(error)
    }
}