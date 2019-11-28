class CodeGenerator {
    constructor(_category, _accumulation, _discount, _date) {
        this.code = "";
        this.code += _category;
        this.code += _accumulation ? "1" : "0";
        this.code += _discount;
        this.code += `${_date.slice(8)}${_date.slice(5, 7)}${_date.slice(2, 4)}`;
    }
}


// category is passed as a number bc of its option value
// accumulation is passed as a true or false value
// discount is passed as a number bc of it's option value
// date is passed as a date object 


