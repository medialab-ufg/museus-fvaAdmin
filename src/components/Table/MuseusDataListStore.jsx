/* eslint no-console: "off", no-debugger: "off", no-unused-vars: "off", react/prop-types:"off", no-undef: "off", react/jsx-no-undef: "off", react/no-direct-mutation-state: "off" */
export default class MuseusDataListStore {
    constructor(museusList) {
        this._museusList = museusList;
        this._cache = [];
        this.size = museusList.length;
    }

    getObjectAt(index) {
        if(index < 0 || index > this.size) {
            return undefined;
        }

        if(this._cache[index] === undefined) {
            console.log(this._museusList[index]);
            this._cache[index] = this._museusList[index];
        }

        //console.log(this._cache);
        return this._cache[index];
    }

    getSize() {
        return this.size;
    }
}