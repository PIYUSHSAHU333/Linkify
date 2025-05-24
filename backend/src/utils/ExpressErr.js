export class ExpressErr extends Error{
    constructor(status, message){ //just Gpt on any doubt
        super(); 
        this.message = message;
        this.status = status;
    }
}
