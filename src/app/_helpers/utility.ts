import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable()
export class Utility {
  currentUnixTime = new Date();
  countriesOptions: any;

  constructor(private http: HttpClient) { }

  // public getCountryOptions(): Observable<any> {
  //   return this.http.get("./../../assets/data/countries.json");
  // }

  // public getTagOptions(lang): Observable<any> {
  //   return this.http.get(`./../../assets/data/types_${lang}.json`);
  // }

  groupBy(arr, func) {
    return arr.reduce((acc, item) => {
      const key = func(item);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, Object.create(null));
  }

  getCurrentUnixTimeString() {
    return this.currentUnixTime.getTime().toString();
  }
  getCurrentUnixTime() {
    return this.currentUnixTime.getTime();
  }

  ConvertUnixTimeToDateString(timestamp) {
    var a = new Date(timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = ' ' + year + ' ' + month + ' ' + date;
    return time;
  }

  IsNullOrEmpty(value) {
    try {
      if (
        !value ||
        value === "" ||
        value === " " ||
        value === null ||
        value === undefined ||
        value === "null"
      ) {
        return true;
      }
      return false;
    } catch (error) {
      console.warn("error", error);
    }
  }

  IsFieldDataNullOrEmpty(Data: object, field: string) {
    if (!this.IsNullOrEmpty(Data)) {
      return this.IsNullOrEmpty(Data[field]);
    } else {
      return true;
    }
  }

  truncate(text: string) {
    if (text.length > 70) {
      return text.slice(0, 70) + "...";
    } else {
      return text;
    }
  }

  isJSONString(str) {
    if (
      /^[\],:{}\s]*$/.test(
        str
          .replace(/\\["\\\/bfnrtu]/g, "@")
          .replace(
            /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
            "]"
          )
          .replace(/(?:^|:|,)(?:\s*\[)+/g, "")
      )
    ) {
      // the json is ok
      return true;
    } else {
      return false;
      // the json is not ok
    }
  }

  isObject(obj) {
    return obj !== undefined && obj !== null && obj.constructor === Object;
  }

  getlocalStorageJSONItem(name) {
    try {
      if (this.isJSONString(localStorage.getItem(name))) {
        return JSON.parse(localStorage.getItem(name));
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  encodeUrl(url) {
    return encodeURIComponent(url);
  }

  decodeUrl(url) {
    return decodeURIComponent(url);
  }

  getExternalURL(url: string) {
    let externalURL: string = "";
    if (!/^http[s]?:\/\//.test(url)) {
      externalURL += "http://";
    }

    externalURL += url;
    return externalURL;
  }

  splitArr(arr, size) {
    let newArr = [];
    for (let i = 0; i < arr.length; i += size) {
      newArr.push(arr.slice(i, i + size));
    }
    return newArr;
  }

  GetFieldData(Data: object, field: string, returnStr = "") {
    if (!this.IsNullOrEmpty(Data)) {
      if (!this.IsNullOrEmpty(Data[field])) {
        return Data[field];
      } else {
        return returnStr;
      }
    } else {
      return returnStr;
    }
  }

  GetUserFieldToArray(Data: object, field: string) {
    if (!this.IsNullOrEmpty(Data)) {
      if (!this.IsNullOrEmpty(Data[field])) {
        return Data[field].split(",");
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  // to get the country name not short term
  // ex sg => Singapore
  GetCountryName(code: string) {
    try {
      if (this.IsNullOrEmpty(this.countriesOptions)) {
        return "";
      }
      let result = this.countriesOptions.filter((t) => t.value == code);
      if (result.length > 0) {
        return result[0]["text"];
      } else {
        return " ";
      }
    } catch (error) {
      console.error("Country Name Error : " + error);
      return " ";
    }
  }

  // to uppercase the first letter of a string
  // ex project => Project
  FirstWordCapitalized(word: string) {
    if (this.IsNullOrEmpty(word)) {
      return "";
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  // delay for a while before redirect to the next page

  replaceAll(string, search, replace) {
    return string.split(search).join(replace);
  }


  getSellETHPrice(usdvalue) {
    try {
      let usd = parseFloat(usdvalue);
      let ethPrice = Number(localStorage.getItem("ETHPRICE"));

      const ethAmount = +((usd / 100) / ethPrice).toFixed(5);
      return ethAmount;
    }
    catch (err) {
      console.error(`Convert USD to ETH failed : `, err);
      return 0;
    }
  }

  getSellUSDPrice(usdvalue) {
    try {
      let usd = parseFloat(usdvalue);
      let ethPrice = Number(localStorage.getItem("ETHPRICE"));

      const ethAmount = +(usd / 100 * ethPrice).toFixed(2);
      return ethAmount;
    }
    catch (err) {
      console.error(`Convert USD to ETH failed :`, err);
      return 0;
    }
  }
}
