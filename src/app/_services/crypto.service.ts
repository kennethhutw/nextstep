import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CryptoService {

    private crypto$: Observable<any>;
    public httpOptions = {
        headers: new HttpHeaders({
            'Access-Control-Allow-Origin': '＊',
            'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
            'Access-Control-Max-Age': '86400'
        })
    };

    constructor(private http: HttpClient) { }

    async getCrypto(symbol: string) {
        try {
            //https://api.coindesk.com/v1/bpi/currentprice.json
            //https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}&convert=USD&CMC_PRO_API_KEY=635df8fc-e179-44be-a7b4-bce2c2d2c89a`
            return await this.http.get(`https://api.coincap.io/v2/assets`).toPromise();
        } catch (error) {
            console.log(error);
        }
    }
}