class CodeInfo {
    constructor(_code) {
        this.decode(_code);
    }

    decode(_code) {
        this.code = _code;

        this.category = DISCOUNT_TYPE[this.code.slice(0, 1)];
        this.accumulation = this.code.slice(1, 2) == 1 ? "Yes" : "No";
        this.discount = (parseInt(this.code.slice(2, 4))).toString() + "%";
        this.date = `20${_code.slice(8)}-${_code.slice(6, 8)}-${_code.slice(4, 6)}`;
    }
}