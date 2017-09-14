/* eslint no-console: "off", no-debugger: "off", no-unused-vars: "off", react/prop-types:"off", no-undef: "off", react/jsx-no-undef: "off", react/no-direct-mutation-state: "off" */
export default class MuseusDataListStore {
    constructor(museusList) {
        this.size = museusList.length;
        this._cache = [];
    }

    getObjectAt(index) {
        if(index < 0 || index > this.size) {
            return undefined;
        }
        if(this._cache[index] === undefined) {
            console.log(this.museusList[index]);
            this._cache[index] = this.museusList[index];
        }

        return this._cache[index];
    }

    getSize() {
        return this.size;
    }
}