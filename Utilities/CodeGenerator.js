function CodeGenerator(_category, _accumulation, _discount, _date) {
    let code = _category;
    code += _accumulation ? "1" : "0";
    code += _discount;
    code += `${_date.slice(8)}${_date.slice(5, 7)}${_date.slice(2, 4)}`;

    return code;
}


// category is passed as a number bc of its option value
// accumulation is passed as a true or false value
// discount is passed as a number bc of it's option value
// date is passed as a date object 