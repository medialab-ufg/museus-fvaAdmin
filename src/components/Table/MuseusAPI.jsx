
export default class MuseusAPI {
    deleteFVA() {
        const deleteURL = 'http://museus.mapa.fdev/space/68';
        const data = {fva2017: null};

        fetch(deleteURL, {
            //mode: 'no-cors',
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'MapasSDK-REQUEST': true
            },
            body: JSON.stringify(data)
        });
    }
}