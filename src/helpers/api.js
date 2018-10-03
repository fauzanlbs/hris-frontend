import * as axios from 'axios';

class Api {

    constructor(){
        this.api_token = null;
        this.client = null;
        this.api_url = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : "http://medanlabs.com/hris-backend/public/api/";        
    }

    create(){
        this.api_token = localStorage.getItem('api_token')
        // console.log(this.api_token);

        let headers = {
            'Content-Type':'application/json',
            'Accept':'application/json'
        }

        if(this.api_token){
            headers.Authorization = `Bearer ${this.api_token}`
        }

        this.client = axios.create({
            baseURL: this.api_url,
            timeout: 31000, 
            headers: headers,
            // validateStatus: (status)=> {
            //     if(status==401){
            //         console.log('unauthorized')
            //         localStorage.removeItem('user')
            //         localStorage.removeItem('api_token')
            //         // TO DO -- redirect untouthorized user
            //         let path = window.location.pathname
            //         // if(path!='/#/login'){
            //         //     window.location.reload();                                                
            //         // }
            //     }
            //     return status >= 200 && status < 300; // default
            // },
        })

        return this.client
    }

    /**
     * form data request api setup
     * for uploading file, etc
     */
    createFormData(){
        this.api_token = localStorage.getItem('api_token')
        // console.log(this.api_token);

        let headers = {
            'Accept':'application/json'
        }

        if(this.api_token){
            headers.Authorization = `Bearer ${this.api_token}`
        }

        this.client = axios.create({
            baseURL: this.api_url,
            timeout: 31000, // Heroku timeout
            headers: headers,
            // validateStatus: (status)=> {
            //     if(status==401){
            //         console.log('unauthorized')
            //         localStorage.removeItem('user')
            //         localStorage.removeItem('api_token')
            //         // TO DO -- redirect untouthorized user
            //         // window.location.reload();
            //     }
            //     return status >= 200 && status < 300; // default
            // },
        })

        return this.client
    }

    getClient(){
        return this.client
    }
}

export { Api }
